import { View, Text } from "react-native";
import React from "react";
import styles from "../../clientDetails/styles";
import { format } from "date-fns";
import { useTheme } from "../../../../../hooks/useTheme";
import AppText from "../../../../../components/appText";

type Props = {
  item: {
    id: number;
    name: string;
    created_at: string;
    calories: number;
    protein: number;
    water: number;
  };
};

const FoodLoggedCard = ({ item }: Props) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.coachFoodCard, { backgroundColor: colors.WHITE }]}>
      <View style={styles.coachFoodHeader}>
        <AppText allowFontScaling={false} style={[styles.coachFoodDate, { color: colors.TEXT }]}>
          {item?.created_at ? format(new Date(item?.created_at), "PPp") : ""}
        </AppText>
      </View>

      <AppText
      allowFontScaling={false}
        style={[styles.coachFoodTitle, { color: colors.HEADING }]}
        numberOfLines={2}
      >
        {item?.name || ""}
      </AppText>

      <View style={styles.coachFoodStatsRow}>
        <View style={styles.coachFoodStat}>
          <AppText allowFontScaling={false} style={[styles.coachFoodStatLabel, { color: colors.TEXT }]}>
            Calories
          </AppText>
          <AppText allowFontScaling={false} style={[styles.coachFoodStatValue, { color: colors.HEADING }]}>
            {item?.calories || 0}
          </AppText>
        </View>
        <View style={styles.coachFoodStat}>
          <AppText allowFontScaling={false} style={[styles.coachFoodStatLabel, { color: colors.TEXT }]}>
            Protein
          </AppText>
          <AppText allowFontScaling={false} style={[styles.coachFoodStatValue, { color: colors.HEADING }]}>
            {item?.protein || 0}g
          </AppText>
        </View>
        <View style={styles.coachFoodStat}>
          <AppText allowFontScaling={false} style={[styles.coachFoodStatLabel, { color: colors.TEXT }]}>
            Water
          </AppText>
          <AppText allowFontScaling={false} style={[styles.coachFoodStatValue, { color: colors.HEADING }]}>
            {item?.water ? `${item?.water}ml` : 0}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default FoodLoggedCard;
