import { ActivityIndicator, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import styles from "./styles";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  name: string;
  control: any;
  rules: object;
  label: string;
  unit: string;
  /** Frozen while a suggestion for a different field is in flight. */
  isLocked: boolean;
  /** This field triggered the in-flight suggestion. */
  isLoading: boolean;
  variant?: "hero" | "tile";
};

/**
 * Big, tappable number field for one macro. The `hero` variant is the calorie
 * headline; `tile` is the compact cell used in the macro grid.
 */
const MacroField = ({
  name,
  control,
  rules,
  label,
  unit,
  isLocked,
  isLoading,
  variant = "tile",
}: Props) => {
  const { colors, scheme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const isHero = variant === "hero";

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={isHero ? styles.heroWrap : styles.tileWrap}>
          <View
            style={[
              isHero ? styles.heroField : styles.tileField,
              {
                backgroundColor: isHero
                  ? colors.PRIMARY
                  : scheme === "dark"
                  ? colors.GRAY_BG
                  : colors.WHITE,
                borderColor: error
                  ? colors.RED
                  : isFocused && !isHero
                  ? colors.PRIMARY
                  : isHero
                  ? colors.TRANSPARENT
                  : colors.BORDER_COLOR,
                opacity: isLocked ? 0.55 : 1,
              },
            ]}
          >
            <View style={styles.fieldHead}>
              <AppText
                allowFontScaling={false}
                style={[
                  isHero ? styles.heroLabel : styles.tileLabel,
                  { color: isHero ? colors.ON_PRIMARY : colors.TEXT },
                ]}
              >
                {label}
              </AppText>
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color={isHero ? colors.ON_PRIMARY : colors.TEXT}
                />
              )}
            </View>
            <View style={styles.valueRow}>
              <TextInput
                allowFontScaling={false}
                value={value}
                onChangeText={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur();
                }}
                editable={!isLocked}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={
                  isHero ? `${colors.ON_PRIMARY}55` : colors.PLACEHOLDER
                }
                selectionColor={isHero ? colors.ON_PRIMARY : colors.PRIMARY}
                style={[
                  isHero ? styles.heroInput : styles.tileInput,
                  { color: isHero ? colors.ON_PRIMARY : colors.HEADING },
                ]}
              />
              <AppText
                allowFontScaling={false}
                style={[
                  isHero ? styles.heroUnit : styles.tileUnit,
                  { color: isHero ? colors.ON_PRIMARY : colors.TEXT },
                ]}
              >
                {unit}
              </AppText>
            </View>
          </View>
          {error?.message ? (
            <AppText
              allowFontScaling={false}
              style={[styles.errorText, { color: colors.RED }]}
            >
              {error.message}
            </AppText>
          ) : null}
        </View>
      )}
    />
  );
};

// Controller re-renders itself on value/error change, so shallow props are
// enough to keep a parent re-render from touching every field.
export default React.memo(MacroField);
