import { TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { activeOpacity } from "../../../constant";
import styles from "./styles";
import ICONS from "../../../assets/icons";
import LoadingIndicator from "../../../components/loaders/LoadingIndicator";
import { fetchAndPlayMessageVoice, stopSound } from "../../../utils/audioUtils";
import { BASE_URL } from "../../../config";
import { API_ENDPOINTS } from "../../../services/endpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../states/store/store";
import { useTheme } from "../../../hooks/useTheme";

const ListenMessageVoice = ({ messageId }: { messageId: number | string }) => {
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const user = useSelector((state: RootState) => state.authReducer?.userData);

  // A freshly streamed message keeps its client-side nanoid until the socket
  // "complete" event swaps in the server id. The voice endpoint can only
  // resolve server ids, so don't offer playback until we have one.
  const hasServerId =
    typeof messageId === "number" ||
    (typeof messageId === "string" && /^\d+$/.test(messageId));

  const handleListen = async () => {
    const url = `${BASE_URL}${API_ENDPOINTS.message_voice}?message_id=${messageId}`;

    await fetchAndPlayMessageVoice(
      url,
      user?.token,
      messageId,
      user?.user?.email ?? "",
      state => {
        if (state === "loading") {
          setVoiceLoading(true);
          setIsListening(false);
        } else if (state === "playing") {
          setVoiceLoading(false);
          setIsListening(true);
        } else if (
          state === "done" ||
          state === "error" ||
          state === "stopped"
        ) {
          setVoiceLoading(false);
          setIsListening(false);
        }
      },
    );
  };

  const handleStopSound = () => {
    stopSound(messageId, state => {
      if (state === "stopped") {
        setVoiceLoading(false);
        setIsListening(false);
      }
    });
  };

  useEffect(() => {
    return () => {
      handleStopSound();
    };
  }, [isFocused]);

  if (!hasServerId) {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={isListening || voiceLoading ? handleStopSound : handleListen}
      style={styles.soundView}
    >
      {voiceLoading ? (
        <LoadingIndicator color={colors.HEADING} />
      ) : (
        <Image
          source={isListening ? ICONS.stopIcon : ICONS.playIcon}
          style={styles.soundIcon}
          tintColor={colors.HEADING}
        />
      )}
      {/* <AppText allowFontScaling={false} style={styles.soundText}>
        {voiceLoading ? "Loading..." : isListening ? "Stop" : "Listen"}
      </AppText> */}
    </TouchableOpacity>
  );
};

export default ListenMessageVoice;
