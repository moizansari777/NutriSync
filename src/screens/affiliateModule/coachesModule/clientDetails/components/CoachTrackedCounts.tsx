import { View, Text } from "react-native";
import React, { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { COLORS } from "../../../../../macros/colors";
import { RootState } from "../../../../../states/store/store";
import styles from "../../../../logModule/logTDEE/styles";
import ProgressBarLine from "../../../../logModule/logTDEE/components/ProgressBarLine";
import { useTheme } from "../../../../../hooks/useTheme";
import AppText from "../../../../../components/appText";

type Props = {
  countData: {
    calories: {
      tracked: number;
      target: number;
    };
    protein: {
      tracked: number;
      target: number;
    };
    sleep: {
      tracked: number;
      target: number;
    };
    water: {
      tracked: number;
      target: number;
    };
  };
};

const CoachTrackedCounts = ({ countData }: Props) => {
  const { colors, scheme } = useTheme();
  const goal_tdee = useSelector(
    (state: RootState) => state.authReducer?.userData?.user?.goal_tdee,
  );

  const { caloriesWidth, proteinWidth, waterWidth } = useMemo(() => {
    const calories = Math.min(
      (countData?.calories?.tracked / countData?.calories?.target) * 100,
      100,
    );
    const protein = Math.min(
      (countData?.protein?.tracked / countData?.protein?.target) * 100,
      100,
    );
    const water = Math.min(
      (countData?.water?.tracked / countData?.water?.target) * 100,
      100,
    );

    return {
      caloriesWidth: calories,
      proteinWidth: protein,
      waterWidth: water,
    };
  }, [countData]);

  const bgColorCalories = useMemo(() => {
    const isTargetHit =
      countData?.calories?.tracked >= countData?.calories?.target;

    if (goal_tdee === "lose") {
      // Lose → Green until target, Red after
      return isTargetHit ? COLORS.RED : COLORS.GREEN;
    }

    if (goal_tdee === "gain") {
      // Gain → Red until target, Green after
      return isTargetHit ? COLORS.GREEN : COLORS.RED;
    }
    return !countData?.calories?.tracked ? COLORS.GRAY_BG : COLORS.GREEN;
  }, [goal_tdee, countData?.calories?.tracked, countData?.calories?.target]);

  const getStatusColor = (target: number, tracked: number) => {
    if (!target) return COLORS.GRAY_BG;
    return target > tracked ? COLORS.RED : COLORS.GREEN;
  };

  const proteinsBgColor = getStatusColor(
    countData?.protein?.target,
    countData?.protein?.tracked,
  );

  const waterBgColor = getStatusColor(
    countData?.water?.target,
    countData?.water?.tracked,
  );

  return (
    <View style={[styles.view, { gap: 20, backgroundColor: colors.WHITE }]}>
      <View style={styles.inCard}>
        <View style={styles.row}>
          <AppText
            allowFontScaling={false}
            style={[styles.label, { color: colors.HEADING }]}
          >
            Calories (kcal)
          </AppText>
          <View style={styles.view1}>
            <AppText
              allowFontScaling={false}
              style={[styles.heading, { color: colors.HEADING }]}
            >
              Tracked
            </AppText>
            <AppText
              allowFontScaling={false}
              style={[styles.count, { color: colors.HEADING }]}
            >
              {countData?.calories?.tracked || 0}{" "}
              <AppText allowFontScaling={false} style={styles.normal}>
                kcal
              </AppText>
            </AppText>
          </View>
          <View style={styles.view1}>
            <AppText
              allowFontScaling={false}
              style={[styles.heading, { color: colors.HEADING }]}
            >
              Target
            </AppText>
            <AppText
              allowFontScaling={false}
              style={[styles.count, { color: colors.HEADING }]}
            >
              {countData?.calories?.target || 0}{" "}
              <AppText allowFontScaling={false} style={styles.normal}>
                kcal
              </AppText>
            </AppText>
          </View>
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
              {
                width: `${caloriesWidth}%`,
                backgroundColor: bgColorCalories,
              },
            ]}
          />
        </View>
      </View>

      <ProgressBarLine
        label="Protein (g)"
        tracked={countData?.protein?.tracked}
        target={countData?.protein?.target}
        bgColor={proteinsBgColor}
        lineWidth={proteinWidth}
      />

      <ProgressBarLine
        label="Water (ltr)"
        tracked={countData?.water?.tracked}
        target={countData?.water?.target}
        bgColor={waterBgColor}
        lineWidth={waterWidth}
      />
    </View>
  );
};

export default memo(CoachTrackedCounts);
