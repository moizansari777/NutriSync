import { View, Text } from "react-native";
import React, { FC } from "react";
import ScreenWrapper from "../../../../components/screenWrapper";
import InputsForm from "../coachNotesLogged/components/InputsForm";
import styles from "../homeCoach/styles";
import { RootStackParamList, screens } from "../../../../navigations/routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.CLIENT_EMAIL_SCREEN
>;

const CoachEmail: FC<Props> = ({ route }) => {
  const clientId = route.params?.clientId;
  const { colors } = useTheme();

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Email Message">
      <AppText allowFontScaling={false} style={[styles.tagLine, styles.tagMargin, { color: colors.TEXT }]}>
        Send a reminder, tip, or encouragement to this client by email.
      </AppText>
      <InputsForm isNotes={false} clientId={clientId} />
    </ScreenWrapper>
  );
};

export default CoachEmail;
