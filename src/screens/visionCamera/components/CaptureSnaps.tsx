import {
  View,
  Pressable,
  Image,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import React, { useCallback } from "react";
import ImagePicker from "react-native-image-crop-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import * as ErrorReporter from "../../../utils/errorReporter";
import styles from "../styles";
import ICONS from "../../../assets/icons";
import { RootNavigationProp } from "../../../schemas/types";
import { screens } from "../../../navigations/routes";
import AppText from "../../../components/appText";
import { CameraMode } from "../cameraModes";
import { RootState } from "../../../states/store/store";
import { useTheme } from "../../../hooks/useTheme";
import { useAdjustLogHistoryPortionMutation } from "../../../services/logsTDEEServices";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { setScreenFromLogHistory } from "../../../states/reducer/cameraReducer";
import { getError } from "../../../utils/errors";
import { toFileUri } from "../../../utils/fileUri";
import { BUILD_NUMBER, BUILD_VERSION, ENVIRONMENT } from "../../../config";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  isFlashOn: boolean;
  hasFlash: boolean;
  setIsLiveScanning: any;
  setCaptureLivePicture: any;
  photoOutput: any;
  onDonutPress: () => void | Promise<void>;
  isDonutLoading: boolean;
  mode: CameraMode;
};

/** Where the image being adjusted came from - useful when triaging failures. */
type AdjustPortionSource = "camera" | "gallery";

