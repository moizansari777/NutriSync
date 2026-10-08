import { View, Keyboard, Platform } from "react-native";
import React, {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import styles from "./styles";
import { RootNavigationProp } from "../../../schemas/types";
import ScreenWrapper from "../../../components/screenWrapper";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import { DECIMAL_RULE_WITH_ZERO_STATISTICS } from "../../../utils/validationRules";
import ICONS from "../../../assets/icons";
import CustomButton from "../../../components/buttons";
import { getError } from "../../../utils/errors";
import { errorAlert, successAlert } from "../../../utils/alerts";
import {
  useAddCustomMacrosMutation,
  useGetTargetKCalQuery,
  useSaveAutoAdaptiveCaloriesMutation,
} from "../../../services/logsTDEEServices";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../states/store/store";
import { setCustomMacrosMode } from "../../../states/reducer/authReducer";
import KeyboardController from "../../../components/keyboardController";
import ConfirmationAlert from "../../../components/customModals/ConfirmationAlert";
import { showConfirmAlert } from "../../../utils/showConfirmAlert";
import {
  calculateCaloriesFromMacros,
  generateLiveMacroRecommendations,
  UserProfile,
} from "../../../utils/macroRecommendations";

type Props = {
  /** Header title. Defaults to this flow's own title. */
  title?: string;
  /** Mode toggle, rendered by the parent right under the header. */
  renderToggle?: ReactNode;
};

type CustomMacrosPayload = {
  custom_target_kcal: number;
  custom_target_protein_g: number;
  target_carbs: number;
  target_fat: number;
};

const AddCustomMacros: FC<Props> = ({
  title = "Set Custom Daily Macros",
  renderToggle = null,
}) => {
  const pendingUserRef = useRef<CustomMacrosPayload | null>(null);
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useDispatch();

  const custom_macros_mode = useSelector(
    (state: RootState) => state.authReducer?.userData?.user?.custom_macros_mode,
  );
  const user = useSelector(
    (state: RootState) => state.authReducer?.userData?.user,
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [mismatchTagLine, setMismatchTagLine] = useState<string>("");
  const [addCustomMacros, { isLoading }] = useAddCustomMacrosMutation();
  const [saveAutoAdaptiveCalories, { isLoading: saving }] =
    useSaveAutoAdaptiveCaloriesMutation();

  const { data: dataAPI } = useGetTargetKCalQuery(
    { date: "today" },
    { refetchOnFocus: true, refetchOnReconnect: true },
  );

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      calories: dataAPI?.target_kcal?.toString() || "",
      protein: dataAPI?.target_protein?.toString() || "",
      carbs: dataAPI?.target_carbs?.toString() || "",
      fat: dataAPI?.target_fat?.toString() || "",
    },
  });

  // Populate the form once the async target data arrives.
  useEffect(() => {
    if (dataAPI) {
      reset({
        calories: dataAPI?.target_kcal?.toString() || "",
        protein: dataAPI?.target_protein?.toString() || "",
        carbs: dataAPI?.target_carbs?.toString() || "",
        fat: dataAPI?.target_fat?.toString() || "",
      });
    }
  }, [dataAPI]);

  const userProfile = useMemo<UserProfile>(
    () => ({
      gender: user?.gender,
      weight: user?.weight as UserProfile["weight"],
      weight_unit: user?.weight_unit,
    }),
    [user?.gender, user?.weight, user?.weight_unit],
  );

  // Auto-calculation. Calories are the source of truth:
  //   • User edits calories → protein comes from body weight/gender, then the
  //     remaining calories split 60% carbs / 40% fat — fields fill directly.
  //   • User edits a macro → calories re-derive from P×4 + C×4 + F×9.
  // Only real user edits (type === "change") trigger this, so the API reset
  // and the programmatic setValue calls below can't cause loops.
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type !== "change" || !name) return;

      if (name === "calories") {
        const rec = generateLiveMacroRecommendations(
          { calories: value.calories },
          userProfile,
          { alwaysEstimateProtein: true },
        );
        if (rec.mode !== "from-calories") return;

        const fill = (field: "protein" | "carbs" | "fat", amount: number) =>
          setValue(field, amount > 0 ? String(Math.round(amount)) : "", {
            shouldValidate: true,
            shouldDirty: true,
          });
        fill("protein", rec.protein);
        fill("carbs", rec.carbs);
        fill("fat", rec.fat);
      } else {
        const total = calculateCaloriesFromMacros({
          protein: value.protein,
          carbs: value.carbs,
          fat: value.fat,
        });
        setValue("calories", total > 0 ? String(Math.round(total)) : "", {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, userProfile]);

  const onSubmit = async (data: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  }) => {
    Keyboard.dismiss();
    const user = {
      custom_target_kcal: parseFloat(data?.calories),
      custom_target_protein_g: parseFloat(data?.protein),
      target_carbs: parseFloat(data?.carbs),
      target_fat: parseFloat(data?.fat),
    };

    const prevValues = JSON.stringify({
      custom_target_kcal: parseFloat(dataAPI?.target_kcal),
      custom_target_protein_g: parseFloat(dataAPI?.target_protein),
      target_carbs: parseFloat(dataAPI?.target_carbs),
      target_fat: parseFloat(dataAPI?.target_fat),
    });

    const newValues = JSON.stringify(user);

    if (prevValues === newValues) {
      errorAlert({ title: "You're all set", body: "No changes were found." });
      return;
    }

    const calculatedCalories =
      (parseFloat(data?.protein) || 0) * 4 +
      (parseFloat(data?.carbs) || 0) * 4 +
      (parseFloat(data?.fat) || 0) * 9;
    const totalCalories = parseFloat(data?.calories) || 0;

    if (calculatedCalories > totalCalories) {
      const roundedCalculated = Math.round(calculatedCalories);
      const roundedTotal = Math.round(totalCalories);
      const tagLine = `This breakdown equals ${roundedCalculated} kcal, but you entered ${roundedTotal} kcal (${
        roundedCalculated - roundedTotal
      } kcal over). Are you sure?`;

      pendingUserRef.current = user;
      if (Platform.OS === "ios") {
        showConfirmAlert({
          title: "Macros don't match",
          tagLine,
          handleOnDone: handleOnDone,
          hasCancel: false,
          buttonTitle: "Confirm",
          isDestructive: false,
        });
      } else {
        setMismatchTagLine(tagLine);
        setIsConfirmModalOpen(true);
      }
      return;
    }

    saveCustomMacros(user);
  };

  const saveCustomMacros = (user: CustomMacrosPayload) => {
    addCustomMacros({ user })
      .unwrap()
      .then(async payload => {
        if (custom_macros_mode === "keep_same") {
          successAlert({
            body: payload?.message || "Custom targets added successfully",
          });
          navigation.goBack();
        } else {
          handleSetAdaptiveCalories();
        }
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleOnDone = () => {
    setIsConfirmModalOpen(false);
    if (pendingUserRef.current) {
      saveCustomMacros(pendingUserRef.current);
      pendingUserRef.current = null;
    }
  };

  const handleOnCloseInfoModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleSetAdaptiveCalories = () => {
    saveAutoAdaptiveCalories({
      custom_macros_mode: "keep_same",
    })
      .unwrap()
      .then(() => {
        dispatch(setCustomMacrosMode("keep_same"));
        successAlert({
          body: "Custom targets set successfully",
        });
        navigation.goBack();
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  // The toggle carries its own header row (back button + tabs), so the
  // wrapper's header is dropped to avoid a second back button.
  return (
    <ScreenWrapper hasTitle={!renderToggle} isBack={true} title={title}>
      {renderToggle}
      <KeyboardController>
        <View style={styles.main}>
          <CustomTextInput
            name="calories"
            label="Calories (kcal)"
            placeholder="0"
            control={control}
            isLoading={false}
            rules={DECIMAL_RULE_WITH_ZERO_STATISTICS}
            iconName={ICONS.calory}
            keyboardType="decimal-pad"
          />

          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="protein"
              label="Protein (g)"
              placeholder="0"
              control={control}
              isLoading={false}
              rules={DECIMAL_RULE_WITH_ZERO_STATISTICS}
              iconName={ICONS.protein}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.buttonContainer, { marginBottom: 0 }]}>
            <CustomButton
              title="Save"
              isLoading={isLoading || saving}
              onPress={handleSubmit(onSubmit)}
              isDisabled={isLoading || saving}
            />
          </View>
        </View>
      </KeyboardController>
      <ConfirmationAlert
        isModalOpen={isConfirmModalOpen}
        title="Macros don't match"
        tagLine={mismatchTagLine}
        buttonTitle="Confirm"
        handleOnClose={handleOnCloseInfoModal}
        handleOnDone={handleOnDone}
        justConfirm={true}
      />
    </ScreenWrapper>
  );
};

export default AddCustomMacros;
