import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./styles";
import ICONS from "../../assets/icons/index";
import { activeOpacity } from "../../constant";
import { COLORS } from "../../macros/colors";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

type Props = {
  label?: string;
  placeHolder?: string;
  value: string | "" | null;
  iconName: any;
  handleOnPress: () => void;
  isRequired?: boolean;
};

const CustomSelect = ({
  label,
  placeHolder,
  value,
  iconName,
  handleOnPress,
  isRequired,
}: Props) => {
  const { colors } = useTheme();
  return (
    <View>
      {label && (
        <AppText
          allowFontScaling={false}
          style={[styles.inputLabel, { color: colors.HEADING }]}
        >
          {label}
          {isRequired && (
            <AppText
              allowFontScaling={false}
              style={styles.required}
            >{` *`}</AppText>
          )}
        </AppText>
      )}
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={handleOnPress}
        style={[
          styles.selectView,
          {
            borderColor: colors.INPUT_BORDER,
            backgroundColor: colors.INPUT_BG,
          },
        ]}
      >
        <View style={styles.leftText}>
          <Image
            source={iconName}
            style={styles.leftIcon}
            tintColor={COLORS.ICON_COLOR}
          />
          {value ? (
            <AppText
              allowFontScaling={false}
              style={[
                styles.value,
                { color: colors.TEXT, textTransform: "capitalize" },
              ]}
            >
              {value}
            </AppText>
          ) : (
            <AppText
              allowFontScaling={false}
              style={[styles.placeHolder, { color: colors.PLACEHOLDER }]}
            >
              {placeHolder}
            </AppText>
          )}
        </View>

        <Image source={ICONS.selectArrow} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomSelect;
