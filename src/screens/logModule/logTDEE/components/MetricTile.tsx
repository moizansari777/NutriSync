import { Image, Pressable, View } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styles from "../styles";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";
import ICONS from "../../../../assets/icons";

type Props = {
  label: string;
  unit: string;
  tracked: number;
  target: number;
  /** 0–100 */
  percent: number;
  onPress?: () => void;
};

const fmt = (value?: number) => Number(Number(value || 0).toFixed(1));

/** Full-width card for a single daily target: value, what's left and a filling bar. */
const MetricTile = ({
  label,
  unit,
  tracked,
  target,
  percent,
  onPress,
}: Props) => {
  const { colors, scheme } = useTheme();
  const fill = useSharedValue(0);
  const isHit = !!target && tracked >= target;

  useEffect(() => {
    const clamped = Math.max(0, Math.min(Number(percent) || 0, 100));
    fill.value = withTiming(clamped, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [percent, fill]);

  const barStyle = useAnimatedStyle(() => ({ width: `${fill.value}%` }));

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.metricTile,
        {
          backgroundColor: scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
          borderColor: colors.BORDER_COLOR,
        },
        pressed && styles.optionTilePressed,
      ]}
    >
      <View style={styles.metricHead}>
        <AppText
          allowFontScaling={false}
          style={[styles.metricLabel, { color: colors.TEXT }]}
        >
          {label}
        </AppText>
        {onPress && (
          <Image
            source={ICONS.edit2}
            style={styles.editIcon}
            tintColor={colors.ICON_COLOR}
          />
        )}
      </View>
      <View style={styles.metricValueRow}>
        <AppText
          allowFontScaling={false}
          style={[styles.metricValue, { color: colors.HEADING }]}
        >
          {fmt(tracked)}
          <AppText
            allowFontScaling={false}
            style={[styles.metricUnit, { color: colors.TEXT }]}
          >
            {` / ${fmt(target)} ${unit}`}
          </AppText>
        </AppText>
        <AppText
          allowFontScaling={false}
          style={[
            styles.metricFoot,
            { color: isHit ? colors.GREEN_DARK : colors.TEXT },
          ]}
        >
          {isHit
            ? "Goal reached"
            : target
            ? `${fmt(target - tracked)} ${unit} to go`
            : "No goal set"}
        </AppText>
      </View>
      <View
        style={[styles.metricTrack, { backgroundColor: colors.BACKGROUND }]}
      >
        <Animated.View
          style={[
            styles.metricFill,
            { backgroundColor: isHit ? colors.GREEN : colors.PRIMARY },
            barStyle,
          ]}
        />
      </View>
    </Pressable>
  );
};

export default React.memo(MetricTile);
