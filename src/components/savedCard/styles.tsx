import { StyleSheet } from "react-native";
import { COLORS } from "../../macros/colors";
import { fontSize } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: COLORS.WHITE,
    borderRadius: 17,
    flexShrink: 1,
    shadowColor: COLORS.MIRROR_BG,
    shadowOffset: {
      width: 2,
      height: -1.5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 10,
    position: "relative",
    overflow: "hidden",
    paddingRight: 10,
    paddingLeft: 15,
    paddingVertical: 12,
  },
  saveButton: {
    paddingVertical: 17,
    paddingRight: 12,
    marginTop: -9,
  },
  saveIcon: {
    height: 26,
    width: 26,
    resizeMode: "contain",
  },
  text: {
    fontSize: fontSize(3.5),
    color: COLORS.HEADING,
    fontFamily: FONTS.Regular_400,
    flexShrink: 1,
  },
  timeText: {
    fontSize: fontSize(3.1),
    color: COLORS.MIRROR_BG,
    fontFamily: FONTS.Regular_400,
    flexShrink: 1,
  },
  icon: {
    height: 22,
    width: 22,
    resizeMode: "contain",
  },
  timeIcon: {
    height: 16,
    width: 16,
    resizeMode: "contain",
    marginLeft: -1.5,
  },
  middleView: {
    flex: 1,
    flexShrink: 1,
    gap: 7,
  },
  timeView: {
    flexDirection: "row",
    gap: 6,
  },
});

export default styles;
