import { View, Text, TextInput, Pressable, Keyboard } from "react-native";
import React, { FC, use, useRef } from "react";
import { useForm } from "react-hook-form";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import styles from "./styles";
import AuthScreenWrapper from "../components/AuthScreenWrapper";
import { RootStackParamList, screens } from "../../../navigations/routes";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import CustomButton from "../../../components/buttons";
import {
  EMAIL_RULES,
  REQUIRED_RULE,
  SIGNUP_PASSWORD_RULES,
} from "../../../utils/validationRules";
import ICONS from "../../../assets/icons";
import { useUserSignupMutation } from "../../../services/authService";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { getError } from "../../../utils/errors";
import { setUserAuthData } from "../../../states/reducer/authReducer";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = NativeStackScreenProps<RootStackParamList, screens.SIGNUP_SCREEN>;

const SignUp: FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [userSignup, { isLoading }] = useUserSignupMutation();

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    Keyboard.dismiss();
    const { first_name, last_name, email, password } = data;

    userSignup({ first_name, last_name, email: email.toLowerCase(), password })
      .unwrap()
      .then(async payload => {
        successAlert({ body: "Account has been created successfully" });
        dispatch(
          setUserAuthData({
            user: payload?.user,
            token: payload.token,
            login: true,
          }),
        );
        reset({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        });
        navigation.navigate(screens.LOGIN_SCREEN);
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleOnFocusNextInput = (index: number) => {
    if (inputRefs?.current) {
      inputRefs.current[index]?.focus();
    }
  };

  const goToLoginScreen = () => {
    navigation.navigate(screens.LOGIN_SCREEN);
  };

  return (
    <AuthScreenWrapper heading="Sign Up">
      <View testID="signup_screen">
        <CustomTextInput
          inputRef={(ref: TextInput | null) => (inputRefs.current[0] = ref)}
          name="first_name"
          testID="signup_name_id"
          label="First Name"
          placeholder="Enter your first name"
          control={control}
          isLoading={false}
          rules={REQUIRED_RULE}
          returnKeyType="next"
          onSubmitEditing={() => handleOnFocusNextInput(1)}
          iconName={ICONS.user}
        />
        <View style={styles.topInputMargin}>
          <CustomTextInput
            inputRef={(ref: TextInput | null) => (inputRefs.current[1] = ref)}
            name="last_name"
            testID="signup_name_id"
            label="Last Name"
            placeholder="Enter your last name"
            control={control}
            isLoading={false}
            rules={REQUIRED_RULE}
            returnKeyType="next"
            onSubmitEditing={() => handleOnFocusNextInput(2)}
            iconName={ICONS.user}
          />
        </View>
        <View style={styles.topInputMargin}>
          <CustomTextInput
            inputRef={(ref: TextInput | null) => (inputRefs.current[2] = ref)}
            name="email"
            testID="signup_email_id"
            label="Email"
            placeholder="Enter your email address"
            control={control}
            isLoading={false}
            rules={EMAIL_RULES}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => handleOnFocusNextInput(3)}
            iconName={ICONS.email}
          />
        </View>
        <View style={styles.topInputMargin}>
          <CustomTextInput
            inputRef={(ref: TextInput | null) => (inputRefs.current[3] = ref)}
            name="password"
            testID="signup_password_id"
            label="Password"
            placeholder="Enter your password"
            control={control}
            isLoading={false}
            rules={SIGNUP_PASSWORD_RULES}
            iconName={ICONS.lock}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Continue"
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
            testID="signup_button_id"
          />
          <View style={styles.forgotTextContainer}>
            <AppText allowFontScaling={false} style={[styles.haveAccountText, { color: colors.TEXT }]}>
              Already have an account?
            </AppText>
            <Pressable onPress={goToLoginScreen} testID="already_account_id">
              <AppText allowFontScaling={false} style={[styles.loginText, { color: colors.HEADING }]}>
                Sign in
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default SignUp;
