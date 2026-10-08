import { Image, TouchableOpacity, View } from "react-native";
import React, { memo, useCallback, useMemo, useState } from "react";
import ICONS from "../../assets/icons";
import styles from "./styles";
import { HistoryProps } from "../../schemas/types";
import { activeOpacity } from "../../constant";
import { timeAgo } from "../../utils/timeAgo";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";
import { getError } from "../../utils/errors";
import { errorAlert, successAlert } from "../../utils/alerts";
import { useUnSaveHistoryMutation } from "../../services/chatServices";

type Props = {
  item: HistoryProps;
  handleOpenHistory: (item: HistoryProps) => any;
  isSavedFilter?: boolean;
  onUnsaved?: (id: HistoryProps["id"]) => void;
  from?: string;
};

const SavedCard = ({ item, handleOpenHistory, isSavedFilter, onUnsaved }: Props) => {
  const { colors, scheme } = useTheme();

  const timeAgoText = useMemo(() => {
    if (!item?.updated_at) return "";
    return timeAgo(item?.updated_at);
  }, [item?.updated_at]);

  const [unSaveHistory] = useUnSaveHistoryMutation();

  const handleSaveOnPress = useCallback(() => {
    unSaveHistory({ conversationId: item?.id })
      .unwrap()
      .then(() => {
        successAlert({ body: "Conversation has been unsaved" });
        onUnsaved?.(item?.id);
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  }, [unSaveHistory, item?.id, onUnsaved]);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handleOpenHistory(item)}
      style={[
        styles.card,
        { backgroundColor: scheme === "dark" ? colors.GRAY_BG : colors.WHITE },
      ]}
    >
      {isSavedFilter && (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={handleSaveOnPress}
          style={styles.saveButton}
        >
          <Image
            source={ICONS.activeBookmark}
            // source={savedIds ? ICONS.activeBookmark : ICONS.bookmark}
            style={styles.saveIcon}
            tintColor={scheme === "dark" ? colors.ICON_COLOR : colors.BLACK}
          />
        </TouchableOpacity>
      )}

      <View style={styles.middleView}>
        <AppText
          allowFontScaling={false}
          style={[styles.text, { color: colors.HEADING }]}
          numberOfLines={1}
        >
          {item?.title}
        </AppText>
        <View style={styles.timeView}>
          <Image source={ICONS.time} style={styles.timeIcon} />
          <AppText
            allowFontScaling={false}
            style={[styles.timeText, { color: colors.TEXT }]}
            numberOfLines={1}
          >
            {timeAgoText || ""}
          </AppText>
        </View>
      </View>
      <Image source={ICONS.rightArrowGray} style={styles.icon} />
    </TouchableOpacity>
  );
};

export default memo(SavedCard);
