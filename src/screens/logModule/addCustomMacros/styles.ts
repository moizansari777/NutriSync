import { StyleSheet } from "react-native";
import { height } from "../../../utils/responsiveSize";
import { mainHPadding } from "../../../constant";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: height(3),
    paddingHorizontal: mainHPadding,
  },
  topInputMargin: { marginTop: 14 },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: height(4),
  },
  tdeeButton: {
    alignSelf: "flex-start",
    marginBottom: height(3),
  },
});

export default styles;
