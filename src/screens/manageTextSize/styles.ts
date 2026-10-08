import { StyleSheet } from "react-native";
import { mainHPadding } from "../../constant";
import { FONTS } from "../../assets/fonts";
import { fontSize } from "../../utils/responsiveSize";


const THUMB_SIZE = 30;
const TRACK_H = 5;
const CARD_PAD = 24;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: mainHPadding,
  },
  previewBody: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  appHeading: {
    textAlign: "center",
    includeFontPadding: false,
    fontFamily: FONTS.SemiBold_600,
  },
  appTagline: {
    marginTop: 4,
    textAlign: "center",
    includeFontPadding: false,
    fontFamily: FONTS.Medium_500,
  },

  // ── Slider Card ───────────────────────────────────────────────────────────
  sliderCard: {
    borderRadius: 24,
    paddingVertical: CARD_PAD,
    paddingHorizontal: CARD_PAD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.055,
    shadowRadius: 16,
    elevation: 3,
  },
  sliderHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  sliderTitle: {
    fontSize: fontSize(3.8),
    fontFamily:FONTS.SemiBold_600,
    marginBottom:18
  },
  trackHit: {
    height: 52,
    justifyContent: "center",
  },
  trackBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: TRACK_H,
    backgroundColor: "#EDE9E3",
    borderRadius: TRACK_H,
  },
  trackFill: {
    position: "absolute",
    left: 0,
    height: TRACK_H,
    borderRadius: TRACK_H,
  },
  tick: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
    top: "50%",
    marginTop: -2.9,
    zIndex: 1,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    top: "50%",
    marginTop: -THUMB_SIZE / 2,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  thumbCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingHorizontal: 1,
    alignItems: "center",
  },
  stepLabel: {
    fontSize: fontSize(3.2),
    color: "#B0A89E",
    fontWeight: "600",
  },
  stepLabelLarge: {
    fontSize: fontSize(4.2),
    color: "#B0A89E",
    fontWeight: "600",
  },



  // ── Buttons ───────────────────────────────────────────────────────────────
  btnRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    marginTop:20
  },
  btn: {
    flex: 1,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  btnReset: {
    backgroundColor: "#EEEBE6",
    borderWidth: 1.5,
    borderColor: "#E2DDD7",
  },
  btnSave: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  btnDisabled: {
    opacity: 0.38,
  },
  saveBtnDisabled: {
    opacity: 0.38,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnLabel: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
    lineHeight: 17,
  },
  btnSub: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3,
    color: "#8C8279",
    lineHeight: 14,
  },
  resetLabel: { color: "#403830" },
  saveLabel: { color: "#FFF" },
  saveSubLabel: { color: "rgba(255,255,255,0.65)" },
  labelDisabled: { color: "#B0A89E" },
});

export default styles;
