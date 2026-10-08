import { StyleSheet } from "react-native";
import { COLORS } from "../../macros/colors";
import { fontSize } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { mainHPadding } from "../../constant";

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: mainHPadding,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flexShrink: 1,
  },
  backArrow: {
    height: 28,
    width: 28,
    resizeMode: "contain",
  },
  closeIcon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: fontSize(4.5),
    fontFamily: FONTS.SemiBold_600,
    letterSpacing: 0.5,
    color: COLORS.HEADING,
    // Long titles wrap instead of running off the screen on small devices.
    flexShrink: 1,
  },
  buttonText: {
    fontSize: fontSize(3.8),
    fontFamily: FONTS.Medium_500,
    letterSpacing: 0.5,
    color: COLORS.HEADING,
  },
  actionView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default styles;
