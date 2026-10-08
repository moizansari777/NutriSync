import { View, Text, Image } from "react-native";
import React from "react";
import styles from "../styles";
import ICONS from "../../../assets/icons";
import { COLORS } from "../../../macros/colors";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const Credits = ({ data }: { data: any }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.pointWrapper}>
      <AppText allowFontScaling={false} style={[styles.heading2, { color: colors.HEADING }]}>Your Credits</AppText>
      <View style={[styles.wrapper, { backgroundColor: colors.WHITE }]}>
        <View style={styles.item}>
          <View style={styles.viewPrimary}>
            <Image
              source={ICONS.dollar}
              style={styles.check}
              tintColor={COLORS.WHITE}
            />
          </View>
          <AppText allowFontScaling={false} style={[styles.pointLabel, { color: colors.HEADING }]}>${data?.credits || 0}</AppText>
        </View>
        <AppText allowFontScaling={false} style={[styles.point, { color: colors.HEADING }]}>
          Credit to be applied to future payments.
        </AppText>
      </View>
    </View>
  );
};

export default Credits;
