import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { activeOpacity } from "../../../../constant";
import styles from "../styles";
import ICONS from "../../../../assets/icons";
import { COLORS } from "../../../../macros/colors";
import { UnitProps } from "../../../../schemas/types";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

type Props = {
  handleOnPress: () => void;
  selectedUnit: UnitProps;
};

const LabelRightUI = ({ handleOnPress, selectedUnit }: Props) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={styles.actionViewIcon}
      onPress={handleOnPress}
    >
      <AppText
        allowFontScaling={false}
        style={[styles.textIcon, { color: colors.TEXT }]}
      >
        {selectedUnit?.name}
      </AppText>
      <Image
        source={ICONS.selectArrow}
        style={styles.arrowDown}
        tintColor={colors.TEXT}
      />
    </TouchableOpacity>
  );
};

export default LabelRightUI;
