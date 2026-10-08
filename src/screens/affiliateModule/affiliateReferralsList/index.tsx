import { FlatList, ListRenderItem, RefreshControl } from "react-native";
import React, { FC, useCallback } from "react";
import ReferralItem from "../../myReferrals/components/ReferralItem";
import ScreenWrapper from "../../../components/screenWrapper";
import PositionedLoader from "../../../components/loaders/PositionedLoader";
import styles from "../../myReferrals/styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../../navigations/routes";
import { useGetAffiliateMyReferralQuery } from "../../../services/affiliateServices/affiliateServices";
import emptyList from "../../../components/emptyList";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.AFFILIATE_REFERRALS_LIST_SCREEN
>;

const AffiliateReferralsList: FC<Props> = ({ navigation }) => {
  const { data, isFetching, refetch } =
    useGetAffiliateMyReferralQuery(undefined);

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
      {false && <PositionedLoader />}
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

export default AffiliateReferralsList;
