import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CommonActions, useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../../../components/screenWrapper";
import styles from "./styles";
import {
  DECIMAL_RULE,
  DIGITS_RULE,
  NUMBER_RULE,
} from "../../../utils/validationRules";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import ICONS from "../../../assets/icons";
import CustomSelect from "../../../components/customSelect";
import CustomBottomSheet from "../../../components/customBottomSheet";
import ActivityLevelSheet from "./components/ActivityLevelSheet";
import {
  ActivityLevelProps,
  GoalDropdownSheetProps,
  RootNavigationProp,
  UnitProps,
} from "../../../schemas/types";
import TDEEGoal from "./components/TDEEGoal";
import { FONTS } from "../../../assets/fonts";
import { fontSize } from "../../../utils/responsiveSize";
import CustomButton from "../../../components/buttons";
import { activeOpacity, mainHPadding } from "../../../constant";
import { getError } from "../../../utils/errors";
import { errorAlert } from "../../../utils/alerts";
import {
  useCalculateTDEEMutation,
  useGetPreviousTDEEQuery,
  useGetTDEESuggesionQuery,
} from "../../../services/logsTDEEServices";
import PositionedLoader from "../../../components/loaders/PositionedLoader";
import { RootStackParamList, screens } from "../../../navigations/routes";
import LabelRightUI from "./components/LabelRightUI";
import {
  ACTIVITY_LEVEL_DATA,
  HEIGHT_UNIT_DATA,
  WEEKLY_GOAL_DATA,
  WEIGHT_UNIT_DATA,
} from "../../../data/staticData";
import CustomFilters from "../../../components/customfilters";
import { setTargetMacros } from "../../../states/reducer/logReducer";
import { RootState } from "../../../states/store/store";
import UserGender from "./components/UserGender";
import { useLazyGetAccountDataQuery } from "../../../services/profileServices";
import {
  logoutFromStore,
  setUserAuthData,
} from "../../../states/reducer/authReducer";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";
import AdaptiveCaloriesToggle from "./components/AdaptiveCaloriesToggle";
import GoalDropdown from "./components/GoalDropdown";

const AUTO_CALCULATE_DELAY = 800;

const getWeightUnitOption = (weightUnit?: string | null): UnitProps | null => {
  const unit = (weightUnit ?? "").toString().trim().toLowerCase();
  if (!unit) {
    return null;
  }

  return unit.startsWith("lb") ? WEIGHT_UNIT_DATA[1] : WEIGHT_UNIT_DATA[0];
};

const toWholeWeight = (weight?: number | string | null) => {
  const value = Math.round(Number(weight ?? 0));
  return Number.isFinite(value) && value > 0 ? value.toString() : "";
};

const isPositiveNumber = (value?: string | number | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
};

const convertToCm = (feet: number | string, inches: number | string) => {
  const ft = Number(feet) || 0;
  const inch = Number(inches) || 0;
  return ft * 30.48 + inch * 2.54;
};

const convertCmToFeetInches = (cm: number) => {
  const totalInches = cm / 2.54;

  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches - feet * 12);

  if (inches === 12) {
    feet += 1;
    inches = 0;
  }

  return { feet, inches };
};

type Props = {
  params?: RootStackParamList[screens.TDEE_CALCULATION_SCREEN];
  title?: string;
  renderToggle?: ReactNode;
};

