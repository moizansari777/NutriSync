import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { useStyles } from "./styles";
import { activeOpacity } from "../../constant";
import ICONS from "../../assets/icons";
import { COLORS } from "../../macros/colors";
import { InputProps } from "../../schemas/types";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

const BottomSheetCustomTextInput: FC<InputProps> = ({
  name,
  control,
  rules,
  isLoading = false,
  type = "text", // Default to text input
  placeholder,
  customStyle,
  customIconStyle,
  iconName = "",
  keyboardType = "default",
  inputRef,
  onSubmitEditing,
  returnKeyType,
  label = "",
  requiredLabel = false,
  inputFocused = false,
  handleInPutFocus,
  testID,
  borderColor,
}) => {
  const [showPassword, setIsShowPassword] = useState<boolean>(false);
  const styles = useStyles();
  const { colors } = useTheme();

  const handleShowHidePassword = () => {
    setIsShowPassword(!showPassword);
  };

  const isTypePassword =
    name === "password" ||
    name === "confirmPassword" ||
    name === "currentPassword";

  return (
    <Controller
      control={control}
      name={`${name}`}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View>
          {label && (
            <AppText allowFontScaling={false} style={styles.inputLabel}>
              {label} {requiredLabel && <AppText allowFontScaling={false} style={styles.required}>*</AppText>}
            </AppText>
          )}

          <View style={styles.inputFieldMain}>
            <BottomSheetTextInput
              testID={testID}
              ref={inputRef}
              value={value}
              onBlur={onBlur}
              autoCapitalize="none"
              multiline={type === "textarea"}
              editable={!isLoading}
              onChangeText={onChange}
              placeholder={placeholder}
              keyboardType={keyboardType}
              style={[
                styles.inputStyle,
                customStyle,
                type === "textarea" ? styles.textareaStyle : {},
                inputFocused && styles.focusedBorder,
                iconName && styles.ifIcon,
                {
                  color: colors.HEADING,
                  borderColor: borderColor ? borderColor : colors.BORDER_COLOR,
                },
              ]}
              placeholderTextColor={colors.ICON_COLOR}
              onSubmitEditing={onSubmitEditing}
              returnKeyType={returnKeyType}
              secureTextEntry={isTypePassword ? !showPassword : false}
              selectionColor={colors.PRIMARY}
              autoComplete="off"
              textContentType={isTypePassword ? "password" : "none"}
              onFocus={() => handleInPutFocus && handleInPutFocus()}
            />
            {isTypePassword && (
              <TouchableOpacity
                hitSlop={25}
                activeOpacity={activeOpacity}
                onPress={handleShowHidePassword}
                style={[styles.iconStyle, customIconStyle]}
              >
                <Image
                  source={showPassword ? ICONS.eye : ICONS.eyeOff}
                  style={styles.eyeIcon}
                  tintColor={colors.ICON_COLOR}
                />
              </TouchableOpacity>
            )}
            {iconName && (
              <Image
                source={iconName}
                style={[styles.leftIconStyle, styles.eyeIcon, customIconStyle]}
                tintColor={colors.ICON_COLOR}
              />
            )}
          </View>

          {error && (
            <AppText allowFontScaling={false} style={styles.errorText}>
              {error?.message ? error?.message : ""}
            </AppText>
          )}
        </View>
      )}
    />
  );
};

export default BottomSheetCustomTextInput;
