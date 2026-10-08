import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PersistGate } from "redux-persist/integration/react";
import { withStallion } from "react-native-stallion";
import { navigationRef } from "./src/hooks/useNavigationHelper";
import RootStack from "./src/navigations";
import { persistor, RootState, store } from "./src/states/store/store";
import socketServices from "./src/utils/socketIO";
import { requestLocationPermission } from "./src/utils/permissions";
import LocationUpdateModal from "./src/components/locationUpdateModal";
import notificationService from "./src/utils/notificationService";
import { useTheme } from "./src/hooks/useTheme";
import { initializeNetworkListener } from "./src/utils/networkListener";
import NoInternet from "./src/components/noInternet";
import { NetworkStatus } from "./src/schemas/types";
import { setLastShownAt } from "./src/states/reducer/settingReducer";

const RenderRootStack = () => {
  const dispatch = useDispatch();
  const { scheme } = useTheme();

  const status = useSelector(
    (state: RootState) => state.networkReducer?.status,
  );
  const appreview = useSelector(
    (state: RootState) => state.settingReducer?.appreview,
  );

  const token = useSelector(
    (state: RootState) => state.authReducer?.userData?.token,
  );
  const isAffiliate = useSelector(
    (state: RootState) => state.authReducer?.userData?.isAffiliate,
  );

  useEffect(() => {
    getLocation();
    if (token) {
      socketServices.initializeSocket(token);
    }
  }, [token]);

  const getLocation = async () => {
    await requestLocationPermission();
  };

  useEffect(() => {
    handleInitPushNotificationsMethods();
  }, []);

  // Local notifications only: there is no remote push service any more.
  async function handleInitPushNotificationsMethods() {
    await notificationService.requestPermission();
    notificationService.registerNotificationEvents(navigationRef);
    notificationService.handleInitialNotification(navigationRef);
  }

  useEffect(() => {
    const unsubscribe = initializeNetworkListener();

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (appreview !== undefined && appreview?.lastShownAt === null) {
      dispatch(setLastShownAt(Date.now()));
    }
  }, [appreview]);

  const noInternet = status === NetworkStatus.OFFLINE;
  

  return (
    <AlertNotificationRoot theme={scheme === "dark" ? "dark" : "light"}>
      <NavigationContainer ref={navigationRef}>
        {noInternet ? <NoInternet /> : <RootStack />}

        {Platform.OS === "android" && (
          <StatusBar
            translucent={true}
            backgroundColor="transparent"
            barStyle={scheme === "light" ? "dark-content" : "light-content"}
          />
        )}
        {!isAffiliate && token && <LocationUpdateModal />}
      </NavigationContainer>
    </AlertNotificationRoot>
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <PersistGate loading={null} persistor={persistor}>
              <KeyboardProvider>
              <RenderRootStack />
              </KeyboardProvider>
            </PersistGate>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaProvider>
  );
}

export default withStallion(App);
