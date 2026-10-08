import React from "react";
import MenuCard from "./MenuCard";
import ICONS from "../../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "../../../schemas/types";
import { screens } from "../../../navigations/routes";

const FeedbackAndRate = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const handlePressOnFeedback = () => {
    navigation.navigate(screens.SEND_FEEDBACK_SCREEN);
  };

  return (
    <>
      <MenuCard
        iconName={ICONS.review}
        title="Feedback"
        handlePress={handlePressOnFeedback}
      />
    </>
  );
};

export default FeedbackAndRate;
