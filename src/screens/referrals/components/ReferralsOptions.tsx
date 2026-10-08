import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import ICONS from "../../../assets/icons";
import styles from "../styles";
import { COLORS } from "../../../macros/colors";
import { screens } from "../../../navigations/routes";
import { RootNavigationProp } from "../../../schemas/types";
import { activeOpacity } from "../../../constant";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const ReferralsOptions = ({
  isAffiliate = false,
  isCoach = false,
}: {
  isAffiliate?: boolean;
  isCoach?: boolean;
}) => {
  const { colors, scheme } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const handleGoToStats = () => {
    navigation.navigate(
      isAffiliate ? screens.AFFILIATE_STATS_SCREEN : screens.QUICK_STATS_SCREEN,
    );
  };

  const handleGoToReferrals = () => {
    navigation.navigate(
      isAffiliate
        ? screens.AFFILIATE_REFERRALS_LIST_SCREEN
        : screens.MY_REFERRALS_SCREEN,
    );
  };

  const handleGoToCoachHome = () => {
    navigation.navigate(screens.HOME_COACH_SCREEN);
  };

  const handleGoToClients = () => {
    navigation.navigate(screens.CLIENT_COACH_SCREEN);
  };

  return (
    <>
      {isCoach ? (
        <View style={styles.optionView}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={handleGoToCoachHome}
            style={[
              styles.referralView,
              {
                backgroundColor:
                  scheme === "dark" ? colors.SECONDARY : colors.WHITE,
              },
            ]}
          >
            <AppText allowFontScaling={false} style={[styles.labelTextOption, { color: colors.HEADING }]}>
              Dashboard
            </AppText>
            <Image
              source={ICONS.rightArrow}
              style={styles.arrow}
              tintColor={colors.HEADING}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={handleGoToClients}
            style={[
              styles.referralView,
              {
                backgroundColor:
                  scheme === "dark" ? colors.SECONDARY : colors.WHITE,
              },
            ]}
          >
            <AppText allowFontScaling={false} style={[styles.labelTextOption, { color: colors.HEADING }]}>
              Clients
            </AppText>
            <Image
              source={ICONS.rightArrow}
              style={styles.arrow}
              tintColor={colors.HEADING}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.optionView}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={handleGoToStats}
            style={[
              styles.referralView,
              {
                backgroundColor:
                  scheme === "dark" ? colors.SECONDARY : colors.WHITE,
              },
            ]}
          >
            <AppText allowFontScaling={false} style={[styles.labelTextOption, { color: colors.HEADING }]}>
              Stats
            </AppText>
            <Image
              source={ICONS.rightArrow}
              style={styles.arrow}
              tintColor={colors.HEADING}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={handleGoToReferrals}
            style={[
              styles.referralView,
              {
                backgroundColor:
                  scheme === "dark" ? colors.SECONDARY : colors.WHITE,
              },
            ]}
          >
            <AppText allowFontScaling={false} style={[styles.labelTextOption, { color: colors.HEADING }]}>
              My Referrals
            </AppText>
            <Image
              source={ICONS.rightArrow}
              style={styles.arrow}
              tintColor={colors.HEADING}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ReferralsOptions;
