import { StyleSheet } from "react-native";
import { fontSize, height } from "../../../utils/responsiveSize";
import { FONTS } from "../../../assets/fonts";
import { mainHPadding } from "../../../constant";

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
  listScroll: {
    flexGrow: 1,
    paddingHorizontal: mainHPadding,
    gap: 14,
    paddingTop: height(1),
    paddingBottom: height(3),
  },
});

export default styles;
