import { StyleSheet } from "react-native";
import { mainHPadding } from "../../../constant";

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: mainHPadding,
    zIndex: 9999999,
  },
  rightIconsView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  logo: {
    height: 50,
    width: 132,
    resizeMode: "contain",
  },
  menuIcon: {
    height: 28,
    width: 28,
    resizeMode: "contain",
  },
});

export default styles;
