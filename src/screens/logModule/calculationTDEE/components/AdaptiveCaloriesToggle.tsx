import { View, Switch } from "react-native";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../../hooks/useTheme";
import { RootState } from "../../../../states/store/store";
import { setCustomMacrosMode } from "../../../../states/reducer/authReducer";
import AppText from "../../../../components/appText";
import { COLORS } from "../../../../macros/colors";
import styles from "../../../setting/styles";
import { mainHPadding } from "../../../../constant";
import { errorAlert, successAlert } from "../../../../utils/alerts";
import { getError } from "../../../../utils/errors";
import { useSaveAutoAdaptiveCaloriesMutation } from "../../../../services/logsTDEEServices";

const AdaptiveCaloriesToggle = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  // Redux (persisted) is the single source of truth, mirroring the backend.
  const custom_macros_mode = useSelector(
    (state: RootState) => state.authReducer?.userData?.user?.custom_macros_mode,
  );
  const isEnabled = custom_macros_mode === "recalculate";

  const [saveAutoAdaptiveCalories, { isLoading }] =
    useSaveAutoAdaptiveCaloriesMutation();

  const toggleSwitch = (value: boolean) => {
    if (isLoading) return;
    const prevMode = custom_macros_mode;
    const nextMode = value ? "recalculate" : "keep_same";

    dispatch(setCustomMacrosMode(nextMode));
    saveAutoAdaptiveCalories({
      custom_macros_mode: nextMode,
    })
      .unwrap()
      .then(() => {
        successAlert({
          body: "Your TDEE will be automatically adjusted",
        });
      })
      .catch(error => {
        dispatch(
          setCustomMacrosMode(
            prevMode ?? (value ? "keep_same" : "recalculate"),
          ),
        );
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  return (
    <View
      style={[
        styles.rowView,
        {
          paddingRight: 18,
          borderBottomWidth: 0,
          marginHorizontal: mainHPadding,
          borderRadius: 16,
          paddingHorizontal: 15,
          backgroundColor: colors.GREEN_TRANSPARENT,
          marginTop: 8,
        },
      ]}
    >
      <View style={[styles.view, { flexShrink: 1 }]}>
        <AppText
          allowFontScaling={false}
          style={[styles.title, { color: colors.HEADING }]}
        >
          Auto update TDEE with weight
        </AppText>
      </View>

      <Switch
        trackColor={{ false: "#cccccc", true: COLORS.GREEN }}
        thumbColor={COLORS.WHITE}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default memo(AdaptiveCaloriesToggle);
