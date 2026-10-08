import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  Pressable,
  Platform,
} from "react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import * as ErrorReporter from "../../../utils/errorReporter";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigation } from "@react-navigation/native";
import BackgroundService from "react-native-background-actions";
import styles from "../styles";
import { COLORS } from "../../../macros/colors";
import ICONS from "../../../assets/icons";
import VoiceInput from "./VoiceInput";
import { RootState, store } from "../../../states/store/store";
import {
  addAssistantPlaceholder,
  addUserMessage,
  completeAssistantMessage,
  setCurrentSelectedImage,
  setIsFromCropEditOrNext,
  startStreaming,
} from "../../../states/reducer/chatReducer";
import {
  activeOpacity,
  LIMIT_END_FLASH_BODY,
  LIMIT_END_FLASH_BODY_NTERNET,
  LIMIT_END_FLASH_TITLE,
  LIMIT_END_FLASH_TITLE_INTERNET,
} from "../../../constant";
import { useSendMessageMutation } from "../../../services/chatServices";
import { getError } from "../../../utils/errors";
import { RootNavigationProp } from "../../../schemas/types";
import { screens } from "../../../navigations/routes";
import ImagePreview from "./ImagePreview";
import { CAMERA_FROM_CHAT } from "../../visionCamera/cameraModes";
import socketManager from "../../../utils/socketManager";
import chatSession from "../../../utils/chatSession";
import {
  clearNotificationState,
  showLocalNotification,
} from "../../../utils/notificationManager";
import { errorAlert } from "../../../utils/alerts";
import { useTheme } from "../../../hooks/useTheme";
import { useLazyGetCanUseAIWidthDispatchQuery } from "../../../services/profileServices";
import { BUILD_NUMBER, BUILD_VERSION, ENVIRONMENT } from "../../../config";
import speechRecognizer from "../../../utils/speechRecognizer";
import { useKeyboardVisibility } from "../../../hooks/useKeyboardVisibility";

/*
  Android 14 (API 34) made a foreground service type mandatory, and Android 15+
  refuses to start one whose type resolves to "none". react-native-background-
  actions forwards this option straight into startForeground(), and when it is
  omitted the native side resolves it to 0 — FOREGROUND_SERVICE_TYPE_NONE — so
  the service throws InvalidForegroundServiceTypeException on its own thread,
  well after BackgroundService.start() has already resolved. That is a native
  crash no JS try/catch can intercept, which is why it only shows up as an error report
  RuntimeException and only on Android 15+ devices.

  The value must match android:foregroundServiceType on RNBackgroundActionsTask
  in AndroidManifest.xml (already "dataSync", with FOREGROUND_SERVICE_DATA_SYNC
  granted). iOS ignores the options dictionary entirely, so this stays undefined
  there rather than relying on that.
*/
const FOREGROUND_SERVICE_TYPE: Array<"dataSync"> | undefined =
  Platform.OS === "android" ? ["dataSync"] : undefined;

/*
  Upper bound on how long the background task will hold the foreground service
  open waiting for a reply. A socket that stalls without ever erroring would
  otherwise pin the service — and its notification — up indefinitely, and
  Android 15 only grants a dataSync service six hours across a day. Well past
  any real answer, short enough that a dead stream cannot camp on the budget.
*/
const STREAM_HOLD_TIMEOUT_MS = 3 * 60 * 1000;

/**
 * Resolves once the streaming turn is over: the socket reached complete/error,
 * a new chat discarded the turn, or the cap above elapsed.
 */
const waitForStreamToSettle = (generation: number): Promise<void> =>
  new Promise<void>(resolve => {
    let settled = false;
    let releaseInvalidate = () => {};

    const settle = () => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      releaseInvalidate();
      resolve();
    };

    const timer = setTimeout(settle, STREAM_HOLD_TIMEOUT_MS);
    // A new chat retires this turn without the socket necessarily saying
    // anything, so the reset has to be able to release the hold too.
    releaseInvalidate = chatSession.onInvalidate(settle);

    socketManager.whenTurnSettles(generation).then(settle);
  });

type Props = {
  conversationId?: string;
  canUseAI: boolean;
};

