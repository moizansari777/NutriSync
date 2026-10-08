import { FlatList, ListRenderItem, RefreshControl } from "react-native";
import React, { FC, useCallback, useState, useEffect } from "react";
import ScreenWrapper from "../../../../components/screenWrapper";
import FoodLoggedCard from "./components/FoodLoggedCard";
import emptyList from "../../../../components/emptyList";
import styles from "../homeCoach/styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../../../navigations/routes";
import { useGetAllFoodLogsForCoachQuery } from "../../../../services/affiliateServices/coachServices";
import { useSelector } from "react-redux";
import { RootState } from "../../../../states/store/store";
import PositionedLoader from "../../../../components/loaders/PositionedLoader";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.CLIENT_FOOD_LOGGED_SCREEN
>;

const CoachFoodLogged: FC<Props> = ({ route }) => {
  const clientId = route.params?.clientId;

  const coachClientDetailsFilter = useSelector(
    (state: RootState) => state.filtersReducer?.coachClientDetailsFilter,
  );

  const [page, setPage] = useState(1);
  const [foodLogs, setFoodLogs] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isFetching, refetch } = useGetAllFoodLogsForCoachQuery({
    clientId,
    filter: coachClientDetailsFilter,
    page,
  });

  // ✅ Append or reset data
  useEffect(() => {
    if (data?.food_logs?.items) {
      if (page === 1) {
        setFoodLogs(data.food_logs.items);
      } else {
        setFoodLogs(prev => [...prev, ...data.food_logs.items]);
      }
      setIsLoadingMore(false);
    }
  }, [data]);

  const keyExtractor = useCallback((item: any) => item?.id?.toString(), []);

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => <FoodLoggedCard item={item} />,
    [],
  );

  // ✅ Load more
  const handleLoadMore = useCallback(() => {
    const totalPages = data?.food_logs?.pagination?.total_pages;

    if (!isFetching && !isLoadingMore && page < totalPages) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [isFetching, isLoadingMore, page, data]);

  // ✅ Pull to refresh
  const onRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Food & Meals Logged">
      <FlatList
        data={foodLogs}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={16}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        contentContainerStyle={styles.listScroll}
        ListEmptyComponent={isFetching ? null : emptyList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      />

      {isFetching && page === 1 && <PositionedLoader />}
    </ScreenWrapper>
  );
};

export default CoachFoodLogged;
