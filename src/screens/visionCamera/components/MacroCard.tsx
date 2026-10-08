import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import styles from "../styles";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

function MacroCard({
  icon,
  label,
  value,
  unit,
  max,
  delay,
}: {
  icon: string;
  label: string;
  value: number;
  unit: string;
  max: number;
  delay: number;
}) {
  const { colors } = useTheme();
  const sc = useSharedValue(0.72);
  const op = useSharedValue(0);
  const bar = useSharedValue(0);

  useEffect(() => {
    sc.value = withDelay(delay, withSpring(1, { damping: 14, stiffness: 180 }));
    op.value = withDelay(delay, withTiming(1, { duration: 380 }));
    bar.value = withDelay(
      delay + 200,
      withTiming(value / max, {
        duration: 900,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sc.value }],
    opacity: op.value,
  }));

  return (
    <Animated.View style={[styles.macroCard, cardStyle]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <AppText allowFontScaling={false} style={styles.macroIcon}>
          {icon}
        </AppText>
        <AppText
          allowFontScaling={false}
          style={[styles.macroVal, { color: colors.HEADING }]}
        >
          {value}
          <AppText
            allowFontScaling={false}
            style={[styles.macroUnit, { color: colors.HEADING }]}
          >
            {unit}
          </AppText>
        </AppText>
      </View>
      <AppText
        allowFontScaling={false}
        style={[styles.macroLabel, { color: colors.HEADING }]}
      >
        {label}
      </AppText>
    </Animated.View>
  );
}

export default MacroCard;
