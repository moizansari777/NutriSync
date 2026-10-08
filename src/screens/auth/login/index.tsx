import { View, TextInput, Keyboard, TouchableOpacity } from "react-native";
import React, { FC, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import { RootStackParamList, screens } from "../../../navigations/routes";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import AuthScreenWrapper from "../components/AuthScreenWrapper";
import CustomButton from "../../../components/buttons";
import { EMAIL_RULES, PASSWORD_RULES } from "../../../utils/validationRules";
import ICONS from "../../../assets/icons";
import { activeOpacity } from "../../../constant";
import { useUserLoginMutation } from "../../../services/authService";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { getError } from "../../../utils/errors";
import {
  setRememberMeInfo,
  setUserAuthData,
} from "../../../states/reducer/authReducer";
import { openURL } from "../../../utils/openURL";
import RememberMe from "./components/RememberMe";
import { RootState } from "../../../states/store/store";
import LoginText from "./components/LoginText";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";
import NoActiveSubscriptionModal from "../../../components/noActiveSubscriptionModal";

type Props = NativeStackScreenProps<RootStackParamList, screens.LOGIN_SCREEN>;

const Login: FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [planURL, setPlanURL] = useState<string>("");
  const [userLogin, { isLoading }] = useUserLoginMutation();

  const isBiometricsEnabled = useSelector(
    (state: RootState) => state.authReducer?.isBiometricsEnabled,
  );
  const isRememberMeEnabled = useSelector(
    (state: RootState) => state.authReducer?.isRememberMeEnabled,
  );
  const rememberMeInfo = useSelector(
    (state: RootState) => state.authReducer?.rememberMeInfo,
  );

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      email: isRememberMeEnabled ? rememberMeInfo?.email || "" : "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    Keyboard.dismiss();
    const { email, password } = data;

    userLogin({
      email: email.toLowerCase(),
      password,
      remember_me: isRememberMeEnabled ?? false,
    })
      .unwrap()
      .then(async payload => {
        if (payload?.subscription) {
          successAlert({ body: "Welcome back! You've signed in." });
          dispatch(
            setUserAuthData({
              user: payload?.user,
              token: payload.token,
              login: true,
              isAffiliate: false,
            }),
          );
          if (isRememberMeEnabled) {
            dispatch(
              setRememberMeInfo({
                email: email.toLowerCase(),
              }),
            );
          } else {
            dispatch(
              setRememberMeInfo({
                email: "",
              }),
            );
          }

          reset({
            password: "",
          });
        } else {
          setIsVisible(true);
          setPlanURL(payload?.plans_url);
        }
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleOnFocusNextInput = () => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const goToForgotPasswordScreen = () => {
    navigation.navigate(screens.FORGOT_PASSWORD_SCREEN);
  };

  const goToSignUp = () => {
    navigation.navigate(screens.SIGNUP_SCREEN);
  };

  return (
    <AuthScreenWrapper
      heading="Login"
      hasBiometrics={isBiometricsEnabled ?? false}
      rightUI={<LoginText />}
    >
      <NoActiveSubscriptionModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        planURL={planURL}
      />
      <View testID="login_screen">
        <CustomTextInput
          testID="email_id"
          name="email"
          label="Email"
          placeholder="Enter your email address"
          control={control}
          isLoading={false}
          rules={EMAIL_RULES}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={handleOnFocusNextInput}
          iconName={ICONS.email}
        />
        <View style={styles.topInputMargin}>
          <CustomTextInput
            testID="password_id"
            inputRef={inputRef}
            name="password"
            label="Password"
            placeholder="Enter your password"
            control={control}
            isLoading={false}
            rules={PASSWORD_RULES}
            iconName={ICONS.lock}
          />
        </View>
        <View style={styles.forGotView}>
          <RememberMe />
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={goToForgotPasswordScreen}
            testID="forgot_password_id"
          >
            <AppText
              allowFontScaling={false}
              style={[
                styles.loginText,
                styles.underLine,
                { color: colors.TEXT },
              ]}
            >
              Forgot Password?
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Continue"
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
            testID="login_button_id"
          />
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={goToSignUp}
            style={styles.newText}
          >
            <AppText
              allowFontScaling={false}
              style={[styles.haveAccountText, { color: colors.TEXT }]}
            >
              {`Don't have an account?`}{" "}
              <AppText
                style={[
                  styles.loginText,
                  styles.underLine,
                  { color: colors.TEXT },
                ]}
              >
                Visit our website to create one.
              </AppText>
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default Login;
