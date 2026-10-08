import { View, Image, TouchableOpacity } from "react-native";
import React, { memo, useMemo, useState } from "react";
import styles from "./styles";
import LoadingIndicator from "../../../components/loaders/LoadingIndicator";
import { MessageProps } from "../../../schemas/types";
import { activeOpacity } from "../../../constant";
import ImagePreviewer from "../../../components/imagePreviewer";
import ListenMessageVoice from "./ListenMessageVoice";
import { FormattedText } from "./FormattedText";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";
import { timeAgo } from "../../../utils/timeAgo";

const FALLBACK_ERROR_MESSAGE =
  "Something went wrong. Please try again in a new chat.";

type Props = {
  item: MessageProps;
  isMessageProcessing: boolean;
};

const MessageBubble = ({ item, isMessageProcessing }: Props) => {
  const { colors, scheme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState("");

  const { isError, timeAgoText } = useMemo(() => {
    const createdAt = item?.createdAt ?? item?.created_at;

    const timeAgoText =
      item?.role === "assistant" && createdAt ? timeAgo(createdAt) : "";

    const isError = item?.role === "assistant" && !!item?.isError;

    // const isError =
    //   item?.role === "assistant"
    //     ? (typeof item?.text === "string" &&
    //         ERROR_PHRASES.some(p => item.text!.toLowerCase().includes(p))) ||
    //       (!item?.text && !item?.content)
    //     : false;

    return { isError, timeAgoText };
  }, [
    item?.text,
    item?.content,
    item?.role,
    item?.createdAt,
    item?.created_at,
  ]);

  const handlePreviewImage = (imgURI: string) => {
    setImage(imgURI);
    setVisible(true);
  };

  return (
    <>
      <View style={styles.bubbleContainer}>
        {item?.role === "user" ? (
          <View style={styles.userView}>
            <View
              style={[
                styles.userInnerView,
                {
                  backgroundColor:
                    scheme === "dark" ? colors.INPUT_BG : colors.WHITE,
                },
              ]}
            >
              {item?.images?.length > 0 && (
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  onPress={() => handlePreviewImage(item.images[0])}
                >
                  <Image
                    source={{ uri: item.images[0] }}
                    style={
                      item?.text || item?.content
                        ? styles.imageFull
                        : styles.image
                    }
                  />
                </TouchableOpacity>
              )}
              {item?.text || item?.content ? (
                <AppText
                  style={[styles.userText, { color: colors.HEADING }]}
                  selectable={true}
                >
                  {item?.text || item?.content}
                </AppText>
              ) : null}
            </View>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.aiView,
                {
                  backgroundColor:
                    scheme === "dark" ? colors.INPUT_BG : colors.WHITE,
                },
              ]}
            >
              {item?.loading ? (
                <View style={styles.loadingView}>
                  <LoadingIndicator color={colors.TEXT} />
                  <AppText
                    allowFontScaling={false}
                    style={[styles.loadingText, { color: colors.TEXT }]}
                  >
                    Analyzing your message...
                  </AppText>
                </View>
              ) : (
                <View style={styles.retryView}>
                  <View style={{ flexShrink: 1, flex: 1 }}>
                    <FormattedText
                      style={[styles.aiText, { color: colors.HEADING }]}
                    >
                      {item?.text ||
                        item?.content ||
                        `${FALLBACK_ERROR_MESSAGE}`}
                    </FormattedText>
                    {!isMessageProcessing && !isError && (
                      <ListenMessageVoice messageId={item?.id} />
                    )}
                  </View>
                </View>
              )}
            </View>
            <AppText
              allowFontScaling={false}
              style={[styles.timeAgoText, { color: colors.TEXT }]}
            >
              {timeAgoText}
            </AppText>
          </>
        )}
      </View>
      {image && (
        <ImagePreviewer
          visible={visible}
          onClose={() => setVisible(false)}
          images={[{ url: image }]}
        />
      )}
    </>
  );
};

// Custom comparator — re-render only when display-relevant fields change
export default memo(MessageBubble, (prev, next) => {
  return (
    prev?.item?.id === next?.item?.id &&
    prev?.item?.text === next?.item?.text &&
    prev?.item?.content === next?.item?.content &&
    prev?.item?.loading === next?.item?.loading &&
    prev?.item?.isError === next?.item?.isError &&
    prev?.item?.images === next?.item?.images &&
    prev?.isMessageProcessing === next?.isMessageProcessing
  );
});
