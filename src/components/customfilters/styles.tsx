import { StyleSheet } from "react-native";
import { fontSize, height } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { COLORS } from "../../macros/colors";
import { mainHPadding } from "../../constant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: mainHPadding,
    marginTop: height(3),
    gap: 16,
  },
  headingText: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.SemiBold_600,
    color: COLORS.HEADING,
  },

  radioRows: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  radioIconView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radioIcon: {
    height: 26,
    width: 26,
    resizeMode: "contain",
  },
  radioLabel: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Medium_500,
    letterSpacing: 0.5,
    color: COLORS.TEXT,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    paddingBottom: 8,
    paddingHorizontal: mainHPadding,
  },
  saveText: {
    fontSize: fontSize(4),
    fontFamily: FONTS.Regular_400,
    color: COLORS.HEADING,
  },
  close: {
    height: 26,
    width: 26,
    resizeMode: "contain",
  },
  sheetBody: {
    paddingHorizontal: mainHPadding,
    paddingTop: 4,
    gap: 14,
  },
  sheetTitle: {
    fontSize: fontSize(5.2),
    fontFamily: FONTS.ExtraBold_800,
    letterSpacing: -0.4,
  },
  group: {
    borderRadius: 22,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: { borderBottomWidth: 0 },
  itemText: {
    fontSize: fontSize(3.9),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
  },
  itemTextActive: { fontFamily: FONTS.Bold_700 },
  radio: {
    height: 24,
    width: 24,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  radioEmpty: { borderWidth: 1.5 },
});

export default styles;
