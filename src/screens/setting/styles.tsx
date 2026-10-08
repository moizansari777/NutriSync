import { StyleSheet } from "react-native";
import { mainHPadding } from "../../constant";
import { COLORS } from "../../macros/colors";
import { fontSize, height } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: mainHPadding,
    // paddingTop: height(2),
    paddingBottom: height(8),
    gap: 18,
  },
  topSpacing: {
    marginTop: height(5),
  },
  rightView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  updateView: {
    backgroundColor: COLORS.BLACK,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  disableTimezoneView: {
    backgroundColor: COLORS.ICON_COLOR,
  },
  updateText: {
    fontSize: fontSize(3),
    fontFamily: FONTS.Medium_500,
    color: COLORS.WHITE,
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.7,
    paddingVertical: 10,
  },
  view: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical:5
  },
  deleteView: {
    alignSelf: "center",
    // marginBottom: height(1),
  },
  sheetTopView: {
    paddingTop: 8,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingBottom: 8,
  },

  lable: {
    fontSize: fontSize(4),
    fontFamily: FONTS.SemiBold_600,
    color: COLORS.HEADING,
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
  icon: {
    height: 21,
    width: 21,
    resizeMode: "contain",
  },
  title: {
    fontSize: fontSize(3.2),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
  rightText: {
    fontSize: fontSize(3.3),
    color: COLORS.HEADING,
    fontFamily: FONTS.Regular_400,
  },
  description: {
    fontSize: fontSize(3),
    color: COLORS.TEXT,
    fontFamily: FONTS.Medium_500,
  },
  deleteTitle: {
    color: COLORS.RED,
  },
  buildContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height(3),
  },
  buildText: {
    fontSize: fontSize(2.6),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },

  // =====
  topView: {
    paddingHorizontal: mainHPadding,
  },
  sectionView: {
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  sectionLable: {
    fontSize: fontSize(3.4),
    color: COLORS.HEADING,
    fontFamily: FONTS.Regular_400,
    paddingLeft: 15,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  logo: {
    height: 50,
    width: 50,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: COLORS.BORDER_COLOR,
  },
  infoView: {
    marginTop: 12,
    gap: 15,
  },
  subTitle: {
    fontSize: fontSize(3.2),
    color: COLORS.TEXT,
    fontFamily: FONTS.Medium_500,
  },
  rowHead: {
    fontSize: fontSize(3),
    color: COLORS.HEADING,
    fontFamily: FONTS.Regular_400,
  },
  rowValue: {
    fontSize: fontSize(3.2),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },
  cancelContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  cancelText: {
    fontSize: fontSize(3),
    color: COLORS.TEXT,
    fontFamily: FONTS.Medium_500,
  },

  // Theme Sheet Styles
  themeContainer: {
    // paddingVertical: 16,
    gap: 0,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: mainHPadding,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
   
  },
  themeRowLast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: mainHPadding,
    paddingVertical: 14,
  },
  themeText: {
    fontSize: fontSize(3.4),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
    flex: 1,
  },
  themeCheckbox: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    marginRight: 4,
  },
});

export default styles;
