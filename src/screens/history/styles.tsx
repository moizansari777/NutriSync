import { StyleSheet } from "react-native";
import { mainHPadding } from "../../constant";
import { height } from "../../utils/responsiveSize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height(2.5),
  },
  listScroll: {
    flexGrow: 1,
    paddingHorizontal: mainHPadding,
    gap: 15,
    paddingTop: height(1),
    paddingBottom: height(3),
  },
});

export default styles;
