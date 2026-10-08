import { Platform, StyleSheet } from "react-native";
import { fontSize, width } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { COLORS } from "../../macros/colors";

const styles = StyleSheet.create({
  selectView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 0.7,
    borderRadius: 100,
    paddingHorizontal: 17,
    paddingVertical: Platform.OS === "ios" ? 17 : 17,
    borderColor: COLORS.INPUT_BORDER,
    backgroundColor: COLORS.INPUT_BG,
  },
  leftText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  required: { color: COLORS.RED },
  inputLabel: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
    marginBottom: width(2),
    letterSpacing: 0.5,
  },
  value: {
    color: COLORS.BLACK,
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Medium_500,
    letterSpacing: 0.5,
  },
  placeHolder: {
    color: COLORS.PLACEHOLDER,
    fontSize: fontSize(3.5),
    letterSpacing: 0.5,
    fontFamily: FONTS.Regular_400,
  },
  leftIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  icon: {
    height: 22,
    width: 22,
    resizeMode: "contain",
  },
});

export default styles;
