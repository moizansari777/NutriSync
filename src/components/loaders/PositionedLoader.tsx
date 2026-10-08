import { View, ActivityIndicator, StyleSheet } from "react-native";
import React, { memo } from "react";
import { COLORS } from "../../macros/colors";
import { fontSize } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

const PositionedLoader = ({
  isBlurr,
  msg = "Loading",
  color,
}: {
  isBlurr?: boolean;
  msg?: string;
  color?: string;
}) => {
  const { colors, scheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isBlurr ? colors.MIRROR_BG : colors.TRANSPARENT_BG,
        },
      ]}
    >
      <View
        style={[
          styles.innerContainer,
          {
            backgroundColor: scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
            shadowColor: scheme === "dark" ? colors.GRAY_BG : colors.BLACK,
          },
        ]}
      >
        <ActivityIndicator color={color} />
        <AppText
          allowFontScaling={false}
          style={[styles.text, { color: color ? color : colors.TEXT }]}
        >
          {msg}
        </AppText>
      </View>
    </View>
  );
};

export default memo(PositionedLoader);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    bottom: 0,
    flex: 1,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 9999999,
    backgroundColor: COLORS.WHITE,
  },
  innerContainer: {
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    borderRadius: 15,
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingVertical: 20,
    zIndex: 99999,
    marginHorizontal: 15,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Regular_400,
    color: COLORS.TEXT,
    textAlign: "center",
  },
});
