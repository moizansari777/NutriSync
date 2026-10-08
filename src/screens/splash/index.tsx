import { View, Image } from "react-native";
import React, { FC, useCallback, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import IMAGES from "../../assets/images";
import { RootStackParamList, screens } from "../../navigations/routes";
import { requestPermissions } from "../../utils/permissions";
import {
  useLazyGetAccountDataQuery,
  useLazyGetCanUseAIQuery,
} from "../../services/profileServices";
import { setCanUseAI, setUserAuthData } from "../../states/reducer/authReducer";
import { RootState } from "../../states/store/store";
import { useLazyGetTargetKCalQuery } from "../../services/logsTDEEServices";
import { setTargetMacros } from "../../states/reducer/logReducer";

type Props = NativeStackScreenProps<RootStackParamList, screens.SPLASH_SCREEN>;

const Splash: FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authReducer?.userData);
  
  const canUseAI = useSelector(
    (state: RootState) => state.authReducer?.canUseAI,
  );

  const isUserLoggedIn = useSelector(
    (state: RootState) => state.authReducer?.isUserLoggedIn,
  );

  const [getAccountsData] = useLazyGetAccountDataQuery();
  const [canUseAIAPI] = useLazyGetCanUseAIQuery();
  const [getTargetMacros] = useLazyGetTargetKCalQuery();

  useEffect(() => {
    if (!user?.isAffiliate && isUserLoggedIn) {
      handleCheckCanUseAI();
      handleGetMacros();
    }
  }, [dispatch, canUseAIAPI, isUserLoggedIn, canUseAI]);

  const handleOnGetUserAccount = useCallback(() => {
    getAccountsData(undefined)
      .then(payload => {
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
      .catch(error => {});
  }, [dispatch, getAccountsData, user?.token]);

  useEffect(() => {
    requestPermissions();
    if (isUserLoggedIn) {
      handleOnGetUserAccount();
    }

    const timeout = setTimeout(() => {
      navigation.replace(screens.MAIN_SCREEN_STACK);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [
    handleOnGetUserAccount,
    navigation,
    isUserLoggedIn,
    user?.user?.subscription,
  ]);

  const handleGetMacros = () => {
    getTargetMacros({ date: "today" })
      .then(payload => {
        if (payload?.isError) {
          dispatch(setTargetMacros(false));
        } else {
          if (
            payload?.data &&
            payload?.data?.target_kcal > 0 &&
            payload?.data?.target_protein > 0
          ) {
            dispatch(setTargetMacros(true));
          } else {
            dispatch(setTargetMacros(false));
          }
        }
      })
      .catch(error => {
        dispatch(setTargetMacros(false));
      });
  };

  const handleCheckCanUseAI = () => {
    canUseAIAPI(undefined)
      .then(payload => {
        if (payload?.data) {
          dispatch(setCanUseAI(payload?.data?.can_use_ai));
        }
      })
      .catch(error => {
        // console.log("erro>>", error)
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={IMAGES.splashLogo}
        style={styles.logo}
        testID="splash_logo"
      />
    </View>
  );
};

export default Splash;
