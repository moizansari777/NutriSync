import { AppState, Linking } from "react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import MenuCard from "../../setting/components/MenuCard";
import ICONS from "../../../assets/icons";
import CustomModal from "../../../components/customModals/CustomModal";
import { RootNavigationProp, UserDataProps } from "../../../schemas/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../states/store/store";
import { SERVER_URL } from "../../../config";
import { setUserAuthData } from "../../../states/reducer/authReducer";
import { successAlert } from "../../../utils/alerts";
import { screens } from "../../../navigations/routes";
import { useNavigation } from "@react-navigation/native";
import ConfirmationAlert from "../../../components/customModals/ConfirmationAlert";
import { COLORS } from "../../../macros/colors";

const MemberShipBilling = ({ getAccountsData }: { getAccountsData: any }) => {
  const appState = useRef(AppState.currentState);
  const userLatestObj = useRef<UserDataProps | null>(null);
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavigationProp>();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.authReducer?.userData);

  const _URL = `${SERVER_URL}products?token=${user?.token}`;

  const handleOnDone = useCallback(() => {
    if (userLatestObj?.current) {
      dispatch(
        setUserAuthData({
          user: userLatestObj?.current || null,
          token: user?.token || "",
          login: false,
        }),
      );
      successAlert({
        body: "You’ve successfully subscribed! Enjoy your access.",
      });
      navigation.replace(screens.MAIN_SCREEN_STACK, {
        screen: screens.BOTTOM_TAB_STACK,
        params: {
          screen: screens.CHAT_SCREEN,
        },
      });
    }
  }, [dispatch, navigation, user?.token]);

  const handleGetAccount = useCallback(() => {
    getAccountsData(undefined)
      .then((payload: any) => {
        userLatestObj.current = payload?.data?.user;

        if (payload?.data?.user?.subscription) {
          userLatestObj.current = payload?.data?.user;
          setOpenModal(true);
        }
      })
      .catch((error: any) => {});
  }, [getAccountsData]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (!user?.user?.subscription) {
          handleGetAccount();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [handleGetAccount, user?.user?.subscription]);

  const handleOnPressSubscription = () => {
    setShowConfirm(true);
  };

  const handleOnClose = () => {
    setShowConfirm(false);
  };

  const handleConfirmDone = () => {
    Linking.openURL(_URL);
    setShowConfirm(false);
  };

  return (
    <>
      <MenuCard
        iconName={ICONS.web}
        title="Membership & Billing"
        handlePress={handleOnPressSubscription}
      />
      <CustomModal
        isModalOpen={openModal}
        title="Success!"
        tagLine="Your action was completed successfully."
        handleOnClose={() => {}}
        handleOnDone={handleOnDone}
      />
      <ConfirmationAlert
        isModalOpen={showConfirm}
        title="NutriSync Website"
        tagLine="Tap Go to continue on our website."
        handleOnClose={handleOnClose}
        handleOnDone={handleConfirmDone}
        buttonTitle="Go"
        yesButtonColor={COLORS.GREEN}
      />
    </>
  );
};

export default memo(MemberShipBilling);
