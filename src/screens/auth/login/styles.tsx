import { Platform, StyleSheet } from "react-native";
import { fontSize, height, width } from "../../../utils/responsiveSize";
import { FONTS } from "../../../assets/fonts";
import { COLORS } from "../../../macros/colors";

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: width(8),
  },

  forGotView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height(1.5),
  },

  forgotTextContainer: {
    flexDirection: "row",
    flexShrink: 1,
    gap: 5,
    justifyContent: "center",
    marginTop: width(3.5),
  },
  newText: {
    flexShrink: 1,
    alignItems: "center",
    marginTop: width(3.5),
    paddingHorizontal: 10,
  },

  haveAccountText: {
    color: COLORS.TEXT,
    fontFamily: FONTS.Medium_500,
    fontSize: fontSize(3.5),
    letterSpacing: 0.4,
    flexShrink: 1,
    textAlign: "center",
  },

  loginText: {
    color: COLORS.SECONDARY,
    fontFamily: FONTS.Medium_500,
    fontSize: fontSize(3.35),
    letterSpacing: 0.5,
  },

  topInputMargin: { marginTop: 14 },

  underLine: {
    textDecorationLine: "underline",
  },
  subHeadingText: {
    fontSize: fontSize(3.5),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
    letterSpacing: 0.4,
    textDecorationLine: "underline",
  },

  checkbox: {
    height: 22,
    width: 22,
    resizeMode: "contain",
  },

  rememberView: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  biometricsView: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: Platform.OS === "ios" ? height(1.5) : height(3.5),
  },
  text: {
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
    fontSize: fontSize(3.4),
    letterSpacing: 0.5,
  },
  biometrics: {
    height: 45,
    width: 45,
    resizeMode: "contain",
  },
});

export default styles;
