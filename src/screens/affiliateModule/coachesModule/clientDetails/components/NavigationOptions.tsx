import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import ICONS from "../../../../../assets/icons";
import { screens } from "../../../../../navigations/routes";
import { RootNavigationProp } from "../../../../../schemas/types";
import { activeOpacity } from "../../../../../constant";
import styles from "../../../../referrals/styles";
import { useTheme } from "../../../../../hooks/useTheme";
import AppText from "../../../../../components/appText";

const NavigationOptions = ({ clientId }: { clientId: number }) => {
  const { colors, scheme } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const handleGoToCoachEmail = () => {
    navigation.navigate(screens.CLIENT_EMAIL_SCREEN, {
      clientId,
    });
  };

  const handleGoToFoodLogged = () => {
    navigation.navigate(screens.CLIENT_FOOD_LOGGED_SCREEN, {
      clientId,
    });
  };

  const handleGoToCoachNotes = () => {
    navigation.navigate(screens.CLIENT_NOTES_SCREEN, {
      clientId,
    });
  };

  return (
    <View style={styles.navigationOptionView}>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={handleGoToFoodLogged}
        style={[
          styles.referralView,
          {
            backgroundColor:
              scheme === "dark" ? colors.SECONDARY : colors.WHITE,
          },
        ]}
      >
        <AppText allowFontScaling={false} style={[styles.labelTextOption, { color: colors.HEADING }]}>
          Food & Meals Logged
        </AppText>
        <Image
          source={ICONS.rightArrow}
          style={styles.arrow}
          tintColor={colors.HEADING}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={handleGoToCoachNotes}
        style={[
          styles.referralView,
          {
            backgroundColor:
              scheme === "dark" ? colors.SECONDARY : colors.WHITE,
          },
        ]}
      >
        <AppText allowFontScaling={false} style={[styles.labelTextOption, { color: colors.HEADING }]}>
          Notes & Feedback
        </AppText>
        <Image
          source={ICONS.rightArrow}
          style={styles.arrow}
          tintColor={colors.HEADING}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={handleGoToCoachEmail}
        style={[
          styles.referralView,
          {
            backgroundColor:
              scheme === "dark" ? colors.SECONDARY : colors.WHITE,
          },
        ]}
      >
        <AppText allowFontScaling={false} style={[styles.labelTextOption, { color: colors.HEADING }]}>
          Email Message
        </AppText>
        <Image
          source={ICONS.rightArrow}
          style={styles.arrow}
          tintColor={colors.HEADING}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavigationOptions;
