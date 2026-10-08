import {
  View,
  Keyboard,
  TextInput,
  Platform,
  Image,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { format, subDays } from "date-fns";
import styles from "../styles";
import AppText from "../../../../components/appText";
import { DECIMAL_RULE_WITH_ZERO_STATISTICS } from "../../../../utils/validationRules";
import ICONS from "../../../../assets/icons";
import {
  useAddStatisticsMutation,
  useGetStatisticsQuery,
  useUpdateStatisticsMutation,
} from "../../../../services/logsTDEEServices";
import { errorAlert, successAlert } from "../../../../utils/alerts";
import { getError } from "../../../../utils/errors";
import { loadHealthData } from "../../../../utils/healthHelper";
import { useForegroundOnce } from "../../../../hooks/useForegroundOnce";
import { getHealthData } from "../../../../utils/getHealthDataAndroid";
import { useTheme } from "../../../../hooks/useTheme";
import { useProfileWeightSync } from "../../../../hooks/useProfileWeightSync";
import { RootState } from "../../../../states/store/store";
import {
  convertKgToWeightUnit,
  getWeightInKg,
  isPoundsUnit,
} from "../../../../utils/macroRecommendations";

const toLogged = (value: number) => Number((value ?? 0).toFixed(2));

const toWholeWeight = (value: number) => Math.round(value ?? 0);

const readHealthDay = async (day: string) => {
  try {
    const data =
      Platform.OS === "android"
        ? await getHealthData(day).then(result => ({
            weight: result?.weight?.latest?.valueKg ?? 0,
            sleep: result?.sleep?.totalHours ?? 0,
          }))
        : await loadHealthData(day);

    return { weight: toWholeWeight(data.weight), sleep: toLogged(data.sleep) };
  } catch (e) {
    console.log("Health read error");
    return { weight: 0, sleep: 0 };
  }
};

const Statistics = ({ filter }: { filter: string }) => {
  const { colors, scheme } = useTheme();
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const isManualEdit = useRef(false);
  const isProcessing = useRef(false);
  const isMounted = useRef(true);
  const syncProfileWeight = useProfileWeightSync();

  const profileWeightUnit = useSelector(
    (state: RootState) => state.authReducer?.userData?.user?.weight_unit,
  );

  const isPounds = isPoundsUnit(profileWeightUnit);

  const toWeightKg = (weight: number | string | null | undefined) =>
    toWholeWeight(getWeightInKg(weight, profileWeightUnit));

  const toStoredWeight = (weightKg: number) =>
    isPounds
      ? toLogged(convertKgToWeightUnit(weightKg, profileWeightUnit))
      : weightKg;

  const filterRef = useRef(filter);
  filterRef.current = filter;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const { data: statisticsData } = useGetStatisticsQuery(
    { period: filter },
    { refetchOnMountOrArgChange: true },
  );

  const [updateStatistics] = useUpdateStatisticsMutation();
  const [addStatistics] = useAddStatisticsMutation();

  const statisticsInfo = statisticsData?.statistics?.[0];

  const { control, handleSubmit, setValue, watch } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = watch((_values, { type }) => {
      if (type === "change") {
        isManualEdit.current = true;
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    isManualEdit.current = false;

    setValue("weight", "");
    setValue("sleep", "");
  }, [filter]);

  useEffect(() => {
    statisticsDataProcess();
  }, [statisticsData]);

  const processRef = useRef<(() => Promise<void>) | null>(null);

  const handleForeground = useCallback(async () => {
    if (isProcessing.current) return;

    isManualEdit.current = false;
    await processRef.current?.();
  }, []);

  useForegroundOnce(handleForeground);

  const syncTodaysWeight = (weightKg: number) => {
    if (filter !== "today") return;
    syncProfileWeight(weightKg);
  };

  const statisticsDataProcess = async () => {
    if (!statisticsData) return;

    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const statWeight = toWeightKg(statisticsInfo?.weight);
      const statSleep = statisticsInfo?.sleep ?? 0;

      const hasWeight = statWeight > 0;
      const hasSleep = statSleep > 0;

      if (hasWeight) {
        setValue("weight", statWeight.toString());
        syncTodaysWeight(statWeight);
      }
      if (hasSleep) setValue("sleep", statSleep.toString());

      if (hasWeight && hasSleep) return;
      if (isManualEdit.current) return;

      if (!["today", "yesterday"].includes(filter)) return;

      await fetchHealthData(statWeight, statSleep);
    } finally {
      isProcessing.current = false;
    }
  };

  processRef.current = statisticsDataProcess;

  const fetchHealthData = async (statWeight: number, statSleep: number) => {
    const health = await readHealthDay(filter);

    if (!isMounted.current || filterRef.current !== filter) return;

    if (isManualEdit.current) return;

    const hasWeight = statWeight > 0;
    const hasSleep = statSleep > 0;

    const finalWeight = hasWeight ? 0 : health.weight;
    const finalSleep = hasSleep ? 0 : health.sleep;

    if (finalWeight > 0) {
      setValue("weight", finalWeight.toString());
    }

    if (finalSleep > 0) {
      setValue("sleep", finalSleep.toString());
    }

    if (finalWeight < 1 && finalSleep < 1) return;

    onSubmit(
      {
        weight: hasWeight ? statWeight : finalWeight,
        sleep: hasSleep ? statSleep : finalSleep,
      },
      false,
    );
  };

  const onSubmit = (data: any, shouldShow: boolean = true) => {
    const prevValues = JSON.stringify({
      weight: toWeightKg(statisticsInfo?.weight),
      sleep: statisticsInfo?.sleep || 0,
    });

    const numberValuesData = {
      weight: Number(data?.weight),
      sleep: Number(data?.sleep),
    };

    const newValues = JSON.stringify(numberValuesData);

    if (newValues === prevValues) {
      if (shouldShow) {
        errorAlert({ body: "No changes detected." });
      }
      return;
    }

    const todayDate = format(new Date(), "yyyy-MM-dd");
    const yesterdayDate = format(subDays(new Date(), 1), "yyyy-MM-dd");

    const log_date = filter === "today" ? todayDate : yesterdayDate;

    const dataProps = {
      weight:
        numberValuesData.weight < 1
          ? null
          : toStoredWeight(numberValuesData.weight),
      sleep: numberValuesData.sleep < 1 ? null : numberValuesData.sleep,
      log_date,
    };

    const hasExistingRecord = statisticsData?.statistics?.length > 0;

    const request = hasExistingRecord
      ? updateStatistics({ ...dataProps, id: statisticsInfo?.id })
      : addStatistics(dataProps);

    request
      .unwrap()
      .then(() => {
        syncTodaysWeight(numberValuesData.weight);
        if (shouldShow) {
          successAlert({ body: "Statistics have been updated." });
        }
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const submitAndNext = (index: number) => {
    handleSubmit(data => {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      } else {
        Keyboard.dismiss();
      }

      onSubmit(data);
    })();
  };

  const isLogged = statisticsInfo?.weight > 0;
  const dayLabel = filter === "yesterday" ? "yesterday" : "today";

  return (
    <View
      style={[
        styles.weightCard,
        {
          backgroundColor: scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
          borderColor: colors.BORDER_COLOR,
        },
      ]}
    >
      <View style={styles.weightHead}>
        <View
          style={[styles.optionIconWrap, { backgroundColor: colors.PRIMARY }]}
        >
          <Image
            source={ICONS.weight}
            style={styles.optionIcon}
            tintColor={colors.ON_PRIMARY}
          />
        </View>
        <View style={styles.optionTextWrap}>
          <AppText
            allowFontScaling={false}
            style={[styles.labelTextOption, { color: colors.HEADING }]}
          >
            Weight
          </AppText>
          <View style={styles.weightStatusRow}>
            <View
              style={[
                styles.weightStatusDot,
                {
                  backgroundColor: isLogged ? colors.GREEN : colors.ICON_COLOR,
                },
              ]}
            />
            <AppText
              allowFontScaling={false}
              style={[styles.optionCaption, { color: colors.TEXT }]}
            >
              {isLogged ? `Logged for ${dayLabel}` : `Not logged ${dayLabel}`}
            </AppText>
          </View>
        </View>
      </View>

      <Controller
        control={control}
        name="weight"
        rules={DECIMAL_RULE_WITH_ZERO_STATISTICS}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View
              style={[
                styles.weightInputRow,
                {
                  backgroundColor: colors.BACKGROUND,
                  borderColor: error ? colors.RED : colors.TRANSPARENT,
                },
              ]}
            >
              <TextInput
                ref={(ref: TextInput | null) => {
                  inputRefs.current[0] = ref;
                }}
                allowFontScaling={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => submitAndNext(0)}
                placeholder="0"
                placeholderTextColor={colors.PLACEHOLDER}
                selectionColor={colors.PRIMARY}
                style={[styles.weightInput, { color: colors.HEADING }]}
              />
              <AppText
                allowFontScaling={false}
                style={[styles.weightUnit, { color: colors.TEXT }]}
              >
                kg
              </AppText>
              <View style={styles.actionSpacerFlex} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save weight"
                onPress={() => submitAndNext(0)}
                style={({ pressed }) => [
                  styles.weightSave,
                  { backgroundColor: colors.PRIMARY },
                  pressed && styles.optionTilePressed,
                ]}
              >
                <AppText
                  allowFontScaling={false}
                  style={[styles.weightSaveText, { color: colors.ON_PRIMARY }]}
                >
                  Save
                </AppText>
              </Pressable>
            </View>
            {error?.message ? (
              <AppText
                allowFontScaling={false}
                style={[styles.weightError, { color: colors.RED }]}
              >
                {String(error.message)}
              </AppText>
            ) : null}
          </>
        )}
      />
    </View>
  );
};

export default Statistics;
