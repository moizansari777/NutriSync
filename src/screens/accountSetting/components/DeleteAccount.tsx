import React, { useCallback, useState } from "react";
import ICONS from "../../../assets/icons";
import ConfirmationAlert from "../../../components/customModals/ConfirmationAlert";
import MenuCard from "../../setting/components/MenuCard";
import { useNavigation } from "@react-navigation/native";
import { screens } from "../../../navigations/routes";
import { RootNavigationProp } from "../../../schemas/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../states/store/store";
import { errorAlert } from "../../../utils/alerts";
import { showConfirmAlert } from "../../../utils/showConfirmAlert";
import { Image, Platform, TouchableOpacity } from "react-native";
import { setUserAuthData } from "../../../states/reducer/authReducer";
import { useForegroundOnce } from "../../../hooks/useForegroundOnce";
import { activeOpacity } from "../../../constant";
import { useTheme } from "../../../hooks/useTheme";

const DeleteAccount = ({ getAccountsData }: { getAccountsData: any }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavigationProp>();
  const user = useSelector((state: RootState) => state.authReducer?.userData);

  const { colors } = useTheme();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const isSubscription = user?.user?.subscription
    ? user?.user?.subscription?.status === "active" &&
      user?.user?.subscription?.canceled_at !== null
    : true;

  const handleOnPressDeleteAccount = () => {
    if (!isSubscription) {
      errorAlert({
        title: "Active subscription found",
        body: "You can’t delete your account while you have an active subscription.",
      });
    } else {
      if (Platform.OS === "ios") {
        showConfirmAlert({
          title: "Delete Account!",
          tagLine: "Are you sure you want to delete your account?",
          handleOnDone: handleOnDone,
        });
      } else {
        setIsConfirmModalOpen(true);
      }
    }
  };

  const handleOnDone = () => {
    setIsConfirmModalOpen(false);
    navigation.navigate(screens.VERIFY_BY_PASSWORD_SCREEN);
  };

  const handleOnCloseInfoModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleOnGetUserAccount = useCallback(() => {
    getAccountsData(undefined)
      .then((payload: any) => {
        if (payload?.data) {
          dispatch(
            setUserAuthData({
              user: payload?.data?.user,
              token: user?.token || "",
              login: false,
              isAffiliate: user ? user?.isAffiliate : false,
            }),
          );
        }
      })
      .catch((error: any) => {});
  }, [dispatch, getAccountsData, user?.token]);

  useForegroundOnce(async () => {
    handleOnGetUserAccount();
  });

  return (
    <>
      <MenuCard
        iconName={ICONS.delete}
        title="Delete Account"
        handlePress={handleOnPressDeleteAccount}
        isDisable={!isSubscription}
        renderExtraUI={
          <TouchableOpacity
            onPress={handleOnGetUserAccount}
            activeOpacity={activeOpacity}
            style={{ marginRight: 10 }}
          >
            <Image
              source={ICONS.retake}
              style={{ height: 20, width: 20 }}
              tintColor={colors.HEADING}
            />
          </TouchableOpacity>
        }
      />
      <ConfirmationAlert
        isModalOpen={isConfirmModalOpen}
        title="Delete Account!"
        tagLine="Are you sure you want to delete your account?"
        buttonTitle="Yes"
        handleOnClose={handleOnCloseInfoModal}
        handleOnDone={handleOnDone}
      />
    </>
  );
};

export default DeleteAccount;
