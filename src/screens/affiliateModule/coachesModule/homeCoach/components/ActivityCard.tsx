import { View, Text } from "react-native";
import React from "react";
import styles from "../styles";
import { CoachProps } from "../../../../../schemas/types";
import { useTheme } from "../../../../../hooks/useTheme";
import AppText from "../../../../../components/appText";

type Props = {
  item: CoachProps;
};

const ActivityCard = ({ item }: Props) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.view, { backgroundColor: colors.WHITE }]}>
      <View style={styles.row}>
        <AppText allowFontScaling={false} style={[styles.title, { color: colors.HEADING }]}>
          {item?.client?.name || ""}
        </AppText>
      </View>
      <View style={[styles.bottomRow, { borderTopColor: colors.BORDER_COLOR }]}>
        <View style={styles.countView}>
          <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>Calories</AppText>
          <AppText allowFontScaling={false} style={[styles.label, styles.bold, { color: colors.TEXT }]}>
            {item?.calories || 0}{" "}
            <AppText allowFontScaling={false} style={[styles.normal, { color: colors.TEXT }]}>kcal</AppText>
          </AppText>
        </View>
        <View style={styles.countView}>
          <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>Protein</AppText>
          <AppText allowFontScaling={false} style={[styles.label, styles.bold, { color: colors.TEXT }]}>
            {item?.protein || 0}{" "}
            <AppText allowFontScaling={false} style={[styles.normal, { color: colors.TEXT }]}>g</AppText>
          </AppText>
        </View>
        <View style={styles.countView}>
          <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>Water</AppText>
          <AppText allowFontScaling={false} style={[styles.label, styles.bold, { color: colors.TEXT }]}>
            {item?.water || 0}{" "}
            <AppText allowFontScaling={false} style={[styles.normal, { color: colors.TEXT }]}>ltr</AppText>
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
