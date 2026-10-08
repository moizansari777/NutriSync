import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { Image as ImageCompressor } from "react-native-compressor";
import type { PhotoFile } from "react-native-vision-camera";
import * as ErrorReporter from "../../../utils/errorReporter";
import { useSelector } from "react-redux";
import { useAnalyzeFoodMutation } from "../../../services/logsTDEEServices";
import { BUILD_NUMBER, BUILD_VERSION, ENVIRONMENT } from "../../../config";
import { RootState } from "../../../states/store/store";
import { AnalyseResultProps } from "../../../schemas/types";
import { errorAlert } from "../../../utils/alerts";
import { getError } from "../../../utils/errors";
import {
  deleteFileQuietly,
  toFilePath,
  toFileUri,
} from "../../../utils/fileUri";

type DonutScanStep = "capture" | "compress" | "upload";

/** Upper bounds per step. Together they bound the whole flow. */
const CAPTURE_TIMEOUT_MS = 20000;
const COMPRESS_TIMEOUT_MS = 20000;
const UPLOAD_TIMEOUT_MS = 60000;

const SCAN_FAILED_TITLE = "Scan failed";

const ERROR_ACTIONS: Record<DonutScanStep, string> = {
  capture: "Donut feature while processing image - Photo capture",
  compress: "Donut feature while processing image - Image compression",
  // Stable action names, so error reports group the same way across releases.
  upload: "Donut feature while processing image - Anyse Food API",
};

const USER_MESSAGES: Record<DonutScanStep, string> = {
  capture: "We couldn't take the photo. Please try again.",
  compress: "We couldn't prepare the photo. Please try again.",
  upload:
    "We couldn't analyse the photo. Please check your connection and try again.",
};

const COMPRESS_OPTIONS = {
  compressionMethod: "manual",
  maxWidth: 400,
  quality: 0.85,
  output: "jpg",
} as const;

type StepError = Error & { step?: DonutScanStep; isTimeout?: boolean };

/** Plain object instead of an Error subclass, so it survives transpilation. */
const timeoutError = (step: DonutScanStep, ms: number): StepError =>
  Object.assign(new Error(`Donut scan "${step}" timed out after ${ms}ms`), {
    name: "DonutScanTimeout",
    step,
    isTimeout: true,
  });

const tagStep = (error: unknown, step: DonutScanStep): StepError => {
  const tagged: StepError =
    error instanceof Error ? error : new Error(String(error));
  if (!tagged.step) tagged.step = step;
  return tagged;
};

const withTimeout = <T>(
  work: Promise<T>,
  ms: number,
  step: DonutScanStep,
  onTimeout?: () => void,
): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      try {
        onTimeout?.();
      } catch {
        // Cancelling is best-effort; the rejection below is what matters.
      }
      reject(timeoutError(step, ms));
    }, ms);
  });

  return Promise.race([work, deadline]).finally(() => {
    if (timer) clearTimeout(timer);
  });
};

const isFoodIdentified = (payload: unknown): payload is AnalyseResultProps => {
  if (!payload || typeof payload !== "object") return false;
  const name = (payload as AnalyseResultProps).name;
  if (typeof name !== "string" || !name.trim()) return false;
  return name.trim().toLowerCase() !== "unknown";
};

type Params = {
  photoOutput: any;
  isFlashOn: boolean;
  /** Requesting flash on a device without one makes the capture throw. */
  hasFlash: boolean;
  setIsLiveScanning: (value: boolean) => void;
  setCaptureLivePicture: (value: any) => void;
  setMacroData: (value: AnalyseResultProps | null) => void;
};

