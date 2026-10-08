import { StyleSheet } from "react-native";
import { fontSize, height } from "../../../utils/responsiveSize";
import { mainHPadding } from "../../../constant";
import { FONTS } from "../../../assets/fonts";
import { COLORS } from "../../../macros/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height(1),
  },
  intro: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Medium_500,
    paddingHorizontal: mainHPadding,
    marginBottom: 6,
  },
  addButton: {
    height: 38,
    width: 38,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  addButtonPressed: { opacity: 0.8, transform: [{ scale: 0.92 }] },
  addIcon: { height: 18, width: 18, resizeMode: "contain" },
  listScroll: {
    flexGrow: 1,
    paddingHorizontal: mainHPadding,
    gap: 14,
    paddingTop: height(1),
    paddingBottom: height(3),
  },
  backArrow: {
    height: 28,
    width: 28,
    resizeMode: "contain",
  },
  innerView: {
    paddingHorizontal: mainHPadding,
  },
  quickAddInnerView: {
    paddingHorizontal: mainHPadding,
    paddingTop: height(1.8),
  },
  topInputMargin: { marginTop: 14 },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    paddingBottom: 8,
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
});

export default styles;
