import { View, Keyboard, Text, TouchableOpacity } from "react-native";
import React, { FC, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styles from "./styles";
import AuthScreenWrapper from "../components/AuthScreenWrapper";
import { RootStackParamList, screens } from "../../../navigations/routes";
import CustomButton from "../../../components/buttons";
import { activeOpacity } from "../../../constant";
import OtpInput from "../components/OTPInput";
import {
  useResendOTPMutation,
  useVerifyOTPMutation,
} from "../../../services/authService";
import { getError } from "../../../utils/errors";
import { errorAlert } from "../../../utils/alerts";
import { useTimer } from "../../../hooks/useTimer";
import LoadingIndicator from "../../../components/loaders/LoadingIndicator";
import { COLORS } from "../../../macros/colors";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.VERIFICATION_SCREEN
>;

const Verification: FC<Props> = ({ navigation, route }) => {
  const email = route?.params?.email;
  const { colors } = useTheme();
  const otpValue = useRef<string>("");
  const [otpVerification, { isLoading }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResendingOTP }] = useResendOTPMutation();
  const { isRunning, formattedTime, startTimer } = useTimer(60); // Pass any duration in seconds

  const handleOtpChange = (code: string) => {
    otpValue.current = code;
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    if (otpValue?.current && otpValue?.current?.length > 5) {
      otpVerification({ email: email.toLowerCase(), otp: otpValue?.current })
        .unwrap()
        .then(async () => {
          navigation.replace(screens.CREATE_PASSWORD_SCREEN, {
            email,
            otp: otpValue?.current,
          });
        })
        .catch(error => {
          const errorMessage = getError(error);
          errorAlert({ body: errorMessage || "" });
        });
    }
  };

  const handleResendOTP = async () => {
    resendOTP({ email: email.toLowerCase(), otp_digit:6 })
      .unwrap()
      .then(async () => {
        startTimer();
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  return (
    <AuthScreenWrapper
      heading="OTP Verification"
      subHeading={`Enter the verification code you\nreceived via email.`}
      isBack={true}
    >
      <View>
        <OtpInput digits={6} onChangeOtp={handleOtpChange} />
        <View style={styles.resentView}>
          {isResendingOTP ? (
            <LoadingIndicator color={COLORS.TEXT} />
          ) : (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={handleResendOTP}
              disabled={isRunning}
            >
              {isRunning ? (
                <AppText
                  allowFontScaling={false}
                  style={[styles.otpText, { color: colors.TEXT }]}
                >
                  Resend OTP in:{" "}
                  <AppText allowFontScaling={false} style={styles.boldText}>
                    {formattedTime}
                  </AppText>
                </AppText>
              ) : (
                <AppText
                  allowFontScaling={false}
                  style={[styles.otpText, { color: colors.TEXT }]}
                >
                  Did not receive OTP?{" "}
                  <AppText allowFontScaling={false} style={styles.boldText}>
                    Resend OTP
                  </AppText>
                </AppText>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="Verify" isLoading={isLoading} onPress={onSubmit} />
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default Verification;
