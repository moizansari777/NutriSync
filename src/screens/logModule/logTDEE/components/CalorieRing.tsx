import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styles from "../styles";
import AppText from "../../../../components/appText";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  /** 0–100 */
  percent: number;
  size: number;
  strokeWidth: number;
  trackColor: string;
  fillColor: string;
  textColor: string;
  value: string;
  caption: string;
};

/** Activity-ring style progress, filling clockwise from 12 o'clock. */
const CalorieRing = ({
  percent,
  size,
  strokeWidth,
  trackColor,
  fillColor,
  textColor,
  value,
  caption,
}: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(Number(percent) || 0, 100));
    progress.value = withTiming(clamped / 100, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [percent, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          fill="none"
        />
      </Svg>
      <View style={styles.ringCenter}>
        <AppText
          allowFontScaling={false}
          style={[styles.ringValue, { color: textColor }]}
        >
          {value}
        </AppText>
        <AppText
          allowFontScaling={false}
          style={[styles.ringCaption, { color: textColor }]}
        >
          {caption}
        </AppText>
      </View>
    </View>
  );
};

export default React.memo(CalorieRing);
