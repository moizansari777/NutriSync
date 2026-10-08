import { Platform } from "react-native";
import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../navigations/routes";
import ScreenWrapper from "../../components/screenWrapper";
import RenderMainUI from "./components/RenderMainUI";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.INFO_STEPS_SCREEN
>;

const InfoSteps: FC<Props> = ({ navigation }) => {
  return (
    <>
      {Platform.OS === "android" ? (
        <ScreenWrapper hasTitle={true} title="" isClose={true} isBack={true}>
          <RenderMainUI />
        </ScreenWrapper>
      ) : (
        <RenderMainUI />
      )}
    </>
  );
};

export default InfoSteps;
