import { StyleSheet } from "react-native";
import { SCREENS_DIMENSION } from "../../utils/responsiveSize";
import { COLORS } from "../../macros/colors";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: COLORS.SECONDARY,
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    height: SCREENS_DIMENSION.width * 0.85,
    resizeMode: "contain",
    width: SCREENS_DIMENSION.width * 0.85,
  },
});

export default styles;
