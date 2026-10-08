import { StyleSheet } from "react-native";
import { height, width } from "../../utils/responsiveSize";
import { mainHPadding } from "../../constant";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: mainHPadding,
    paddingTop: height(2.5),
  },
  buttonContainer: {
    marginTop: width(6),
  },
  topInputMargin: { marginTop: 14 },
});

export default styles;
