import { useCallback, useMemo, useState } from "react";
import {
  CameraController,
  CameraDevice,
  CameraRef,
  useCameraDevice,
  useCameraDevices,
} from "react-native-vision-camera";
import { CameraZoomProps } from "../../../schemas/types";

/**
 * Zoom handling for the camera screen.
 *
 * The buttons are real-world "x" factors (what the user sees), but the
 * Camera's `zoom` prop is in the *bound camera's own* units, and the two
 * scales only line up on some devices:
 *
 *  - An iPhone's multi-lens device starts at `zoom: 1` on the ultra-wide, so
 *    "1x" there is really `zoom: 2` - the lens switch-over factor.
 *  - Android reports plain zoom ratios (1 really is 1x), but many phones keep
 *    the ultra-wide as a *separate* camera, so the multi-lens device we are
 *    handed cannot go below 1x at all. Clamping 0.5x into that range lands it
 *    exactly on 1x, which is why 0.5x could look like it did nothing.
 *
 * So this hook:
 *  1. converts x-factors into the bound camera's units, preferring the ratio
 *     the *running session* reports over what static device metadata implies;
 *  2. clamps to the range the running session actually accepts - `setZoom()`
 *     throws for out-of-range values, and a rejected zoom silently leaves the
 *     preview where it was;
 *  3. binds the wider camera while the selected factor is out of the main
 *     camera's reach, so 0.5x really does zoom out on phones that publish
 *     their ultra-wide lens;
 *  4. offers only the factors that camera can actually reach - a phone that
 *     keeps its ultra-wide lens private gets a 1x/3x row rather than a 0.5x
 *     button that does nothing.
 */

/** The zoom buttons, expressed as real-world "x" factors. */
const ZOOM_FACTORS = [0.5, 1, 3];
const DEFAULT_ZOOM_FACTOR = 1;

/** What a running session tells us about the camera it is bound to. */
type ZoomCapabilities = {
  /** Camera zoom units that make up one displayed "x". */
  scale: number;
  minZoom: number;
  maxZoom: number;
};

/** Below this share of the bound lens' focal length, a lens is "wider". */
const WIDER_LENS_RATIO = 0.8;

