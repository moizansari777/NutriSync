import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { activeOpacity } from "../../../../constant";
import styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import { screens } from "../../../../navigations/routes";
import { RootNavigationProp } from "../../../../schemas/types";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

const LoginText = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const handleGoToAffiliateLogin = () => {
    navigation.navigate(screens.AFFILIATE_LOGIN_SCREEN);
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handleGoToAffiliateLogin}
    >
      <AppText allowFontScaling={false} style={[styles.subHeadingText, { color: colors.HEADING }]}>
        Affiliate Login
      </AppText>
    </TouchableOpacity>
  );
};

export default LoginText;