const CalculationTDEE: FC<Props> = ({
  params,
  title = "Calculate Your TDEE",
  renderToggle = null,
}) => {
  const navigation = useNavigation<RootNavigationProp>();
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const hasBack = params?.hasBack ?? false;
  const showLogin = params?.showLogin ?? "";
  const screenFrom = params?.from ?? "";

  const canGoBack = navigation.canGoBack();

  const activityLevelSheet = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );
  const goalDropdownSheet = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );

  const heightUnitSheet = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );

  const weightUnitSheet = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );

  const savedSignature = useRef<string>("");
  const isBaselineLocked = useRef<boolean>(false);

  const [sheetKey, setSheetKey] = useState(0);
  const [totalTargetKcal, setTotalTargetKcal] = useState<any>(null);
  const [suggestionParams, setSuggestionParams] = useState<any>(null);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevelProps>({
    value: "",
    title: "",
    tagLine: "",
  });
  const [goalDropdownSheetValue, setGoalDropdownSheetValue] =
    useState<GoalDropdownSheetProps>({
      value: "",
      kcal: "",
      title: "",
    });

  const [selectedHeightUnit, setSelectedHeightUnit] = useState<UnitProps>(
    HEIGHT_UNIT_DATA[0],
  );
  const [selectedWeightUnit, setSelectedWeightUnit] = useState<UnitProps>(
    WEIGHT_UNIT_DATA[0],
  );

  const user = useSelector((state: RootState) => state.authReducer?.userData);
  const hasMacros = useSelector(
    (state: RootState) => state.logReducer?.hasMacros,
  );

  const profileWeight = useMemo(() => {
    const weight = Number(user?.user?.weight ?? 0);
    return Number.isFinite(weight) && weight > 0 ? weight : null;
  }, [user?.user?.weight]);

  const profileWeightUnit = useMemo(
    () => getWeightUnitOption(user?.user?.weight_unit),
    [user?.user?.weight_unit],
  );

  const { data: previousTDEE } = useGetPreviousTDEEQuery(undefined, {
    skip: showLogin !== "no",
  });

  const { data: suggestionData, isFetching: isSuggestionFetching } =
    useGetTDEESuggesionQuery(suggestionParams, { skip: !suggestionParams });

  const [calculateTDEEApi] = useCalculateTDEEMutation();
  const [getAccountsData, { isFetching }] = useLazyGetAccountDataQuery();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { dirtyFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      age: "",
      height: "",
      feet: "",
      inches: "",
      weight: "",
    },
  });

  const watchedValues = useWatch({ control });
  const age = watchedValues?.age ?? "";
  const height = watchedValues?.height ?? "";
  const feet = watchedValues?.feet ?? "";
  const inches = watchedValues?.inches ?? "";
  const weight = watchedValues?.weight ?? "";

  const handleOpenLevelSheet = useCallback(() => {
    Keyboard.dismiss();
    activityLevelSheet?.current?.present();
  }, []);

  const handleOpenGoalDropdownSheet = useCallback(() => {
    Keyboard.dismiss();
    goalDropdownSheet?.current?.present();
  }, []);

  const handleOpenHeightUnitsSheet = useCallback(() => {
    Keyboard.dismiss();
    heightUnitSheet?.current?.present();
  }, []);

  const handleOpenWeightUnitsSheet = useCallback(() => {
    Keyboard.dismiss();
    weightUnitSheet?.current?.present();
  }, []);

  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setSheetKey(prev => prev - 1);
    }
  }, []);

  const handleSaveActivity = (activityValues: ActivityLevelProps) => {
    if (activityValues?.value) {
      activityLevelSheet?.current?.close();
      setHasSelectionChanged(true);
      setActivityLevel(activityValues);
    } else {
      errorAlert({
        body: "Select activity level",
      });
    }
  };

  const handleSaveGoalDropdownSheet = (goalValue: GoalDropdownSheetProps) => {
    if (goalValue?.value) {
      goalDropdownSheet?.current?.close();
      setHasSelectionChanged(true);
      setGoalDropdownSheetValue(goalValue);
    } else {
      errorAlert({
        body: "Select weekly goal",
      });
    }
  };

  const handleSelectGoal = (goalValue: string) => {
    setHasSelectionChanged(true);
    setSelectedGoal(goalValue);
  };

  const handleSelectGender = (genderValue: string) => {
    setHasSelectionChanged(true);
    setSelectedGender(genderValue);
  };

  const buildFitnessPayload = useCallback(
    (data: any) => {
      const dataProps = {
        activity_level: activityLevel?.value,
        weight_change_rate: "",
        goal_tdee: selectedGoal,
        gender: selectedGender,
        height_unit: selectedHeightUnit?.id,
        weight_unit: selectedWeightUnit?.id,
        age: data?.age,
        height: 0,
        weight: 0,
      };

      if (selectedGoal !== "maintain" && goalDropdownSheetValue?.value) {
        dataProps.weight_change_rate = goalDropdownSheetValue?.value;
      }

      if (selectedHeightUnit?.id === "cm") {
        dataProps.height = data?.height;
      } else {
        const heightCm = convertToCm(data?.feet, data?.inches);
        dataProps.height = heightCm;
      }

      dataProps.weight = data?.weight;

      return dataProps;
    },
    [
      activityLevel?.value,
      goalDropdownSheetValue?.value,
      selectedGender,
      selectedGoal,
      selectedHeightUnit?.id,
      selectedWeightUnit?.id,
    ],
  );

  const isFormReady = useMemo(() => {
    if (!selectedGender || !selectedGoal || !activityLevel?.value) {
      return false;
    }

    if (selectedGoal !== "maintain" && !goalDropdownSheetValue?.value) {
      return false;
    }

    if (!isPositiveNumber(age) || !isPositiveNumber(weight)) {
      return false;
    }

    if (selectedHeightUnit?.id === "cm") {
      return isPositiveNumber(height);
    }

    if (`${feet}`.trim() === "" || `${inches}`.trim() === "") {
      return false;
    }

    return convertToCm(feet, inches) > 0;
  }, [
    activityLevel?.value,
    age,
    feet,
    goalDropdownSheetValue?.value,
    height,
    inches,
    selectedGender,
    selectedGoal,
    selectedHeightUnit?.id,
    weight,
  ]);

  const autoPayload = useMemo(() => {
    if (!isFormReady) {
      return null;
    }

    return buildFitnessPayload({ age, height, feet, inches, weight });
  }, [age, buildFitnessPayload, feet, height, inches, isFormReady, weight]);

  const autoSignature = useMemo(
    () => (autoPayload ? JSON.stringify(autoPayload) : ""),
    [autoPayload],
  );

  const suggestionSignature = useMemo(
    () => (suggestionParams ? JSON.stringify(suggestionParams) : ""),
    [suggestionParams],
  );

  const isSuggestionUpdating =
    !!autoSignature &&
    (isSuggestionFetching || suggestionSignature !== autoSignature);

  const hasUserInteracted = useMemo(
    () => hasSelectionChanged || Object.keys(dirtyFields ?? {}).length > 0,
    [dirtyFields, hasSelectionChanged],
  );

  const onSubmit = (data: any) => {
    if (!isPositiveNumber(totalTargetKcal)) {
      errorAlert({
        title: "No Suggested Target",
        body: "Complete your details to get a suggested target first",
      });
      return;
    }

    const dataProps = buildFitnessPayload(data);
    const signature = JSON.stringify(dataProps);

    setIsUpdating(true);

    calculateTDEEApi(dataProps)
      .unwrap()
      .then(payload => {
        setIsUpdating(false);
        savedSignature.current = signature;
        setTotalTargetKcal(payload?.target_kcal?.target_kcal ?? null);
        dispatch(setTargetMacros(payload));
        handleGetUserDetails();
      })
      .catch(error => {
        setIsUpdating(false);
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  const handleSaveWeightUnit = (searchType: string, text: string) => {
    setHasSelectionChanged(true);
    const weightUnit = WEIGHT_UNIT_DATA.find(item => item?.id === text);
    if (weightUnit) {
      setSelectedWeightUnit(weightUnit);
    }

    if (profileWeight !== null) {
      const storedUnitId = (profileWeightUnit ?? WEIGHT_UNIT_DATA[0])?.id;
      setValue(
        "weight",
        text === storedUnitId ? toWholeWeight(profileWeight) : "",
      );
      return;
    }

    if (previousTDEE?.profile?.weight_unit !== text) {
      setValue("weight", "");
    } else {
      setValue("weight", toWholeWeight(previousTDEE?.profile?.weight));
    }
  };

  const handleSaveHeightUnit = (searchType: string, text: string) => {
    setHasSelectionChanged(true);
    const heightUnit = HEIGHT_UNIT_DATA.find(item => item?.id === text);
    if (heightUnit) {
      setSelectedHeightUnit(heightUnit);
    }

    if (previousTDEE?.profile?.height_unit === "ft" && text === "cm") {
      setValue("height", previousTDEE?.profile?.height?.toString() || "");
    }
  };

  const handleGetUserDetails = () => {
    getAccountsData(undefined)
      .then(payload => {
        if (screenFrom === "logs") {
          navigation.replace(screens.MAIN_SCREEN_STACK, {
            screen: screens.BOTTOM_TAB_STACK,
            params: {
              screen: screens.LOG_TDEE_ROOT_SCREEN,
            },
          });
        } else if (screenFrom === "setting") {
          navigation.goBack();
        } else if (screenFrom === "auth") {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: screens.MAIN_SCREEN_STACK }],
            }),
          );
        }

        dispatch(
          setUserAuthData({
            user: payload?.data?.user,
            token: user?.token || "",
            login: false,
            isAffiliate: false,
          }),
        );
      })
      .catch(error => {});
  };

  const handleGoToLogin = () => {
    dispatch(logoutFromStore());
  };

  useEffect(() => {
    if (previousTDEE) {
      setValue("age", previousTDEE?.profile?.age?.toString() || "");
      if (profileWeight === null) {
        setValue("weight", toWholeWeight(previousTDEE?.profile?.weight));
      }
      setSelectedGoal(previousTDEE?.tdee?.goal_tdee || "");
      setSelectedGender(previousTDEE?.profile?.gender || "");

      if (previousTDEE?.profile?.height_unit === "cm") {
        setSelectedHeightUnit(HEIGHT_UNIT_DATA[0]);
        setValue("height", previousTDEE?.profile?.height?.toString() || "");
      } else {
        setSelectedHeightUnit(HEIGHT_UNIT_DATA[1]);
        const result = convertCmToFeetInches(
          previousTDEE?.profile?.height || 0,
        );
        setValue("feet", result?.feet?.toString() || "");
        setValue("inches", result?.inches?.toString() || "");
      }

      if (profileWeight === null) {
        if (previousTDEE?.profile?.weight_unit === "kg") {
          setSelectedWeightUnit(WEIGHT_UNIT_DATA[0]);
        } else {
          setSelectedWeightUnit(WEIGHT_UNIT_DATA[1]);
        }
      }

      const currentActivityLevel = ACTIVITY_LEVEL_DATA?.find(
        item => item?.value === previousTDEE?.profile?.activity_level,
      );
      if (currentActivityLevel) {
        setActivityLevel(currentActivityLevel);
      }

      const goalCurrentValue = WEEKLY_GOAL_DATA?.find(
        item => item?.value === previousTDEE?.tdee?.weight_change_rate,
      );
      if (goalCurrentValue) {
        setGoalDropdownSheetValue(goalCurrentValue);
      }
    }
  }, [previousTDEE]);

  useEffect(() => {
    if (profileWeight === null) {
      return;
    }

    setValue("weight", toWholeWeight(profileWeight));
    setSelectedWeightUnit(profileWeightUnit ?? WEIGHT_UNIT_DATA[0]);
  }, [profileWeight, profileWeightUnit, setValue]);

  useEffect(() => {
    if (isBaselineLocked.current) {
      return;
    }

    if (hasUserInteracted) {
      isBaselineLocked.current = true;
      return;
    }

    savedSignature.current = autoSignature;
  }, [autoSignature, hasUserInteracted]);

  useEffect(() => {
    if (!autoPayload) {
      return;
    }

    const timer = setTimeout(() => {
      setSuggestionParams(autoPayload);
    }, AUTO_CALCULATE_DELAY);

    return () => clearTimeout(timer);
  }, [autoPayload]);

  useEffect(() => {
    if (suggestionData) {
      setTotalTargetKcal(suggestionData?.suggested_kcal ?? null);
    }
  }, [suggestionData]);

  return (
    <ScreenWrapper
      hasTitle={!renderToggle}
      isBack={hasBack ? true : hasMacros ? (canGoBack ? true : false) : false}
      title={title}
      renderExtraUI={
        showLogin !== "no" ? (
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={handleGoToLogin}
          >
            <AppText
              allowFontScaling={false}
              style={[styles.buttonText, { color: colors.HEADING }]}
            >
              Login
            </AppText>
          </TouchableOpacity>
        ) : null
      }
    >
      {renderToggle}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <AdaptiveCaloriesToggle />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.topInputMargin}>
              <UserGender
                handleSelectGender={handleSelectGender}
                selectedGender={selectedGender}
              />
            </View>
            <View style={styles.topMargin}>
              <CustomTextInput
                name="age"
                label="Age"
                placeholder="Add your age"
                control={control}
                isLoading={false}
                rules={NUMBER_RULE}
                iconName={ICONS.user}
                keyboardType="number-pad"
              />
            </View>
            {selectedHeightUnit?.id === "cm" ? (
              <View style={styles.topInputMargin}>
                <CustomTextInput
                  name="height"
                  label="Height"
                  placeholder="Add your height in centimeters"
                  control={control}
                  isLoading={false}
                  rules={DECIMAL_RULE}
                  iconName={ICONS.height}
                  keyboardType="number-pad"
                  renderRightUI={
                    <LabelRightUI
                      handleOnPress={handleOpenHeightUnitsSheet}
                      selectedUnit={selectedHeightUnit}
                    />
                  }
                />
              </View>
            ) : (
              <View style={[styles.topInputMargin, { width: "100%" }]}>
                <AppText
                  allowFontScaling={false}
                  style={[styles.inputLabel, { color: colors.HEADING }]}
                >
                  Height
                </AppText>
                <View style={{ width: "100%", flexDirection: "row", gap: 15 }}>
                  <CustomTextInput
                    name="feet"
                    label="Feet"
                    placeholder="Feet"
                    control={control}
                    isLoading={false}
                    rules={DIGITS_RULE}
                    iconName={ICONS.height}
                    customStyle={{ width: "100%" }}
                    mainStyle={{ flex: 0.6 }}
                    keyboardType="number-pad"
                  />
                  <CustomTextInput
                    name="inches"
                    label="Inches"
                    placeholder="Inches"
                    control={control}
                    isLoading={false}
                    rules={DIGITS_RULE}
                    iconName={ICONS.height}
                    customStyle={{ width: "100%" }}
                    mainStyle={{ flex: 1 }}
                    keyboardType="number-pad"
                    renderRightUI={
                      <LabelRightUI
                        handleOnPress={handleOpenHeightUnitsSheet}
                        selectedUnit={selectedHeightUnit}
                      />
                    }
                  />
                </View>
              </View>
            )}

            <View style={styles.topInputMargin}>
              <CustomTextInput
                name="weight"
                label="Weight"
                placeholder="Add your weight"
                control={control}
                isLoading={false}
                rules={DECIMAL_RULE}
                iconName={ICONS.weight}
                keyboardType="number-pad"
                renderRightUI={
                  <LabelRightUI
                    handleOnPress={handleOpenWeightUnitsSheet}
                    selectedUnit={selectedWeightUnit}
                  />
                }
              />
            </View>
            <View style={styles.topInputMargin}>
              <CustomSelect
                label="Activity Level"
                placeHolder="Select activity level"
                value={activityLevel?.title}
                handleOnPress={handleOpenLevelSheet}
                iconName={ICONS.activityLevel}
              />
            </View>
            <View style={styles.topInputMargin}>
              <TDEEGoal
                handleSelectGoal={handleSelectGoal}
                selectedGoal={selectedGoal}
              />
            </View>

            {selectedGoal !== "maintain" && (
              <View style={styles.topInputMargin}>
                <CustomSelect
                  label="Weekly Goal"
                  placeHolder="Select weekly goal"
                  value={
                    goalDropdownSheetValue?.title
                      ? `${selectedGoal} ${goalDropdownSheetValue?.title}`
                      : ""
                  }
                  handleOnPress={handleOpenGoalDropdownSheet}
                  iconName={ICONS.goals}
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {totalTargetKcal ? (
        <View style={styles.suggestionContainer}>
          <AppText
            allowFontScaling={false}
            style={[styles.targetText, { color: colors.HEADING }]}
          >
            Suggested Target:
          </AppText>
          <AppText
            allowFontScaling={false}
            style={[
              styles.countText,
              {
                color: colors.HEADING,
                opacity: isSuggestionUpdating ? 0.5 : 1,
              },
            ]}
          >
            <AppText
              style={{
                fontFamily: FONTS.Medium_500,
                fontSize: fontSize(4),
              }}
            >
              {totalTargetKcal}
            </AppText>{" "}
            kcal/day
          </AppText>
        </View>
      ) : null}

      <CustomButton
        title={totalTargetKcal !== null ? "Update your TDEE" : "Calculate"}
        isLoading={false}
        isDisabled={
          isSuggestionUpdating || (totalTargetKcal === null && !isFormReady)
        }
        onPress={handleSubmit(onSubmit)}
        customStyle={{
          marginHorizontal: mainHPadding,
          marginBottom: bottom + 5,
        }}
      />

      <CustomBottomSheet
        bottomSheetRef={activityLevelSheet}
        isBackDrop={true}
        enableDrag={Platform.OS === "ios" ? false : true}
        enablePanDownClose={true}
        backdropPressBehavior="close"
        onSheetChange={handleSheetChange}
        key={`activity-level-${sheetKey}`}
        customSanps={Platform.OS === "ios" ? ["28%"] : ["85%"]}
      >
        <ActivityLevelSheet
          handleSaveActivity={handleSaveActivity}
          currentValue={activityLevel?.value}
        />
      </CustomBottomSheet>

      {selectedGoal !== "maintain" && (
        <CustomBottomSheet
          bottomSheetRef={goalDropdownSheet}
          isBackDrop={true}
          enableDrag={Platform.OS === "ios" ? false : true}
          enablePanDownClose={true}
          backdropPressBehavior="close"
          onSheetChange={handleSheetChange}
          key={`weekly-goal-${sheetKey}`}
          customSanps={Platform.OS === "ios" ? ["28%"] : ["40%"]}
        >
          <GoalDropdown
            handleSaveActivity={handleSaveGoalDropdownSheet}
            selectedGoal={selectedGoal}
            currentValue={goalDropdownSheetValue?.value}
          />
        </CustomBottomSheet>
      )}

      <CustomFilters
        filterSheetRef={weightUnitSheet}
        handleSearchFilter={handleSaveWeightUnit}
        filterData={WEIGHT_UNIT_DATA}
        title="Weight unit"
      />

      <CustomFilters
        filterSheetRef={heightUnitSheet}
        handleSearchFilter={handleSaveHeightUnit}
        filterData={HEIGHT_UNIT_DATA}
        title="Height unit"
      />
      {isFetching && <PositionedLoader msg="Fetching details..." />}
      {isUpdating && <PositionedLoader msg="Calculating..." />}
    </ScreenWrapper>
  );
};

export default CalculationTDEE;
