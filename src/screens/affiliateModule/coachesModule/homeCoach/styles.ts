import { StyleSheet } from "react-native";
import { fontSize, height } from "../../../../utils/responsiveSize";
import { mainHPadding } from "../../../../constant";
import { FONTS } from "../../../../assets/fonts";
import { COLORS } from "../../../../macros/colors";

const styles = StyleSheet.create({
  listScroll: {
    flexGrow: 1,
    paddingHorizontal: mainHPadding,
    gap: 16,
    paddingTop: 8,
    marginTop: 15,
    paddingBottom: height(4),
  },
  feedView: {
    paddingHorizontal: mainHPadding,
    marginTop: 23,
  },
  mainScroll: {
    flexGrow: 1,
    paddingBottom: height(4),
  },
  statsListView: {
    paddingHorizontal: mainHPadding,
    gap: 20,
    marginTop: height(3),
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  mainWrapper: {
    flex: 1,
    marginTop: 15,
  },
  headingView: {
    marginHorizontal: mainHPadding,
    marginTop: 20,
    marginBottom: 3,
  },

  heading2: {
    fontSize: fontSize(3.8),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
  },
  tagLine: {
    fontSize: fontSize(3.2),
    fontFamily: FONTS.Regular_400,
    color: COLORS.TEXT,
  },
  tagMargin: {
    marginHorizontal: mainHPadding,
    marginTop: 23,
  },
  view: {
    backgroundColor: COLORS.WHITE,
    padding: 15,
    borderRadius: 18,
    gap: 6,
  },
  row: {
    gap: 5,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: fontSize(3.5),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
  label: {
    fontSize: fontSize(3),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },
  subsText: {
    fontSize: fontSize(3),
    color: COLORS.WHITE,
    fontFamily: FONTS.Medium_500,
  },
  subCard: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  bold: {
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
  },
  normal: {
    fontFamily: FONTS.Regular_400,
    color: COLORS.TEXT,
  },
  bottomRow: {
    borderTopWidth: 0.5,
    borderTopColor: COLORS.BORDER_COLOR,
    paddingTop: 10,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
  },
  countView: {
    gap: 1,
  },
  topRow: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default styles;
