import {
  FlatList,
  Keyboard,
  ListRenderItem,
  RefreshControl,
  View,
} from "react-native";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import { RootStackParamList, screens } from "../../navigations/routes";
import ScreenWrapper from "../../components/screenWrapper";
import SavedCard from "../../components/savedCard";
import {
  useLazyGetAllConversationListQuery,
  useLazyGetAllMessagesListQuery,
  useLazyGetLibraryListQuery,
  useLazyGetLibrarySearchQuery,
  useLazyGetSearchQuery,
} from "../../services/chatServices";
import PositionedLoader from "../../components/loaders/PositionedLoader";
import { HistoryProps } from "../../schemas/types";
import ListFooter from "./compoents/ListFooter";
import { setAllMessageList } from "../../states/reducer/chatReducer";
import CustomFilters from "../../components/customfilters";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SearchInput from "../../components/searchInput";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import EmptyList from "../../components/emptyList";
import { useTheme } from "../../hooks/useTheme";
import FilterWithText from "../logModule/components/FilterWithText";
import { RootState } from "../../states/store/store";
import { setChatHistoryFilter } from "../../states/reducer/filtersReducer";
import { FILTER_DATA } from "../../data/staticData";

type Props = NativeStackScreenProps<RootStackParamList, screens.HISTORY_SCREEN>;

const PER_PAGE = 25;

const SAVED_CHAT_FILTER = "saved_chat";

// A switch only gets a spinner once it outlasts this, so a quick filter change
// swaps the list in a single commit instead of flashing an overlay on and off.
const SLOW_REQUEST_DELAY = 350;

// The rendered rows and the filter they belong to live in one state value so
// they can never be committed separately: the save icon is driven by
// `filter`, so a render where the two disagree is exactly the flicker.
type ListState = {
  filter: string;
  items: HistoryProps[];
};

type LoadOptions = {
  filter: string;
  page?: number;
  append?: boolean;
  search?: { searchType: string; type: string };
  silent?: boolean;
};

const mergeConversations = (prev: HistoryProps[], incoming: HistoryProps[]) => {
  const existingIds = new Set(prev.map(item => item.id));
  return [...prev, ...incoming.filter(item => !existingIds.has(item.id))];
};

