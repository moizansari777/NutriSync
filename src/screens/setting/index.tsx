import { View, ScrollView } from "react-native";
import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styles from "./styles";
import { RootStackParamList, screens } from "../../navigations/routes";
import ScreenWrapper from "../../components/screenWrapper";
import ICONS from "../../assets/icons";
import MenuCard from "./components/MenuCard";
import MenuesList from "./components/MenuesList";
import SectionCard from "./components/SectionCard";
import AppAbout from "./components/AppAbout";

type Props = NativeStackScreenProps<RootStackParamList, screens.SETTING_SCREEN>;

const Setting: FC<Props> = ({ navigation }) => {
  const handleOnPressAccountDetails = () => {
    navigation.navigate(screens.ACCOUNTS_SCREEN);
  };

  const handleOnPressAccountsSetting = () => {
    navigation.navigate(screens.ACCOUNT_SETTING_SCREEN);
  };

  const handleOnPressChangePassword = () => {
    navigation.navigate(screens.RESET_PASSWORD_SCREEN);
  };

  const handleOnPressAccountGoals = () => {
    navigation.navigate(screens.TDEE_CALCULATION_SCREEN, {
      hasBack: true,
      showLogin: "no",
      from: "setting",
    });
  };

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Preference & Settings">
      <View style={{ flex: 1, paddingTop: 20 }} testID="setting_screen_id">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <SectionCard>
            <MenuesList />
          </SectionCard>
          <SectionCard>
            <MenuCard
              iconName={ICONS.account}
              title="Profile Details"
              handlePress={handleOnPressAccountDetails}
            />
            <MenuCard
              iconName={ICONS.lock}
              title="Change Password"
              handlePress={handleOnPressChangePassword}
            />
            <MenuCard
              iconName={ICONS.goals}
              title="Account Goals"
              handlePress={handleOnPressAccountGoals}
            />
            <MenuCard
              iconName={ICONS.setting}
              title="Account Settings"
              handlePress={handleOnPressAccountsSetting}
              hasBorder={false}
            />
          </SectionCard>

          <SectionCard>
            <AppAbout />
          </SectionCard>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Setting;
