import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";
import React, { FC, useCallback, useState } from "react";
import { Controller } from "react-hook-form";
import { INSIDE_RIGHT_GAP, INSIDE_RIGHT_INSET, useStyles } from "./styles";
import { activeOpacity } from "../../constant";
import ICONS from "../../assets/icons";
import { COLORS } from "../../macros/colors";
import { InputProps } from "../../schemas/types";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

const CustomTextInput: FC<InputProps> = ({
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
  onBlur: handleInputBlur,
  testID,
  renderRightUI = null,
  renderInsideRightUI = null,
  mainStyle,
  borderColor,
  maxLength,
  showCharCount = false,
}) => {
  const [showPassword, setIsShowPassword] = useState<boolean>(false);
  const styles = useStyles();
  const { colors } = useTheme();

  // `insideRightUI` is absolutely positioned, so the value has no idea it is
  // there. Measuring it lets the field reserve exactly what the slot occupies
  // — its inset, its own width, and the 8px gap — rather than a fixed
  // guess, which is what used to squeeze the value into the left of the field
  // and push it out of sight behind a control as narrow as a spinner.
  const [insideRightWidth, setInsideRightWidth] = useState(0);
  const handleInsideRightLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.ceil(event.nativeEvent.layout.width);
    setInsideRightWidth(prev => (prev === nextWidth ? prev : nextWidth));
  }, []);

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
        <View style={mainStyle}>
          <View style={styles.labelView}>
            {label && (
              <AppText allowFontScaling={false} style={styles.inputLabel}>
                {label}{" "}
                {requiredLabel && (
                  <AppText allowFontScaling={false} style={styles.required}>
                    *
                  </AppText>
                )}
              </AppText>
            )}
            {renderRightUI && renderRightUI}
          </View>

          <View style={styles.inputFieldMain}>
            <TextInput
              allowFontScaling={false}
              testID={testID}
              ref={inputRef}
              value={value}
              // react-hook-form's own onBlur (touched state) always runs; the
              // optional prop lets a screen react to the field losing focus,
              // which on iOS is the only moment a numeric keyboard gives —
              // its pad has no return key, so onSubmitEditing never fires.
              onBlur={() => {
                onBlur();
                handleInputBlur?.();
              }}
              autoCapitalize="none"
              multiline={type === "textarea"}
              editable={!isLoading}
              onChangeText={onChange}
              placeholder={placeholder}
              keyboardType={keyboardType}
              textAlignVertical="top"
              style={[
                styles.inputStyle,
                customStyle,
                type === "textarea" ? styles.textareaStyle : {},
                inputFocused && styles.focusedBorder,
                iconName && styles.ifIcon,
                renderInsideRightUI && {
                  paddingRight:
                    INSIDE_RIGHT_INSET + insideRightWidth + INSIDE_RIGHT_GAP,
                },
                {
                  color: colors.HEADING,
                  borderColor: borderColor ? borderColor : colors.BORDER_COLOR,
                },
              ]}
              placeholderTextColor={colors.ICON_COLOR}
              maxLength={maxLength}
              onSubmitEditing={onSubmitEditing}
              returnKeyType={returnKeyType}
              secureTextEntry={isTypePassword ? !showPassword : false}
              selectionColor={colors.PRIMARY}
              autoComplete="off"
              textContentType={isTypePassword ? "password" : "none"}
              onFocus={() => handleInPutFocus && handleInPutFocus()}
            />
            {/* `box-none` keeps the empty area of this slot tappable as the
                input itself — only the rendered control swallows touches. */}
            {renderInsideRightUI ? (
              <View
                pointerEvents="box-none"
                style={styles.insideRightUI}
                onLayout={handleInsideRightLayout}
              >
                {renderInsideRightUI}
              </View>
            ) : null}
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
                tintColor={COLORS.ICON_COLOR}
              />
            )}
          </View>

          {showCharCount && maxLength ? (
            <View style={styles.helperRow}>
              {error ? (
                <AppText
                  allowFontScaling={false}
                  style={[styles.errorText, styles.helperError]}
                >
                  {error?.message ? error?.message : ""}
                </AppText>
              ) : null}
              <AppText
                allowFontScaling={false}
                style={[
                  styles.charCount,
                  (value?.length ?? 0) >= maxLength && styles.charCountLimit,
                ]}
              >
                {`${value?.length ?? 0}/${maxLength}`}
              </AppText>
            </View>
          ) : (
            error && (
              <AppText allowFontScaling={false} style={styles.errorText}>
                {error?.message ? error?.message : ""}
              </AppText>
            )
          )}
        </View>
      )}
    />
  );
};

// `Controller` subscribes to its own field internally, so a field still
// re-renders on its own value/error change even when the parent's render is
// skipped here. That makes it safe to bail out on shallow-equal props, which
// stops a parent re-render (e.g. live macro suggestions) from re-rendering
// every field on every keystroke.
export default React.memo(CustomTextInput);
