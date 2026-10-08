import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { FC, useCallback, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import styles from "./styles";
import { RootStackParamList, screens } from "../../../../navigations/routes";
import ScreenWrapper from "../../../../components/screenWrapper";
import StatsCard from "../../../quickStats/components/StatsCard";
import ICONS from "../../../../assets/icons";
import CoachTrackedCounts from "./components/CoachTrackedCounts";
import NavigationOptions from "./components/NavigationOptions";
import { RootState } from "../../../../states/store/store";
import { useGetAllClientDetailsDataQuery } from "../../../../services/affiliateServices/coachServices";
import { setCoachFilter } from "../../../../states/reducer/filtersReducer";
import { CoachFilterKey, TDEE_FILTER_DATA } from "../../../../data/staticData";
import CustomFilters from "../../../../components/customfilters";
import PositionedLoader from "../../../../components/loaders/PositionedLoader";
import WeightGraph from "./components/WeightGraph";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.CLIENT_DETAILS_SCREEN
>;

const ClientDetails: FC<Props> = ({ navigation, route }) => {
  const clientName = route.params?.clientName || "";
  const clientId = route.params?.clientId;
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const filterSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );
  const coachClientDetailsFilter = useSelector(
    (state: RootState) =>
      state.filtersReducer?.coachClientDetailsFilter ?? "last_7_days",
  );

  const { data, isFetching, refetch } = useGetAllClientDetailsDataQuery({
    clientId,
    filter: coachClientDetailsFilter,
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
        key: CoachFilterKey.coachClientDetailsFilter,
        value: value,
      }),
    );
  }, []);

  const onRefresh = useCallback(() => {
    refetch();
  }, []);

  return (
    <ScreenWrapper
      isBack={true}
      hasTitle={true}
      title={clientName}
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
            label="Calories (kcal)"
            icon={ICONS.calories}
            count={data?.totals?.calories || 0}
          />
          <StatsCard
            label="Protein (g)"
            icon={ICONS.protein}
            count={data?.totals?.protein || 0}
          />
          <StatsCard
            label="Water (ltr)"
            icon={ICONS.water}
            count={data?.totals?.water || 0}
          />
        </View>
        <View style={styles.body}>
          <AppText
            allowFontScaling={false}
            style={[
              styles.heading2,
              { color: colors.HEADING, marginBottom: 10 },
            ]}
          >
            Target vs Tracked
          </AppText>
          <CoachTrackedCounts countData={data?.targets} />
        </View>

        <View style={styles.body}>
          <AppText
            allowFontScaling={false}
            style={[
              styles.heading2,
              { color: colors.HEADING, marginBottom: 10 },
            ]}
          >
            Weight Graph
          </AppText>
          <WeightGraph data={data?.progress} />
        </View>
        <NavigationOptions clientId={clientId} />
      </ScrollView>

      <CustomFilters
        filterSheetRef={filterSheetRef}
        handleSearchFilter={handleSearch}
        filterData={TDEE_FILTER_DATA}
        type="logs"
        currentValue={coachClientDetailsFilter}
      />

      {isFetching && <PositionedLoader msg="Fetching..." />}
    </ScreenWrapper>
  );
};

export default ClientDetails;
