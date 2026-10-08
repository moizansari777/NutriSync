import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Pressable,
} from "react-native";
import {
  Camera,
  CameraRef,
  useCameraPermission,
  usePhotoOutput,
} from "react-native-vision-camera";
import * as RNFS from "@dr.pogodin/react-native-fs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFloatingTabBarInset } from "../../navigations/bottomTabs/GlassTabBar";
import { CAMERA_FROM_CHAT, CameraMode } from "./cameraModes";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ViewShot, { captureRef } from "react-native-view-shot";
import styles from "./styles";
import { RootStackParamList, screens } from "../../navigations/routes";
import ICONS from "../../assets/icons";
import ShowMessage from "./components/ShowMessage";
import { activeOpacity } from "../../constant";
import ZoomButtons from "./components/ZoomButtons";
import CaptureSnaps from "./components/CaptureSnaps";
import { AnalyseResultProps } from "../../schemas/types";
import FlashIcon from "./components/FlashIcon";
import { RootState } from "../../states/store/store";
import { ResultSheet } from "./components/ResultSheet";
import { setScreenFromLogHistory } from "../../states/reducer/cameraReducer";
import { useTheme } from "../../hooks/useTheme";
import { useForegroundOnce } from "../../hooks/useForegroundOnce";
import { shareService } from "../../utils/shareService";
import LoadingIndicator from "../../components/loaders/LoadingIndicator";
import { COLORS } from "../../macros/colors";
import { toFileUri } from "../../utils/fileUri";
import { useDonutFoodScan } from "./hooks/useDonutFoodScan";
import { useCameraZoom } from "./hooks/useCameraZoom";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.VISION_CAMERA_SCREEN
>;

/**
 * How long after the native share sheet settles a tap is still assumed to be
 * the one that dismissed it, rather than a deliberate tap on the result sheet.
 */
const SHARE_DISMISS_WINDOW_MS = 600;

