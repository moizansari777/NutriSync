import { View, Text, Image } from "react-native";
import React from "react";
import styles from "../styles";
import { COLORS } from "../../../macros/colors";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const StatsCard = ({
  label,
  icon,
  count,
}: {
  label: string;
  icon: any;
  count: any;
}) => {
  const { colors, scheme } = useTheme();
  return (
    <View style={[styles.itemView, { backgroundColor: colors.WHITE }]}>
      <View style={styles.iconView}>
        <Image
          source={icon}
          style={styles.icon}
          tintColor={COLORS.WHITE}
        />
      </View>
      <View style={styles.textView}>
        <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>{label}</AppText>
        <AppText allowFontScaling={false} style={[styles.count, { color: colors.HEADING }]}>{count}</AppText>
      </View>
    </View>
  );
};

export default StatsCard;
