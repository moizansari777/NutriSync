import { View, Text, Image } from "react-native";
import React from "react";
import styles from "../styles";
import ICONS from "../../../assets/icons";
import AppText from "../../../components/appText";

const EarnedPoints = ({ points }: { points: number }) => {
  return (
    <View style={styles.pointWrapper}>
      <AppText allowFontScaling={false} style={styles.heading2}>Points you earned</AppText>
      <View style={styles.wrapper}>
        <View style={styles.item}>
          <View style={styles.viewPrimary}>
            <Image source={ICONS.point} style={styles.check} />
          </View>
          <AppText allowFontScaling={false} style={styles.pointLabel}>{points || 0} Points</AppText>
        </View>
        <AppText allowFontScaling={false} style={styles.point}>Points for each friend who Subscribes.</AppText>
      </View>
    </View>
  );
};

export default EarnedPoints;
