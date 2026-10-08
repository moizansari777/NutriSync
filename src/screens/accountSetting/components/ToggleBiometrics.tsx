import { View, Image, Switch } from "react-native";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Keychain from "react-native-keychain";
import styles from "../../setting/styles";
import ICONS from "../../../assets/icons";
import { COLORS } from "../../../macros/colors";
import { setIsBiometricsEnabled } from "../../../states/reducer/authReducer";
import { RootState } from "../../../states/store/store";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const ToggleBiometrics = () => {
  const dispatch = useDispatch();
  const { colors, scheme } = useTheme();

  const userData = useSelector(
    (state: RootState) => state.authReducer?.userData,
  );
  const isBiometricsEnabled = useSelector(
    (state: RootState) => state.authReducer?.isBiometricsEnabled,
  );

  const toggleSwitch = async (value: any) => {
    if (value) {
      const isDataSaved = await saveBiometricCredentials();
      if (isDataSaved) {
        dispatch(setIsBiometricsEnabled(value));
        successAlert({ body: "Biometrics login has been enabled" });
      }
    } else {
      dispatch(setIsBiometricsEnabled(value));
      await Keychain.resetGenericPassword();
    }
  };

  const saveBiometricCredentials = async () => {
    try {
      await Keychain.setGenericPassword(
        "user",
        JSON.stringify({ token: userData?.token, user: userData?.user }),
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
          authenticationPrompt: {
            title: "Enable Biometric Login",
          },
        },
      );
      return true;
    } catch (error) {
      // console.log("Error saving credentials", error);
      errorAlert({
        title: "Error",
        body: "Biometric auth failed: User not authenticated",
      });
      return false;
    }
  };

  return (
    <View style={[styles.rowView, { borderBottomWidth: 0, paddingRight: 15 }]}>
      <View style={styles.view}>
        <Image
          source={ICONS.biometrics}
          style={styles.icon}
          tintColor={colors.TEXT}
        />
        <AppText
          allowFontScaling={false}
          style={[styles.title, { color: colors.HEADING }]}
        >
          Face ID / Touch ID
        </AppText>
      </View>

      <Switch
        trackColor={{ false: "#cccccc", true: COLORS.GREEN }}
        thumbColor={COLORS.WHITE}
        onValueChange={toggleSwitch}
        value={isBiometricsEnabled}
      />
    </View>
  );
};

export default memo(ToggleBiometrics);
