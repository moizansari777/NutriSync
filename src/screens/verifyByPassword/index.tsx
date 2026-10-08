import { View, Keyboard } from "react-native";
import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList, screens } from "../../navigations/routes";
import CustomTextInput from "../../components/forms/CustomTextInput";
import { REQUIRED_RULE } from "../../utils/validationRules";
import ICONS from "../../assets/icons";
import styles from "../resetPassword/styles";
import CustomButton from "../../components/buttons";
import { getError } from "../../utils/errors";
import { errorAlert, successAlert } from "../../utils/alerts";
import {
  profileServices,
  useDeleteAccountMutation,
  useVerifyByPasswordMutation,
} from "../../services/profileServices";
import { RootState } from "../../states/store/store";
import ScreenWrapper from "../../components/screenWrapper";
import {
  logoutFromStore,
  setCanUseAI,
  setIsOnboarding,
  setUserCountry,
} from "../../states/reducer/authReducer";
import {
  setAllMessageList,
  setQueryCountData,
} from "../../states/reducer/chatReducer";
import { resetLogInitialState } from "../../states/reducer/logReducer";
import { authService } from "../../services/authService";
import {
  chatServices,
  useLazyGetPlanURLQuery,
} from "../../services/chatServices";
import { referralServices } from "../../services/referralServices";
import { logsTDEEServices } from "../../services/logsTDEEServices";
import socketServices from "../../utils/socketIO";
import PositionedLoader from "../../components/loaders/PositionedLoader";
import { coachServices } from "../../services/affiliateServices/coachServices";
import { friendAccessServices } from "../../services/friendAccessServices";
import { openURL } from "../../utils/openURL";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.VERIFY_BY_PASSWORD_SCREEN
>;

const VerifyByPassword: FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authReducer?.userData);

  const [verifyPasswordAPI, { isLoading }] = useVerifyByPasswordMutation();
  const [deleteUserAccount, { isLoading: isAccountDeleting }] =
    useDeleteAccountMutation();
  const [planURL, { isLoading: isGettingURL }] = useLazyGetPlanURLQuery();

  const isSubscription = user?.user?.subscription
    ? user?.user?.subscription?.status === "active" &&
      user?.user?.subscription?.canceled_at !== null
    : true;

  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: { password: string }) => {
    Keyboard.dismiss();

    verifyPasswordAPI({
      password: data?.password,
    })
      .unwrap()
      .then(async payload => {
        if (payload?.valid) {
          if (!isSubscription) {
            openURL(payload?.authenticated_plans_url);
          } else {
            handleDelete();
          }
        } else {
          errorAlert({ body: "Invalid password" });
        }
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleDelete = () => {
    deleteUserAccount(undefined)
      .unwrap()
      .then(async payload => {
        successAlert({
          body:
            payload?.message ||
            "Your account has been deactivated. You have 30 days to reactivate by logging in. After 30 days, your account will be permanently deleted",
        });
        dispatch(logoutFromStore());
        dispatch(setUserCountry(null));
        dispatch(setAllMessageList([]));
        dispatch(setIsOnboarding(true));
        dispatch(setQueryCountData(null));
        dispatch(setCanUseAI(false));
        dispatch(resetLogInitialState());
        handleClearAllAPIsSession();
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleClearAllAPIsSession = () => {
    dispatch(authService.util.resetApiState());
    dispatch(profileServices.util.resetApiState());
    dispatch(chatServices.util.resetApiState());
    dispatch(referralServices.util.resetApiState());
    dispatch(logsTDEEServices.util.resetApiState());
    dispatch(coachServices.util.resetApiState());
    dispatch(friendAccessServices.util.resetApiState());
    socketServices.disconnect();
  };

  return (
    <ScreenWrapper
      hasTitle={true}
      isBack={true}
      title="Confirm Account Deletion"
    >
      <View style={styles.container}>
          <CustomTextInput
            name="password"
            label="Password"
            placeholder="Enter your password"
            control={control}
            isLoading={false}
            rules={REQUIRED_RULE}
            iconName={ICONS.lock}
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Submit"
              isLoading={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
      </View>

      {isAccountDeleting && <PositionedLoader />}
      {isGettingURL && <PositionedLoader />}
    </ScreenWrapper>
  );
};

export default VerifyByPassword;
