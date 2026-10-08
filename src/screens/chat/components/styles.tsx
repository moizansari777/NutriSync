import { StyleSheet } from "react-native";
import { COLORS } from "../../../macros/colors";
import { FONTS } from "../../../assets/fonts";
import { fontSize, width } from "../../../utils/responsiveSize";
import { mainHPadding } from "../../../constant";

const styles = StyleSheet.create({
  bubbleContainer: {
    gap: 5,
  },
  userView: {
    alignItems: "flex-end",
    alignSelf: "flex-end",
    width: "85%",
  },
  userInnerView: {
    // alignItems: "flex-end",
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 12,
    gap: 10,
  },
  image: {
    height: width(30),
    width: width(30),
    borderRadius: 10,
  },
  imageFull: {
    borderRadius: 10,
    height: 300,
    width: width(72),
  },
  userText: {
    fontFamily: FONTS.Regular_400,
    letterSpacing: 0.5,
    fontSize: fontSize(3.5),
    textAlign: "left",
  },
  aiView: {
    alignItems: "flex-start",
    borderRadius: 15,
    padding: 12,
  },
  retryView: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexShrink: 1,
    gap: 10,
    alignItems: "center",
  },
  retryButtonView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  retryIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
  },
  retryText: {
    fontFamily: FONTS.SemiBold_600,
    letterSpacing: 0.5,
    fontSize: fontSize(3.8),
  },
  aiText: {
    fontFamily: FONTS.Regular_400,
    letterSpacing: 0.5,
    fontSize: fontSize(3.5),
    flexShrink: 1,
  },
  timeAgoText: {
    fontFamily: FONTS.Regular_400,
    letterSpacing: 0.5,
    fontSize: fontSize(3),
    marginBottom: 15,
    marginLeft: 12,
  },
  loadingText: {
    fontFamily: FONTS.Regular_400,
    letterSpacing: 0.5,
    fontSize: fontSize(3),
    lineHeight: fontSize(3.5),
  },
  loadingView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // =====
  bannerView: {
    backgroundColor: COLORS.RED_TRANSPARENT,
    flexShrink: 1,
    padding: 12,
    borderRadius: 15,
    marginTop: 20,
    marginHorizontal: mainHPadding,
    gap: 6,
    zIndex: 99999999,
    borderColor: COLORS.RED,
    borderWidth: 0.5,
    position: "relative",
  },
  bannerInnerView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonView: {
    alignItems: "flex-start",
  },
  icon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  closeIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  bannerTitle: {
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
    letterSpacing: 0.5,
    fontSize: fontSize(3.5),
  },
  regular: {
    fontFamily: FONTS.Regular_400,
  },
  buttonText: {
    fontFamily: FONTS.Medium_500,
    color: COLORS.BLACK,
    letterSpacing: 0.5,
    fontSize: fontSize(3.5),
    textDecorationLine: "underline",
  },
  bannerText: {
    fontFamily: FONTS.Regular_400,
    color: COLORS.TEXT,
    letterSpacing: 0.5,
    fontSize: fontSize(3.2),
    flexShrink: 1,
  },
  blockView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flex: 1,
    // zIndex: 99999,
    // zIndex: 9,
    backgroundColor: COLORS.TRANSPARENT_BG,
  },
  boldText: {
    fontFamily: FONTS.Bold_700,
  },
  darkText: {
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
  soundView: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 100,
    alignSelf: "flex-start",
    height: 40,
    width: 40,
    marginTop: 15,
  },
  soundIcon: {
    height: 22,
    width: 22,
    resizeMode: "contain",
  },
  soundText: {
    fontFamily: FONTS.Medium_500,
    color: COLORS.ACCENT_TEXT,
    letterSpacing: 0.5,
    fontSize: fontSize(3.5),
  },

  // ====
  referral_banner: {
    backgroundColor: COLORS.GREEN_TRANSPARENT,
    flexShrink: 1,
    padding: 12,
    borderRadius: 15,
    marginTop: 20,
    marginHorizontal: mainHPadding,
    gap: 10,
    zIndex: 99999999,
    borderColor: COLORS.GREEN_DARK,
    borderWidth: 0.5,
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  gift: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginTop: 4,
  },
  title: {
    fontFamily: FONTS.SemiBold_600,
    color: COLORS.HEADING,
    letterSpacing: 0.5,
    fontSize: fontSize(3.4),
    lineHeight: fontSize(5),
  },
  desc: {
    fontFamily: FONTS.Regular_400,
    color: COLORS.HEADING,
    letterSpacing: 0.5,
    fontSize: fontSize(3.2),
    lineHeight: fontSize(4.5),
    marginTop: 4,
  },
  benfits: {
    marginTop: 5,
    paddingLeft: 10,
  },
  bold: {
    fontFamily: FONTS.Medium_500,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  claim: {
    backgroundColor: COLORS.GREEN_DARK,
    borderRadius: 12,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    marginTop: 18,
  },
  buttonClaimText: {
    fontFamily: FONTS.Regular_400,
    color: COLORS.WHITE,
    letterSpacing: 0.5,
    fontSize: fontSize(3.4),
  },
});

export default styles;
