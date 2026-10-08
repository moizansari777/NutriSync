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

const DetailsPointEnable = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [show, setShow] = useState<boolean>(false);
  const [saveDotDetailedPoint, { isLoading }] =
    useSaveDotDetailedPointMutation();

  // Redux (persisted) is the single source of truth, mirroring the backend.
  const chat_response_style = useSelector(
    (state: RootState) =>
      state.authReducer?.userData?.user?.chat_response_style,
  );
  const isEnabled = chat_response_style === "detailed";

  const toggleSwitch = (value: boolean) => {
    if (isLoading) return;
    const prevStyle = chat_response_style;
    const nextStyle = value ? "detailed" : "dot_points";

    dispatch(setDotDetailsResponse(nextStyle));
    saveDotDetailedPoint({
      chat_response_style: nextStyle,
    })
      .unwrap()
      .then(async payload => {
        successAlert({
          body: payload.message || "",
        });
      })
      .catch(error => {
        dispatch(
          setDotDetailsResponse(
            prevStyle ?? (value ? "dot_points" : "detailed"),
          ),
        );
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleCheckInfo = () => {
    setShow(!show);
  };

  return (
    <>
      <View
        style={[styles.rowView, { paddingRight: 15, borderBottomColor: colors.BORDER_COLOR }]}
      >
        <View style={styles.view}>
          <Image
            source={ICONS.docs}
            style={styles.icon}
            tintColor={colors.TEXT}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <AppText
              allowFontScaling={false}
              style={[styles.title, { color: colors.HEADING }]}
            >
              Detailed AI Response
            </AppText>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={handleCheckInfo}
            >
              <Image
                source={ICONS.info}
                style={styles.icon}
                tintColor={colors.GREEN}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Switch
          trackColor={{ false: "#cccccc", true: COLORS.GREEN }}
          thumbColor={COLORS.WHITE}
          onValueChange={toggleSwitch}
          value={isEnabled}
          disabled={isLoading}
        />
      </View>
      <CustomModal
        isModalOpen={show}
        title="Detailed AI Response"
        tagLine="When enabled, AI provides detailed explanations and recommendations. Turn it off for shorter responses focused on key information and macros."
        handleOnClose={handleCheckInfo}
        handleOnDone={handleCheckInfo}
        doneButtonText="Got it"
      />
    </>
  );
};

export default memo(DetailsPointEnable);
