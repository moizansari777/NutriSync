import { View, Text, Image } from "react-native";
import React from "react";
import styles from "../../../quickStats/styles";
import ICONS from "../../../../assets/icons";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

type Props = {
  data: {
    discount_cycles: number;
    discount_percentage: string;
    free_months: number;
    indefinite_discount_percentage: string;
  };
};

const Rewards = ({ data }: Props) => {
  const { colors } = useTheme();
  return (
    <View>
      <AppText allowFontScaling={false} style={[styles.heading2, { color: colors.HEADING }]}>Reward</AppText>
      <View style={[styles.wrapper, { backgroundColor: colors.WHITE }]}>
        <View style={{ gap: 10 }}>
          <View style={styles.item}>
            <Image source={ICONS.checkGreen} style={styles.check} />
            <AppText allowFontScaling={false} style={[styles.pointLabel, { color: colors.HEADING }]}>
              {data?.discount_percentage} Off
            </AppText>
          </View>
          <AppText allowFontScaling={false} style={[styles.point, { color: colors.HEADING }]}>
            {data?.discount_cycles
              ? `For ${data?.discount_cycles} cycle`
              : "Forever"}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default Rewards;