const CaptureSnaps = ({
  isFlashOn,
  hasFlash,
  setIsLiveScanning,
  setCaptureLivePicture,
  photoOutput,
  onDonutPress,
  isDonutLoading,
  mode,
}: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const { colors, scheme } = useTheme();
  const dispatch = useDispatch();
  const shutterScale = useSharedValue(1);

  const shutterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shutterScale.value }],
  }));

  const isScreenFromLogHistory = useSelector(
    (state: RootState) => state.cameraReducer?.isScreenFromLogHistory,
  );

  const userEmail = useSelector(
    (state: RootState) => state?.authReducer?.userData?.user?.email,
  );

  const [adjustPortion] = useAdjustLogHistoryPortionMutation();

  const reportError = useCallback(
    (error: unknown, action: string, extra?: Record<string, unknown>) => {
      ErrorReporter.captureException(error, {
        extra: {
          userEmail,
          device: Platform.OS,
          action,
          env: ENVIRONMENT,
          appVersion: `${BUILD_VERSION}(${BUILD_NUMBER})`,
          ...extra,
        },
      });
    },
    [userEmail],
  );

  const takePhoto = async () => {
    try {
      if (photoOutput) {
        const photo = await photoOutput.capturePhotoToFile(
          {
            enableShutterSound: false,
            flashMode: isFlashOn && hasFlash ? "on" : "off",
          },
          {},
        );

        if (photo) {
          if (mode === "photo") {
            navigation.navigate(screens.PREVIEW_FULL_IMAGE_SCREEN, {
              imageURL: toFileUri(photo?.filePath),
            });
            return;
          }

          setCaptureLivePicture(photo);
          setIsLiveScanning(true);

          const imagePayload = {
            name: `photo_${Date.now()}.jpg`,
            uri: toFileUri(photo?.filePath),
            type: "image/jpeg",
          };

          handleAdjustPortion(imagePayload, "camera");
        }
      }
    } catch (error) {
      // The capture silently does nothing for the user when it throws, so the
      // report is the only trace of it.
      reportError(
        error,
        "Adjust portion while capturing image - Photo capture",
        {
          flashRequested: isFlashOn && hasFlash,
          isLogHistoryFlow: Boolean(isScreenFromLogHistory),
        },
      );
    }
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: "photo",
        cropping: false,
        compressImageQuality: 0.8,
      });

      if (image?.path) {
        if (isScreenFromLogHistory) {
          setCaptureLivePicture({ ...image, filePath: image?.path });
          setIsLiveScanning(true);

          const imagePayload = {
            name: `photo_${Date.now()}.jpg`,
            uri:
              Platform.OS === "android"
                ? image?.path
                : image?.path?.replace("file://", ""),
            type: image?.mime || "image/jpeg",
          };

          handleAdjustPortion(imagePayload, "gallery");
        } else {
          navigation.navigate(screens.PREVIEW_FULL_IMAGE_SCREEN, {
            imageURL: image?.path,
          });
        }
      }
    } catch (e: any) {
      // Handled user conditions, not defects: both already lead somewhere
      // sensible, so neither is worth an error report.
      if (
        e?.message?.includes("User did not grant library permission") ||
        e?.code === "E_PERMISSION_MISSING"
      ) {
        Alert.alert(
          "Permission Needed",
          "Please enable Photos access in Settings to select images.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openURL("app-settings:"),
            },
          ],
        );
        return;
      }

      // The user backing out of the picker is the normal way to leave it.
      if (e?.code === "E_PICKER_CANCELLED") return;

      reportError(e, "Adjust portion while picking image - Gallery picker", {
        code: e?.code,
        isLogHistoryFlow: Boolean(isScreenFromLogHistory),
      });
    }
  };

  const handleAdjustPortion = useCallback(
    (imagePayload: any, source: AdjustPortionSource) => {
      requestAnimationFrame(() => {
        const formData = new FormData();
        formData.append("image", imagePayload as any);

        adjustPortion({ data: formData, logId: isScreenFromLogHistory })
          .unwrap()
          .then(payload => {
            successAlert({ body: payload?.message || "Data has been updated" });
            navigation.replace(screens.MAIN_SCREEN_STACK, {
              screen: screens.BOTTOM_TAB_STACK,
              params: { screen: screens.HISTORY_TAB },
            });
            dispatch(setScreenFromLogHistory(""));
            setCaptureLivePicture(null);
            setIsLiveScanning(false);
          })
          .catch(error => {
            reportError(
              error,
              "Adjust portion while updating log - Adjust Portion API",
              {
                logId: isScreenFromLogHistory,
                source,
                status: error?.status,
              },
            );

            const errorMessage = getError(error);
            errorAlert({ body: errorMessage || "" });
            setCaptureLivePicture(null);
            setIsLiveScanning(false);
          });
      });
    },
    [
      adjustPortion,
      dispatch,
      isScreenFromLogHistory,
      navigation,
      reportError,
      setCaptureLivePicture,
      setIsLiveScanning,
    ],
  );

  /**
   * The scan reports its own capture/compress/upload failures (see
   * `useDonutFoodScan`), so nothing is duplicated here. This only catches a
   * failure that escapes the scan entirely - an unhandled rejection that would
   * otherwise leave the donut locked with no trace of why.
   */
  const handleDonutPress = useCallback(() => {
    try {
      Promise.resolve(onDonutPress()).catch(error => {
        reportError(
          error,
          "Donut feature while processing image - Unhandled scan failure",
        );
      });
    } catch (error) {
      reportError(
        error,
        "Donut feature while processing image - Unhandled scan failure",
      );
    }
  }, [onDonutPress, reportError]);

  const shutterPressIn = () => {
    shutterScale.value = withSpring(0.88, { damping: 18, stiffness: 360 });
  };
  const shutterPressOut = () => {
    shutterScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  // Photo mode (from the chat) and adjusting a History entry both take or pick
  // an ordinary photo: gallery plus shutter, no Live AI scan.
  if (mode !== "scan") {
    return (
      <View style={styles.bottomButtons}>
        <Pressable
          onPress={openGallery}
          accessibilityRole="button"
          accessibilityLabel="Choose from library"
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.GLASS_BG,
              borderColor: colors.GLASS_BORDER,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Image
            source={ICONS.image}
            style={styles.imgIcon}
            tintColor={colors.HEADING}
          />
        </Pressable>

        <AnimatedPressable
          onPress={takePhoto}
          onPressIn={shutterPressIn}
          onPressOut={shutterPressOut}
          accessibilityRole="button"
          accessibilityLabel="Take photo"
          style={[
            styles.borderCircle,
            { borderColor: scheme === "dark" ? colors.HEADING : colors.WHITE },
          ]}
        >
          <Animated.View
            style={[
              styles.innerCircle,
              { backgroundColor: colors.PRIMARY },
              shutterStyle,
            ]}
          />
        </AnimatedPressable>

        <View style={styles.button2} />
      </View>
    );
  }

  // The Camera tab is just the food scanner: one shutter that detects the
  // meal in frame and shows its calories and protein.
  return (
    <View style={styles.scanControls}>
      <View
        style={[styles.scanHint, { backgroundColor: colors.CAMERA_BAR_BG }]}
      >
        <AppText
          allowFontScaling={false}
          style={[styles.scanHintText, { color: colors.CAMERA_BAR_TEXT }]}
        >
          {isDonutLoading ? "Detecting food…" : "Point at your meal and tap"}
        </AppText>
      </View>

      <AnimatedPressable
        onPress={handleDonutPress}
        onPressIn={shutterPressIn}
        onPressOut={shutterPressOut}
        disabled={isDonutLoading}
        accessibilityRole="button"
        accessibilityLabel="Scan food"
        accessibilityState={{ busy: isDonutLoading }}
        style={[styles.borderCircle, { borderColor: colors.WHITE }]}
      >
        <Animated.View
          style={[
            styles.innerCircle,
            styles.scanShutterInner,
            { backgroundColor: colors.PRIMARY },
            shutterStyle,
          ]}
        >
          {isDonutLoading ? (
            <ActivityIndicator color={colors.ON_PRIMARY} />
          ) : (
            <Svg width={28} height={28} viewBox="0 0 24 24">
              <Path
                d="M10 3c.4 3.7 2.3 5.6 6 6-3.7.4-5.6 2.3-6 6-.4-3.7-2.3-5.6-6-6 3.7-.4 5.6-2.3 6-6Z"
                fill={colors.ON_PRIMARY}
              />
              <Path
                d="M18 13c.2 2 1.2 3 3 3.2-1.8.2-2.8 1.2-3 3.2-.2-2-1.2-3-3-3.2 1.8-.2 2.8-1.2 3-3.2Z"
                fill={colors.ON_PRIMARY}
              />
            </Svg>
          )}
        </Animated.View>
      </AnimatedPressable>
    </View>
  );
};

export default CaptureSnaps;
