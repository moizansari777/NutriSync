import { Keyboard, Platform, TextInput, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import styles from "../styles";
import CustomBottomSheet from "../../../../components/customBottomSheet";
import BottomSheetCustomTextInput from "../../../../components/forms/BottomSheetCustomTextInput";
import CustomButton from "../../../../components/buttons";
import AppText from "../../../../components/appText";
import ICONS from "../../../../assets/icons";
import { WATER_TARGET_RULE } from "../../../../utils/validationRules";
import {
  useGetWaterDataQuery,
  useUpdateWaterDataMutation,
} from "../../../../services/logsTDEEServices";
import { errorAlert, successAlert } from "../../../../utils/alerts";
import { getError } from "../../../../utils/errors";
import { COLORS } from "../../../../macros/colors";
import { useTheme } from "../../../../hooks/useTheme";

const toTarget = (value: unknown): number => {
  const target = Math.trunc(Number(value ?? 0));
  return Number.isFinite(target) && target > 0 ? target : 0;
};

const readTarget = (data: any) =>
  data?.target_water ?? data?.user?.target_water ?? data?.profile?.target_water;

const FOCUS_DELAY = Platform.OS === "android" ? 350 : 150;

const WaterTargetSheet = ({
  waterSheetRef,
}: {
  waterSheetRef: React.RefObject<BottomSheetModal>;
}) => {
  const { colors } = useTheme();

  const inputRef = useRef<TextInput>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpen = useRef(false);

  const [sheetKey, setSheetKey] = useState(0);

  const { data: waterData } = useGetWaterDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateWaterData, { isLoading }] = useUpdateWaterDataMutation();

  const targetWater = toTarget(readTarget(waterData));

  const savedTarget = useRef(targetWater);

  const { control, handleSubmit, setValue } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (!waterData) return;

    savedTarget.current = targetWater;

    if (isOpen.current) return;
    setValue("water", targetWater > 0 ? targetWater.toString() : "");
  }, [waterData, targetWater, setValue]);

  useEffect(
    () => () => {
      if (focusTimer.current) clearTimeout(focusTimer.current);
    },
    [],
  );

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        isOpen.current = false;
        if (focusTimer.current) clearTimeout(focusTimer.current);
        Keyboard.dismiss();
        setSheetKey(prev => prev - 1);
        return;
      }

      if (isOpen.current) return;
      isOpen.current = true;

      setValue(
        "water",
        savedTarget.current > 0 ? savedTarget.current.toString() : "",
      );
      focusTimer.current = setTimeout(
        () => inputRef.current?.focus(),
        FOCUS_DELAY,
      );
    },
    [setValue],
  );

  const closeSheet = useCallback(() => {
    Keyboard.dismiss();
    waterSheetRef?.current?.close();
  }, [waterSheetRef]);

  const onSubmit = (data: any) => {
    const nextTarget = toTarget(data?.water);
    const previousTarget = savedTarget.current;

    if (nextTarget === previousTarget) {
      closeSheet();
      return;
    }

    updateWaterData({ target_water: nextTarget > 0 ? nextTarget : null })
      .unwrap()
      .then(() => {
        savedTarget.current = nextTarget;
        successAlert({ body: "Water target has been updated." });
        closeSheet();
      })
      .catch(error => {
        // Keep the sheet open so the value is still there to correct.
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleSave = handleSubmit(onSubmit);

  return (
    <CustomBottomSheet
      key={sheetKey}
      bottomSheetRef={waterSheetRef}
      isBackDrop={true}
      enableDrag={false}
      enablePanDownClose={true}
      backdropPressBehavior="close"
      onSheetChange={handleSheetChange}
      keyboardAware
      customSanps={Platform.OS === "ios" ? ["32%"] : ["50%"]}
    >
      <View style={styles.sheetContent}>
        <BottomSheetCustomTextInput
          name="water"
          label="Water (ltr)"
          control={control}
          rules={WATER_TARGET_RULE}
          iconName={ICONS.water}
          keyboardType="number-pad"
          inputRef={inputRef}
          borderColor={targetWater > 0 ? COLORS.GREEN : COLORS.RED}
        />

        <CustomButton title="Save" onPress={handleSave} isLoading={isLoading} />
      </View>
    </CustomBottomSheet>
  );
};

export default WaterTargetSheet;
