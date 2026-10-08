import { View, Image, Switch, Alert, Linking } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../setting/styles";
import ICONS from "../../../assets/icons";
import { COLORS } from "../../../macros/colors";
import { RootState } from "../../../states/store/store";
import { setUserAuthData } from "../../../states/reducer/authReducer";
import notificationService from "../../../utils/notificationService";
import { useEnablePushNtificationMutation } from "../../../services/logsTDEEServices";
import { getError } from "../../../utils/errors";
import { errorAlert } from "../../../utils/alerts";
import { useForegroundOnce } from "../../../hooks/useForegroundOnce";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const PushNotifications = () => {
  const dispatch = useDispatch();
  const { colors, scheme } = useTheme();
  const user = useSelector((state: RootState) => state.authReducer?.userData);

  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] = useState(
    user?.user?.push_notifications_enabled
      ? user?.user?.push_notifications_enabled
      : false,
  );

  const [enablePushNotification] = useEnablePushNtificationMutation();

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await notificationService.requestPermission();
      setIsPermissionGranted(granted);
    };
    checkPermission();
  }, []);

  useForegroundOnce(async () => {
    const granted = await notificationService.requestPermission();
    setIsPermissionGranted(granted);
    if (!granted) {
      setIsPushNotificationEnabled(false);
      handleUpdateAPI(false);
    } else {
      if (isPushNotificationEnabled) {
        handleUpdateAPI(true);
        setIsPushNotificationEnabled(true);
      }
    }
  });

  const toggleSwitch = async (value: any) => {
    const granted = await notificationService.requestPermission();
    if (!granted) {
      Alert.alert(
        "Enable Notifications",
        "Please enable notifications from settings",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    } else {
      setIsPushNotificationEnabled(value);
      handleUpdateAPI(value);
    }
  };

  const handleUpdateAPI = (value: boolean) => {
    enablePushNotification({ push_notifications_enabled: value })
      .unwrap()
      .then(() => {
        if (!user) return;
        dispatch(
          setUserAuthData({
            user: {
              ...user?.user,
              push_notifications_enabled: value,
            },
            token: user?.token || "",
            login: false,
            isAffiliate: user ? user?.isAffiliate : false,
          }),
        );
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({
          body: errorMessage || "Something went wrong, please try again",
        });
        setIsPushNotificationEnabled(false);
      });
  };

  return (
    <View
      style={[
        styles.rowView,
        { paddingRight: 15, borderBottomColor: colors.BORDER_COLOR },
      ]}
    >
      <View style={styles.view}>
        <Image
          source={ICONS.bell}
          style={styles.icon}
          tintColor={colors.TEXT}
        />
        <View>
          <AppText
            allowFontScaling={false}
            style={[styles.title, { color: colors.HEADING }]}
          >
            Push Notifications
          </AppText>
          <AppText
            allowFontScaling={false}
            style={[
              styles.description,
              { color: isPermissionGranted ? "green" : "red" },
            ]}
          >
            {isPermissionGranted ? "Permission Granted" : "Permission Denied"}
          </AppText>
        </View>
      </View>
      <Switch
        trackColor={{ false: "#cccccc", true: COLORS.GREEN }}
        thumbColor={COLORS.WHITE}
        onValueChange={toggleSwitch}
        value={isPushNotificationEnabled}
       
      />
    </View>
  );
};

export default memo(PushNotifications);
