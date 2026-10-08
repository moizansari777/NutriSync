import { Image, TouchableOpacity, View } from "react-native";
import React from "react";
import styles from "../styles";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";
import { activeOpacity } from "../../../../constant";
import ICONS from "../../../../assets/icons";

type Props = {
  label: string;
  tracked: number;
  target: number;
  bgColor: string;
  lineWidth: number;
  onPress?: () => void;
  /** Pencil beside the target, like the Calories row. Needs `onPress`. */
  showEditIcon?: boolean;
};

const ProgressBarLine = ({
  label,
  tracked,
  target,
  bgColor,
  lineWidth,
  onPress,
  showEditIcon = false,
}: Props) => {
  const { colors, scheme } = useTheme();

  const targetValue = (
    <View style={styles.editRowTarget}>
      <AppText
        allowFontScaling={false}
        style={[styles.count, { color: colors.HEADING }]}
      >
        {Number(target?.toFixed(1) || 0)}
      </AppText>
      {showEditIcon && (
        <Image
          source={ICONS.edit2}
          style={styles.editIcon}
          tintColor={colors.HEADING}
        />
      )}
    </View>
  );

  return (
    <View style={styles.inCard}>
      <View style={styles.row}>
        <AppText
          allowFontScaling={false}
          style={[styles.label, { color: colors.HEADING }]}
        >
          {label}
        </AppText>
        <View style={styles.view1}>
          <AppText
            allowFontScaling={false}
            style={[styles.count, { color: colors.HEADING }]}
          >
            {Number(tracked?.toFixed(1) || 0)}
          </AppText>
        </View>
        {/* Without a handler the target is plain text — nothing to tap, so it
            must not look or feel pressable either. */}
        {onPress ? (
          <TouchableOpacity
            activeOpacity={activeOpacity}
            style={styles.view1}
            onPress={onPress}
          >
            {targetValue}
          </TouchableOpacity>
        ) : (
          <View style={styles.view1}>{targetValue}</View>
        )}
      </View>
      <View
        style={[
          styles.progressView,
          {
            backgroundColor:
              scheme === "dark" ? colors.ICON_COLOR : colors.BACKGROUND,
          },
        ]}
      >
        <View
          style={[
            styles.progress,
            { width: `${lineWidth}%`, backgroundColor: bgColor },
          ]}
        />
      </View>
    </View>
  );
};

export default ProgressBarLine;
