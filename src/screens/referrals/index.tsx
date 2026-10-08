import { View, Text } from "react-native";
import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../navigations/routes";
import ScreenWrapper from "../../components/screenWrapper";
import CopyReferralRUL from "./components/CopyReferralRUL";
import HowItWorks from "./components/HowItWorks";
import ReferralsOptions from "./components/ReferralsOptions";
import { useGetReferralsQuery } from "../../services/referralServices";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.REFERRALS_SCREEN
>;

const Referrals: FC<Props> = ({ navigation }) => {
  const { data } = useGetReferralsQuery(undefined);

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Referrals">
      <View>
        <CopyReferralRUL referral_link={data?.referral_link} />
        <ReferralsOptions />
        <HowItWorks />
      </View>
    </ScreenWrapper>
  );
};

export default Referrals;
