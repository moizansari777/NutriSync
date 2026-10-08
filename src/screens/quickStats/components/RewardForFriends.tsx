import { View, Text, Image } from "react-native";
import React from "react";
import styles from "../styles";
import ICONS from "../../../assets/icons";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const RewardForFriends = ({ data }: { data: any }) => {
  const info = data?.rewards_for_referred_user;
  const { colors } = useTheme();

  return (
    <View>
      <AppText allowFontScaling={false} style={[styles.heading2, { color: colors.HEADING }]}>Rewards</AppText>
      <View style={[styles.wrapper, { backgroundColor: colors.WHITE }]}>
        {/* No Rewards */}
        {info == null && (
          <View style={{ gap: 10 }}>
            <AppText allowFontScaling={false} style={[styles.point, { color: colors.HEADING }]}>
              No rewards
            </AppText>
          </View>
        )}
        {/* Discount cycles */}
        {info?.discount_type === "percentage" && (
          <View style={{ gap: 10 }}>
            <View style={styles.item}>
              <Image source={ICONS.checkGreen} style={styles.check} />
              <AppText allowFontScaling={false} style={[styles.pointLabel, { color: colors.HEADING }]}>
                {info?.discount_percentage}% off
              </AppText>
            </View>
            <AppText allowFontScaling={false} style={[styles.point, { color: colors.HEADING }]}>
              for {info?.discount_cycles} cycle
              {info?.discount_cycles !== 1 ? "s" : ""}
            </AppText>
          </View>
        )}

        {info?.discount_type === "fixed_amount" && (
          <View style={{ gap: 10 }}>
            <View style={styles.item}>
              <Image source={ICONS.checkGreen} style={styles.check} />
              <AppText allowFontScaling={false} style={[styles.pointLabel, { color: colors.HEADING }]}>
                ${info?.discount_amount} off
              </AppText>
            </View>
            <AppText allowFontScaling={false} style={[styles.point, { color: colors.HEADING }]}>
              for {info?.discount_cycles} cycle
              {info?.discount_cycles !== 1 ? "s" : ""}
            </AppText>
          </View>
        )}

        {/* Indefinite discount */}
        {info?.indefinite_discount_percentage > 0 && (
          <View style={{ gap: 10 }}>
            <View style={styles.item}>
              <Image source={ICONS.checkGreen} style={styles.check} />
              <AppText allowFontScaling={false} style={[styles.pointLabel, { color: colors.HEADING }]}>
                {info?.indefinite_discount_percentage}% off
              </AppText>
            </View>
            <AppText allowFontScaling={false} style={[styles.point, { color: colors.HEADING }]}>forever</AppText>
          </View>
        )}

        {/* No rewards */}
        {info?.free_months === 0 &&
          info?.discount_cycles === 0 &&
          info?.indefinite_discount_percentage === 0 && (
            <View style={styles.item}>
              <Image source={ICONS.checkGreen} style={styles.check} />
              <AppText allowFontScaling={false} style={[styles.point, { color: colors.HEADING, flex: 1 }]}>
                No special rewards for referred users in this campaign
              </AppText>
            </View>
          )}
      </View>
    </View>
  );
};

export default RewardForFriends;
