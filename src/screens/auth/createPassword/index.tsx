import { View, Text, TextInput, Pressable, Keyboard } from "react-native";
import React, { FC, useRef } from "react";
import AuthScreenWrapper from "../components/AuthScreenWrapper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../../navigations/routes";
import { useForm } from "react-hook-form";
import CustomTextInput from "../../../components/forms/CustomTextInput";

import CustomButton from "../../../components/buttons";
import { SIGNUP_PASSWORD_RULES } from "../../../utils/validationRules";
import ICONS from "../../../assets/icons";
import styles from "./styles";
import { useResetPasswordMutation } from "../../../services/authService";
import { getError } from "../../../utils/errors";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { setUserAuthData } from "../../../states/reducer/authReducer";
import { useDispatch } from "react-redux";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.CREATE_PASSWORD_SCREEN
>;

const CreatePassword: FC<Props> = ({ navigation, route }) => {
  const email = route.params?.email;
  const otp = route.params?.otp;

  const dispatch = useDispatch();
  const { colors } = useTheme();

  const inputRef = useRef<TextInput>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { control, handleSubmit, getValues } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    Keyboard.dismiss();
    resetPassword({
      email: email.toLowerCase(),
      otp,
      password: data?.password,
      password_confirmation: data?.confirmPassword,
    })
      .unwrap()
      .then(async payload => {
        successAlert({ body: "Welcome back! You've signed in." });
        dispatch(
          setUserAuthData({
            user: payload?.user,
            token: payload.token,
            login: true,
          }),
        );
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

  const goToLoginScreen = () => {
    navigation.navigate(screens.LOGIN_SCREEN);
  };

  return (
    <AuthScreenWrapper heading="Create New Password">
      <View>
        <CustomTextInput
          inputRef={inputRef}
          name="password"
          label="Password"
          placeholder="Enter your password"
          control={control}
          isLoading={false}
          onSubmitEditing={handleOnFocusNextInput}
          returnKeyType="next"
          rules={SIGNUP_PASSWORD_RULES}
          iconName={ICONS.lock}
        />
        <View style={styles.topInputMargin}>
          <CustomTextInput
            inputRef={inputRef}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Enter your confirm password"
            control={control}
            isLoading={false}
            rules={{
              ...SIGNUP_PASSWORD_RULES,
              validate: (value: string) => {
                const password = getValues("password");
                return value === password || "Passwords do not match";
              },
            }}
            iconName={ICONS.lock}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Create Password"
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
          <View style={styles.forgotTextContainer}>
            <AppText
              allowFontScaling={false}
              style={[styles.haveAccountText, { color: colors.TEXT }]}
            >{`Don't want to reset password?`}</AppText>
            <Pressable onPress={goToLoginScreen}>
              <AppText
                allowFontScaling={false}
                style={[styles.loginText, { color: colors.HEADING }]}
              >
                Signin
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default CreatePassword;
