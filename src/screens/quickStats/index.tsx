import { View, Keyboard } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import ScreenWrapper from "../../components/screenWrapper";
import StatsCard from "./components/StatsCard";
import styles from "./styles";
import RewardForFriends from "./components/RewardForFriends";
import ICONS from "../../assets/icons";
import PositionedLoader from "../../components/loaders/PositionedLoader";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomFilters from "../../components/customfilters";
import Credits from "./components/Credits";
import { useGetReferralStatsQuery } from "../../services/referralServices";

const QuickStats = () => {
  const [filter, setFilter] = useState("all");
  const filterSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );
  const { data, refetch, isFetching } = useGetReferralStatsQuery({
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
          count={data?.referrals ?? 0}
        />
        <StatsCard
          label="Subscribers"
          icon={ICONS.subscribed}
          count={data?.subscribers ?? 0}
        />
        <StatsCard
          label="You've Saved"
          icon={ICONS.dollar}
          count={`$${data?.youve_saved ?? 0}`}
        />
        <StatsCard
          label="You've Saved Friends"
          icon={ICONS.dollar}
          count={`$${data?.youve_saved_friends ?? 0}`}
        />
      </View>
      <View style={styles.rewardContainer}>
        <RewardForFriends data={data} />

        {/* <Commission data={0} />
        <EarnedPoints points={0} /> */}

        <Credits data={data} />
      </View>

      <CustomFilters
        filterSheetRef={filterSheetRef}
        handleSearchFilter={handleSearchFilter}
      />
    </ScreenWrapper>
  );
};

export default QuickStats;
