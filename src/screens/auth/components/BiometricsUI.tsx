import { Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import * as Keychain from "react-native-keychain";
import ICONS from "../../../assets/icons";
import styles from "../login/styles";
import { activeOpacity } from "../../../constant";
import { COLORS } from "../../../macros/colors";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { setUserAuthData } from "../../../states/reducer/authReducer";
import { useDispatch } from "react-redux";
import AppText from "../../../components/appText";

const BiometricsUI = () => {
  const dispatch = useDispatch();

  const handlePressOnBiometrics = async () => {
    try {
      const supported = await Keychain.getSupportedBiometryType();
      if (!supported) {
        errorAlert({
          title: "Error",
          body: "Biometrics not available on this device.",
        });
        return;
      }

      const creds = await Keychain.getGenericPassword({
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
        authenticationPrompt: {
          title: "Biometric Login",
          subtitle: "Unlock your account",
          description: "Use fingerprint / Face ID to login",
        },
      });

      if (creds) {
        const data = JSON.parse(creds.password);
        successAlert({ body: "Welcome back! You've signed in." });
        dispatch(
          setUserAuthData({
            user: data?.user,
            token: data.token,
            login: true,
          }),
        );
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handlePressOnBiometrics}
      style={styles.biometricsView}
    >
      <Image
        source={ICONS.biometrics}
        style={styles.biometrics}
        tintColor={COLORS.TEXT}
      />
      <AppText allowFontScaling={false} style={styles.text}>Use Face ID / Touch ID to continue</AppText>
    </TouchableOpacity>
  );
};

export default BiometricsUI;
