import { StyleSheet } from "react-native";
import { fontSize, width } from "../../utils/responsiveSize";
import { COLORS } from "../../macros/colors";
import { FONTS } from "../../assets/fonts";

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "rgba(0,0,0,.55)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  innerView: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: width(5),
    width: width(92),
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  confirmInnerView: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    width: width("88%"),
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  headingText: {
    fontSize: fontSize(4.5),
    color: COLORS.BLACK,
    fontFamily: FONTS.SemiBold_600,
    letterSpacing: 0.4,
  },
  subHeadingText: {
    fontSize: fontSize(3.5),
    color: COLORS.HEADING,
    fontFamily: FONTS.Regular_400,
    textAlign: "center",
    marginTop: 4,
    letterSpacing: 0.4,
  },
  updateAppImage: {
    height: 130,
    width: "100%",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: width(6),
  },
  updateButtonContainer: {
    width: "70%",
    marginTop: width(5),
    gap: 12,
    paddingBottom: 20,
  },
  rowValue: {
    color: COLORS.BLACK,
    fontFamily: FONTS.Medium_500,
  },
});

export default styles;
