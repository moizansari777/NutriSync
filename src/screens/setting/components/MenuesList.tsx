import React, { memo } from "react";
import MenuCard from "./MenuCard";
import ICONS from "../../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { screens } from "../../../navigations/routes";
import { RootNavigationProp } from "../../../schemas/types";
import {
  LIMIT_END_FLASH_BODY,
  LIMIT_END_FLASH_BODY_NTERNET,
  LIMIT_END_FLASH_TITLE,
  LIMIT_END_FLASH_TITLE_INTERNET,
} from "../../../constant";
import { useSelector } from "react-redux";
import { RootState } from "../../../states/store/store";
import { errorAlert } from "../../../utils/alerts";
import FeedbackAndRate from "./FeedbackAndRate";
import { useLazyGetCanUseAIWidthDispatchQuery } from "../../../services/profileServices";

const MenuesList = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const canUseAI = useSelector(
    (state: RootState) => state.authReducer?.canUseAI,
  );

  const [canUseAIAPI] = useLazyGetCanUseAIWidthDispatchQuery();

  // const handleOnPressFriendViewAccess = () => {
  //   if (canUseAI) {
  //     navigation.navigate(screens.CONTACTS_LIST_SCREEN);
  //   } else {
  //     errorAlert({
  //       title: LIMIT_END_FLASH_TITLE,
  //       body: LIMIT_END_FLASH_BODY,
  //     });
  //   }
  // };

  const handleOnPressReferrals = () => {
    if (canUseAI) {
      navigation.navigate(screens.REFERRALS_SCREEN);
    } else {
      canUseAIAPI({ shouldDispatch: true, canUseAI });
      errorAlert({
        title:
          canUseAI != undefined
            ? LIMIT_END_FLASH_TITLE
            : LIMIT_END_FLASH_TITLE_INTERNET,
        body:
          canUseAI != undefined
            ? LIMIT_END_FLASH_BODY
            : LIMIT_END_FLASH_BODY_NTERNET,
      });
    }
  };

  const handleOnPressHistory = () => {
    if (canUseAI) {
      navigation.navigate(screens.HISTORY_SCREEN);
    } else {
      errorAlert({
        title:
          canUseAI != undefined
            ? LIMIT_END_FLASH_TITLE
            : LIMIT_END_FLASH_TITLE_INTERNET,
        body:
          canUseAI != undefined
            ? LIMIT_END_FLASH_BODY
            : LIMIT_END_FLASH_BODY_NTERNET,
      });
    }
  };

  return (
    <>
      <FeedbackAndRate />

      <MenuCard
        iconName={ICONS.referral}
        title="Referrals"
        handlePress={handleOnPressReferrals}
        isDisable={!canUseAI}
      />
      {/* <MenuCard
        iconName={ICONS.referHome}
        title="Refer Friends"
        handlePress={handleOnPressFriendViewAccess}
        isDisable={!canUseAI}
      /> */}
      <MenuCard
        iconName={ICONS.historyIcon}
        title="History"
        handlePress={handleOnPressHistory}
        isDisable={!canUseAI}
        hasBorder={false}
      />
    </>
  );
};

export default memo(MenuesList);
