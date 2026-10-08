import { StyleSheet } from "react-native";
import { mainHPadding } from "../../constant";
import { fontSize, height } from "../../utils/responsiveSize";
import { COLORS } from "../../macros/colors";
import { FONTS } from "../../assets/fonts";

const styles = StyleSheet.create({
  listScroll: {
    flexGrow: 1,
    paddingHorizontal: mainHPadding,
    gap: 16,
    paddingTop: height(3),
  },
  view: {
    backgroundColor: COLORS.WHITE,
    padding: 15,
    borderRadius: 18,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  email: {
    fontSize: fontSize(3.35),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
  label: {
    fontSize: fontSize(3.25),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },
  bold: {
    fontFamily: FONTS.Medium_500,
  },
});

export default styles;
