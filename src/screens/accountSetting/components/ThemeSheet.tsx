import { View, Platform, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBottomSheet from "../../../components/customBottomSheet";
import { activeOpacity } from "../../../constant";
import ICONS from "../../../assets/icons";
import styles from "../../setting/styles";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../../states/reducer/settingReducer";
import { ThemeMode } from "../../../schemas/types";
import { useTheme } from "../../../hooks/useTheme";
import { RootState } from "../../../states/store/store";
import AppText from "../../../components/appText";

const THEME_OPTIONS: { id: ThemeMode; label: string }[] = [
  { id: "system", label: "System Default" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const ThemeSheet = ({
  themeSheetRef,
}: {
  themeSheetRef: React.RefObject<BottomSheetModal>;
}) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const themeMode = useSelector(
    (state: RootState) => state.settingReducer?.themeMode,
  );

  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [sheetKey, setSheetKey] = useState(0);

  // Remount the sheet once it is fully closed, no matter how it got closed
  // (option press, backdrop press or drag down) so it opens cleanly again.
  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setSheetKey(prev => prev - 1);
    }
  }, []);

  // Selecting a theme applies it and closes the sheet
  const handleSelectTheme = (themeId: ThemeMode) => {
    setSelectedTheme(themeId);
    dispatch(setThemeMode(themeId));
    themeSheetRef?.current?.close();
  };

  return (
    <CustomBottomSheet
      key={sheetKey}
      bottomSheetRef={themeSheetRef}
      isBackDrop={true}
      enableDrag={false}
      enablePanDownClose={true}
      backdropPressBehavior="close"
      onSheetChange={handleSheetChange}
      customSanps={Platform.OS === "ios" ? ["28%"] : ["40%"]}
    >
      <View style={[styles.topView, { paddingHorizontal: 0 }]}>
        <View style={[styles.themeContainer, styles.sheetTopView]}>
          {THEME_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              activeOpacity={activeOpacity}
              onPress={() => handleSelectTheme(option?.id)}
              style={
                index === THEME_OPTIONS.length - 1
                  ? styles.themeRowLast
                  : [
                      styles.themeRow,
                      { borderBottomColor: colors.INPUT_BORDER },
                    ]
              }
            >
              <AppText allowFontScaling={false} style={[styles.themeText, { color: colors.TEXT }]}>
                {option.label}
              </AppText>
              {selectedTheme === option.id && (
                <Image
                  source={ICONS.checkCircle}
                  style={styles.themeCheckbox}
                  tintColor={colors.HEADING}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </CustomBottomSheet>
  );
};

export default ThemeSheet;
