import { Platform, StyleSheet } from "react-native";
import { mainHPadding } from "../../constant";
import { fontSize, height } from "../../utils/responsiveSize";
import { COLORS } from "../../macros/colors";
import { FONTS } from "../../assets/fonts";

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: mainHPadding,
    zIndex: 9999999,
  },
  logo: {
    height: 50,
    width: 132,
    resizeMode: "contain",
  },
  scrollButton: {
    height: 35,
    width: 35,
    borderRadius: 100,
    backgroundColor: COLORS.MIRROR_BG,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    position: "absolute",
    bottom: height(8),
  },
  rightIconsView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  menuIcon: {
    height: 28,
    width: 28,
    resizeMode: "contain",
  },
  bottomScrollArrow: {
    height: 22,
    width: 22,
    resizeMode: "contain",
  },
  saveIcon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
    marginTop: 3,
  },
  editIcon: {
    height: 22,
    width: 24,
    resizeMode: "contain",
    marginTop: 2,
  },
  conversationView: {
    flex: 1,
  },
  textViewMiddle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  countView: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  countsText: {
    fontSize: fontSize(3.5),
    color: COLORS.HEADING,
    fontFamily: FONTS.Bold_700,
  },
  countsTextBelow: {
    fontSize: fontSize(4),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
  titleText: {
    fontSize: fontSize(3.2),
    color: COLORS.HEADING,
    fontFamily: FONTS.Regular_400,
  },
  chatInputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: COLORS.WHITE,
    paddingVertical: 10,
    shadowColor: COLORS.MIRROR_BG,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 15,
    zIndex: 10,
    position: "relative",
    paddingLeft: mainHPadding,
  },
  textInput: {
    paddingLeft: 2,
    fontSize: Platform.OS === "ios" ? fontSize(3.5) : fontSize(3),
    letterSpacing: 0.5,
    color: COLORS.HEADING,
    fontFamily: FONTS.Regular_400,
    textAlignVertical: "center",
    maxHeight: height(20),
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 11 : 14,
    height: "100%",
  },
  bottomActionView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    paddingRight: mainHPadding,
    gap: 10,
  },
  actionIcon: {
    height: 45,
    width: 45,
    resizeMode: "contain",
  },
  imageIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  sendIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    transform: [{ rotate: "180deg" }],
  },
  cameraIcon: {
    height: 23,
    width: 23,
    resizeMode: "contain",
  },
  // Keeps a mounted action button out of both sight and layout.
  hiddenAction: {
    display: "none",
  },
  iconCircleView: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderWidth: 0.7,
    borderColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  circleView: {
    height: 45,
    width: 45,
    borderRadius: 100,
    backgroundColor: COLORS.SECONDARY,
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.PRIMARY,
  },
  stopIcon: {
    height: 28,
    width: 28,
    resizeMode: "contain",
  },
  listScroll: {
    flexGrow: 1,
    paddingHorizontal: mainHPadding,
    gap: 5,
    paddingTop: height(4),
  },

  // ====
  selctedImgView: {
    height: 45,
    width: 45,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: COLORS.ICON_COLOR,
    position: "relative",
  },
  selctedImg: {
    height: "100%",
    width: "100%",
    borderRadius: 7,
  },
  closeIconView: {
    height: 18,
    width: 18,
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.WHITE,
    borderRadius: 100,
  },
  closeIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
  },
  emptyView: {
    flex: 1,
    paddingHorizontal: mainHPadding,
    justifyContent: "flex-start",
    gap: 28,
    paddingTop: height(4),
  },
  emptyEyebrow: {
    fontFamily: FONTS.Bold_700,
    fontSize: fontSize(3.2),
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  emptyTitle: {
    fontFamily: FONTS.ExtraBold_800,
    fontSize: fontSize(7),
    lineHeight: fontSize(8.6),
    letterSpacing: -0.6,
  },
  emptySubtitle: {
    fontFamily: FONTS.Medium_500,
    fontSize: fontSize(3.7),
    lineHeight: fontSize(5.4),
    marginTop: 8,
    maxWidth: "92%",
  },
  emptyHeading: {
    color: COLORS.HEADING,
    fontFamily: FONTS.Black_900,
    textAlign: "center",
    fontSize: fontSize(5.2),
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  primaryText: {
    color: COLORS.ACCENT_TEXT,
  },
  emptyTagLine: {
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
    textAlign: "center",
    fontSize: fontSize(3.6),
    letterSpacing: 0.4,
    marginTop: 5,
    marginHorizontal: mainHPadding + 4,
  },
});

export default styles;