export const useDonutFoodScan = ({
  photoOutput,
  isFlashOn,
  hasFlash,
  setIsLiveScanning,
  setCaptureLivePicture,
  setMacroData,
}: Params) => {
  const [analyseFood, { isLoading }] = useAnalyzeFoodMutation();

  // Primitive selector: re-renders only if the email itself changes.
  const userEmail = useSelector(
    (state: RootState) => state?.authReducer?.userData?.user?.email,
  );

  // Values read at tap time are kept in a ref so `runDonutScan` stays a stable
  // reference and never re-creates itself when the flash toggle changes.
  const inputsRef = useRef({ photoOutput, isFlashOn, hasFlash });
  useEffect(() => {
    inputsRef.current = { photoOutput, isFlashOn, hasFlash };
  }, [photoOutput, isFlashOn, hasFlash]);

  const isScanningRef = useRef(false);
  const runIdRef = useRef(0);
  const abortUploadRef = useRef<(() => void) | null>(null);
  /** Temp capture currently on screen, reclaimed once it is no longer shown. */
  const onScreenPhotoRef = useRef<string | null>(null);

  const runDonutScan = useCallback(async () => {
    // 1. Serialise scans. A ref (not state) because state updates are async and
    //    two fast taps would otherwise both pass the check.
    if (isScanningRef.current) return;

    const {
      photoOutput: output,
      isFlashOn: flashOn,
      hasFlash: deviceHasFlash,
    } = inputsRef.current;

    // 2. Never switch the loader on unless we can actually do the work,
    //    otherwise there is nothing left to switch it off again.
    if (!output?.capturePhotoToFile) {
      errorAlert({
        title: "Camera not ready",
        body: "Please wait a moment and try again.",
      });
      return;
    }

    isScanningRef.current = true;
    const runId = ++runIdRef.current;
    const isStale = () => runId !== runIdRef.current;

    // The previous capture is off screen by the time the donut button is
    // tappable again, so its temp file is safe to reclaim here.
    const previousPhotoPath = onScreenPhotoRef.current;
    onScreenPhotoRef.current = null;
    deleteFileQuietly(previousPhotoPath);

    let photoPath: string | null = null;
    let compressedUri: string | null = null;
    let photoIsOnScreen = false;
    let step: DonutScanStep = "capture";
    const startedAt = Date.now();

    setIsLiveScanning(true);
    ErrorReporter.addBreadcrumb({
      category: "donut-scan",
      level: "info",
      message: "started",
      data: { flashRequested: flashOn && deviceHasFlash },
    });

    try {
      // ---- Capture -------------------------------------------------------
      // `flashMode` is the real option name; `flash` was silently ignored.
      // Gated on `hasFlash` because the native call throws when flash is
      // requested on a device that has none.
      const wantsFlash = flashOn && deviceHasFlash;

      // Typed as nullable: `photoOutput` crosses an untyped boundary here.
      const capture = (useFlash: boolean) =>
        withTimeout<PhotoFile | null>(
          output.capturePhotoToFile(
            {
              enableShutterSound: false,
              flashMode: useFlash ? "on" : "off",
            },
            {},
          ),
          CAPTURE_TIMEOUT_MS,
          "capture",
        );

      let photo: PhotoFile | null;
      try {
        photo = await capture(wantsFlash);
      } catch (captureError) {
        // Flash can be refused at runtime even when the device has one (iOS
        // withdraws it when hot or on low battery). Getting the photo without
        // flash beats abandoning the scan. Timeouts are not retried.
        if (!wantsFlash || (captureError as StepError)?.isTimeout === true) {
          throw captureError;
        }
        ErrorReporter.addBreadcrumb({
          category: "donut-scan",
          level: "warning",
          message: "flash-capture-failed-retrying-without-flash",
        });
        photo = await capture(false);
      }

      photoPath = toFilePath(photo?.filePath);
      if (!photoPath) throw new Error("Camera returned an empty photo path");

      ErrorReporter.addBreadcrumb({
        category: "donut-scan",
        level: "info",
        message: "captured",
      });

      // The screen was torn down mid-capture: stop before touching its state.
      if (isStale()) return;
      setCaptureLivePicture(photo);
      photoIsOnScreen = true;

      // ---- Compress ------------------------------------------------------
      step = "compress";
      // `filePath` is a bare filesystem path; the compressor and the upload
      // both need a proper `file://` URL (Android is strict about this).
      const compressed = await withTimeout(
        ImageCompressor.compress(toFileUri(photoPath), COMPRESS_OPTIONS),
        COMPRESS_TIMEOUT_MS,
        "compress",
      );
      if (!compressed) throw new Error("Compressor returned an empty path");

      compressedUri = toFileUri(compressed);
      ErrorReporter.addBreadcrumb({
        category: "donut-scan",
        level: "info",
        message: "compressed",
      });

      if (isStale()) return;

      // ---- Upload --------------------------------------------------------
      step = "upload";
      const formData = new FormData();
      formData.append("image", {
        uri: compressedUri,
        type: "image/jpeg",
        name: `food_${Date.now()}.jpg`,
      } as any);

      const request = analyseFood(formData);
      abortUploadRef.current = () => request.abort();

      const payload = await withTimeout(
        request.unwrap(),
        UPLOAD_TIMEOUT_MS,
        "upload",
        // Free the socket instead of leaving a dead request in flight.
        () => request.abort(),
      );

      if (isStale()) return;

      // ---- Result --------------------------------------------------------
      if (isFoodIdentified(payload)) {
        setMacroData(payload);
      } else {
        ErrorReporter.addBreadcrumb({
          category: "donut-scan",
          level: "info",
          message: "no-food-detected",
        });
        setCaptureLivePicture(null);
        setMacroData(null);
        photoIsOnScreen = false;
        errorAlert({
          title: "No food detected",
          body: "We couldn’t identify any food in this image.",
        });
      }
    } catch (error) {
      const tagged = tagStep(error, step);
      const failedStep = tagged.step ?? step;

      // Cancelled because the user left the screen: expected, not a defect, so
      // it is neither reported nor surfaced. `finally` still cleans up.
      if (isStale()) return;

      ErrorReporter.captureException(tagged, {
        extra: {
          userEmail,
          device: Platform.OS,
          action: ERROR_ACTIONS[failedStep],
          env: ENVIRONMENT,
          appVersion: `${BUILD_VERSION}(${BUILD_NUMBER})`,
          step: failedStep,
          timedOut: tagged.isTimeout === true,
          durationMs: Date.now() - startedAt,
        },
      });

      // Back to a clean live camera so the user can simply try again.
      setCaptureLivePicture(null);
      setMacroData(null);
      photoIsOnScreen = false;
      errorAlert({
        title: SCAN_FAILED_TITLE,
        // Only the upload step carries a server-shaped error worth surfacing;
        // capture/compress failures get a specific, actionable message.
        body:
          failedStep === "upload" && !tagged.isTimeout
            ? getError(error)
            : USER_MESSAGES[failedStep],
      });
    } finally {
      // The single place the loader is released - reached on success, failure,
      // timeout, cancellation and teardown alike.
      abortUploadRef.current = null;
      isScanningRef.current = false;
      deleteFileQuietly(compressedUri);

      if (isStale()) {
        // Screen is gone: nothing will display or reclaim this capture later.
        deleteFileQuietly(photoPath);
      } else if (photoIsOnScreen) {
        // Still displayed - keep the file and reclaim it on the next scan.
        onScreenPhotoRef.current = photoPath;
        setIsLiveScanning(false);
      } else {
        deleteFileQuietly(photoPath);
        setIsLiveScanning(false);
      }
    }
  }, [
    analyseFood,
    setCaptureLivePicture,
    setIsLiveScanning,
    setMacroData,
    userEmail,
  ]);

  // Leaving the screen: stop the request and reclaim temporary files.
  useEffect(
    () => () => {
      runIdRef.current += 1;
      abortUploadRef.current?.();
      abortUploadRef.current = null;
      isScanningRef.current = false;
      deleteFileQuietly(onScreenPhotoRef.current);
      onScreenPhotoRef.current = null;
    },
    [],
  );

  return { runDonutScan, isAnalysing: isLoading };
};