const History: FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const chatHistoryFilter = useSelector(
    (state: RootState) => state.filtersReducer?.chatHistoryFilter,
  );

  const [list, setList] = useState<ListState>({
    filter: chatHistoryFilter,
    items: [],
  });
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Page and search mode only steer the next request, never the rendered
  // output, so they stay out of state to avoid extra renders mid-transition.
  const pageRef = useRef(1);
  const isSearchModeRef = useRef(false);
  const loadedFilterRef = useRef(chatHistoryFilter);
  const requestIdRef = useRef(0);
  const filterSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );

  // Drives the save icon: the filter the rows on screen actually came from,
  // which lags chatHistoryFilter until the new rows have landed.
  const isSavedList = list.filter === SAVED_CHAT_FILTER;

  const [fetchHistoryConversations] = useLazyGetAllConversationListQuery();
  const [fetchLibraryConversations] = useLazyGetLibraryListQuery();
  const [historySearchAPI] = useLazyGetSearchQuery();
  const [librarySearchAPI] = useLazyGetLibrarySearchQuery();
  const [fetchConversationMessages, { isFetching: isFetchingMessages }] =
    useLazyGetAllMessagesListQuery();

  // Single entry point for every load. Nothing is read off the query hooks'
  // cached `data`, because that switches endpoints the instant the filter
  // changes and would repaint the list with stale rows.
  const loadConversations = useCallback(
    ({
      filter,
      page = 1,
      append = false,
      search,
      silent = false,
    }: LoadOptions) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (!silent) {
        setIsLoadingList(true);
        setIsLoadingMore(append);
      }

      const isSaved = filter === SAVED_CHAT_FILTER;

      const request = search
        ? (isSaved ? librarySearchAPI : historySearchAPI)(search)
        : (isSaved ? fetchLibraryConversations : fetchHistoryConversations)({
            page,
            per_page: PER_PAGE,
            // Saved conversations APIs always receive "all" as the filter value
            filter: isSaved ? "all" : filter,
          });

      request
        .then((payload: any) => {
          // A newer request has been fired since; dropping this response keeps
          // a slow reply from overwriting the list the user is now looking at.
          if (requestId !== requestIdRef.current) return;

          const result = payload?.data;

          if (result?.conversations) {
            const incoming: HistoryProps[] = result.conversations;
            // Rows and their filter land together, so the list and its save
            // icons change in one render with nothing in between.
            setList(prev => ({
              filter,
              items: append
                ? mergeConversations(prev.items, incoming)
                : incoming,
            }));
            setHasMore(search ? false : page < (result?.total_pages ?? page));
            pageRef.current = page;
            loadedFilterRef.current = filter;
          }

          setHasLoadedOnce(true);
        })
        // A failed load leaves the current rows alone rather than blanking
        // the list, so a dropped request never shows up as a flash of empty.
        .catch(() => setHasLoadedOnce(true))
        .finally(() => {
          setIsRefreshing(false);
          if (requestId !== requestIdRef.current) return;
          setIsLoadingList(false);
          setIsLoadingMore(false);
        });
    },
    [
      fetchHistoryConversations,
      fetchLibraryConversations,
      historySearchAPI,
      librarySearchAPI,
    ],
  );

  const loadRef = useRef(loadConversations);
  useEffect(() => {
    loadRef.current = loadConversations;
  }, [loadConversations]);

  // Initial load. Every later load is driven by a filter change, a search,
  // pagination, refresh or refocus.
  useEffect(() => {
    loadRef.current({ filter: loadedFilterRef.current, page: 1 });
  }, []);

  const hasFocusedRef = useRef(false);

  // Returning from a conversation, quietly re-pull the first page so a chat
  // saved or unsaved elsewhere shows up. It is silent and commits atomically,
  // so the current list simply swaps once the fresh rows arrive.
  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedRef.current) {
        hasFocusedRef.current = true;
        return;
      }
      if (isSearchModeRef.current || pageRef.current !== 1) return;
      loadRef.current({
        filter: loadedFilterRef.current,
        page: 1,
        silent: true,
      });
    }, []),
  );

  // Hold the spinner back until a switch is actually slow. The first load has
  // nothing to show yet, so it gets one immediately.
  useEffect(() => {
    const isTransitioning = isLoadingList && !isLoadingMore && !isRefreshing;

    if (!isTransitioning) {
      setShowLoader(false);
      return;
    }

    if (!hasLoadedOnce) {
      setShowLoader(true);
      return;
    }

    const timer = setTimeout(() => setShowLoader(true), SLOW_REQUEST_DELAY);
    return () => clearTimeout(timer);
  }, [isLoadingList, isLoadingMore, isRefreshing, hasLoadedOnce]);

  const handleGetListOfMessages = useCallback(
    (item: HistoryProps) => {
      fetchConversationMessages({ conversationId: item.id })
        .then(payload => {
          dispatch(setAllMessageList(payload?.data?.messages));
          navigation.navigate(screens.BOTTOM_TAB_STACK, {
            screen: screens.CHAT_SCREEN,
            params: {
              conversationId: item.id,
              isStarred: payload?.data?.starred,
            },
          });
        })
        .catch(error => {});
    },
    [fetchConversationMessages, dispatch, navigation],
  );

  const handleOpenHistory = useCallback(
    (item: HistoryProps) => () => handleGetListOfMessages(item),
    [handleGetListOfMessages],
  );

  const handleLoadMore = useCallback(() => {
    if (isLoadingList || isRefreshing || !hasMore || isSearchModeRef.current) {
      return;
    }
    // Page the list that is on screen, not a filter still being switched to.
    loadConversations({
      filter: list.filter,
      page: pageRef.current + 1,
      append: true,
    });
  }, [isLoadingList, isRefreshing, hasMore, list.filter, loadConversations]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setHasMore(true);
    isSearchModeRef.current = false;
    loadConversations({ filter: chatHistoryFilter, page: 1 });
  }, [chatHistoryFilter, loadConversations]);

  const handleUnsaved = useCallback((id: HistoryProps["id"]) => {
    setList(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  }, []);

  const renderItem: ListRenderItem<HistoryProps> = useCallback(
    ({ item }) => (
      <SavedCard
        item={item}
        handleOpenHistory={handleOpenHistory}
        isSavedFilter={isSavedList}
        onUnsaved={handleUnsaved}
      />
    ),
    [handleOpenHistory, isSavedList, handleUnsaved],
  );

  const keyExtractor = useCallback(
    (item: HistoryProps) => item.id.toString(),
    [],
  );

  const memoizedFooter = useMemo(
    () => <ListFooter isLoadingMore={isLoadingMore} />,
    [isLoadingMore],
  );

  const handleOpenFilterSheet = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      filterSheetRef.current?.present();
    }, 0);
  }, []);

  const handleSearch = useCallback(
    (searchType: string, value: string) => {
      const isFilterChange = searchType !== "search";

      if (isFilterChange) {
        // Redux has not re-rendered yet, so this load is driven by the value
        // that was just picked rather than by chatHistoryFilter.
        dispatch(setChatHistoryFilter(value));
        isSearchModeRef.current = true;
        setHasMore(true);
        loadConversations({
          filter: value,
          search: {
            searchType,
            // Saved conversations APIs always receive "all" as the filter value
            type: value === SAVED_CHAT_FILTER ? "all" : value,
          },
        });
        return;
      }

      if (!value) {
        // Search cleared: back to the paginated list for the active filter.
        isSearchModeRef.current = false;
        setHasMore(true);
        loadConversations({ filter: chatHistoryFilter, page: 1 });
        return;
      }

      isSearchModeRef.current = true;
      setHasMore(true);
      loadConversations({
        filter: chatHistoryFilter,
        search: { searchType, type: value },
      });
    },
    [chatHistoryFilter, dispatch, loadConversations],
  );

  const debouncedSearch = useDebouncedCallback(handleSearch, 200);

  const shouldShowLoader = showLoader || isFetchingMessages;

  return (
    <ScreenWrapper
      isBack={true}
      hasTitle={true}
      title="Chat History"
      bgColor={colors.BACKGROUND}
      hasFilter={false}
      // onPressOnFilter={handleOpenFilterSheet}
      renderExtraUI={
        <FilterWithText
          handleOpenFilterSheet={handleOpenFilterSheet}
          value={chatHistoryFilter}
        />
      }
    >
      <View style={styles.container}>
        {shouldShowLoader && <PositionedLoader />}

        <SearchInput
          handleSearch={debouncedSearch}
          placeholder="Search history..."
        />

        <FlatList
          data={list.items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={memoizedFooter}
          // Kept mounted through a switch: the previous result stays until the
          // new rows land, so the list never blinks empty in between.
          ListEmptyComponent={
            hasLoadedOnce ? (
              <EmptyList msg={chatHistoryFilter === SAVED_CHAT_FILTER?"Nothing has been saved yet":"No results found"} />
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listScroll}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      <CustomFilters
        filterSheetRef={filterSheetRef}
        handleSearchFilter={handleSearch}
        currentValue={chatHistoryFilter}
        filterData={[
          ...FILTER_DATA,
          { id: SAVED_CHAT_FILTER, name: "Bookmarked" },
        ]}
        title="Show chats from"
      />
    </ScreenWrapper>
  );
};

export default History;
