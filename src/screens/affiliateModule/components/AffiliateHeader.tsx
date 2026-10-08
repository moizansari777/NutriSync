import { View, Image, TouchableOpacity, Text } from "react-native";
import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import IMAGES from "../../../assets/images";
import { activeOpacity } from "../../../constant";
import ICONS from "../../../assets/icons";
import { screens } from "../../../navigations/routes";
import { RootNavigationProp } from "../../../schemas/types";
import { useTheme } from "../../../hooks/useTheme";

const AffiliateHeader = () => {
  const { colors, scheme } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const goToSettingScreen = () => {
    navigation.navigate(screens.AFFILIATE_SETTING_SCREEN);
  };

  return (
    <View style={styles.headerView}>
      <TouchableOpacity activeOpacity={activeOpacity}>
        <Image source={scheme === "dark" ? IMAGES.splashLogo : IMAGES.logoPrimary} style={styles.logo} />
      </TouchableOpacity>

      <View style={styles.rightIconsView}>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={goToSettingScreen}
        >
          <Image source={ICONS.menu} style={styles.menuIcon} tintColor={colors.HEADING} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(AffiliateHeader);