const VisionCamera: FC<Props> = ({ navigation, route }) => {
  const routeParams = route.params?.from || "";
  const { colors } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  // Opened as a tab, the glass tab bar floats over the bottom of the preview.
  const tabBarInset = getFloatingTabBarInset(bottom) + 4;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  // Shoot JPEG instead of the platform default. iOS resolves `native` to HEIC,
  // and RN derives a multipart part's Content-Type from the file extension
  // (RCTFileRequestHandler), overwriting whatever `type` the payload declares -
  // so a HEIC capture reaches the API as `image/heic` and is rejected. Encoding
  // JPEG at capture time costs nothing extra and keeps every consumer (upload,
  // preview) on a universally supported format. Android's `native` already
  // resolves to JPEG, so this leaves it byte-for-byte unchanged.
  const photoOutput = usePhotoOutput({ containerFormat: "jpeg" });

  const viewShotRef = useRef<any>(null);
  const cameraRef = useRef<CameraRef>(null);
  // Android hands the tap that dismisses the native share chooser straight
  // through to whatever sits behind it - here, the result sheet's scrim - so a
  // single "cancel" tap would close the chooser *and* tear the sheet down.
  // These mark that one such tap is still expected: it can land either side of
  // the share promise resolving, hence the window that only starts once the
  // share has settled.
  const isShareDismissPendingRef = useRef(false);
  const shareDismissExpiresAtRef = useRef(0);
  const { hasPermission, requestPermission } = useCameraPermission();

  const isActive = isFocused;

  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [macroData, setMacroData] = useState<AnalyseResultProps | null>(null);
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [captureLivePicture, setCaptureLivePicture] = useState<any>(null);
  const [capturing, setCapturing] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  const isScreenFromLogHistory = useSelector(
    (state: RootState) => state.cameraReducer?.isScreenFromLogHistory,
  );
  const cameraMode: CameraMode = isScreenFromLogHistory
    ? "adjust"
    : routeParams === CAMERA_FROM_CHAT
    ? "photo"
    : "scan";

  // Owns the back camera to bind and the x-factor → camera zoom conversion,
  // both of which depend on what the running session reports.
  const {
    device,
    zoomLevels,
    activeZoom,
    handleCameraZoom,
    readZoomCapabilities,
  } = useCameraZoom(cameraRef);

  const cameraOutputs = useMemo(() => [photoOutput], [photoOutput]);

  const { runDonutScan, isAnalysing } = useDonutFoodScan({
    photoOutput,
    isFlashOn,
    hasFlash: device?.hasFlash === true,
    setIsLiveScanning,
    setCaptureLivePicture,
    setMacroData,
  });

  useEffect(() => {
    (async () => {
      if (hasPermission) return;
      requestPermission();
    })();
  }, []);

  useForegroundOnce(async () => {
    if (hasPermission) return;
    requestPermission();
  });

  // When the screen loses focus the session stops; drop the ready flag so the
  // warm-up overlay is shown again the moment we come back and re-activate.
  useEffect(() => {
    if (!isActive) setIsPreviewReady(false);
  }, [isActive]);

  if (!hasPermission) {
    return (
      <ShowMessage
        msg="Looks like camera permission is not granted. Please enable it from settings to continue."
        permission={true}
      />
    );
  }

  const handleFlashOnOff = () => {
    setIsFlashOn(!isFlashOn);
  };

  const handleGoBack = () => {
    navigation.goBack();
    if (isScreenFromLogHistory) {
      dispatch(setScreenFromLogHistory(""));
    }
  };

  const handleReset = () => {
    setMacroData(null);
  };

  const handlePressOnImage = () => {
    setCaptureLivePicture(null);
    handleReset();
  };

  /**
   * Swallows the pass-through tap described above, and only ever one per share
   * - so a share that somehow never settles still can't strand the user on a
   * sheet they cannot close. iOS presents the share sheet modally and leaks
   * nothing through, so it keeps its existing behaviour untouched.
   */
  const consumeShareDismissTap = () => {
    if (Platform.OS !== "android") return false;
    if (!isShareDismissPendingRef.current) return false;

    isShareDismissPendingRef.current = false;

    return Date.now() < shareDismissExpiresAtRef.current;
  };

  const handleSnapshotAndShare = async () => {
    setCapturing(true);
    isShareDismissPendingRef.current = true;
    shareDismissExpiresAtRef.current = Number.POSITIVE_INFINITY;

    setTimeout(async () => {
      try {
        if (!viewShotRef.current) return;

        const uri = await captureRef(viewShotRef, {
          format: "jpg",
          quality: 0.9,
        });

        if (Platform.OS === "ios") {
          const destPath = `${
            RNFS.CachesDirectoryPath
          }/nutrisync_share_${Date.now()}.jpg`;
          await RNFS.copyFile(uri, destPath);

          await shareService({
            title: "NutriSync",
            message: "Nutrition insights for my meal",
            url: `file://${destPath}`,
            type: "image/jpeg",
          });

          await RNFS.unlink(destPath); // ✅ after share completes
        } else {
          await shareService({
            title: "NutriSync",
            message: "Nutrition insights for my meal",
            url: uri,
          });
        }
      } catch (error) {
        console.error("Share failed:", error);
      } finally {
        setCapturing(false);
        // The chooser is gone: the tap that closed it, if it hasn't arrived
        // already, is due about now.
        if (isShareDismissPendingRef.current) {
          shareDismissExpiresAtRef.current =
            Date.now() + SHARE_DISMISS_WINDOW_MS;
        }
      }
    }, 250);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      testID="camera_screen_id"
    >
      <>
        {device && (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            outputs={cameraOutputs}
            zoom={activeZoom.value}
            onPreviewStarted={() => {
              setIsPreviewReady(true);
              // The session is up, so it can now be asked what this camera's
              // zoom scale and range really are.
              readZoomCapabilities();
            }}
            onPreviewStopped={() => setIsPreviewReady(false)}
          />
        )}

        {/* Warm-up mask: covers the camera until the preview's first frame is
            ready, so re-entering the screen never shows a black flash/freeze. */}
        {isActive && !isPreviewReady && !captureLivePicture && (
          <View
            style={[
              StyleSheet.absoluteFill,
              styles.warmUpOverlay,
              { backgroundColor: colors.BACKGROUND },
            ]}
          >
            <LoadingIndicator color={COLORS.PINK} size="large" />
          </View>
        )}
        {!captureLivePicture && (
          <View style={[styles.topRowView, { paddingTop: top + 10 }]}>
            {routeParams || isScreenFromLogHistory ? (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={handleGoBack}
                style={{ zIndex: 99999999 }}
              >
                <Image
                  source={ICONS.backArrowCircle}
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
            ) : (
              <View />
            )}

            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={handleFlashOnOff}
              style={[styles.flashView, isFlashOn && styles.activeFlash]}
            >
              <FlashIcon active={isFlashOn} />
            </TouchableOpacity>
          </View>
        )}

        <ViewShot
          ref={viewShotRef}
          style={StyleSheet.absoluteFill}
          options={{ format: "jpg", quality: 0.9 }}
        >
          {/* Captured photo */}
          {captureLivePicture && (
            <Pressable
              onPress={handlePressOnImage}
              style={StyleSheet.absoluteFill}
            >
              <Image
                source={{ uri: toFileUri(captureLivePicture?.filePath) }}
                style={StyleSheet.absoluteFill}
              />
            </Pressable>
          )}

          {macroData && (
            <ResultSheet
              data={macroData}
              macroData={macroData}
              onScanAgain={handleReset}
              setCaptureLivePicture={setCaptureLivePicture}
              handleSnapshotAndShare={handleSnapshotAndShare}
              capturing={capturing}
              shouldIgnoreDismiss={consumeShareDismissTap}
              bottomInset={routeParams ? 0 : tabBarInset}
            />
          )}
        </ViewShot>

        {!captureLivePicture && (
          <View
            style={[
              styles.bottomBar,
              { paddingBottom: routeParams ? bottom + 20 : tabBarInset },
            ]}
          >
            {device && (
              <ZoomButtons
                zoomValue={activeZoom}
                zoomLevels={zoomLevels}
                handleCameraZoom={handleCameraZoom}
              />
            )}
            <CaptureSnaps
              isFlashOn={isFlashOn}
              hasFlash={device?.hasFlash === true}
              setIsLiveScanning={setIsLiveScanning}
              setCaptureLivePicture={setCaptureLivePicture}
              photoOutput={photoOutput}
              onDonutPress={runDonutScan}
              isDonutLoading={isAnalysing}
              mode={cameraMode}
            />
          </View>
        )}
        {isLiveScanning && (
          <View style={styles.frameWrap}>
            <View style={styles.frameWrapView}>
              <LoadingIndicator color={COLORS.PINK} size="large" />
            </View>
          </View>
        )}
      </>
    </View>
  );
};

export default VisionCamera;
