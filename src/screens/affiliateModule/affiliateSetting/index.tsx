import { View, ScrollView } from "react-native";
import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../../navigations/routes";
import ScreenWrapper from "../../../components/screenWrapper";
import styles from "../../setting/styles";
import MenuCard from "../../setting/components/MenuCard";
import ICONS from "../../../assets/icons";
import HandleLogout from "../../accountSetting/components/HandleLogout";
import SectionCard from "../../setting/components/SectionCard";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.AFFILIATE_SETTING_SCREEN
>;

const AffiliateSetting: FC<Props> = ({ navigation }) => {
  const handleOnPressAccounts = () => {
    navigation.navigate(screens.AFFILIATE_ACCOUNTS_SCREEN);
  };

  const handleOnPressChangePassword = () => {
    navigation.navigate(screens.RESET_PASSWORD_SCREEN);
  };

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Preference & Settings">
      <View style={{ flex: 1, paddingTop: 20 }} testID="setting_screen_id">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <SectionCard sectionLable="Account">
            <MenuCard
              iconName={ICONS.account}
              title="Account"
              handlePress={handleOnPressAccounts}
            />
            <MenuCard
              iconName={ICONS.lock}
              title="Change Password"
              handlePress={handleOnPressChangePassword}
            />
          </SectionCard>

         
          <SectionCard sectionLable="Account Actions">
            <HandleLogout />
          </SectionCard>

          <View style={styles.topSpacing} />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default AffiliateSetting;
