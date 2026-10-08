import { View } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import styles from "./styles";
import AppText from "../../components/appText";
import { useTheme } from "../../hooks/useTheme";

/** Green dot that breathes while the live scanner is the active tab. */
const LiveDot = ({ active }: { active: boolean }) => {
  const { colors } = useTheme();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (active) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(0.35, { duration: 700 }),
          withTiming(1, { duration: 700 }),
        ),
        -1,
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = 1;
    }
  }, [active, pulse]);

  const style = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      style={[
        styles.liveDot,
        { backgroundColor: active ? colors.GREEN : colors.ICON_COLOR },
        style,
      ]}
    />
  );
};

const TabItemTitle = ({
  label,
  color,
  focused,
  hasLiveDot = false,
}: {
  focused: boolean;
  label: string;
  color: string;
  hasLiveDot?: boolean;
}) => {
  return (
    <View style={styles.tabLabelRow}>
      {hasLiveDot && <LiveDot active={focused} />}
      <AppText allowFontScaling={false} style={[styles.tabLabel, { color }]}>
        {label}
      </AppText>
    </View>
  );
};

export default TabItemTitle;
