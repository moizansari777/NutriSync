import {
  TouchableOpacity,
  Image,
  View,
  Alert,
  Linking,
  Platform,
} from "react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import ICONS from "../../../assets/icons";
import styles from "../styles";
import {
  activeOpacity,
  APP_NAME,
  LIMIT_END_FLASH_BODY,
  LIMIT_END_FLASH_BODY_NTERNET,
  LIMIT_END_FLASH_TITLE,
  LIMIT_END_FLASH_TITLE_INTERNET,
} from "../../../constant";
import { errorAlert } from "../../../utils/alerts";
import { RootState } from "../../../states/store/store";
import { useTheme } from "../../../hooks/useTheme";
import { COLORS } from "../../../macros/colors";
import { useLazyGetCanUseAIWidthDispatchQuery } from "../../../services/profileServices";
import speechRecognizer, {
  SpeechFailureReason,
} from "../../../utils/speechRecognizer";

type Props = {
  handleSetVoiceResult: (value: string) => void;
  handleSetIsListening: (value: boolean) => void;
};

function VoiceInput({ handleSetVoiceResult, handleSetIsListening }: Props) {
  const { colors, scheme } = useTheme();
  const isFocused = useIsFocused();
  const [isListening, setIsListening] = useState(false);
  /** Prevents a second tap while start() is still negotiating permissions. */
  const isStartingRef = useRef(false);

  const canUseAI = useSelector(
    (state: RootState) => state.authReducer?.canUseAI,
  );

  const [canUseAIAPI] = useLazyGetCanUseAIWidthDispatchQuery();

  const handleRefetch = useCallback(() => {
    canUseAIAPI({ shouldDispatch: true, canUseAI });
  }, [canUseAIAPI, canUseAI]);

  const promptForSettings = useCallback(() => {
    // iOS needs Speech Recognition on top of Microphone, and both can also be
    // switched off by Screen Time restrictions.
    const permissionNames =
      Platform.OS === "ios"
        ? "Microphone and Speech Recognition"
        : "Microphone";
    Alert.alert(
      "Microphone Access Needed",
      `Please enable ${permissionNames} access for ${APP_NAME} in Settings to use voice input.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ],
    );
  }, []);

  const handleFailure = useCallback(
    (reason: SpeechFailureReason, message: string) => {
      setIsListening(false);
      handleSetIsListening(false);

      switch (reason) {
        case "permission_blocked":
          promptForSettings();
          return;
        case "permission_denied":
          errorAlert({
            title: "Microphone Needed",
            body: "Allow microphone access to use voice input.",
          });
          return;
        case "unavailable":
          errorAlert({
            title: "Not Supported",
            body: "Voice input is not available on this device. Please type your message instead.",
          });
          return;
        case "network":
          errorAlert({
            title: "Connection Needed",
            body: "Voice input needs an internet connection. Please check your network and try again.",
          });
          return;
        case "no_speech":
          errorAlert({
            title: "Didn't Catch That",
            body: "We couldn't hear anything. Please try again.",
          });
          return;
        default:
          errorAlert({ title: "Voice Input", body: message });
      }
    },
    [handleSetIsListening, promptForSettings],
  );

  const handleListeningChange = useCallback(
    (listening: boolean) => {
      setIsListening(listening);
      handleSetIsListening(listening);
    },
    [handleSetIsListening],
  );

  const handleTranscript = useCallback(
    (text: string) => {
      // Partials are committed as they arrive, so a failure at the tail of the
      // utterance can no longer discard what the user already said.
      handleSetVoiceResult(text);
    },
    [handleSetVoiceResult],
  );

  const startListening = useCallback(async () => {
    if (!canUseAI) {
      handleRefetch();
      errorAlert({
        title:
          canUseAI != undefined
            ? LIMIT_END_FLASH_TITLE
            : LIMIT_END_FLASH_TITLE_INTERNET,
        body:
          canUseAI != undefined
            ? LIMIT_END_FLASH_BODY
            : LIMIT_END_FLASH_BODY_NTERNET,
      });
      return;
    }

    if (isStartingRef.current || speechRecognizer.isActive()) {
      return;
    }
    isStartingRef.current = true;
    // Reflected before the recogniser has warmed up (which can take seconds on
    // a cold service) so the other actions disappear on the tap rather than
    // later. onFailure and the start watchdog always revert this.
    setIsListening(true);
    handleSetIsListening(true);
    try {
      await speechRecognizer.start({
        onTranscript: handleTranscript,
        onListeningChange: handleListeningChange,
        onFailure: handleFailure,
      });
    } finally {
      isStartingRef.current = false;
    }
  }, [
    canUseAI,
    handleRefetch,
    handleTranscript,
    handleListeningChange,
    handleFailure,
    handleSetIsListening,
  ]);

  const stopListening = useCallback(() => {
    // Reflect the tap immediately: the transcript still arrives asynchronously,
    // but the button must never look stuck.
    setIsListening(false);
    handleSetIsListening(false);
    speechRecognizer.stop();
  }, [handleSetIsListening]);

  // Leaving the screen must release the microphone. This is keyed off focus
  // rather than unmount so that ordinary re-renders can never kill a live
  // session.
  useEffect(() => {
    if (isFocused) {
      return;
    }
    speechRecognizer.cancel();
    setIsListening(false);
    handleSetIsListening(false);
  }, [isFocused, handleSetIsListening]);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={isListening ? stopListening : startListening}
      // Deliberately always enabled: a disabled button swallows onPress, which
      // left users with a silent, dead mic whenever canUseAI was still false.
      accessibilityRole="button"
      accessibilityLabel={
        isListening ? "Stop voice input" : "Start voice input"
      }
      accessibilityState={{ busy: isListening }}
    >
      {isListening ? (
        <View
          style={[
            styles.circleView,
            {
              backgroundColor: colors.SECONDARY,
              borderWidth: scheme === "dark" ? 0.7 : 0,
            },
          ]}
        >
          <Image
            source={ICONS.stop}
            style={styles.stopIcon}
            tintColor={COLORS.WHITE}
          />
        </View>
      ) : (
        <View style={styles.iconCircleView}>
          <Image
            source={ICONS.mic}
            style={styles.cameraIcon}
            tintColor={colors.HEADING}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default memo(VoiceInput);
