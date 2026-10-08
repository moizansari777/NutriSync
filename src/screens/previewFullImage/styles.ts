import { StyleSheet } from "react-native";
import { fontSize, height, width } from "../../utils/responsiveSize";
import { COLORS } from "../../macros/colors";
import { FONTS } from "../../assets/fonts";

const HANDLE_HIT = 36;     // touch target size for handles (px)
const HANDLE_VIS = 10;     // visible dot/pip size (px)
const CORNER_ARM = 20;     // length of the L-shaped corner bracket arms
const CORNER_THK = 3;      // thickness of the corner brackets

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewButtons: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: COLORS.SECONDARY,
  },
  previewInnerButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: width(11),
    paddingVertical: 10,
  },
  itemButtom: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  textLabel: {
    fontSize: fontSize(3),
    fontFamily: FONTS.Medium_500,
    color: COLORS.WHITE,
  },
  zoomView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height(3),
    alignSelf: "center",
    backgroundColor: COLORS.MIRROR_BG,
    padding: 4,
    borderRadius: 100,
    gap: 2,
  },
  actionIcon: {
    height: 21,
    width: 21,
    resizeMode: "contain",
  },
  slashIcon: {
    height: 22,
    width: 22,
    resizeMode: "contain",
  },
  editView: {
    flexDirection: "row",
    alignItems: "center",
  },
  slash:{
    fontFamily:FONTS.Medium_500,
    fontSize:fontSize(3.4),
  },
  frameWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  frameWrapView: {
    position: "absolute",
    width: 55,
    height: 55,
    backgroundColor: "rgba(0,0,0,.7)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
    paddingLeft: 1,
  },



  // =====================

  root: {
    flex: 1,
    backgroundColor: "#000",
  },

  // ── Image area
  imageContainer: {
    flex: 1,
    // overflow: "hidden",
    // paddingHorizontal: 8,
    marginHorizontal:5
  },

  // ── Dark overlay masks
  mask: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.58)",
  },

  // ── Crop box shell
  cropBox: {
    position: "absolute",
  },

  cropBorder: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.85)",
  },

  // ── Rule-of-thirds
  grid33H: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "33.33%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  grid66H: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "66.66%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  grid33V: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "33.33%",
    width: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  grid66V: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "66.66%",
    width: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  // ── L-shaped corner brackets
  corner: {
    position: "absolute",
    width: CORNER_ARM,
    height: CORNER_ARM,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THK,
    borderLeftWidth: CORNER_THK,
    borderColor: "#fff",
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THK,
    borderRightWidth: CORNER_THK,
    borderColor: "#fff",
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THK,
    borderLeftWidth: CORNER_THK,
    borderColor: "#fff",
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THK,
    borderRightWidth: CORNER_THK,
    borderColor: "#fff",
  },

  // ── Interior drag layer (below handles in z-order)
  dragLayer: {
    ...StyleSheet.absoluteFill,
  },

  // ── Resize handle hit area + visible dot
  handleHit: {
    position: "absolute",
    width: HANDLE_HIT,
    height: HANDLE_HIT,
    alignItems: "center",
    justifyContent: "center",
  },
  handleDot: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 3,
    elevation: 4,
  },
  handleDotCorner: {
    width: HANDLE_VIS,
    height: HANDLE_VIS,
    borderRadius: HANDLE_VIS / 2,
  },
  handleDotEdgeH: {
    // left / right edge handle → tall narrow pill
    width: HANDLE_VIS * 0.55,
    height: HANDLE_VIS * 1.6,
    borderRadius: HANDLE_VIS,
  },
  handleDotEdgeV: {
    // top / bottom edge handle → wide short pill
    width: HANDLE_VIS * 1.6,
    height: HANDLE_VIS * 0.55,
    borderRadius: HANDLE_VIS,
  },
});

export default styles;
