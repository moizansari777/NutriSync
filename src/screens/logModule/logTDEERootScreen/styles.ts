import { StyleSheet } from "react-native";
import { FONTS } from "../../../assets/fonts";
import { fontSize } from "../../../utils/responsiveSize";
import { COLORS } from "../../../macros/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  text: {
    fontFamily: FONTS.Regular_400,
    fontSize: fontSize(3),
    color: COLORS.TEXT,
  },
});

export default styles;
