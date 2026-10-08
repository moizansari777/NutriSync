import { View, Image, TouchableOpacity } from "react-native";
import React, { memo, useRef } from "react";
import { useSelector } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import styles from "../../setting/styles";
import ICONS from "../../../assets/icons";
import { COLORS } from "../../../macros/colors";
import { RootState } from "../../../states/store/store";
import { useTheme } from "../../../hooks/useTheme";
import ThemeSheet from "./ThemeSheet";
import { activeOpacity } from "../../../constant";
import AppText from "../../../components/appText";

const AppTheme = () => {
  const { colors } = useTheme();

  const themeSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );

  const themeMode = useSelector(
    (state: RootState) => state.settingReducer?.themeMode,
  );

  const handlePressOnAbout = () => {
    themeSheetRef?.current?.present();
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={handlePressOnAbout}
        style={[styles.rowView, { borderBottomColor: colors.BORDER_COLOR }]}
      >
        <View style={styles.view}>
          <Image
            source={ICONS.theme}
            style={styles.icon}
            tintColor={colors.TEXT}
          />
          <View>
            <AppText allowFontScaling={false} style={[styles.title, { color: colors.HEADING }]}>Theme</AppText>
            <AppText
            allowFontScaling={false}
              style={[
                styles.description,
                { textTransform: "capitalize", color: colors.TEXT },
              ]}
            >
              {themeMode === "system" ? "System default" : themeMode}
            </AppText>
          </View>
        </View>
        <Image
          source={ICONS.rightArrowGray}
          style={styles.icon}
          tintColor={COLORS.ICON_COLOR}
        />
      </TouchableOpacity>
      <ThemeSheet themeSheetRef={themeSheetRef} />
    </>
  );
};

export default memo(AppTheme);
