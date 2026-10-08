import {
  View,
  FlatList,
  ListRenderItem,
  RefreshControl,
  Keyboard,
} from "react-native";
import React, { FC, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ScreenWrapper from "../../../components/screenWrapper";
import SearchInput from "../../../components/searchInput";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import styles from "./styles";
import AppText from "../../../components/appText";
import Card from "../components/Card";
import CustomFilters from "../../../components/customfilters";
import { useGetAllLogsQuery } from "../../../services/logsTDEEServices";
import EmptyList from "../../../components/emptyList";
import PositionedLoader from "../../../components/loaders/PositionedLoader";
import { TDEE_FILTER_DATA } from "../../../data/staticData";
import { RootState } from "../../../states/store/store";
import { setHistoryTDEEFilter } from "../../../states/reducer/filtersReducer";
import { useTheme } from "../../../hooks/useTheme";
import FilterWithText from "../components/FilterWithText";
import SettingsButton from "../../../components/settingsButton";
import { RootStackParamList, screens } from "../../../navigations/routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.HISTORY_TDEE_SCREEN | screens.HISTORY_TAB
>;

const HistoryTDEE: FC<Props> = ({ navigation, route }) => {
  // Shown both as a bottom-bar tab (no back button) and as a pushed screen.
  const isTab = route?.name === screens.HISTORY_TAB;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const filterSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetKey, setSheetKey] = useState(0);

  const historyTDEEFilter = useSelector(
    (state: RootState) => state.filtersReducer?.historyTDEEFilter,
  );

  const { data, isFetching, refetch } = useGetAllLogsQuery(
    {
      date: historyTDEEFilter,
      query: searchQuery,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const handleOpenFilterSheet = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      filterSheetRef.current?.present();
    }, 0);
  }, []);

  const handleSearch = useCallback((searchType: string, value: string) => {
    if (searchType === "search") {
      setSearchQuery(value);
    } else {
      dispatch(setHistoryTDEEFilter(value));
      filterSheetRef.current?.close();
      setTimeout(() => {
        setSheetKey(prev => prev - 1);
      }, 300);
    }
  }, []);

  const debouncedSearch = useDebouncedCallback(handleSearch, 350);

  const keyExtractor = useCallback((item: any) => item?.id?.toString(), []);

  const onRefresh = useCallback(() => {
    refetch();
  }, []);

  const handlePressOnEdit = (item: any) => {
    navigation.navigate(screens.QUICK_ADD_SCREEN, {
      currentLogData: item,
      type: "",
    });
  };

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => (
      <Card
        item={item}
        handlePressOnEdit={handlePressOnEdit}
        isHistory={true}
      />
    ),
    [],
  );

  return (
    <ScreenWrapper
      isBack={!isTab}
      hasTitle={true}
      type="log_history"
      title="History"
      bgColor={colors.BACKGROUND}
      hasFilter={false}
      // onPressOnFilter={handleOpenFilterSheet}
      renderExtraUI={
        <>
          <FilterWithText
            handleOpenFilterSheet={handleOpenFilterSheet}
            value={historyTDEEFilter}
          />
          {isTab && <SettingsButton />}
        </>
      }
    >
      <View style={styles.container}>
        {isFetching && <PositionedLoader />}

        <AppText
          allowFontScaling={false}
          style={[styles.intro, { color: colors.TEXT }]}
        >
          Everything you’ve logged. Edit, re-scan or remove an entry.
        </AppText>
        <SearchInput handleSearch={debouncedSearch} placeholder="Search logs" />

        <FlatList
          data={data?.logs || []}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            isFetching ? null : <EmptyList msg="No data recorded yet" />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listScroll}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
        />
      </View>

      <CustomFilters
        key={sheetKey}
        filterSheetRef={filterSheetRef}
        handleSearchFilter={handleSearch}
        filterData={TDEE_FILTER_DATA}
        type="logs"
        currentValue={historyTDEEFilter}
      />
    </ScreenWrapper>
  );
};

export default HistoryTDEE;
