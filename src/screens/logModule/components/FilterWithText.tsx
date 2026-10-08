import { Pressable } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";
import styles from "./styles";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  handleOpenFilterSheet: any;
  value: any;
};

const FilterWithText = ({ handleOpenFilterSheet, value }: Props) => {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Choose the date range"
      onPress={handleOpenFilterSheet}
      style={({ pressed }) => [
        styles.filterView,
        {
          backgroundColor: colors.YELLOW_TRANSPARENT,
          borderColor: colors.BORDER_COLOR,
        },
        pressed && styles.actionPressed,
      ]}
    >
      <AppText
        allowFontScaling={false}
        style={[styles.filterText, { color: colors.HEADING }]}
      >
        {value ? value?.replace(/_/g, " ") ?? "" : ""}
      </AppText>
      <Svg width={12} height={12} viewBox="0 0 24 24">
        <Path
          d="M6 9l6 6 6-6"
          stroke={colors.HEADING}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Pressable>
  );
};

export default FilterWithText;
