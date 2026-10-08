import { View, Keyboard } from "react-native";
import React, { FC, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "./styles";
import { RootStackParamList, screens } from "../../navigations/routes";
import ScreenWrapper from "../../components/screenWrapper";
import CustomTextInput from "../../components/forms/CustomTextInput";
import { EMAIL_RULES, REQUIRED_RULE } from "../../utils/validationRules";
import ICONS from "../../assets/icons";
import CustomButton from "../../components/buttons";
import { errorAlert, successAlert } from "../../utils/alerts";
import { getError } from "../../utils/errors";
import { useUpdateUserInfoMutation } from "../../services/profileServices";
import { RootState } from "../../states/store/store";
import {
  setUserAuthData,
  setUserCountry,
} from "../../states/reducer/authReducer";
import RenderCountry from "./components/RenderCountry";
import KeyboardController from "../../components/keyboardController";
import CustomPhoneInput from "../../components/customPhoneInput";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../../components/appText";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.ACCOUNTS_SCREEN
>;

const Accounts: FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const phoneRef = useRef<any>(null);

  const user = useSelector((state: RootState) => state.authReducer?.userData);
  const selectedCountry = useSelector(
    (state: RootState) => state.authReducer?.selectedCountry,
  );

  const [updateUserInfo, { isLoading }] = useUpdateUserInfoMutation();

  const { control, handleSubmit, watch, setValue, setError, clearErrors } =
    useForm({
      mode: "onChange",
      defaultValues: {
        first_name: user?.user?.first_name || "",
        last_name: user?.user?.last_name || "",
        email: user?.user?.email || "",
        phone_number: user?.user?.phone_number || "",
      },
    });

  const onSubmit = async (data: {
    first_name: string;
    last_name: string;
    phone_number: string;
  }) => {
    Keyboard.dismiss();

    let prevValues = {
      first_name: user?.user?.first_name,
      last_name: user?.user?.last_name,
      country: user?.user?.country,
      phone_number: user?.user?.phone_number,
    };

    let newValues = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      country: selectedCountry?.code
        ? selectedCountry?.code
        : user?.user?.country,
      phone_number: phoneRef.current?.fullNumber || data?.phone_number,
    };

    if (JSON.stringify(prevValues) === JSON.stringify(newValues)) {
      errorAlert({ body: "You haven't made any changes to update" });
      return;
    }

    updateUserInfo({
      user: newValues,
    })
      .unwrap()
      .then(async payload => {
        successAlert({ body: "Profile has been updated successfully" });
        navigation.goBack();
        dispatch(
          setUserAuthData({
            user: payload?.user,
            token: user?.token || "",
            login: false,
          }),
        );
        dispatch(setUserCountry(null));
        phoneRef.current = null;
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Accounts">
      <KeyboardController>
        <View style={styles.container}>
          <CustomTextInput
            name="first_name"
            label="First Name"
            placeholder={user?.user?.first_name || ""}
            control={control}
            isLoading={false}
            rules={REQUIRED_RULE}
            iconName={ICONS.user}
          />
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="last_name"
              label="Last Name"
              placeholder={user?.user?.last_name || ""}
              control={control}
              isLoading={false}
              rules={REQUIRED_RULE}
              iconName={ICONS.user}
            />
          </View>
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="email"
              label="Email"
              placeholder={user?.user?.email || ""}
              control={control}
              isLoading={true}
              rules={EMAIL_RULES}
              iconName={ICONS.email}
            />
            <AppText allowFontScaling={false} style={[styles.cannotText, { color: colors.TEXT }]}>
              You cannot change your email
            </AppText>
          </View>
          <View style={styles.topInputMargin}>
            <RenderCountry />
          </View>
          <View style={styles.topInputMargin}>
            <CustomPhoneInput
              user={user}
              control={control}
              watch={watch}
              setValue={setValue}
              setError={setError}
              clearErrors={clearErrors}
              phoneRef={phoneRef}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Save Changes"
              isLoading={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </KeyboardController>
    </ScreenWrapper>
  );
};

export default Accounts;
