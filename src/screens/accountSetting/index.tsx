import { View, ScrollView, Platform } from "react-native";
import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../navigations/routes";
import ScreenWrapper from "../../components/screenWrapper";
import ICONS from "../../assets/icons";
import { useLazyGetAccountDataQuery } from "../../services/profileServices";
import styles from "../setting/styles";
import SectionCard from "../setting/components/SectionCard";
import MemberShipBilling from "./components/MemberShipBilling";
import MenuCard from "../setting/components/MenuCard";
import UpdateTimeZone from "./components/UpdateTimeZone";
import PushNotifications from "./components/PushNotifications";
import SoundToggle from "./components/SoundToggle";
import ToggleBiometrics from "./components/ToggleBiometrics";
import AppTheme from "./components/AppTheme";
import DeleteAccount from "./components/DeleteAccount";
import HandleLogout from "./components/HandleLogout";
import PositionedLoader from "../../components/loaders/PositionedLoader";
import DetailsPointEnable from "./components/DetailsPointEnable";
// import HealthStepToggle from "./components/HealthStepToggle";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.ACCOUNT_SETTING_SCREEN
>;

const AccountSetting: FC<Props> = ({ navigation }) => {
  const [getAccountsData, { isLoading }] = useLazyGetAccountDataQuery();

  const handlePressOnTextSize = () => {
    navigation.navigate(screens.MANAGE_TEXT_SIZE_SCREEN);
  };

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Account Settings">
      <View style={{ flex: 1, paddingTop: 20 }} testID="setting_screen_id">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <SectionCard>
            {Platform.OS === "android" && (
              <MemberShipBilling getAccountsData={getAccountsData} />
            )}
            <DetailsPointEnable />
            {/* <HealthStepToggle /> */}

            <PushNotifications />
            <SoundToggle />
            <ToggleBiometrics />
            <UpdateTimeZone />
          </SectionCard>

          <SectionCard>
            <AppTheme />
            <MenuCard
              iconName={ICONS.textSize}
              title="Text Size"
              handlePress={handlePressOnTextSize}
              hasBorder={false}
            />
          </SectionCard>

          <SectionCard>
            <DeleteAccount getAccountsData={getAccountsData}/>
            <HandleLogout />
          </SectionCard>
        </ScrollView>
      </View>

      {isLoading && (
        <PositionedLoader
          isBlurr={true}
          msg="Please wait… we’re processing"
        />
      )}
    </ScreenWrapper>
  );
};

export default AccountSetting;
