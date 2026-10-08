import { View, Keyboard, Platform } from "react-native";
import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../navigations/routes";
import { useForm } from "react-hook-form";
import ScreenWrapper from "../../components/screenWrapper";
import CustomTextInput from "../../components/forms/CustomTextInput";
import KeyboardController from "../../components/keyboardController";
import CustomButton from "../../components/buttons";
import styles from "./styles";
import DeviceInfo from "react-native-device-info";
import { BUILD_NUMBER, BUILD_VERSION, ENVIRONMENT } from "../../config";
import { useSelector } from "react-redux";
import { RootState } from "../../states/store/store";
import { useSendFeedbackAPIMutation } from "../../services/profileServices";
import { getError } from "../../utils/errors";
import { errorAlert, successAlert } from "../../utils/alerts";
import { MESSAGE_RULES } from "../../utils/validationRules";

const MESSAGE_MAX_LENGTH = 2000;

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.SEND_FEEDBACK_SCREEN
>;

const SendFeedback: FC<Props> = ({ navigation }) => {
  const user = useSelector(
    (state: RootState) => state.authReducer?.userData?.user,
  );

  const [sendFeedback, { isLoading }] = useSendFeedbackAPIMutation();

  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      subject: "App Feedback / Support Request",
      message: "",
    },
  });

  const onSubmit = async (data: { subject: string; message: string }) => {
    Keyboard.dismiss();

    const message = `
Dear Support Team,

I hope this message finds you well. My name is ${user?.first_name} ${
      user?.last_name ?? ""
    }, and I am writing to share feedback regarding my experience with the NutriSync App.

    
MESSAGE
${data?.message}


DEVICE & APP INFORMATION
  • Device:       ${DeviceInfo.getModel()}
  • OS:           ${Platform.OS} ${DeviceInfo.getSystemVersion()}
  • App Version:  ${BUILD_VERSION}(${BUILD_NUMBER})
  • Environment:  ${ENVIRONMENT}


Thank you for taking the time to review my feedback. I look forward to hearing from you.

Best regards,
${user?.email}
${user?.first_name} ${user?.last_name ?? ""}
    `.trim();

    sendFeedback({ message })
      .unwrap()
      .then(async payload => {
        successAlert({
          body: payload.message || "",
        });
        navigation.goBack();
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Send Feedback">
      <KeyboardController>
        <View style={styles.container}>
          <CustomTextInput
            name="subject"
            label="Subject"
            placeholder="Subject"
            control={control}
            isLoading={true}
            rules={{}}
          />
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="message"
              label="Message"
              type="textarea"
              placeholder="Message"
              control={control}
              isLoading={false}
              rules={MESSAGE_RULES}
              maxLength={MESSAGE_MAX_LENGTH}
              showCharCount={true}
              customStyle={{
                borderRadius: 20,
                maxHeight:475
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Send"
              isLoading={isLoading}
              isDisabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </KeyboardController>
    </ScreenWrapper>
  );
};

export default SendFeedback;
