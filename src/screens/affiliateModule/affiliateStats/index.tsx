import { View, Keyboard } from "react-native";
import React, { FC, useCallback, useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ScreenWrapper from "../../../components/screenWrapper";
import PositionedLoader from "../../../components/loaders/PositionedLoader";
import StatsCard from "../../quickStats/components/StatsCard";
import ICONS from "../../../assets/icons";
import styles from "../../quickStats/styles";
import CustomFilters from "../../../components/customfilters";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../../navigations/routes";
import { useGetAffiliateReferralStatsQuery } from "../../../services/affiliateServices/affiliateServices";
import Rewards from "./components/Rewards";
import AffiliateCommission from "./components/AffiliateCommission";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.AFFILIATE_STATS_SCREEN
>;

const AffiliateStats: FC<Props> = ({ navigation }) => {
  const [filter, setFilter] = useState("all");
  const filterSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );

  const { data, isFetching, refetch } = useGetAffiliateReferralStatsQuery({
    filter,
  });

  const handleRefreshData = () => {
    refetch();
  };

  const handleOpenFilterSheet = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      filterSheetRef.current?.present();
    }, 0);
  }, []);

  const handleSearchFilter = (searchType: string, text: string) => {
    setFilter(text);
    filterSheetRef.current?.close();
  };

  return (
    <ScreenWrapper
      isBack={true}
      hasTitle={true}
      title="Stats"
      hasRefresh={true}
      hasFilter={true}
      onPressRefresh={handleRefreshData}
      onPressOnFilter={handleOpenFilterSheet}
    >
      {isFetching && <PositionedLoader />}
      <View style={styles.statsListView}>
        <StatsCard
          label="Referrals"
          icon={ICONS.referral}
          count={data?.referrals || 0}
        />
        <StatsCard
          label="Subscribers"
          icon={ICONS.subscribed}
          count={data?.subscribers || 0}
        />
        <StatsCard
          label="Commission"
          icon={ICONS.commission}
          count={data?.commission || 0}
        />
      </View>
      <View style={styles.rewardContainer}>
        <Rewards data={data?.rewards_for_referred_user} />
        <AffiliateCommission
          data={data?.commission_per_new_subscriber}
          payout_frequency={data?.payout_frequency}
        />
      </View>

      <CustomFilters
        filterSheetRef={filterSheetRef}
        handleSearchFilter={handleSearchFilter}
        title="Show stats for"
      />
    </ScreenWrapper>
  );
};

export default AffiliateStats;
