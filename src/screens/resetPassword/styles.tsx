import { StyleSheet } from "react-native";
import { fontSize, height, width } from "../../utils/responsiveSize";
import { COLORS } from "../../macros/colors";
import { FONTS } from "../../assets/fonts";
import { mainHPadding } from "../../constant";

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal: mainHPadding,
    paddingTop: height(3),
  },
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
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
    fontSize: fontSize(3.5),
    letterSpacing: 0.5,
  },

  loginText: {
    color: COLORS.ACCENT_TEXT,
    fontFamily: FONTS.Medium_500,
    fontSize: fontSize(3.5),
    letterSpacing: 0.5,
  },
  topInputMargin: { marginTop: 14 },
});

export default styles;
