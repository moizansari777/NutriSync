import { View, Text, Image } from "react-native";
import React, { FC } from "react";
import styles from "../styles";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  item: any;
};

const StepCard: FC<Props> = ({ item }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.stepCard, item?.imgRight ? styles.right : styles.left]}
    >
      <Image source={item?.imgPath} style={styles.actionImg} />
      <View style={styles.textContent}>
        <AppText allowFontScaling={false} style={[styles.heading, { color: colors.HEADING }]}>{item?.label}</AppText>
        <AppText allowFontScaling={false} style={[styles.desc, { color: colors.HEADING }]}>{item?.description}</AppText>
      </View>
    </View>
  );
};

export default StepCard;
