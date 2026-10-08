import { View, ListRenderItem, FlatList } from "react-native";
import React, { memo, useCallback, useRef, useState } from "react";
import styles from "../styles";
import { MessageProps } from "../../../schemas/types";
import MessageBubble from "./MessageBubble";
import ScrollToBottom from "./ScrollToBottom";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../../../states/store/store";
import AskEmptyScreen from "./AskEmptyScreen";

const MessagesList = () => {
  const flatListRef = useRef<FlatList>(null);
  const lastOffsetY = useRef(0);
  const ticking = useRef(false);

  const [showScrollButton, setShowScrollButton] = useState(false);
  const allMessagesList = useSelector(
    (state: RootState) => state.chatReducer?.allMessagesList,
    shallowEqual,
  );

  const isMessageProcessing = useSelector(
    (state: RootState) => state.chatReducer?.isMessageProcessing,
  );

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (!ticking.current) {
      requestAnimationFrame(() => {
        const shouldShow = offsetY > 800;
        if (lastOffsetY.current > 800 !== shouldShow) {
          setShowScrollButton(shouldShow);
        }
        lastOffsetY.current = offsetY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  const keyExtractor = useCallback(
    (item: MessageProps) => item.id?.toString(),
    [],
  );

  const renderItem: ListRenderItem<MessageProps> = useCallback(
    ({ item }) => (
      <MessageBubble item={item} isMessageProcessing={isMessageProcessing} />
    ),
    [],
  );

  let hasMessages = allMessagesList?.length > 0;

  return (
    <>
      <View style={styles.conversationView}>
        {hasMessages ? (
          <FlatList
            ref={flatListRef}
            data={allMessagesList || []}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            inverted={true}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={10}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
            contentContainerStyle={styles.listScroll}
          />
        ) : (
          <AskEmptyScreen />
        )}
      </View>

      {hasMessages && showScrollButton && (
        <ScrollToBottom flatListRef={flatListRef} />
      )}
    </>
  );
};

export default memo(MessagesList);
