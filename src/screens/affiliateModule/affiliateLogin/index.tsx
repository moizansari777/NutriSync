import {
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { FC, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import { RootStackParamList, screens } from "../../../navigations/routes";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import CustomButton from "../../../components/buttons";
import { EMAIL_RULES, PASSWORD_RULES } from "../../../utils/validationRules";
import ICONS from "../../../assets/icons";
import { activeOpacity } from "../../../constant";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { getError } from "../../../utils/errors";
import {
  setAffiliateRememberMeInfo,
  setUserAuthData,
} from "../../../states/reducer/authReducer";
import AuthScreenWrapper from "../../auth/components/AuthScreenWrapper";
import RememberMe from "../../auth/login/components/RememberMe";
import { useAffiliateUserLoginMutation } from "../../../services/affiliateServices/affiliateAuthServices";
import { RootState } from "../../../states/store/store";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.AFFILIATE_LOGIN_SCREEN
>;

const AffiliateLogin: FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [affiliateUserLogin, { isLoading }] = useAffiliateUserLoginMutation();

  const isAffiliateRememberMeEnabled = useSelector(
    (state: RootState) => state.authReducer?.isAffiliateRememberMeEnabled,
  );
  const rememberMeAffiliateInfo = useSelector(
    (state: RootState) => state.authReducer?.rememberMeAffiliateInfo,
  );

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      email: isAffiliateRememberMeEnabled
        ? rememberMeAffiliateInfo?.email || ""
        : "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    Keyboard.dismiss();
    const { email, password } = data;

    affiliateUserLogin({
      email: email.toLowerCase(),
      password,
      remember_me: isAffiliateRememberMeEnabled ?? false,
    })
      .unwrap()
      .then(async payload => {
        successAlert({ body: "Welcome back! You've signed in." });
        dispatch(
          setUserAuthData({
            user: payload?.user,
            token: payload.token,
            login: true,
            isAffiliate: true,
          }),
        );
        if (isAffiliateRememberMeEnabled) {
          dispatch(
            setAffiliateRememberMeInfo({
              email: email.toLowerCase(),
            }),
          );
        } else {
          dispatch(
            setAffiliateRememberMeInfo({
              email: "",
            }),
          );
        }

        reset({
          password: "",
        });
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

  return (
    <AuthScreenWrapper
      heading="Affiliate Login"
      isBack={true}
    >
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
          <RememberMe isAffiliate={true} />
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={goToForgotPasswordScreen}
            testID="forgot_password_id"
          >
            <AppText allowFontScaling={false} style={[styles.loginText, styles.underLine,{color:colors.TEXT}]}>
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
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default AffiliateLogin;
