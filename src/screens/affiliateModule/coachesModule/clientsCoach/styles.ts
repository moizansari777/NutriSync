import { StyleSheet } from "react-native";
import { mainHPadding } from "../../../../constant";
import { fontSize, height } from "../../../../utils/responsiveSize";
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
});

export default styles;
