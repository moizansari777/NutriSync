import { View, Image, TouchableOpacity } from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";
import IMAGES from "../../../assets/images";
import { activeOpacity } from "../../../constant";
import ICONS from "../../../assets/icons";
import SettingsButton from "../../../components/settingsButton";
import { screens } from "../../../navigations/routes";
import { RootNavigationProp } from "../../../schemas/types";
import { useTheme } from "../../../hooks/useTheme";
import {
  useSaveHistoryMutation,
  useUnSaveHistoryMutation,
} from "../../../services/chatServices";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../states/store/store";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { getError } from "../../../utils/errors";
import { resetChat } from "../../../states/reducer/chatReducer";
import { clearNotificationState } from "../../../utils/notificationManager";
import socketManager from "../../../utils/socketManager";
import chatSession from "../../../utils/chatSession";

const Header = ({
  testID,
  canUseAI,
  isStarred,
  conversationId,
}: {
  testID: string;
  canUseAI: boolean;
  isStarred?: boolean | undefined;
  conversationId?: string | undefined;
}) => {
  const navigation = useNavigation<RootNavigationProp>();
  const { colors, scheme } = useTheme();
  const dispatch = useDispatch();

  const allMessagesList = useSelector(
    (state: RootState) => state.chatReducer?.allMessagesList,
    shallowEqual,
  );
  const isMessageProcessing = useSelector(
    (state: RootState) => state.chatReducer?.isMessageProcessing,
    shallowEqual,
  );

  const [isChatSaved, setIsChatSaved] = useState<boolean>(false);

  const [saveHistory] = useSaveHistoryMutation();
  const [unSaveHistory] = useUnSaveHistoryMutation();

  useEffect(() => {
    if (allMessagesList?.length < 1) {
      setIsChatSaved(false);
    } else if (isStarred !== undefined) {
      setIsChatSaved(isStarred);
    } else {
      const item = allMessagesList?.find(item => item?.role === "assistant");
      setIsChatSaved(item?.starred);
    }
  }, [allMessagesList, isStarred]);

  const handleSaveChat = () => {
    const item = allMessagesList?.find(item => item?.role === "assistant");
    const conv_id = conversationId
      ? conversationId
      : item?.conversation_id
      ? item?.conversation_id
      : item?.conversationId;

    if (!conv_id) {
      errorAlert({ body: "Conversation id not found" });
      return;
    }
    if (isChatSaved) {
      setIsChatSaved(false);
      unSaveHistory({ conversationId: conv_id })
        .unwrap()
        .then(() => {
          successAlert({ body: "Conversation has been unsaved" });
        })
        .catch(error => {
          const errorMessage = getError(error);
          errorAlert({ body: errorMessage || "" });
          setIsChatSaved(true);
        });
    } else {
      setIsChatSaved(true);
      saveHistory({ conversationId: conv_id })
        .unwrap()
        .then(payload => {
          successAlert({ body: "Conversation has been saved" });
        })
        .catch(error => {
          const errorMessage = getError(error);
          errorAlert({ body: errorMessage || "" });
          setIsChatSaved(false);
        });
    }
  };

  const handleStartNewChat = useCallback(() => {
    chatSession.invalidate();
    socketManager.cleanup();

    dispatch(resetChat());

    clearNotificationState().catch(() => {});
  }, [dispatch]);

  const handleGoToCamera = () => {
    navigation.navigate(screens.VISION_CAMERA_SCREEN);
  };

  return (
    <View style={styles.headerView}>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={handleGoToCamera}
        disabled={!canUseAI}
      >
        <Image
          source={scheme === "dark" ? IMAGES.splashLogo : IMAGES.logoPrimary}
          style={styles.logo}
        />
      </TouchableOpacity>

      <View style={styles.rightIconsView}>
        {allMessagesList?.length > 1 && (
          <>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={handleStartNewChat}
              testID={testID}
              hitSlop={25}
            >
              <Image
                source={ICONS.editNew}
                style={styles.editIcon}
                tintColor={colors.HEADING}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={handleSaveChat}
              testID={testID}
              disabled={isMessageProcessing}
              hitSlop={25}
            >
              <Image
                source={isChatSaved ? ICONS.activeBookmark : ICONS.bookmark}
                style={styles.saveIcon}
                tintColor={
                  isMessageProcessing ? colors.ICON_COLOR : colors.HEADING
                }
              />
            </TouchableOpacity>
          </>
        )}
        <SettingsButton testID={testID} />
      </View>
    </View>
  );
};

export default memo(Header);
