import { View, Keyboard } from "react-native";
import React, { FC, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import styles from "./styles";
import { RootStackParamList, screens } from "../../../navigations/routes";
import ICONS from "../../../assets/icons";
import AuthScreenWrapper from "../components/AuthScreenWrapper";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import CustomButton from "../../../components/buttons";
import { EMAIL_RULES } from "../../../utils/validationRules";
import CustomModal from "../../../components/customModals/CustomModal";
import { useForgotPasswordMutation } from "../../../services/authService";
import { getError } from "../../../utils/errors";
import { errorAlert } from "../../../utils/alerts";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.FORGOT_PASSWORD_SCREEN
>;

const ForgotPassword: FC<Props> = ({ navigation }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const { control, handleSubmit, getValues } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: { email: string }) => {
    Keyboard.dismiss();
    forgotPassword({ email: data?.email.toLowerCase(), otp_digit: 6 })
      .unwrap()
      .then(async () => {
        setIsSuccessModalOpen(true);
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleOnDone = () => {
    setIsSuccessModalOpen(false);
    const email = getValues("email");
    setTimeout(() => {
      navigation.navigate(screens.VERIFICATION_SCREEN, {
        email,
      });
    }, 50);
  };

  const handleOnCloseInfoModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <AuthScreenWrapper
      heading="Forgot Password?"
      isBack={true}
    >
      <View>
        <CustomTextInput
          name="email"
          label="Email"
          placeholder="Enter your email address"
          control={control}
          isLoading={false}
          rules={EMAIL_RULES}
          keyboardType="email-address"
          iconName={ICONS.email}
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Send"
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>

      <CustomModal
        isModalOpen={isSuccessModalOpen}
        title="Email Sent!"
        tagLine="Verification code has been sent to your email address. Please check email."
        handleOnClose={handleOnCloseInfoModal}
        handleOnDone={handleOnDone}
      />
    </AuthScreenWrapper>
  );
};

export default ForgotPassword;
