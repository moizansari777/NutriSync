import { View, Image, Switch } from "react-native";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../setting/styles";
import ICONS from "../../../assets/icons";
import { setIsSoundOnOff } from "../../../states/reducer/authReducer";
import { RootState } from "../../../states/store/store";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";
import { COLORS } from "../../../macros/colors";

const SoundToggle = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const isSoundOff = useSelector(
    (state: RootState) => state.authReducer?.isSoundOff,
  );

  const toggleSwitch = (value: any) => {
    dispatch(setIsSoundOnOff(value));
  };

  return (
    <View
      style={[
        styles.rowView,
        { paddingRight: 15, borderBottomColor: colors.BORDER_COLOR },
      ]}
    >
      <View style={styles.view}>
        <Image
          source={ICONS.soundAlert}
          style={styles.icon}
          tintColor={colors.TEXT}
        />
        <View>
          <AppText
            allowFontScaling={false}
            style={[styles.title, { color: colors.HEADING }]}
          >
            Iconic Audio
          </AppText>
          <AppText
            allowFontScaling={false}
            style={[styles.description, { color: colors.TEXT }]}
          >
            Mute / Unmute NutriSync
          </AppText>
        </View>
      </View>

      <Switch
        trackColor={{ false: "#cccccc", true: COLORS.GREEN }}
        thumbColor={COLORS.WHITE}
        onValueChange={toggleSwitch}
        value={isSoundOff}
      />
    </View>
  );
};

export default memo(SoundToggle);
