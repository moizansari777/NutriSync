import React, { useState } from "react";
import { useDispatch } from "react-redux";
import MenuCard from "../../setting/components/MenuCard";
import ICONS from "../../../assets/icons";
import ConfirmationAlert from "../../../components/customModals/ConfirmationAlert";
import {
  logoutFromStore,
  setCanUseAI,
  setIsOnboarding,
  setUserCountry,
} from "../../../states/reducer/authReducer";
import { profileServices } from "../../../services/profileServices";
import { authService } from "../../../services/authService";
import { chatServices } from "../../../services/chatServices";
import { referralServices } from "../../../services/referralServices";
import socketServices from "../../../utils/socketIO";
import { setAllMessageList } from "../../../states/reducer/chatReducer";
import { setQueryCountData } from "../../../states/reducer/chatReducer";
import { logsTDEEServices } from "../../../services/logsTDEEServices";
import { resetLogInitialState } from "../../../states/reducer/logReducer";
import { resetFiletrsToInitialState } from "../../../states/reducer/filtersReducer";
import { Platform } from "react-native";
import { showConfirmAlert } from "../../../utils/showConfirmAlert";
import { coachServices } from "../../../services/affiliateServices/coachServices";
import { affiliateAuthServices } from "../../../services/affiliateServices/affiliateAuthServices";
import { affiliateServices } from "../../../services/affiliateServices/affiliateServices";
import { friendAccessServices } from "../../../services/friendAccessServices";

const HandleLogout = () => {
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const handleOnPressLogout = () => {
    if (Platform.OS === "ios") {
      showConfirmAlert({
        title: "Logout",
        tagLine: "Are you sure you want to logout?",
        handleOnDone: handleOnDone,
      });
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const handleOnDone = () => {
    setIsConfirmModalOpen(false);
    setTimeout(() => {
      dispatch(logoutFromStore());
      dispatch(setUserCountry(null));
      dispatch(setAllMessageList([]));
      dispatch(setIsOnboarding(true));
      dispatch(setQueryCountData(null));
      dispatch(setCanUseAI(false));
      dispatch(resetLogInitialState());
      dispatch(resetFiletrsToInitialState());
      handleClearAllAPIsSession();
      socketServices.disconnect();
    }, 100);
  };

  const handleClearAllAPIsSession = () => {
    dispatch(authService.util.resetApiState());
    dispatch(profileServices.util.resetApiState());
    dispatch(chatServices.util.resetApiState());
    dispatch(referralServices.util.resetApiState());
    dispatch(logsTDEEServices.util.resetApiState());
    dispatch(coachServices.util.resetApiState());
    dispatch(affiliateAuthServices.util.resetApiState());
    dispatch(affiliateServices.util.resetApiState());
    dispatch(friendAccessServices.util.resetApiState());
  };

  const handleOnCloseInfoModal = () => {
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      <MenuCard
        iconName={ICONS.logout}
        title="Logout"
        handlePress={handleOnPressLogout}
        hasBorder={false}
      />
      <ConfirmationAlert
        isModalOpen={isConfirmModalOpen}
        title="Logout"
        tagLine="Are you sure you want to logout?"
        buttonTitle="Yes"
        handleOnClose={handleOnCloseInfoModal}
        handleOnDone={handleOnDone}
      />
    </>
  );
};

export default HandleLogout;
