import { Pressable, View } from "react-native";
import React, { memo } from "react";
import { format } from "date-fns";
import Animated, { FadeInDown } from "react-native-reanimated";
import styles from "./styles";
import { TDEEHistoryProps } from "../../../schemas/types";
import CardsActions from "./CardsActions";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  item: TDEEHistoryProps;
  isHistory?: boolean;
  handlePressOnEdit?: any;
  handlePressOnAdd?: any;
};

const fmt = (value: number) => Number(value.toFixed(1));

const formatLoggedAt = (createdAt?: string) => {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  return isNaN(date.getTime()) ? "" : format(date, "MMM d · h:mm a");
};

/**
 * One meal in the Saved Meals and History lists: the name, then calories and
 * protein as large stat blocks. Tapping the card edits it; the action row
 * underneath holds delete, edit, photo and log.
 */
const Card = ({
  item,
  isHistory,
  handlePressOnEdit,
  handlePressOnAdd,
}: Props) => {
  const { colors, scheme } = useTheme();

  const calories = Number(item?.calories) || 0;
  const protein = Number(item?.protein) || 0;
  const water = Number(item?.water) || 0;
  const carbs = Number(item?.carbs) || 0;
  const fat = Number(item?.fat) || 0;

  const isWaterOnly =
    water > 0 && calories === 0 && protein === 0 && carbs === 0 && fat === 0;

  // Calories and protein are what people scan this list for, so they get the
  // same weight as the name. Water joins them only when the entry has some.
  const stats = isWaterOnly
    ? [{ label: "Water", value: fmt(water), unit: "L" }]
    : [
        { label: "Calories", value: Math.round(calories), unit: "kcal" },
        { label: "Protein", value: fmt(protein), unit: "g" },
        ...(water > 0
          ? [{ label: "Water", value: fmt(water), unit: "L" }]
          : []),
      ];

  const loggedAt = isHistory ? formatLoggedAt(item?.created_at) : "";
  const isDark = scheme === "dark";

  return (
    <Animated.View entering={FadeInDown.springify().damping(18)}>
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Edit this meal"
        onPress={() => handlePressOnEdit?.(item)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isDark ? colors.GRAY_BG : colors.WHITE,
            borderColor: colors.BORDER_COLOR,
          },
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={styles.cardTitleWrap}>
              <AppText
                allowFontScaling={false}
                style={[styles.text, { color: colors.HEADING }]}
                numberOfLines={2}
              >
                {item?.name}
              </AppText>
              {!!loggedAt && (
                <AppText
                  allowFontScaling={false}
                  style={[styles.timeText, { color: colors.ICON_COLOR }]}
                >
                  {loggedAt}
                </AppText>
              )}
            </View>
          </View>

          <View style={styles.statRow}>
            {stats.map((stat, index) => (
              <View
                key={stat.label}
                style={[
                  styles.stat,
                  {
                    backgroundColor:
                      index === 0
                        ? colors.YELLOW_TRANSPARENT
                        : colors.BACKGROUND,
                  },
                ]}
              >
                <AppText
                  allowFontScaling={false}
                  style={[styles.statValue, { color: colors.HEADING }]}
                >
                  {stat.value}
                  <AppText
                    allowFontScaling={false}
                    style={[styles.statUnit, { color: colors.TEXT }]}
                  >
                    {` ${stat.unit}`}
                  </AppText>
                </AppText>
                <AppText
                  allowFontScaling={false}
                  style={[styles.statLabel, { color: colors.TEXT }]}
                >
                  {stat.label}
                </AppText>
              </View>
            ))}
          </View>

          <CardsActions
            item={item}
            isHistory={isHistory}
            handlePressOnEdit={handlePressOnEdit}
            handlePressOnAdd={handlePressOnAdd}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default memo(Card);
