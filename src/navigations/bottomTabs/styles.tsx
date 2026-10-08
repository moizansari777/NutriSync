import { StyleSheet } from "react-native";
import { fontSize } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";

const BAR_HEIGHT = 64;
const INSET = 5;

const styles = StyleSheet.create({
  barWrap: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  barFloating: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tabsCapsule: {
    flex: 1,
    flexDirection: "row",
    height: BAR_HEIGHT,
    padding: INSET,
    borderRadius: 100,
  },
  selectionPill: {
    position: "absolute",
    top: INSET,
    bottom: INSET,
    left: INSET,
    borderRadius: 100,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  tabIconImg: { height: 22, width: 22, resizeMode: "contain" },
  // The label stays centred under its icon; the live dot hangs off its left
  // edge instead of taking space in the row.
  tabLabelRow: { justifyContent: "center" },
  liveDot: {
    position: "absolute",
    left: -10,
    height: 6,
    width: 6,
    borderRadius: 100,
  },
  tabLabel: {
    fontSize: fontSize(2.8),
    fontFamily: FONTS.SemiBold_600,
  },
});

export default styles;
