import { TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import { activeOpacity } from "../../../constant";
import styles from "../styles";
import ICONS from "../../../assets/icons";
import { COLORS } from "../../../macros/colors";

const ScrollToBottom = ({
  flatListRef,
}: {
  flatListRef: any;
}) => {
  const scrollToBottom = () => {
    if (flatListRef?.current) {
      flatListRef?.current?.scrollToIndex({ index: 0, animated: true });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={styles.scrollButton}
      onPress={scrollToBottom}
    >
      <Image
        source={ICONS.arrowDown}
        style={styles.bottomScrollArrow}
        tintColor={COLORS.WHITE}
      />
    </TouchableOpacity>
  );
};

export default memo(ScrollToBottom);
