import { StyleSheet } from "react-native";
import { fontSize, height } from "../../../../utils/responsiveSize";
import { mainHPadding } from "../../../../constant";
import { FONTS } from "../../../../assets/fonts";
import { COLORS } from "../../../../macros/colors";

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: mainHPadding,
    marginTop: 25,
  },
  listScroll: {
    flexGrow: 1,
    paddingHorizontal: mainHPadding,
    gap: 16,
    paddingTop: 8,
  },
  mainScroll: {
    flexGrow: 1,
    paddingBottom: height(4),
  },
   labelTextOption: {
    fontSize: fontSize(3.4),
    fontFamily: FONTS.SemiBold_600,
    color: COLORS.HEADING,
  },
   arrow: {
    height: 20,
    width: 20,
    resizeMode: "contain",
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
  noFoundView: {
    paddingBottom: 12,
  },
  noFoundText: {
    fontSize: fontSize(3.9),
    color: COLORS.TEXT,
    textAlign: "center",
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

  // FoodMealsLogged (table)
  tableCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    padding: 15,
    gap: 12,
  },
  tableTitle: {
    fontSize: fontSize(3.5),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
  tableWrapper: {
    minWidth: "100%",
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  tableDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER_COLOR,
    opacity: 0.5,
  },
  tableHeaderCell: {
    fontSize: fontSize(2.8),
    color: COLORS.TEXT,
    fontFamily: FONTS.Medium_500,
  },
  tableCell: {
    fontSize: fontSize(3),
    color: COLORS.HEADING,
    fontFamily: FONTS.Regular_400,
  },
  tableCellDate: {
    width: 150,
    paddingRight: 10,
  },
  tableCellItem: {
    width: 170,
    paddingRight: 10,
  },
  tableCellNumber: {
    width: 90,
    textAlign: "right",
    paddingRight: 10,
  },
  tableEmpty: {
    paddingVertical: 12,
  },
  tableEmptyText: {
    fontSize: fontSize(3),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },

  // NotesFeedback
  notesCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    padding: 15,
    gap: 12,
  },
  notesTitle: {
    fontSize: fontSize(3.5),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
  notesList: {
    gap: 12,
  },
  notesRow: {
    gap: 6,
  },
  notesDate: {
    fontSize: fontSize(2.9),
    color: COLORS.TEXT,
    fontFamily: FONTS.Medium_500,
  },
  notesMessage: {
    fontSize: fontSize(3.1),
    color: COLORS.HEADING,
    fontFamily: FONTS.Regular_400,
    lineHeight: fontSize(4.2),
  },
  notesDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER_COLOR,
    opacity: 0.5,
  },
  notesEmpty: {
    paddingVertical: 8,
  },
  notesEmptyText: {
    fontSize: fontSize(3),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },

  // Coach FoodLoggedCard
  coachFoodCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 18,
    padding: 15,
    gap: 10,
  },
  coachFoodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coachFoodDate: {
    fontSize: fontSize(2.8),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },
  coachFoodTitle: {
    fontSize: fontSize(3.4),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
  coachFoodStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  coachFoodStat: {
    flex: 1,
    gap: 2,
  },
  coachFoodStatLabel: {
    fontSize: fontSize(2.7),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },
  coachFoodStatValue: {
    fontSize: fontSize(3.2),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
});

export default styles;
