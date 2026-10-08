import { StyleSheet } from "react-native";
import { fontSize } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { mainHPadding } from "../../constant";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logoContainer: {
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 40,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: mainHPadding,
  },

  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },

  title: {
    fontSize: fontSize(5),
    fontFamily: FONTS.SemiBold_600,
    marginBottom: 10,
    textAlign: "center",
  },

  tagline: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Regular_400,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default styles;
