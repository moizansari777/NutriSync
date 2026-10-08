import React, { useEffect } from "react";
import {
  Image,
  Platform,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import styles from "../styles";
import MacroCard from "./MacroCard";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";
import { activeOpacity } from "../../../constant";
import ICONS from "../../../assets/icons";
import { COLORS } from "../../../macros/colors";

type AnalyseResult = {
  name?: string;
  calories: number;
  proteins: number;
  carbs: number;
  fat: number;
};

export function ResultSheet({
  data,
  onScanAgain,
  macroData,
  setCaptureLivePicture,
  handleSnapshotAndShare,
  capturing,
  shouldIgnoreDismiss,
  bottomInset = 0,
}: {
  data: AnalyseResult;
  onScanAgain: () => void;
  macroData: any;
  setCaptureLivePicture: any;
  handleSnapshotAndShare: any;
  capturing: boolean;
  /**
   * Lets the screen swallow a tap it knows was only the user dismissing the
   * native share sheet. Consumed on call, so it can veto at most one tap.
   */
  shouldIgnoreDismiss?: () => boolean;
  /** Extra space under the content for the floating tab bar. */
  bottomInset?: number;
}) {
  const { colors, scheme } = useTheme();
  const ty = useSharedValue(510);
  const op = useSharedValue(0);

  useEffect(() => {
    op.value = withTiming(1, { duration: 280 });
    ty.value = withSpring(0);
  }, []);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
    opacity: op.value,
  }));

  const btnSc = useSharedValue(1);

  const handlePress = () => {
    // A tap that was really the user cancelling the share sheet leaves the
    // result sheet up; the next one closes it as usual.
    if (shouldIgnoreDismiss?.()) return;

    btnSc.value = withSequence(
      withTiming(0.93, { duration: 80 }),
      withSpring(1, { damping: 10 }),
    );
    setCaptureLivePicture(null);
    onScanAgain();
  };

  return (
    <>
      <Pressable style={styles.sheetScrim} onPress={handlePress}>
        <View pointerEvents="none" />
      </Pressable>

      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View
          style={[
            styles.resultSheet,
            {
              backgroundColor:
                scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
              paddingBottom: 30 + bottomInset,
            },
            sheetStyle,
          ]}
        >
          {!capturing && (
            <View
              style={[
                styles.sheetHandle,
                {
                  backgroundColor:
                    scheme === "dark" ? colors.ICON_COLOR : colors.MIRROR_BG,
                },
              ]}
            />
          )}

          <View style={styles.sheetHead}>
            <AppText
              allowFontScaling={false}
              style={[styles.sheetTitle, { color: colors.HEADING }]}
            >
              {data?.name ?? "Nutrition Info"}
            </AppText>
            {!capturing && (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={handleSnapshotAndShare}
                style={[
                  styles.shareCircleView,
                  {
                    backgroundColor: colors.SECONDARY,
                    marginRight: 5,
                  },
                ]}
              >
                <Image
                  source={
                    Platform.OS === "ios" ? ICONS.shareIOS : ICONS.shareAndroid
                  }
                  style={styles.imgIcon}
                  tintColor={COLORS.WHITE}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.macroSection}>
            <View style={styles.macroRow}>
              <MacroCard
                icon="🔥"
                label="Calories"
                value={data?.calories ?? 0}
                unit=" kcal"
                max={800}
                delay={80}
              />
              <MacroCard
                icon="💪"
                label="Protein"
                value={data?.proteins ?? 0}
                unit=" g"
                max={60}
                delay={200}
              />
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
}
