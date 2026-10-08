import { View, Platform } from "react-native";
import React, { FC, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import styles from "./styles";
import ScreenWrapper from "../../components/screenWrapper";
import { RootStackParamList, screens } from "../../navigations/routes";
import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import MessagesList from "./components/MessagesList";
import NoSubscription from "./components/NoSubscription";
import { setCurrentChatScreen } from "../../states/reducer/chatReducer";
import { getAndroidVersion } from "../../utils/getAndroidVersion";
import {
  useGetCanUseAIQuery,
  useLazyGetAccountDataQuery,
} from "../../services/profileServices";
import { useForegroundOnce } from "../../hooks/useForegroundOnce";
import { setCanUseAI, setUserAuthData } from "../../states/reducer/authReducer";
import { RootState } from "../../states/store/store";
import NoInternetBanner from "./components/NoInternetBanner";

type Props = NativeStackScreenProps<RootStackParamList, screens.CHAT_SCREEN>;

const Chat: FC<Props> = ({ route }) => {
  const dispatch = useDispatch();
  const version = getAndroidVersion();
  const isFocused = useIsFocused();
  const conversationId = route.params?.conversationId || "";
  const isStarred = route.params?.isStarred || "";

  const user = useSelector((state: RootState) => state.authReducer?.userData);
  const canUseAI = useSelector(
    (state: RootState) => state.authReducer?.canUseAI,
  );

  const { data, refetch } = useGetCanUseAIQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [getAccountsData] = useLazyGetAccountDataQuery();

  console.log(version, "version");

  useForegroundOnce(async () => {
    refetch();
    getAccountsData(undefined)
      .then(payload => {
        if (payload?.data) {
          dispatch(
            setUserAuthData({
              user: payload?.data?.user,
              token: user?.token || "",
              login: false,
              isAffiliate: user ? user?.isAffiliate : false,
            }),
          );
        }
      })
      .catch(error => {});
  });

  useEffect(() => {
    if (isFocused) {
      dispatch(setCurrentChatScreen(true));
    } else {
      dispatch(setCurrentChatScreen(false));
    }
  }, [isFocused]);

  useEffect(() => {
    if (data?.can_use_ai != undefined) {
      dispatch(setCanUseAI(data?.can_use_ai));
    }
  }, [data?.can_use_ai]);

  return (
    <ScreenWrapper paddingTop={0}>
      <View style={styles.container} testID="chat_screen">
        <KeyboardAvoidingView
          style={styles.container}
          // behavior={Platform.OS === "ios" ? "padding" : undefined}  // Android handled by adjustResize
          behavior="padding"
          keyboardVerticalOffset={
            Platform.OS === "ios"
              ? 70
              : version > 33
              ? version > 35
                ? 30
                : 60
              : 30
          }
        >
          <Header
            testID="menu_button_id"
            canUseAI={canUseAI}
            isStarred={isStarred}
            conversationId={conversationId}
          />
          <NoInternetBanner />
          {canUseAI != undefined && <NoSubscription canUseAI={canUseAI} />}

          <MessagesList />
          <ChatInput conversationId={conversationId} canUseAI={canUseAI} />
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

export default Chat;
