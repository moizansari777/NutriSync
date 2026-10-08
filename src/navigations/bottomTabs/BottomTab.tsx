import React, { memo, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import GlassTabBar from "./GlassTabBar";
import { screens } from "../routes";
import Chat from "../../screens/chat";
import TabItemIcon from "./TabItemIcon";
import VisionCamera from "../../screens/visionCamera";
import TabItemTitle from "./TabItemTitle";
import ICONS from "../../assets/icons";
import {
  resetChat,
  setAllMessageList,
  setCurrentSelectedImage,
} from "../../states/reducer/chatReducer";
import { RootState } from "../../states/store/store";
import { getAndroidVersion } from "../../utils/getAndroidVersion";
import { errorAlert } from "../../utils/alerts";
import { LIMIT_END_FLASH_BODY, LIMIT_END_FLASH_TITLE } from "../../constant";
import LogTDEERootScreen from "../../screens/logModule/logTDEERootScreen";
import QuickAddTDEE from "../../screens/logModule/quickAddTDEE";
import HistoryTDEE from "../../screens/logModule/historyTDEE";
import {
  setLiveScanActivate,
  setScreenFromLogHistory,
} from "../../states/reducer/cameraReducer";
import { useGetCanUseAIQuery } from "../../services/profileServices";
import { setCanUseAI } from "../../states/reducer/authReducer";
import { useForegroundOnce } from "../../hooks/useForegroundOnce";
import { clearNotificationState } from "../../utils/notificationManager";
import socketManager from "../../utils/socketManager";
import chatSession from "../../utils/chatSession";

const Tab = createBottomTabNavigator();

// The list screens are typed as stack screens; inside the tab navigator they
// receive tab props, which they only use to read `route.name` and navigate.
const SavedMealsTab = (props: any) => <QuickAddTDEE {...props} />;
const HistoryTab = (props: any) => <HistoryTDEE {...props} />;

const renderTabTitleComponent = ({
  focused,
  color,
  label,
  hasLiveDot = false,
}: {
  focused: boolean;
  color: string;
  label: string;
  hasLiveDot?: boolean;
}) => {
  return (
    <TabItemTitle
      focused={focused}
      label={label}
      color={color}
      hasLiveDot={hasLiveDot}
    />
  );
};

const renderTabIconComponent = ({
  focused,
  color,
  iconName,
}: {
  focused: boolean;
  color: string;
  iconName: any;
}) => {
  return <TabItemIcon iconName={iconName} color={color} focused={focused} />;
};

function BottomTab() {
  const dispatch = useDispatch();
  const version = getAndroidVersion();

  const { data, refetch } = useGetCanUseAIQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const canUseAI = useSelector(
    (state: RootState) => state.authReducer?.canUseAI,
  );

  const hasMessagesList = useSelector(
    (state: RootState) => state.chatReducer?.allMessagesList,
  );
  const isMessageProcessing = useSelector(
    (state: RootState) => state.chatReducer?.isMessageProcessing,
  );
  const isCurrentChatScreenActive = useSelector(
    (state: RootState) => state.chatReducer?.isCurrentChatScreenActive,
  );

  const isChatActive = isCurrentChatScreenActive
    ? hasMessagesList?.length > 0
    : false;

  const OPTIONS_DATA = {
    tabBarHideOnKeyboard:
      Platform.OS === "ios" ? true : version >= 33 ? true : false,
    headerShown: false,
  };

  useEffect(() => {
    if (data?.can_use_ai != undefined) {
      dispatch(setCanUseAI(data?.can_use_ai));
    }
  }, [data?.can_use_ai]);

  // Log, Saved Meals and History all need AI access; a press without it
  // refreshes the flag and explains why instead of switching tabs.
  const gateAIAccess = useCallback(
    (e: { preventDefault: () => void }) => {
      if (!canUseAI) {
        e.preventDefault();
        refetch();
        errorAlert({
          title: LIMIT_END_FLASH_TITLE,
          body: LIMIT_END_FLASH_BODY,
        });
      }
    },
    [canUseAI, refetch],
  );

  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => <GlassTabBar {...props} />,
    [],
  );

  useForegroundOnce(async () => {
    refetch();
  });

  return (
    <Tab.Navigator
      screenOptions={OPTIONS_DATA}
      tabBar={renderTabBar}
      // Log is home. Without AI access it is locked, so fall back to Ask.
      initialRouteName={
        canUseAI ? screens.LOG_TDEE_ROOT_SCREEN : screens.CHAT_SCREEN
      }
    >
      <Tab.Screen
        name={screens.VISION_CAMERA_SCREEN}
        component={VisionCamera}
        listeners={({ navigation }) => ({
          tabPress: e => {
            if (!canUseAI) {
              e.preventDefault(); // prevent tab navigation
              refetch();
              errorAlert({
                title: LIMIT_END_FLASH_TITLE,
                body: LIMIT_END_FLASH_BODY,
              });
              return;
            }

            if (!isMessageProcessing) {
              dispatch(setAllMessageList([]));
              dispatch(setCurrentSelectedImage(null));
              navigation.reset({
                index: 0,
                routes: [{ name: screens.CHAT_SCREEN, params: {} }],
              });
            }

            dispatch(setLiveScanActivate(false));
          },
        })}
        options={{
          tabBarLabel: ({ focused, color }) =>
            renderTabTitleComponent({
              focused,
              color,
              label: "Live",
              hasLiveDot: true,
            }),
          tabBarIcon: ({ focused, color }) =>
            renderTabIconComponent({
              focused,
              color,
              iconName: ICONS.tab_camera,
            }),
        }}
      />
      <Tab.Screen
        name={screens.CHAT_SCREEN}
        component={Chat}
        listeners={({ navigation }) => ({
          tabPress: () => {
            if (!isMessageProcessing) {
              dispatch(setLiveScanActivate(false));
              dispatch(setScreenFromLogHistory(""));
              if (!navigation.isFocused()) {
                return;
              }
              chatSession.invalidate();
              socketManager.cleanup();

              dispatch(resetChat());

              clearNotificationState().catch(() => {});
              navigation.setParams({
                conversationId: undefined,
                isStarred: undefined,
              });
            }
          },
        })}
        options={{
          tabBarLabel: ({ focused, color }) =>
            renderTabTitleComponent({
              focused,
              color,
              label: isChatActive ? "Refresh" : "Ask",
            }),
          tabBarIcon: ({ focused, color }) =>
            renderTabIconComponent({
              focused,
              color,
              iconName: isChatActive ? ICONS.retake : ICONS.tab_chat,
            }),
        }}
      />
      <Tab.Screen
        name={screens.LOG_TDEE_ROOT_SCREEN}
        component={LogTDEERootScreen}
        listeners={() => ({
          tabPress: e => {
            if (!canUseAI) {
              e.preventDefault(); // prevent tab navigation
              refetch();
              errorAlert({
                title: LIMIT_END_FLASH_TITLE,
                body: LIMIT_END_FLASH_BODY,
              });
              return;
            }
          },
        })}
        options={{
          tabBarLabel: ({ focused, color }) =>
            renderTabTitleComponent({ focused, color, label: "Log" }),
          tabBarIcon: ({ focused, color }) =>
            renderTabIconComponent({
              focused,
              color,
              iconName: ICONS.tab_log,
            }),
        }}
      />
      <Tab.Screen
        name={screens.SAVED_MEALS_TAB}
        component={SavedMealsTab}
        listeners={() => ({ tabPress: gateAIAccess })}
        options={{
          tabBarLabel: ({ focused, color }) =>
            renderTabTitleComponent({ focused, color, label: "Saved" }),
          tabBarIcon: ({ focused, color }) =>
            renderTabIconComponent({
              focused,
              color,
              iconName: ICONS.bookmark,
            }),
        }}
      />
      <Tab.Screen
        name={screens.HISTORY_TAB}
        component={HistoryTab}
        listeners={() => ({ tabPress: gateAIAccess })}
        options={{
          tabBarLabel: ({ focused, color }) =>
            renderTabTitleComponent({ focused, color, label: "History" }),
          tabBarIcon: ({ focused, color }) =>
            renderTabIconComponent({
              focused,
              color,
              iconName: ICONS.historyIcon,
            }),
        }}
      />
    </Tab.Navigator>
  );
}

export default memo(BottomTab);
