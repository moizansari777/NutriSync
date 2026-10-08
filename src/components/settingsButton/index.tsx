import { Image, Pressable, StyleSheet } from "react-native";
import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";
import ICONS from "../../assets/icons";
import { useTheme } from "../../hooks/useTheme";
import { RootNavigationProp } from "../../schemas/types";
import { screens } from "../../navigations/routes";

/** Round gear button in the top bar that opens Preference & Settings. */
const SettingsButton = ({ testID }: { testID?: string }) => {
  const { colors, scheme } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Preference & Settings"
      testID={testID}
      hitSlop={8}
      onPress={() => navigation.navigate(screens.SETTING_SCREEN)}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
          borderColor: colors.BORDER_COLOR,
        },
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={ICONS.setting}
        style={styles.icon}
        tintColor={colors.HEADING}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 38,
    width: 38,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.92 }] },
  icon: { height: 19, width: 19, resizeMode: "contain" },
});

export default memo(SettingsButton);
