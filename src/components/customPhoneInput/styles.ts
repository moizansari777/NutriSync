import { Platform, StyleSheet } from "react-native";
import { fontSize, width } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { COLORS } from "../../macros/colors";

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  inputLabel: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
    marginBottom: width(1.2),
    letterSpacing: 0.5,
  },
  inputFieldMain: {
    borderWidth: 0.7,
    borderRadius: 100,
    paddingHorizontal: 15,
    width: 80,
    height: 59,
    paddingVertical: 20,
    borderColor: COLORS.INPUT_BORDER,
    backgroundColor: COLORS.INPUT_BG,
    color: COLORS.BLACK,
    justifyContent: "center",
    alignItems: "center",
    fontSize: fontSize(3.5),
    letterSpacing: 0.5,
  },
});

export default styles;
