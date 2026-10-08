import React, { memo } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { COLORS } from "../../../macros/colors";

type FooterProps = {
  isLoadingMore: boolean;
};

const ListFooter: React.FC<FooterProps> = ({ isLoadingMore }) => {
  if (!isLoadingMore) return null;

  return (
    <View style={styles.footerContainer}>
      <ActivityIndicator size="small" color={COLORS.PRIMARY} />
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(ListFooter);
