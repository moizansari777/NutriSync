import { View, Text, Image } from "react-native";
import React from "react";
import styles from "../styles";
import ICONS from "../../../assets/icons";
import AppText from "../../../components/appText";

const Commission = ({ data }: { data: any }) => {
  return (
    <View style={styles.pointWrapper}>
      <AppText allowFontScaling={false} style={styles.heading2}>Commission you earn</AppText>
      <View style={styles.wrapper}>
        <View style={styles.item}>
          <View style={styles.viewPrimary}>
            <Image source={ICONS.commission} style={styles.check} />
          </View>
          <AppText allowFontScaling={false} style={styles.pointLabel}>
            {data?.commission_rate}% Commission
          </AppText>
        </View>
        <AppText allowFontScaling={false} style={styles.point}>
          Commission you earn for each new friend who subscribes. Paid{" "}
          {data?.commission_frequency}
        </AppText>
      </View>
    </View>
  );
};

export default Commission;