const ChatInput = ({ conversationId, canUseAI }: Props) => {
  const imageProcessedRef = useRef(false);
  const isKeyboardVisible = useKeyboardVisibility();
  const { colors, scheme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavigationProp>();

  const [queryText, setQueryText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const [canUseAIAPI] = useLazyGetCanUseAIWidthDispatchQuery();

  const allMessagesList = useSelector(
    (state: RootState) => state.chatReducer?.allMessagesList,
    shallowEqual,
  );

  const currentSelectedImage = useSelector(
    (state: RootState) => state?.chatReducer?.currentSelectedImage,
    shallowEqual,
  );

  const userData = useSelector(
    (state: RootState) => state?.authReducer?.userData?.user,
    shallowEqual,
  );

  const isSoundOn = useSelector(
    (state: RootState) => state.authReducer?.isSoundOff,
  );

  const isFromCropEdit = useSelector(
    (state: RootState) => state.chatReducer.isFromCropEdit,
  );

  const isGlobalMessageProcessing = useSelector(
    (state: RootState) => state.chatReducer.isMessageProcessing,
    shallowEqual,
  );

  const [sendMessageAPI] = useSendMessageMutation();

  const queryTextRef = useRef("");
  const dictationBaseRef = useRef("");

  const handleOnChange = useCallback((text: string) => {
    queryTextRef.current = text;
    setQueryText(text);
  }, []);

  const handleSetVoiceResult = useCallback((text: string) => {
    const base = dictationBaseRef.current;
    const merged = base ? `${base} ${text}`.trim() : text;
    queryTextRef.current = merged;
    setQueryText(merged);
  }, []);

  const handleSetIsListening = useCallback((value: boolean) => {
    if (value) {
      // Captured once per session; partial transcripts then replace only the
      // dictated tail rather than everything the user had already typed.
      dictationBaseRef.current = queryTextRef.current.trim();
    }
    setIsListening(value);
  }, []);

  const handleDeselectImage = useCallback(() => {
    dispatch(setCurrentSelectedImage(null));
    dispatch(setIsFromCropEditOrNext(false));
  }, [dispatch]);

  // Inside your backgroundTask function
  const backgroundTask = async (taskData: any) => {
    const {
      formData,
      assistantMessageId,
      isFirstMessage,
      soundOn,
      sendMessageAPICall,
      generation,
    } = taskData;

    // Hands the reset a way to cancel the request outright, instead of letting
    // the reply come back and open a stream for a chat that is already gone.
    const request = sendMessageAPICall(formData);
    const releaseAbort = chatSession.onInvalidate(() => request.abort());

    try {
      const payload = await request.unwrap();

      // Retired while the request was in flight — drop the result rather than
      // subscribing to the stream it points at.
      if (!chatSession.isCurrent(generation)) {
        return;
      }

      console.log("✅ Conversation Id Created");

      // ✅ Initialize socket streaming safely (no React hooks)
      socketManager.init(
        payload.conversation_id,
        assistantMessageId,
        isFirstMessage, // allMessagesList?.length < 1,
        soundOn,
        generation,
      );

      store.dispatch(
        startStreaming({
          conversationId: payload.conversation_id,
          assistantMessageId,
        }),
      );

      // The foreground service is the only thing keeping this process awake
      // once the app is backgrounded — Android 14+ freezes a cached process,
      // and a frozen process drops its WebSocket. Returning here would let the
      // finally below stop the service the instant the HTTP request came back,
      // before a single token had streamed, which is exactly why the socket
      // disconnected right after "Conversation Id Created" and only reconnected
      // when the app was reopened. Hold the task open for the whole reply.
      await waitForStreamToSettle(generation);
    } catch (error) {
      // An abort from the reset is the expected path, not a failure: there is
      // no placeholder left to fill and nothing worth reporting.
      if (!chatSession.isCurrent(generation)) {
        return;
      }

      ErrorReporter.captureException(error, {
        extra: {
          userEmail: userData?.email,
          device: Platform.OS,
          action: "After sending message - During API Calling",
          env: ENVIRONMENT,
          appVersion: `${BUILD_VERSION}(${BUILD_NUMBER})`,
        },
      });

      const errorMessage = getError(error);

      store.dispatch(
        completeAssistantMessage({
          id: assistantMessageId,
          error: errorMessage,
        }),
      );

      // The turn ends here, so nothing downstream will reach socketManager to
      // take the "Analyzing..." notification and its sound down.
      await clearNotificationState();
    } finally {
      releaseAbort();

      // Only clear the composer if this turn still owns it. After a reset the
      // user may already be typing the next message, and a discarded turn has
      // no business wiping it.
      if (chatSession.isCurrent(generation)) {
        queryTextRef.current = "";
        dictationBaseRef.current = "";
        setQueryText("");
        dispatch(setCurrentSelectedImage(null));
        dispatch(setIsFromCropEditOrNext(false));
      }

      await BackgroundService.stop();
    }
  };

  // Send Message Method
  const handleSendMessage = useCallback(async () => {
    if (!queryText.trim() && !currentSelectedImage) {
      return;
    }

    Keyboard.dismiss();

    if (isGlobalMessageProcessing) {
      return;
    }

    speechRecognizer.cancel();

    // Alert (no spoken cue when a message is sent)
    if (isSoundOn) {
      if (allMessagesList?.length < 1) {
        showLocalNotification("Analyzing...", "We’re processing your request.");
      }
    }

    const formData = new FormData();
    const userMessageId = nanoid();
    const assistantMessageId = nanoid();

    formData.append("content", queryText);

    // Determine conversation ID
    const targetConversationId =
      conversationId ||
      allMessagesList?.find(m => m.conversationId)?.conversationId;

    if (targetConversationId) {
      formData.append("conversation_id", targetConversationId);
    }

    // Attach image if present
    if (currentSelectedImage) {
      formData.append("images[]", {
        uri: currentSelectedImage.uri,
        type: currentSelectedImage.type || "image/jpeg",
        name: currentSelectedImage.name || `photo_${Date.now()}.jpg`,
      } as any);
    }

    const createdAt = Date.now();

    // Add user message to UI
    dispatch(
      addUserMessage({
        id: userMessageId,
        role: "user",
        text: queryText,
        images: currentSelectedImage ? [currentSelectedImage.uri] : [],
        createdAt,
      }),
    );

    // Add assistant placeholder
    dispatch(
      addAssistantPlaceholder({
        id: assistantMessageId,
        role: "assistant",
        text: "",
        loading: true,
        createdAt: Date.now(),
        starred: false,
      }),
    );

    // Clear input
    queryTextRef.current = "";
    dictationBaseRef.current = "";
    setQueryText("");
    dispatch(setCurrentSelectedImage(null));
    dispatch(setIsFromCropEditOrNext(false));

    const taskParameters = {
      formData,
      assistantMessageId,
      isFirstMessage: allMessagesList?.length < 1,
      soundOn: isSoundOn,
      sendMessageAPICall: sendMessageAPI,
      // Stamps the turn this task belongs to, so everything downstream can
      // tell whether it is still the conversation on screen.
      generation: chatSession.current(),
      userMessageId,
      queryText,
      currentSelectedImage,
      conversationId: targetConversationId,
    };

    // Start background task
    try {
      await BackgroundService.start(backgroundTask, {
        taskName: "UploadMessage",
        taskTitle: "Sending Message",
        taskDesc: "Sending your message...",
        taskIcon: {
          name: "ic_launcher",
          type: "mipmap",
        },
        color: COLORS.SECONDARY,
        linkingURI: "",
        foregroundServiceType: FOREGROUND_SERVICE_TYPE,
        parameters: taskParameters,
      });
    } catch (error) {
      // console.error("❌ Failed to start background service:", error);
      ErrorReporter.captureException(error, {
        extra: {
          userEmail: userData?.email,
          device: Platform.OS,
          action:
            "Background task while processing message - After API Success",
          env: ENVIRONMENT,
          appVersion: `${BUILD_VERSION}(${BUILD_NUMBER})`,
        },
      });

      // The service never came up — Android 12+ refuses to start one from the
      // background, for one — so the headless task will never be dispatched and
      // the assistant placeholder would spin forever. Run the same work in
      // process instead: the library itself does exactly this on iOS, where
      // there is no service to begin with. Only reachable when start() rejects,
      // which means the service did not launch, so the task cannot double-run.
      try {
        await backgroundTask(taskParameters);
      } catch (fallbackError) {
        ErrorReporter.captureException(fallbackError, {
          extra: {
            userEmail: userData?.email,
            device: Platform.OS,
            action: "In-process fallback after background service start failed",
            env: ENVIRONMENT,
            appVersion: `${BUILD_VERSION}(${BUILD_NUMBER})`,
          },
        });

        await clearNotificationState(); // stops sound + removes notification
      }
    }
  }, [
    queryText,
    currentSelectedImage,
    conversationId,
    allMessagesList,
    dispatch,
    sendMessageAPI,
  ]);

  // The chat's camera is the same camera screen as the Live tab, opened in
  // photo mode: take a picture or pick one, no Live AI scan.
  const handleGoToCameraScreen = () => {
    if (canUseAI) {
      navigation.navigate(screens.MAIN_SCREEN_STACK, {
        screen: screens.VISION_CAMERA_SCREEN,
        params: { from: CAMERA_FROM_CHAT },
      });
    } else {
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
    }
  };

  // Auto-send when image is selected (only once)
  useEffect(() => {
    if (!isFromCropEdit) {
      if (currentSelectedImage && !imageProcessedRef.current) {
        imageProcessedRef.current = true;
        handleSendMessage();
      }

      if (!currentSelectedImage) {
        imageProcessedRef.current = false;
      }
    }
  }, []); // Only depend on image

  const handleRefetch = () => {
    canUseAIAPI({ shouldDispatch: true, canUseAI });
  };

  const messageLoading = isGlobalMessageProcessing;

  const hasText = Boolean(queryText?.trim());
  const hasImage = Boolean(currentSelectedImage?.uri);

  // While the mic is live nothing else is offered, so a tap can neither send a
  // half-dictated message nor navigate away mid-recognition.
  const showCamera = !isListening && !hasImage;
  const showSend = !isListening && (hasImage || hasText);
  // Typed or dictated text replaces the mic with send; an image keeps the mic
  // so a caption can still be dictated.
  const showMic = isListening || !hasText;

  const placeholder = canUseAI
    ? isFromCropEdit
      ? "Add description..."
      : "Ask anything..."
    : "Subscribe to continue chatting";

  return (
    <Pressable onPress={handleRefetch}>
      {messageLoading ? null : (
        <View
          style={[
            styles.chatInputArea,
            {
              backgroundColor: colors.INPUT_BG,
              shadowColor:
                scheme === "dark" ? colors.MIRROR_BG : COLORS.MIRROR_BG,
              borderRadius:
                Platform.OS === "ios" ? (isKeyboardVisible ? 25 : 0) : 0,
            },
          ]}
        >
          {currentSelectedImage && (
            <ImagePreview
              currentSelectedImage={currentSelectedImage}
              handleDeselectImage={handleDeselectImage}
            />
          )}
          <TextInput
            allowFontScaling={false}
            style={[styles.textInput, { color: colors.HEADING }]}
            placeholder={placeholder}
            placeholderTextColor={colors.PLACEHOLDER}
            multiline={true}
            cursorColor={colors.TEXT}
            value={queryText}
            onChangeText={handleOnChange}
            editable={canUseAI && !messageLoading}
            pointerEvents={canUseAI ? "auto" : "none"}
          />

          {!messageLoading && (
            <View style={styles.bottomActionView}>
              {showCamera && (
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  onPress={handleGoToCameraScreen}
                  style={styles.iconCircleView}
                >
                  <Image
                    source={ICONS.camera}
                    style={styles.cameraIcon}
                    tintColor={colors.HEADING}
                  />
                </TouchableOpacity>
              )}

              {/*
                VoiceInput stays mounted at a fixed position and is hidden with
                `display: none` rather than unmounted. Conditional rendering
                here used to tear down the live speech session the instant the
                first transcript arrived and turned the mic into a send button.
                `display: none` removes it from layout just as effectively while
                leaving the recognition session untouched.
              */}
              <View style={showMic ? undefined : styles.hiddenAction}>
                <VoiceInput
                  handleSetVoiceResult={handleSetVoiceResult}
                  handleSetIsListening={handleSetIsListening}
                />
              </View>

              {showSend && (
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  onPress={handleSendMessage}
                  style={[
                    styles.circleView,
                    {
                      backgroundColor: COLORS.SECONDARY,
                      borderWidth: scheme === "dark" ? 0.7 : 0,
                    },
                  ]}
                  disabled={!canUseAI}
                >
                  <Image
                    source={ICONS.arrowDown}
                    style={styles.sendIcon}
                    tintColor={COLORS.WHITE}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default memo(ChatInput);