const isUsable = (value: number | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Camera zoom units per displayed "x", from static metadata alone. Used until
 * the session reports its own numbers, and as the fallback on iOS versions
 * that do not expose a displayable zoom factor.
 */
const getStaticZoomScale = (device: CameraDevice): number => {
  // Cameras that can zoom out past 1x already report zoom as an x-factor,
  // e.g. minZoom 0.5 really is 0.5x - nothing to convert.
  if (device.minZoom < 1) return 1;

  const hasUltraWide =
    device.type === "ultra-wide-angle" ||
    device.physicalDevices?.some(lens => lens.type === "ultra-wide-angle") ===
      true;
  const [wideLensFactor] = device.zoomLensSwitchFactors ?? [];

  if (!hasUltraWide || !wideLensFactor || wideLensFactor <= 1) return 1;
  return wideLensFactor;
};

/**
 * The session's scale wins when it knows more than the static guess, but never
 * the other way around: pre-iOS 18 a session reports no displayable factor at
 * all (scale 1) while the lens switch-over factor is still the truth.
 */
const getZoomScale = (device: CameraDevice, capabilities?: ZoomCapabilities) =>
  Math.max(getStaticZoomScale(device), capabilities?.scale ?? 1);

/**
 * The zoom range to clamp into. A camera that has not published its zoom state
 * yet reports 0 for both bounds, so anything unusable is dropped rather than
 * clamping every level onto the same dead value.
 */
const getZoomRange = (
  device: CameraDevice,
  capabilities?: ZoomCapabilities,
) => {
  // Either source can report 0 for a camera that has not published its zoom
  // state yet, so each bound falls back on its own.
  const rawMin = [capabilities?.minZoom, device.minZoom].find(isUsable);
  const rawMax = [capabilities?.maxZoom, device.maxZoom].find(isUsable);

  const min = rawMin ?? 1;
  const max = rawMax !== undefined && rawMax >= min ? rawMax : Infinity;

  return { min, max };
};

/**
 * Camera zoom units per displayed "x", as the live session sees it.
 * `displayableZoomFactor` is the "x" the user should see for the current
 * `zoom`, so the pair gives this camera's exact conversion - but not every OS
 * version reports one, hence the guarded read and the plain 1 fallback.
 */
const readSessionScale = (controller: CameraController): number => {
  try {
    const ratio = controller.zoom / controller.displayableZoomFactor;
    return isUsable(ratio) ? ratio : 1;
  } catch {
    return 1;
  }
};

/** How far a level had to be clamped to fit the camera's range. */
const clampDistance = (level: CameraZoomProps, scale: number) =>
  Math.abs(level.key * scale - level.value);

/**
 * Drops factors that clamp onto the same zoom as another one. Two buttons
 * driving the identical zoom means one of them is dead - tapping it changes
 * nothing the user can see - so only the factor that best describes what the
 * camera actually does survives.
 *
 * This is what hides 0.5x on phones that keep their ultra-wide lens to
 * themselves: some (Samsung's A-series, for one) publish a single back camera
 * with a zoom range of 1x and up, and no app can open the wider lens.
 */
const dropDeadLevels = (levels: CameraZoomProps[], scale: number) =>
  levels.filter(level =>
    levels.every(
      other =>
        other.key === level.key ||
        Math.abs(other.value - level.value) > 1e-4 ||
        clampDistance(other, scale) >= clampDistance(level, scale),
    ),
  );

/**
 * The camera to fall back on for factors the bound one cannot reach - the
 * ultra-wide, in practice.
 *
 * `type` is the obvious way to spot it, and it is what iOS reports, but on
 * Android the type is derived from CameraX's `intrinsicZoomRatio`, which
 * plenty of devices leave unimplemented: every lens then comes back as
 * 'wide-angle' and the ultra-wide is invisible. Focal length is a raw Camera2
 * characteristic, so it survives that - among the cameras on one side, the
 * ultra-wide is simply the shortest lens.
 */
const findWiderDevice = (
  devices: CameraDevice[],
  boundDevice: CameraDevice,
): CameraDevice | undefined => {
  const candidates = devices.filter(
    item =>
      item.position === boundDevice.position && item.id !== boundDevice.id,
  );

  const byType = candidates.find(item => item.type === "ultra-wide-angle");
  if (byType) return byType;

  const boundFocalLength = boundDevice.focalLength;
  if (!isUsable(boundFocalLength)) return undefined;

  // The margin keeps a second lens of the same class from qualifying; a
  // telephoto, being longer, can never get through here.
  const widestAllowed = boundFocalLength * WIDER_LENS_RATIO;

  return candidates.reduce<CameraDevice | undefined>((widest, item) => {
    const focalLength = item.focalLength;
    if (!isUsable(focalLength) || focalLength > widestAllowed) return widest;

    const widestFocalLength = widest?.focalLength;
    if (isUsable(widestFocalLength) && widestFocalLength <= focalLength) {
      return widest;
    }
    return item;
  }, undefined);
};

/** The lowest "x" this camera can actually reach. */
const getMinFactor = (
  device: CameraDevice,
  capabilities?: ZoomCapabilities,
) => {
  const { min } = getZoomRange(device, capabilities);
  return min / getZoomScale(device, capabilities);
};

export const useCameraZoom = (cameraRef: {
  current: CameraRef | null;
}): {
  device: CameraDevice | undefined;
  zoomLevels: CameraZoomProps[];
  activeZoom: CameraZoomProps;
  handleCameraZoom: (value: CameraZoomProps) => void;
  readZoomCapabilities: () => void;
} => {
  const [zoomFactor, setZoomFactor] = useState<number>(DEFAULT_ZOOM_FACTOR);

  // Keyed by camera id: only a running session knows a camera's true zoom
  // range and scale, and each camera we may bind has its own.
  const [capabilities, setCapabilities] = useState<
    Record<string, ZoomCapabilities>
  >({});

  const multiLensDevice = useCameraDevice("back", {
    physicalDevices: ["ultra-wide-angle", "wide-angle", "telephoto"],
  });

  const devices = useCameraDevices();

  const widerDevice = useMemo(
    () =>
      multiLensDevice ? findWiderDevice(devices, multiLensDevice) : undefined,
    [devices, multiLensDevice],
  );

  // Only fall back to the wider camera while the selected factor is genuinely
  // out of the main camera's reach; the slack keeps a camera that reports e.g.
  // 0.5000001 from switching for nothing.
  const device = useMemo(() => {
    if (!multiLensDevice) return widerDevice;
    if (!widerDevice) return multiLensDevice;

    const minFactor = getMinFactor(
      multiLensDevice,
      capabilities[multiLensDevice.id],
    );
    return zoomFactor < minFactor - 0.01 ? widerDevice : multiLensDevice;
  }, [multiLensDevice, widerDevice, capabilities, zoomFactor]);

  const zoomLevels = useMemo<CameraZoomProps[]>(() => {
    if (!device) return [];

    const deviceCapabilities = capabilities[device.id];
    const scale = getZoomScale(device, deviceCapabilities);
    const { min, max } = getZoomRange(device, deviceCapabilities);

    const levels = ZOOM_FACTORS.map(factor => ({
      key: factor,
      value: clamp(factor * scale, min, max),
    }));

    return dropDeadLevels(levels, scale);
  }, [device, capabilities]);

  // Single source of truth for both the highlighted button and the Camera.
  const activeZoom = useMemo<CameraZoomProps>(() => {
    const level = zoomLevels.find(item => item.key === zoomFactor);
    if (level) return level;

    // The selected factor is not offered by this camera; the closest one that
    // is keeps the button row and the preview agreeing with each other.
    const closest = zoomLevels.reduce<CameraZoomProps | undefined>(
      (best, item) =>
        !best ||
        Math.abs(item.key - zoomFactor) < Math.abs(best.key - zoomFactor)
          ? item
          : best,
      undefined,
    );
    return closest ?? { key: zoomFactor, value: zoomFactor };
  }, [zoomLevels, zoomFactor]);

  /**
   * Reads the bound camera's real zoom scale and range off the live session.
   * Called once the preview is up, and again on every zoom tap so a session
   * that started before its controller existed still gets corrected.
   */
  const readZoomCapabilities = useCallback(() => {
    const controller = cameraRef.current?.controller;
    if (!controller || !device) return;

    try {
      const { device: boundDevice, minZoom, maxZoom } = controller;

      // The controller of the camera we just switched away from can still be
      // around while the session settles; its numbers must not be filed under
      // the camera we switched to.
      if (boundDevice.id !== device.id) return;

      const scale = readSessionScale(controller);

      setCapabilities(previous => {
        const current = previous[device.id];
        if (
          current &&
          current.scale === scale &&
          current.minZoom === minZoom &&
          current.maxZoom === maxZoom
        ) {
          return previous;
        }
        return { ...previous, [device.id]: { scale, minZoom, maxZoom } };
      });
    } catch {
      // Reading from a controller that is already tearing down - the static
      // fallback still describes the camera well enough to shoot with.
    }
  }, [cameraRef, device]);

  const handleCameraZoom = useCallback(
    (value: CameraZoomProps) => {
      readZoomCapabilities();
      setZoomFactor(value.key);
    },
    [readZoomCapabilities],
  );

  return {
    device,
    zoomLevels,
    activeZoom,
    handleCameraZoom,
    readZoomCapabilities,
  };
};
