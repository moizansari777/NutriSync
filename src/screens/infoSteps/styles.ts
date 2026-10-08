import { Dimensions, Platform, StyleSheet } from "react-native";
import { mainHPadding } from "../../constant";
import { fontSize, height } from "../../utils/responsiveSize";
import { COLORS } from "../../macros/colors";
import { FONTS } from "../../assets/fonts";

const { width: WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  listScroll: {
    flexGrow: 1,
    paddingHorizontal: mainHPadding,
    gap: 20,
    paddingTop: height(1),
    paddingBottom: height(5),
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: Platform.OS === "ios" ? 10 : 2,
  },
  logo: {
    height: 50,
    width: 145,
    resizeMode: "contain",
  },
  actionText: {
    fontSize: fontSize(6),
    color: COLORS.BLACK,
    fontFamily: FONTS.Bold_700,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },
  right: {
    flexDirection: "row-reverse",
  },
  left: {},
  actionImg: {
    height: WIDTH * 0.45,
    width: WIDTH * 0.45,
    resizeMode: "contain",
  },
  textContent: { flexShrink: 1 },

  heading: {
    fontSize: fontSize(4.5),
    color: COLORS.BLACK,
    fontFamily: FONTS.Bold_700,
    flexShrink: 1,
    letterSpacing: 0.4,
  },
  desc: {
    fontSize: fontSize(3.2),
    color: COLORS.BLACK,
    fontFamily: FONTS.Regular_400,
    letterSpacing: 0.4,
    flexShrink: 1,
    marginTop: 4,
  },
});

export default styles;
