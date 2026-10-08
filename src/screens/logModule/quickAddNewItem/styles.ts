import { StyleSheet } from "react-native";
import { fontSize, height } from "../../../utils/responsiveSize";
import { mainHPadding } from "../../../constant";
import { FONTS } from "../../../assets/fonts";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: mainHPadding,
    paddingTop: height(1.5),
    paddingBottom: height(3),
    gap: 22,
  },
  sectionTitle: {
    fontSize: fontSize(3.3),
    fontFamily: FONTS.Bold_700,
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  hint: {
    fontSize: fontSize(3.1),
    fontFamily: FONTS.Medium_500,
  },
  autoFillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  autoFillText: { flex: 1, gap: 2 },
  autoFillTitle: { fontSize: fontSize(3.7), fontFamily: FONTS.Bold_700 },
  grid: { flexDirection: "row", gap: 10 },

  heroWrap: {},
  heroField: {
    borderRadius: 28,
    borderCurve: "continuous",
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  heroLabel: { fontSize: fontSize(3.4), fontFamily: FONTS.Bold_700 },
  heroInput: {
    flex: 1,
    fontSize: fontSize(13),
    fontFamily: FONTS.ExtraBold_800,
    letterSpacing: -1.5,
    paddingVertical: 0,
  },
  heroUnit: { fontSize: fontSize(4.4), fontFamily: FONTS.Bold_700 },

  tileWrap: { flex: 1 },
  tileField: {
    borderRadius: 20,
    borderCurve: "continuous",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tileLabel: { fontSize: fontSize(3.1), fontFamily: FONTS.SemiBold_600 },
  tileInput: {
    flex: 1,
    fontSize: fontSize(6.2),
    fontFamily: FONTS.ExtraBold_800,
    letterSpacing: -0.6,
    paddingVertical: 2,
  },
  tileUnit: { fontSize: fontSize(3.2), fontFamily: FONTS.SemiBold_600 },

  fieldHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 20,
  },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  errorText: {
    fontSize: fontSize(3),
    fontFamily: FONTS.Medium_500,
    marginTop: 6,
    marginLeft: 6,
  },
  footer: { paddingHorizontal: mainHPadding, paddingTop: 8 },
});

export default styles;
