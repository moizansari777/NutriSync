import { View, Text } from "react-native";
import React from "react";
import styles from "../styles";
import { format } from "date-fns";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  item: {
    joining_date: string;
    email: string;
    subscribed: boolean;
    id: number;
    is_trialing: false;
    name: string;
    subscription_plan: any;
    trial_days_left: any;
    commission: any;
    points: any;
    status: any;
  };
};

const ReferralItem = ({ item }: Props) => {
  const { colors, scheme } = useTheme();
  return (
    <View
      style={[
        styles.view,
        { backgroundColor: scheme === "dark" ? colors.GRAY_BG : colors.WHITE },
      ]}
    >
      <View style={styles.row}>
        <AppText allowFontScaling={false} style={[styles.email, { color: colors.HEADING }]}>
          {item?.email}
        </AppText>
        <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>
          {item?.joining_date ? format(new Date(item?.joining_date), "PP") : ""}
        </AppText>
      </View>
      <View style={styles.row}>
        <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>
          Subscribed:
          <AppText allowFontScaling={false} style={styles.bold}>{` ${
            item?.subscribed ? "Yes" : "No"
          }`}</AppText>
        </AppText>
        {item?.status && (
          <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>
            Plan:
            <AppText allowFontScaling={false} style={styles.bold}>{` ${item?.status || "-"}`}</AppText>
          </AppText>
        )}
        {item?.commission && (
          <View style={styles.row}>
            <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>
              Credits:
              <AppText allowFontScaling={false} style={styles.bold}> ${item?.commission}</AppText>
            </AppText>
          </View>
        )}
      </View>

      {item?.points && (
        <View style={styles.row}>
          <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>
            Points:
            <AppText allowFontScaling={false} style={styles.bold}>
              {item?.points
                ? ` ${item?.points?.points_earned} Points from $${item?.points?.subscription_amount} subscription`
                : " -"}
            </AppText>
          </AppText>
        </View>
      )}
    </View>
  );
};

export default ReferralItem;
