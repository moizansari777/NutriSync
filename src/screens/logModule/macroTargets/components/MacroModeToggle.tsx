import { Image, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";
import AppText from "../../../../components/appText";
import ICONS from "../../../../assets/icons";
import { activeOpacity } from "../../../../constant";
import { COLORS } from "../../../../macros/colors";
import { useTheme } from "../../../../hooks/useTheme";
import { RootNavigationProp } from "../../../../schemas/types";

export type MacroMode = "auto" | "manual";

const MACRO_MODES: { mode: MacroMode; title: string }[] = [
  { mode: "auto", title: "Auto Calculate" },
  { mode: "manual", title: "Custom Targets" },
];

type Props = {
  selectedMode: MacroMode;
  handleSelectMode: (mode: MacroMode) => void;
};

/**
 * Header for the macro targets screen: the back button and a compact segmented
 * control sit on one row, so this replaces the wrapper's own header instead of
 * stacking below it. The selected side is a solid black pill with white text —
 * deliberately different from the outlined gender / goal pills further down the
 * form, so it reads as a tab bar.
 */
const MacroModeToggle = ({ selectedMode, handleSelectMode }: Props) => {
  const { colors, scheme } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  // Pure black separates better from the dark theme's greys; the softer
  // near-black is easier on the eye against a white background.
  const activeColor = scheme === "dark" ? COLORS.BLACK : COLORS.SECONDARY;

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerRow}>
      {navigation.canGoBack() && (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Image source={ICONS.backArrowCircle} style={styles.backArrow} />
        </TouchableOpacity>
      )}

      <View
        style={[
          styles.toggleContainer,
          {
            backgroundColor: colors.INPUT_BG,
            borderColor: colors.PRIMARY,
          },
        ]}
      >
        {MACRO_MODES.map(({ mode, title }) => {
          const isSelected = selectedMode === mode;

          return (
            <TouchableOpacity
              key={mode}
              activeOpacity={activeOpacity}
              onPress={() => handleSelectMode(mode)}
              style={[
                styles.toggleOption,
                {
                  backgroundColor: isSelected
                    ? activeColor
                    : COLORS.TRANSPARENT,
                },
              ]}
            >
              <AppText
                allowFontScaling={false}
                style={[
                  styles.toggleText,
                  isSelected && styles.toggleTextActive,
                  { color: isSelected ? COLORS.WHITE : colors.TEXT },
                ]}
              >
                {title}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default memo(MacroModeToggle);
