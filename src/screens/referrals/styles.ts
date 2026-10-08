import { StyleSheet } from "react-native";
import { mainHPadding } from "../../constant";
import { fontSize, height } from "../../utils/responsiveSize";
import { COLORS } from "../../macros/colors";
import { FONTS } from "../../assets/fonts";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: mainHPadding,
    paddingTop: height(3),
  },
  headingText: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
    marginBottom: 8,
  },
  labelText: {
    fontSize: fontSize(3.25),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
  },
  labelTextOption: {
    fontSize: fontSize(3.4),
    fontFamily: FONTS.SemiBold_600,
    color: COLORS.HEADING,
  },
  copyView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    borderWidth: 0.5,
    borderColor: COLORS.BORDER_COLOR,
    borderRadius: 100,
    padding: 8,
  },
  urlText: {
    fontSize: fontSize(3),
    fontFamily: FONTS.Regular_400,
    color: COLORS.TEXT,
    marginLeft: 10,
    flexShrink: 1,
  },
  instructionText: {
    fontSize: fontSize(2.9),
    lineHeight: fontSize(4.5),
    letterSpacing: 0.4,
    fontFamily: FONTS.Regular_400,
    color: COLORS.TEXT,
    marginTop: 7,
  },
  desText: {
    fontSize: fontSize(3.1),
    fontFamily: FONTS.Regular_400,
    color: COLORS.TEXT,
    flexShrink: 1,
  },
  itemView: {
    flexDirection: "row",
    gap: 12,
    flexShrink: 1,
  },
  icon: {
    height: 35,
    width: 35,
    resizeMode: "contain",
  },
  iconImg: {
    height: 22,
    width: 22,
    resizeMode: "contain",
  },
  arrow: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  view: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    flexShrink: 1,
  },
  textRightView: {
    flexShrink: 1,
  },
  optionView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: mainHPadding,
    gap: 15,
    marginTop: 25,
  },
  navigationOptionView: {
    paddingHorizontal: mainHPadding,
    gap: 15,
    marginTop: 25,
  },
  referralView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    backgroundColor: COLORS.WHITE,
    borderRadius: 100,
    padding: 15,
    borderWidth: 0.5,
    borderColor: COLORS.PRIMARY,
  },
  referralViewIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  iconView: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  iconShare: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
});

export default styles;
