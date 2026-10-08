import { View, ScrollView, RefreshControl } from "react-native";
import React, { FC, useCallback, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import styles from "./styles";
import { RootStackParamList, screens } from "../../../../navigations/routes";
import ScreenWrapper from "../../../../components/screenWrapper";
import StatsCard from "../../../quickStats/components/StatsCard";
import ICONS from "../../../../assets/icons";
import ActivityList from "./components/ActivityList";
import { useGetCoachDashboardDataQuery } from "../../../../services/affiliateServices/coachServices";
import PositionedLoader from "../../../../components/loaders/PositionedLoader";
import CustomFilters from "../../../../components/customfilters";
import { setCoachFilter } from "../../../../states/reducer/filtersReducer";
import { CoachFilterKey, TDEE_FILTER_DATA } from "../../../../data/staticData";
import { RootState } from "../../../../states/store/store";
import { getNameById } from "../../../../utils/helper";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.HOME_COACH_SCREEN
>;

const HomeCoach: FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const filterSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );
  const coachDashboardFilter = useSelector(
    (state: RootState) =>
      state.filtersReducer?.coachDashboardFilter ?? "last_7_days",
  );

  const { data, isFetching, refetch } = useGetCoachDashboardDataQuery({
    filter: coachDashboardFilter,
    page: 1,
  });

  const handleOpenFilterSheet = useCallback(() => {
    setTimeout(() => {
      filterSheetRef.current?.present();
    }, 0);
  }, []);

  const handleSearch = useCallback((searchType: string, value: string) => {
    dispatch(
      setCoachFilter({
        key: CoachFilterKey.coachDashboardFilter,
        value: value,
      }),
    );
  }, []);

  const filterName = getNameById(coachDashboardFilter);

  const onRefresh = useCallback(() => {
    refetch();
  }, []);

  return (
    <ScreenWrapper
      isBack={true}
      hasTitle={true}
      title="Coach Dashboard"
      hasRefresh={false}
      hasFilter={true}
      onPressOnFilter={handleOpenFilterSheet}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainScroll}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsListView}>
          <StatsCard
            label="Total Users"
            icon={ICONS.user}
            count={data?.summary?.total_clients || 0}
          />
          <StatsCard
            label="Active Users"
            icon={ICONS.user}
            count={data?.summary?.active_in_period || 0}
          />
          <StatsCard
            label={`New in ${filterName}`}
            icon={ICONS.log}
            count={data?.summary?.new_in_period || 0}
          />
        </View>

        <ActivityList data={data} refetch={refetch} isFetching={isFetching}/>
      </ScrollView>

      <CustomFilters
        filterSheetRef={filterSheetRef}
        handleSearchFilter={handleSearch}
        filterData={TDEE_FILTER_DATA}
        type="logs"
        currentValue={coachDashboardFilter}
      />

      {isFetching && <PositionedLoader msg="Fetching..." />}
    </ScreenWrapper>
  );
};

export default HomeCoach;
