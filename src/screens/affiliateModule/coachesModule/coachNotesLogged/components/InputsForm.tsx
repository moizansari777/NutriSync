import { View, Text, Keyboard } from "react-native";
import React from "react";
import CustomTextInput from "../../../../../components/forms/CustomTextInput";
import { useForm } from "react-hook-form";
import { REQUIRED_RULE } from "../../../../../utils/validationRules";
import styles from "../../homeCoach/styles";
import CustomButton from "../../../../../components/buttons";
import {
  useSaveCoachNotesMutation,
  useSendCoachMessageMutation,
} from "../../../../../services/affiliateServices/coachServices";
import { errorAlert, successAlert } from "../../../../../utils/alerts";
import { getError } from "../../../../../utils/errors";
import { useNavigation } from "@react-navigation/native";

const InputsForm = ({
  isNotes,
  clientId,
}: {
  isNotes: boolean;
  clientId: number;
}) => {
  const navigation = useNavigation();
  const [sendMessage, { isLoading }] = useSendCoachMessageMutation();
  const [saveNotes, { isLoading: savingNotes }] = useSaveCoachNotesMutation();

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      body: "",
    },
  });

  const onSubmit = async (data: { body: string }) => {
    Keyboard.dismiss();

    if (isNotes) {
      saveNotes({ data, clientId })
        .unwrap()
        .then(async payload => {
          successAlert({ body: "Notes has been saved" });
          reset({
            body: "",
          });
        })
        .catch(error => {
          const errorMessage = getError(error);
          errorAlert({ body: errorMessage || "" });
        });
    } else {
      sendMessage({ data: { message: data?.body }, clientId })
        .unwrap()
        .then(async payload => {
          successAlert({ body: "Message has been sent" });
          navigation.goBack();
          reset({
            body: "",
          });
        })
        .catch(error => {
          const errorMessage = getError(error);
          errorAlert({ body: errorMessage || "" });
        });
    }
  };

  return (
    <View style={styles.feedView}>
      <View style={{ height: 185 }}>
        <CustomTextInput
          name="body"
          label=""
          type="textarea"
          placeholder="Write here..."
          control={control}
          isLoading={false}
          rules={REQUIRED_RULE}
          mainStyle={{ flex: 1, borderRadius: 10 }}
          customStyle={{ borderRadius: 20 }}
        />
      </View>
      <CustomButton
        title="Save"
        onPress={handleSubmit(onSubmit)}
        isLoading={isNotes ? savingNotes : isLoading}
      />
    </View>
  );
};

export default InputsForm;
