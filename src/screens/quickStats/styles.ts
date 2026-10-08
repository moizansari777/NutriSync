import { StyleSheet } from "react-native";
import { COLORS } from "../../macros/colors";
import { fontSize, height } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import { mainHPadding } from "../../constant";

const styles = StyleSheet.create({
  statsListView: {
    paddingHorizontal: mainHPadding,
    gap: 20,
    marginTop: height(3),
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  itemView: {
    padding: 12,
    borderRadius: 18,
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "46%",
  },
  textView: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconView: {
    height: 30,
    width: 30,
    borderRadius: 100,
    backgroundColor: COLORS.BLACK,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  icon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
  },
  label: {
    fontSize: fontSize(3.1),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },
  count: {
    fontSize: fontSize(3.5),
    color: COLORS.HEADING,
    fontFamily: FONTS.Medium_500,
  },
  viewPrimary: {
    height: 30,
    width: 30,
    borderRadius: 100,
    backgroundColor: COLORS.BLACK,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardContainer: {
    paddingHorizontal: mainHPadding,
    marginTop: 15,
  },
  heading: {
    fontSize: fontSize(3.35),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
    marginBottom: 8,
  },
  heading2: {
    fontSize: fontSize(3.8),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
    marginTop: 8,
  },
  pointLabel: {
    fontSize: fontSize(3.5),
    fontFamily: FONTS.Medium_500,
    color: COLORS.HEADING,
  },
  wrapper: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 14,
    paddingVertical: 20,
    borderRadius: 16,
    gap: 12,
    marginTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  check: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  point: {
    fontSize: fontSize(3.1),
    fontFamily: FONTS.Regular_400,
    color: COLORS.HEADING,
  },
  pointWrapper: {
    marginTop: 15,
  },
});

export default styles;
