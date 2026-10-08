import { View, TextInput, Keyboard } from "react-native";
import React, { FC, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../navigations/routes";
import ScreenWrapper from "../../components/screenWrapper";
import CustomTextInput from "../../components/forms/CustomTextInput";
import { useForm } from "react-hook-form";
import {
  PASSWORD_RULES,
  SIGNUP_PASSWORD_RULES,
} from "../../utils/validationRules";
import ICONS from "../../assets/icons";
import styles from "./styles";
import CustomButton from "../../components/buttons";
import { errorAlert, successAlert } from "../../utils/alerts";
import { getError } from "../../utils/errors";
import { useUpdatePasswordMutation } from "../../services/profileServices";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.RESET_PASSWORD_SCREEN
>;

const ResetPassword: FC<Props> = ({ navigation }) => {
  const inputRef = useRef<TextInput>(null);
  const [changePassword, { isLoading }] = useUpdatePasswordMutation();

  const { control, handleSubmit, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }) => {
    Keyboard.dismiss();
    const { currentPassword, password, confirmPassword } = data;

    changePassword({
      user: {
        current_password: currentPassword,
        new_password: password,
        new_password_confirmation: confirmPassword,
      },
    })
      .unwrap()
      .then(async () => {
        successAlert({ body: "Password has been updated successfully" });
        reset({
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
        navigation.goBack();
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

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Change Password">
      <View style={styles.container}>
        <CustomTextInput
          inputRef={inputRef}
          name="currentPassword"
          label="Current Password"
          placeholder="Enter your current password"
          control={control}
          isLoading={false}
          onSubmitEditing={handleOnFocusNextInput}
          returnKeyType="next"
          rules={PASSWORD_RULES}
          iconName={ICONS.lock}
        />
        <View style={styles.topInputMargin}>
          <CustomTextInput
            inputRef={inputRef}
            name="password"
            label="New Password"
            placeholder="Enter your new password"
            control={control}
            isLoading={false}
            onSubmitEditing={handleOnFocusNextInput}
            returnKeyType="next"
            rules={SIGNUP_PASSWORD_RULES}
            iconName={ICONS.lock}
          />
        </View>
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
            title="Update Password"
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ResetPassword;
