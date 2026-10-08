import { StyleSheet } from "react-native";
import { fontSize, height } from "../../../utils/responsiveSize";
import { mainHPadding } from "../../../constant";
import { FONTS } from "../../../assets/fonts";

const styles = StyleSheet.create({
  // Back button and the tab bar share one row, so the toggle costs no extra
  // vertical space above the form. The button is taken out of the flow so the
  // tab bar centres against the screen, not against the space left over.
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: mainHPadding,
    marginBottom: height(0.5),
  },
  backButton: {
    position: "absolute",
    left: mainHPadding,
    zIndex: 1,
  },
  backArrow: {
    height: 28,
    width: 28,
    resizeMode: "contain",
  },
  // No flex: the pill hugs its two labels instead of spanning the row.
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    padding: 2.5,
    borderRadius: 100,
    borderWidth: 0.7,
  },
  toggleOption: {
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    fontSize: fontSize(3),
    fontFamily: FONTS.Medium_500,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  toggleTextActive: {
    fontFamily: FONTS.SemiBold_600,
  },
});

export default styles;
