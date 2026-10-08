import { View, Image, Switch, TouchableOpacity } from "react-native";
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../setting/styles";
import ICONS from "../../../assets/icons";
import { RootState } from "../../../states/store/store";
import { setDotDetailsResponse } from "../../../states/reducer/authReducer";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";
import { COLORS } from "../../../macros/colors";
import { activeOpacity } from "../../../constant";
import CustomModal from "../../../components/customModals/CustomModal";
import { useSaveDotDetailedPointMutation } from "../../../services/profileServices";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { getError } from "../../../utils/errors";
import { setActivityDataEnabled } from "../../../states/reducer/logReducer";

const HealthStepToggle = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [show, setShow] = useState<boolean>(false);
  const [saveDotDetailedPoint, { isLoading }] =
    useSaveDotDetailedPointMutation();

  // Redux (persisted) is the single source of truth, mirroring the backend.
  // const chat_response_style = useSelector(
  //   (state: RootState) =>
  //     state.authReducer?.userData?.user?.chat_response_style,
  // );
  // const isEnabled = chat_response_style === "detailed";

  const toggleSwitch = (value: boolean) => {
    // if (isLoading) return;
    // const prevStyle = chat_response_style;
    // const nextStyle = value ? "detailed" : "dot_points";

    dispatch(setActivityDataEnabled(value));
    // saveDotDetailedPoint({
    //   chat_response_style: nextStyle,
    // })
    //   .unwrap()
    //   .then(async payload => {
    //     successAlert({
    //       body: payload.message || "",
    //     });
    //   })
    //   .catch(error => {
    //     dispatch(
    //       setDotDetailsResponse(
    //         prevStyle ?? (value ? "dot_points" : "detailed"),
    //       ),
    //     );
    //     const errorMessage = getError(error);
    //     errorAlert({ body: errorMessage || "" });
    //   });
  };

  return (
    <>
      <View
        style={[
          styles.rowView,
          { paddingRight: 15, borderBottomColor: colors.BORDER_COLOR },
        ]}
      >
        <View style={styles.view}>
          <Image
            source={ICONS.steps}
            style={styles.icon}
            tintColor={colors.TEXT}
          />
          <AppText
            allowFontScaling={false}
            style={[styles.title, { color: colors.HEADING }]}
          >
            Sync Activity Data
          </AppText>
        </View>
        <Switch
          trackColor={{ false: "#cccccc", true: COLORS.GREEN }}
          thumbColor={COLORS.WHITE}
          onValueChange={toggleSwitch}
          value={false}
          disabled={isLoading}
        />
      </View>
    </>
  );
};

export default memo(HealthStepToggle);
