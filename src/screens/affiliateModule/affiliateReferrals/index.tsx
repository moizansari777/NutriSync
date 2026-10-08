import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootStackParamList, screens } from "../../../navigations/routes";
import ScreenWrapper from "../../../components/screenWrapper";
import CopyReferralRUL from "../../referrals/components/CopyReferralRUL";
import ReferralsOptions from "../../referrals/components/ReferralsOptions";
import HowItWorks from "../../referrals/components/HowItWorks";
import AffiliateHeader from "../components/AffiliateHeader";
import { useGetAffiliateReferralLinkQuery } from "../../../services/affiliateServices/affiliateServices";
import { RootState } from "../../../states/store/store";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.AFFILIATE_REFERRALS_SCREEN
>;

const AffiliateReferrals: FC<Props> = () => {
  const user = useSelector((state: RootState) => state.authReducer?.userData);
  const { data, isFetching } = useGetAffiliateReferralLinkQuery(undefined);

  return (
    <ScreenWrapper paddingTop={0}>
      <>
        <AffiliateHeader />
        <CopyReferralRUL
          referral_link={
            isFetching ? "Link fetching..." : data?.referral_link || ""
          }
        />
        <ReferralsOptions isAffiliate={true} />

        {user?.user?.isCoach && (
          <ReferralsOptions isAffiliate={true} isCoach={true} />
        )}
        <HowItWorks />
      </>
    </ScreenWrapper>
  );
};

export default AffiliateReferrals;
