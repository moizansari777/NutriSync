import { FlatList, ListRenderItem, RefreshControl } from "react-native";
import React, { useCallback } from "react";
import ScreenWrapper from "../../components/screenWrapper";
import styles from "./styles";
import ReferralItem from "./components/ReferralItem";
import emptyList from "../../components/emptyList";
import PositionedLoader from "../../components/loaders/PositionedLoader";
import { useGetMyReferralsQuery } from "../../services/referralServices";

const MyReferrals = () => {
  const { data, refetch, isFetching } = useGetMyReferralsQuery(undefined);

  const keyExtractor = useCallback((item: any) => item?.id, []);

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => <ReferralItem item={item} />,
    [],
  );

  const onRefresh = useCallback(() => {
    refetch();
  }, []);

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="My Referrals">
      {isFetching && <PositionedLoader />}
      <FlatList
        data={data?.referrals || []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={16}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        ListEmptyComponent={isFetching ? null : emptyList}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        contentContainerStyle={styles.listScroll}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
      />
    </ScreenWrapper>
  );
};

export default MyReferrals;
