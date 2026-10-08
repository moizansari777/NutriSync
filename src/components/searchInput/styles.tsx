import { StyleSheet } from "react-native";
import { COLORS } from "../../macros/colors";
import { fontSize } from "../../utils/responsiveSize";
import { mainHPadding } from "../../constant";

const styles = StyleSheet.create({
  container: {
    borderColor: COLORS.INPUT_BORDER,
    backgroundColor: COLORS.INPUT_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 100,
    paddingHorizontal: 6,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: mainHPadding,
    marginBottom: 10,
    marginTop: 7,
  },
  inputStyle: {
    flex: 1,
    color: COLORS.BLACK,
    justifyContent: "center",
    alignItems: "center",
    fontSize: fontSize(3.5),
    letterSpacing: 0.5,
    paddingLeft: 2,
    height: "100%",
  },
  searchIcon: {
    height: 18,
    width: 18,
    marginLeft: 12,
  },
  sendIcon: {
    height: 14,
    width: 14,
    resizeMode: "contain",
  },
  iconCircleView: {
    height: 30,
    width: 30,
    borderRadius: 100,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
