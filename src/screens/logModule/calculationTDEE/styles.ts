import { StyleSheet } from "react-native";
import { fontSize, height, width } from "../../../utils/responsiveSize";
import { mainHPadding } from "../../../constant";
import { COLORS } from "../../../macros/colors";
import { FONTS } from "../../../assets/fonts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height(0.6),
    paddingHorizontal: mainHPadding,
  },
  scroll: {
    paddingBottom: height(10),
  },
  headingMain: {
    fontSize: fontSize(6),
    color: COLORS.HEADING,
    fontFamily: FONTS.Bold_700,
    textAlign: "center",
    marginBottom: height(1),
  },
  topMargin: { marginTop: 8 },
  topInputMargin: { marginTop: 14 },
  sheetListView: {
    paddingTop: 8,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    paddingHorizontal: mainHPadding,
  },
  saveText: {
    fontSize: fontSize(3.8),
    fontFamily: FONTS.Regular_400,
    color: COLORS.HEADING,
  },
  textIcon: {
    fontSize: fontSize(3.4),
    fontFamily: FONTS.Regular_400,
    color: COLORS.TEXT,
  },
  close: {
    height: 26,
    width: 26,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: fontSize(3.8),
    fontFamily: FONTS.Medium_500,
    letterSpacing: 0.5,
    color: COLORS.HEADING,
  },
  arrowDown: {
    height: 22,
    width: 22,
    resizeMode: "contain",
  },
  actionViewIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  itemView: {
    paddingVertical: 14,
    borderBottomColor: COLORS.BORDER_COLOR,
    borderBottomWidth: 0.7,
    backgroundColor: COLORS.TRANSPARENT,
    gap: 3,
    paddingHorizontal: 15,
  },
  activeItemView: {
    paddingVertical: 14,
    borderBottomWidth: 0.7,
    backgroundColor: COLORS.WHITE,
    borderBottomColor: COLORS.BORDER_COLOR,
    gap: 3,
    paddingHorizontal: 15,
  },
  itemText: {
    fontSize: fontSize(4),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
    textAlign: "center",
  },
  itemTagText: {
    fontSize: fontSize(3.2),
    fontFamily: FONTS.Regular_400,
    color: COLORS.TEXT,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
    marginBottom: width(2),
    letterSpacing: 0.5,
  },
  goalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  goalView: {
    flex: 1,
    borderRadius: 100,
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 0.7,
  },
  textGoal: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Regular_400,
    color: COLORS.HEADING,
    textTransform: "capitalize",
  },
  suggestionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: mainHPadding,
    paddingTop: 12,
    paddingBottom: 10,
  },
  targetText: {
    fontSize: fontSize(3.2),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
  },
  countText: {
    fontSize: fontSize(3.2),
    fontFamily: FONTS.Regular_400,
    color: COLORS.HEADING,
  },
});

export default styles;
