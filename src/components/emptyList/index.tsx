import { View, Text, StyleSheet } from "react-native";
import React, { memo } from "react";
import { COLORS } from "../../macros/colors";
import { fontSize } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import AppText from "../appText";

const EmptyList = ({ msg }: { msg?: string }) => {
  return (
    <View style={styles.container}>
      <AppText allowFontScaling={false} style={styles.text}>{msg ? msg : "Nothing to show here"}</AppText>
    </View>
  );
};

export default memo(EmptyList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999999,
  },
  text: {
    textAlign: "center",
    fontSize: fontSize(3.5),
    color: COLORS.TEXT,
    fontFamily: FONTS.Regular_400,
  },
});
