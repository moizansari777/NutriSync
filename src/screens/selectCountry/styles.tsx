import { StyleSheet } from "react-native";
import { COLORS } from "../../macros/colors";
import { mainHPadding } from "../../constant";
import { fontSize, height } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: height(3),
  },
  inputStyle: {
    color: COLORS.BLACK,
    justifyContent: "center",
    alignItems: "center",
    fontSize: fontSize(3.5),
    letterSpacing: 0.5,
    paddingHorizontal: 15,
    borderRadius: 100,
    marginHorizontal: mainHPadding,
    borderWidth: 0.5,
    borderColor: COLORS.BORDER_COLOR,
    paddingVertical: 15,
    backgroundColor: COLORS.WHITE,
    marginBottom: 12,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: COLORS.BORDER_COLOR,
    paddingHorizontal: mainHPadding + 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 30,
    height: 22,
    borderRadius: 4,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  countryName: {
    fontSize: fontSize(3.7),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  listScroll: {
    flexGrow: 1,
    paddingBottom: height(5),
  },
});

export default styles;
