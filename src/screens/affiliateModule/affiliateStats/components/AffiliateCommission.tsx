import { View, Text, Image } from "react-native";
import React from "react";
import ICONS from "../../../../assets/icons";
import styles from "../../../quickStats/styles";
import { FONTS } from "../../../../assets/fonts";
import { COLORS } from "../../../../macros/colors";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

const AffiliateCommission = ({
  data,
  payout_frequency,
}: {
  data: any;
  payout_frequency: any;
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.pointWrapper}>
      <AppText
      allowFontScaling={false}
        style={[
          styles.heading2,
          { color: colors.HEADING, textTransform: "capitalize" },
        ]}
      >
        {payout_frequency || "-"} Earning
      </AppText>
      <View style={[styles.wrapper, { backgroundColor: colors.WHITE }]}>
        <View style={styles.item}>
          <View style={styles.viewPrimary}>
            <Image
              source={ICONS.commission}
              style={styles.check}
              tintColor={COLORS.WHITE}
            />
          </View>
          <AppText allowFontScaling={false} style={[styles.pointLabel, { color: colors.HEADING }]}>
            {data || 0}% Commission
          </AppText>
        </View>
        <AppText allowFontScaling={false} style={[styles.point, { color: colors.HEADING }]}>
          Commission per new subscriber. Paid{" "}
          <AppText
          allowFontScaling={false}
            style={{
              fontFamily: FONTS.SemiBold_600,
              textTransform: "capitalize",
            }}
          >
            {payout_frequency || "-"}
          </AppText>
        </AppText>
      </View>
    </View>
  );
};

export default AffiliateCommission;
