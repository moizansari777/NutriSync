import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  EventType,
} from "@notifee/react-native";
import { PermissionsAndroid, Platform } from "react-native";

class NotificationService {
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === "ios") {
      const settings = await notifee.requestPermission();
      return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
    }

    if (Platform.OS === "android") {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (granted) return true;

        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        return result === PermissionsAndroid.RESULTS.GRANTED;
      }

      return true;
    }

    return false;
  }

  async createAndroidChannel() {
    if (Platform.OS === "android") {
      await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
      });
    }
  }

  async displayNotification(
    remoteMessage: any,
  ) {
    await this.createAndroidChannel();

    await notifee.displayNotification({
      title:
        remoteMessage.notification?.title || remoteMessage.data?.title || "",
      body: remoteMessage.notification?.body || remoteMessage.data?.body || "",
      android: {
        channelId: "default",
        pressAction: {
          id: "default",
        },
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
      data: remoteMessage.data,
    });
  }

  registerNotificationEvents(navigationRef: any) {
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const data = detail.notification?.data;
        this.handleNavigation(data, navigationRef);
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        const data = detail.notification?.data;
        this.handleNavigation(data, navigationRef);
      }
    });
  }

  async handleInitialNotification(navigationRef: any) {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      const data = initialNotification.notification?.data;
      this.handleNavigation(data, navigationRef);
    }
  }

  handleNavigation(data: any, navigationRef: any) {
    if (!data?.screen) return;

    navigationRef.current?.navigate(data.screen, data);
  }
}

export default new NotificationService();
