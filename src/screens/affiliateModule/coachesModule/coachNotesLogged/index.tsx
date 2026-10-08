import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  View,
} from "react-native";
import React, { FC, useCallback, useEffect, useState } from "react";
import ScreenWrapper from "../../../../components/screenWrapper";
import emptyList from "../../../../components/emptyList";
import styles from "../homeCoach/styles";
import InputsForm from "./components/InputsForm";
import { mainHPadding } from "../../../../constant";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../../../navigations/routes";
import { useGetAllNotesListQuery } from "../../../../services/affiliateServices/coachServices";
import PositionedLoader from "../../../../components/loaders/PositionedLoader";
import { format } from "date-fns";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.CLIENT_NOTES_SCREEN
>;

const CoachNotesLogged: FC<Props> = ({ route }) => {
  const clientId = route.params?.clientId;
  const { colors } = useTheme();

  const [page, setPage] = useState(1);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isFetching, refetch } = useGetAllNotesListQuery({
    clientId,
    page,
  });

  // ✅ Handle data append/reset
  useEffect(() => {
    if (data?.notes?.items) {
      if (page === 1) {
        setNotes(data.notes.items);
      } else {
        setNotes(prev => [...prev, ...data.notes.items]);
      }
      setIsLoadingMore(false);
    }
  }, [data]);

  const keyExtractor = useCallback((item: any) => item?.id?.toString(), []);

  const renderItem: ListRenderItem<any> = useCallback(({ item }) => {
    return (
      <View style={[styles.view, { backgroundColor: colors.WHITE }]}>
        <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>
          {item?.created_at ? format(new Date(item.created_at), "PPp") : ""}
        </AppText>
        <AppText allowFontScaling={false} style={[styles.title, { color: colors.HEADING }]}>
          {item?.body || ""}
        </AppText>
      </View>
    );
  }, []);

  // ✅ Load more
  const handleLoadMore = useCallback(() => {
    const totalPages = data?.notes?.pagination?.total_pages;

    if (!isFetching && !isLoadingMore && page < totalPages) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [isFetching, isLoadingMore, page, data]);

  // ✅ Refresh
  const onRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Notes & Feedback">
      <InputsForm isNotes={true} clientId={clientId} />

      <AppText
      allowFontScaling={false}
        style={[
          styles.heading2,
          {
            marginHorizontal: mainHPadding,
            marginTop: 20,
            color: colors.HEADING,
          },
        ]}
      >
        All Notes
      </AppText>

      <FlatList
        data={notes}
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
        ListFooterComponent={isLoadingMore ? <PositionedLoader /> : null}
      />

      {isFetching && page === 1 && <PositionedLoader />}
    </ScreenWrapper>
  );
};

export default CoachNotesLogged;
