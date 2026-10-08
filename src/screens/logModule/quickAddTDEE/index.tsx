import {
  View,
  FlatList,
  ListRenderItem,
  RefreshControl,
  Pressable,
  Image,
} from "react-native";
import React, { FC, useCallback, useState } from "react";
import ScreenWrapper from "../../../components/screenWrapper";
import SearchInput from "../../../components/searchInput";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import styles from "./styles";
import Card from "../components/Card";
import AppText from "../../../components/appText";
import ICONS from "../../../assets/icons";
import SettingsButton from "../../../components/settingsButton";
import {
  useGetQuickItemsListQuery,
  useQuicklyAddItemsInLogsMutation,
} from "../../../services/logsTDEEServices";
import PositionedLoader from "../../../components/loaders/PositionedLoader";
import EmptyList from "../../../components/emptyList";
import { getError } from "../../../utils/errors";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { useTheme } from "../../../hooks/useTheme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../../navigations/routes";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.QUICK_ADD_TDEE_SCREEN | screens.SAVED_MEALS_TAB
>;

const QuickAddTDEE: FC<Props> = ({ navigation, route }) => {
  // Shown both as a bottom-bar tab (no back button) and as a pushed screen.
  const isTab = route?.name === screens.SAVED_MEALS_TAB;
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  // const [sheetKey, setSheetKey] = useState(0);

  // const quickAddFilter = useSelector(
  //   (state: RootState) => state.filtersReducer?.quickAddFilter,
  // );

  const { data, isFetching, refetch } = useGetQuickItemsListQuery(
    {
      date: "last_30_days",
      query: searchQuery,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );
  const [quickAddPlus, { isLoading }] = useQuicklyAddItemsInLogsMutation();

  // const handleOpenFilterSheet = useCallback(() => {
  //   Keyboard.dismiss();
  //   setTimeout(() => {
  //     filterSheetRef.current?.present();
  //   }, 0);
  // }, []);

  const handleOpenQuickAddSheet = useCallback(() => {
    navigation.navigate(screens.QUICK_ADD_SCREEN, {
      currentLogData: null,
      type: "",
    });
  }, []);

  const handleSearch = useCallback((searchType: string, value: string) => {
    if (searchType === "search") {
      setSearchQuery(value);
    }
    // else {
    //   dispatch(setQuickAddFilter(value));
    //   filterSheetRef.current?.close();
    //   setTimeout(() => {
    //     setSheetKey(prev => prev - 1);
    //   }, 300);
    // }
  }, []);

  const debouncedSearch = useDebouncedCallback(handleSearch, 350);

  const keyExtractor = useCallback((item: any) => item?.id?.toString(), []);

  const onRefresh = useCallback(() => {
    refetch();
  }, []);

  const handlePressOnEdit = (item: any) => {
    navigation.navigate(screens.QUICK_ADD_SCREEN, {
      currentLogData: item,
      type: "quickadd",
    });
  };

  const handlePressOnAdd = (item: any) => {
    quickAddPlus({ quick_add_meal_id: item?.id })
      .then(payload => {
        successAlert({
          body: "This item has been logged",
        });
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => (
      <Card
        item={item}
        handlePressOnEdit={handlePressOnEdit}
        handlePressOnAdd={handlePressOnAdd}
        isHistory={false}
      />
    ),
    [],
  );

  return (
    <ScreenWrapper
      isBack={!isTab}
      hasTitle={true}
      title="Saved Meals"
      bgColor={colors.BACKGROUND}
      renderExtraUI={
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="New saved meal"
            onPress={handleOpenQuickAddSheet}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.PRIMARY, shadowColor: colors.PRIMARY },
              pressed && styles.addButtonPressed,
            ]}
          >
            <Image
              source={ICONS.add}
              style={styles.addIcon}
              tintColor={colors.ON_PRIMARY}
            />
          </Pressable>
          {isTab && <SettingsButton />}
          {/* <FilterWithText
            handleOpenFilterSheet={handleOpenFilterSheet}
            value={quickAddFilter}
          /> */}
        </>
      }
    >
      <View style={styles.container}>
        {isFetching && <PositionedLoader />}
        {isLoading && <PositionedLoader />}

        <AppText
          allowFontScaling={false}
          style={[styles.intro, { color: colors.TEXT }]}
        >
          Your saved meals. Log any of them again in one tap.
        </AppText>
        <SearchInput
          handleSearch={debouncedSearch}
          placeholder="Search saved meals"
        />

        <FlatList
          data={data?.meals || []}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            isFetching ? null : (
              <EmptyList msg="No saved meals yet. Tap + to add your first one." />
            )
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

      {/* <CustomFilters
        key={sheetKey}
        filterSheetRef={filterSheetRef}
        handleSearchFilter={handleSearch}
        filterData={TDEE_FILTER_DATA}
        type="logs"
        currentValue={quickAddFilter}
      /> */}
    </ScreenWrapper>
  );
};

export default QuickAddTDEE;
