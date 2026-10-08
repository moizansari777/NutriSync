import { StyleSheet } from "react-native";
import { COLORS } from "../../../macros/colors";
import { fontSize } from "../../../utils/responsiveSize";
import { FONTS } from "../../../assets/fonts";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    borderRadius: 26,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  cardPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  cardBody: { flex: 1, gap: 12 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  cardTitleWrap: { flex: 1, gap: 3 },
  text: {
    fontSize: fontSize(4.4),
    color: COLORS.HEADING,
    fontFamily: FONTS.ExtraBold_800,
    letterSpacing: -0.3,
  },
  timeText: {
    fontSize: fontSize(2.9),
    color: COLORS.TEXT,
    fontFamily: FONTS.Medium_500,
  },
  statRow: { flexDirection: "row", gap: 8 },
  stat: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  statValue: {
    fontSize: fontSize(5.6),
    fontFamily: FONTS.ExtraBold_800,
    letterSpacing: -0.5,
  },
  statUnit: { fontSize: fontSize(3), fontFamily: FONTS.SemiBold_600 },
  statLabel: { fontSize: fontSize(2.9), fontFamily: FONTS.SemiBold_600 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionSpacer: { flex: 1 },
  iconAction: {
    height: 38,
    width: 38,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  iconActionImg: { height: 17, width: 17, resizeMode: "contain" },
  logButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 100,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  logIcon: { height: 13, width: 13, resizeMode: "contain" },
  logText: { fontSize: fontSize(3.5), fontFamily: FONTS.Bold_700 },
  actionPressed: { opacity: 0.7, transform: [{ scale: 0.92 }] },
  filterView: {
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterText: {
    fontSize: fontSize(3.2),
    fontFamily: FONTS.SemiBold_600,
    textTransform: "capitalize",
  },
});

export default styles;
