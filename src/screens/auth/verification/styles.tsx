import { StyleSheet } from "react-native";
import { fontSize, height, width } from "../../../utils/responsiveSize";
import { FONTS } from "../../../assets/fonts";
import { COLORS } from "../../../macros/colors";

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: width(8),
  },

  forGotView: {
    alignItems: "flex-end",
    marginTop: height(1.5),
  },

  forgotTextContainer: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    marginTop: width(3.5),
  },

  haveAccountText: {
    color: COLORS.TEXT,
    fontFamily: FONTS.Medium_500,
    fontSize: fontSize(3.2),
    letterSpacing: 0.5,
  },

  resentView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: height(3),
  },

  otpText: {
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
    fontSize: fontSize(3.2),
    letterSpacing: 0.5,
  },

  boldText: {
    fontFamily: FONTS.SemiBold_600,
  },
});

export default styles;
