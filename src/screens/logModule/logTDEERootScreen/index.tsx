import React, { FC, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList, screens } from "../../../navigations/routes";
import { RootState } from "../../../states/store/store";
import LogTDEE from "../logTDEE";
import { useLazyGetTargetKCalQuery } from "../../../services/logsTDEEServices";
import { setTargetMacros } from "../../../states/reducer/logReducer";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.LOG_TDEE_ROOT_SCREEN
>;

const LogTDEERootScreen: FC<Props> = () => {
  const dispatch = useDispatch();

  const hasMacros = useSelector(
    (state: RootState) => state.logReducer?.hasMacros,
  );

  const [getTargetMacros] = useLazyGetTargetKCalQuery();

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

  useEffect(() => {
    if (hasMacros === null) {
      handleGetMacros();
    }
  }, [hasMacros]);

  return <LogTDEE />;
};

export default LogTDEERootScreen;
