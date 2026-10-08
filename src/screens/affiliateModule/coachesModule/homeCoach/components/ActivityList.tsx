import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  RefreshControl,
} from "react-native";
import React, { useCallback } from "react";
import ActivityCard from "./ActivityCard";
import emptyList from "../../../../../components/emptyList";
import styles from "../styles";
import { useTheme } from "../../../../../hooks/useTheme";
import AppText from "../../../../../components/appText";

const ActivityList = ({ data, refetch, isFetching }: any) => {
  const { colors } = useTheme();

  const keyExtractor = useCallback((item: any) => item?.client?.id || item, []);

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => <ActivityCard item={item} />,
    [],
  );

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <View style={styles.headingView}>
        <AppText allowFontScaling={false} style={[styles.heading2, { color: colors.HEADING }]}>Client Activities</AppText>
        <AppText allowFontScaling={false} style={[styles.tagLine, { color: colors.TEXT }]}>
          Overview of your invited users and their recent activity.
        </AppText>
      </View>

      <FlatList
        data={data?.clients_activity || []}
        scrollEnabled={false}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={16}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        ListEmptyComponent={isFetching ? null : emptyList}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        contentContainerStyle={[styles.listScroll, { paddingTop: 0 }]}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
      />
    </>
  );
};

export default ActivityList;
