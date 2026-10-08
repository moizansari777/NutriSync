import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import emptyList from "../../../../../components/emptyList";
import ClientCard from "./ClientCard";
import styles from "../styles";
import PositionedLoader from "../../../../../components/loaders/PositionedLoader";
import { useGetAllClientsQuery } from "../../../../../services/affiliateServices/coachServices";
import { COLORS } from "../../../../../macros/colors";

type Props = {
  coachClientFilter: any;
};

const ClientList = ({ coachClientFilter }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isFetching, refetch } = useGetAllClientsQuery({
    filter: coachClientFilter,
    page: currentPage,
  });

  // Accumulate clients as new pages are fetched
  useEffect(() => {
    if (data?.clients) {
      setAllClients(prevClients => {
        // If it's the first page, replace data
        if (currentPage === 1) {
          return data?.clients;
        }
        // Otherwise, append new clients
        const newClients = data?.clients?.filter(
          (client: any) => !prevClients.some(p => p.id === client.id),
        );
        return [...prevClients, ...newClients];
      });
      setIsLoadingMore(false);
    }
  }, [data?.clients, currentPage]);

  // Reset when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setAllClients([]);
  }, [coachClientFilter]);

  const keyExtractor = useCallback(
    (item: any) => item?.id?.toString() || Math.random().toString(),
    [],
  );

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => <ClientCard item={item} />,
    [],
  );

  const onRefresh = useCallback(() => {
    setCurrentPage(1);
    setAllClients([]);
    refetch();
  }, [refetch]);

  const onEndReached = useCallback(() => {
    // Check if there are more pages and we're not already loading
    if (
      data?.pagination &&
      currentPage < data?.pagination?.total_pages &&
      !isLoadingMore &&
      !isFetching
    ) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [data?.pagination, currentPage, isLoadingMore, isFetching]);

  const renderFooter = useMemo(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }, [isLoadingMore]);

  return (
    <>
      {isFetching && currentPage === 1 && (
        <PositionedLoader msg="Fetching..." />
      )}

      <FlatList
        data={allClients}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={16}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        ListEmptyComponent={isFetching && currentPage === 1 ? null : emptyList}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        contentContainerStyle={styles.listScroll}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && currentPage === 1}
            onRefresh={onRefresh}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </>
  );
};

export default ClientList;
