import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Keyboard,
  Switch,
  TextInput,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import {
  useAddLogsMutation,
  useLazyGetSuggestedMealMacrosQuery,
  useUpdateLogsMutation,
} from "../../../services/logsTDEEServices";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../../navigations/routes";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import {
  DECIMAL_RULE_WITH_ZERO,
  DECIMAL_RULE_WITH_ZERO_STATISTICS,
  REQUIRED_RULE,
} from "../../../utils/validationRules";
import ICONS from "../../../assets/icons";
import styles from "./styles";
import MacroInput from "./MacroField";
import AppText from "../../../components/appText";
import ScreenWrapper from "../../../components/screenWrapper";
import { getError } from "../../../utils/errors";
import { errorAlert, successAlert } from "../../../utils/alerts";
import KeyboardController from "../../../components/keyboardController";
import CustomButton from "../../../components/buttons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { useTheme } from "../../../hooks/useTheme";
import { storage } from "../../../utils/storage";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.QUICK_ADD_SCREEN
>;

type MacroField = "calories" | "protein" | "carbs" | "fat";
// The name field can't be anchored on, but it can be the field a request was
// triggered from, so it takes part in the loading state.
type TriggerField = MacroField | "name";

const MACRO_FIELDS: readonly MacroField[] = [
  "calories",
  "protein",
  "carbs",
  "fat",
] as const;

const MACRO_TILES: { name: MacroField; label: string }[] = [
  { name: "protein", label: "Protein" },
];

// Below this the name is too vague to ask the backend about, and a request
// would only burn a round trip to fill the fields with noise.
const MIN_NAME_LENGTH = 3;

// How long typing has to stop before anything is sent. Long enough to sit out
// the pauses inside a typed-out name ("chicken bir…yani") so the request fires
// once, when the user is done — not on every few keystrokes.
const TYPING_SETTLE_MS = 800;

// Remembered across visits, so someone who prefers typing their own numbers
// doesn't have to switch it off every time.
const AUTO_FILL_STORAGE_KEY = "quick_add_auto_fill";

const QuickAddNewItem: FC<Props> = ({ navigation, route }) => {
  const currentLogData = route.params?.currentLogData || null;
  const type = route.params?.type || "";
  const { bottom } = useSafeAreaInsets();

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [addLogApi, { isLoading }] = useAddLogsMutation();
  const [updateLogApi, { isLoading: isUpdating }] = useUpdateLogsMutation();
  const [getSuggestedMealMacros] = useLazyGetSuggestedMealMacrosQuery();
  const { colors, scheme } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    // Read during render on purpose: touching `errors` is what subscribes this
    // screen to validation changes, which is what keeps `errorsRef` current.
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: currentLogData?.name?.toString() || "",
      calories: currentLogData?.calories?.toString() || "",
      protein: currentLogData?.protein?.toString() || "",
      carbs: currentLogData?.carbs?.toString() || "",
      fat: currentLogData?.fat?.toString() || "",
      water: currentLogData?.water?.toString() || "0",
    },
  });

  // The backend is the single source of truth for calories and macros: nothing
  // is derived on the device. Every edit — the name, or any one of the four
  // calorie/macro fields — is debounced into one call to
  // `logs/suggested_meal_macros`, and the response is written straight into all
  // four fields. Editing a macro sends the name and all four current values,
  // with that field named as the `anchor` so the backend keeps it fixed and
  // re-derives the rest around it.
  //
  // Keystrokes are debounced before hitting the API, the last fetched name is
  // remembered so a no-op name edit (or the item's own name in edit mode)
  // doesn't refetch, and a sequence number plus abort of the in-flight request
  // guarantee a slow response can never overwrite the result of a newer edit.
  const requestSeqRef = useRef(0);
  const requestRef = useRef<ReturnType<typeof getSuggestedMealMacros> | null>(
    null,
  );
  const lastFetchedNameRef = useRef(
    (currentLogData?.name?.toString() || "").trim(),
  );
  // The field the in-flight request came from. It carries the spinner and
  // stays editable — the user is still typing in it, and a further edit there
  // simply supersedes the request in flight. Every OTHER field freezes until
  // the response lands, so a second, conflicting edit can't race it.
  const [loadingField, setLoadingField] = useState<TriggerField | null>(null);
  const isFetchingMacros = loadingField !== null;

  // Whole grams only — no field ever shows a fraction. A field missing from
  // the response is left as-is rather than being wiped.
  const applyMacros = useCallback(
    (payload: any) => {
      const macros =
        payload?.data?.macros ??
        payload?.data ??
        payload?.macros ??
        payload ??
        {};

      const next: Partial<Record<MacroField, string>> = {};
      MACRO_FIELDS.forEach(field => {
        const parsed = parseFloat(String(macros?.[field] ?? ""));
        if (Number.isFinite(parsed) && parsed >= 0) {
          next[field] = String(Math.round(parsed));
        }
      });

      // An empty/unknown response must never blank out what the user typed.
      if (Object.keys(next).length === 0) return;

      MACRO_FIELDS.forEach(field => {
        const value = next[field];
        if (value === undefined) return;
        setValue(field, value, { shouldValidate: true, shouldDirty: true });
      });
    },
    [setValue],
  );

  // The same errors the inline messages under the fields are showing, kept in
  // a ref so the fetch can read them without being rebuilt on every keystroke.
  const errorsRef = useRef(errors);
  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  // The API is never asked about a value the form itself rejects: a field the
  // user has typed something invalid into blocks every request until the
  // inline error it is already showing has been resolved.
  //
  // An EMPTY macro field is not invalid input in that sense — "Required" only
  // means it hasn't been filled yet, and filling it is precisely what the
  // response is for. Blocking on those would deadlock the main flow, since a
  // failed Save marks every empty field Required and typing a name afterwards
  // would then never fetch anything.
  const hasInvalidInput = useCallback(() => {
    if (errorsRef.current?.name) return true;
    const values = getValues();
    return MACRO_FIELDS.some(
      field =>
        String(values[field] ?? "").trim().length > 0 &&
        !!errorsRef.current?.[field],
    );
  }, [getValues]);

  // `anchor` is the macro field the user just edited, or null when the fetch
  // was triggered by the name. Values are read at call time (not at schedule
  // time) so the debounced call always sends what's currently on screen.
  const fetchMacros = useCallback(
    async (anchor: MacroField | null) => {
      if (!isAutoFillRef.current) return;
      // Checked before anything is recorded as fetched, so fixing the invalid
      // field is all it takes for the next edit to go through.
      if (hasInvalidInput()) return;

      const values = getValues();
      const name = (values.name ?? "").trim();
      // The name is required for every request, anchored or not.
      if (name.length < MIN_NAME_LENGTH) return;

      // Everything the form currently holds goes with an anchored request, not
      // just the edited field: the backend re-derives around the anchor, so it
      // needs the other three to know what it is adjusting. Fields that are
      // still empty or half-typed are simply left out.
      const macros: Partial<Record<MacroField, number>> = {};
      MACRO_FIELDS.forEach(field => {
        const parsed = parseFloat(String(values[field] ?? ""));
        if (Number.isFinite(parsed) && parsed >= 0) macros[field] = parsed;
      });

      if (anchor) {
        const anchorValue = macros[anchor];
        if (anchorValue === undefined || anchorValue <= 0) return;
      } else {
        if (name === lastFetchedNameRef.current) return;
        lastFetchedNameRef.current = name;
      }

      const seq = ++requestSeqRef.current;
      requestRef.current?.abort();
      // `preferCacheValue` resolves instantly from the RTK Query cache when
      // the same name/macros/anchor combination is requested again.
      const request = getSuggestedMealMacros(
        anchor ? { name, anchor, macros } : { name },
        true,
      );
      requestRef.current = request;
      setLoadingField(anchor ?? "name");

      try {
        const payload = await request.unwrap();
        if (seq === requestSeqRef.current) applyMacros(payload);
      } catch {
        // Aborted or failed. Forget the name so a genuine failure can be
        // retried on the next edit.
        if (seq === requestSeqRef.current && !anchor) {
          lastFetchedNameRef.current = "";
        }
      } finally {
        // A newer request owns the loading state now; let it clear its own.
        if (seq === requestSeqRef.current) setLoadingField(null);
      }
    },
    [hasInvalidInput, getValues, getSuggestedMealMacros, applyMacros],
  );

  const debouncedFetchMacros = useDebouncedCallback(
    fetchMacros,
    TYPING_SETTLE_MS,
  );

  // With auto-fill off the form is plain manual entry: no request is made and
  // nothing the user types is overwritten. Read through a ref so a debounced
  // call scheduled before the switch flipped still sees the latest choice.
  const [isAutoFill, setIsAutoFill] = useState(true);
  const isAutoFillRef = useRef(true);

  useEffect(() => {
    storage.get<boolean>(AUTO_FILL_STORAGE_KEY, true).then(saved => {
      isAutoFillRef.current = saved;
      setIsAutoFill(saved);
    });
  }, []);

  // Dropping the name below the threshold invalidates any in-flight response
  // and unfreezes the fields — what's already in them stays put.
  const cancelFetch = useCallback(() => {
    requestSeqRef.current++;
    requestRef.current?.abort();
    lastFetchedNameRef.current = "";
    setLoadingField(null);
  }, []);

  useEffect(() => () => requestRef.current?.abort(), []);

  const handleToggleAutoFill = useCallback(
    (value: boolean) => {
      isAutoFillRef.current = value;
      setIsAutoFill(value);
      storage.set(AUTO_FILL_STORAGE_KEY, value);
      if (value) {
        // Fill straight away from whatever name is already typed.
        debouncedFetchMacros(null);
      } else {
        cancelFetch();
      }
    },
    [debouncedFetchMacros, cancelFetch],
  );

  // Only real user edits (type === "change") reach the API, so the
  // currentLogData effect and the setValue calls that write the response back
  // can't loop.
  useEffect(() => {
    const subscription = watch((value, { name, type: eventType }) => {
      if (eventType !== "change" || !name) return;

      if (name === "name") {
        // Always route through the debouncer: a short/empty name schedules a
        // no-op, which replaces (i.e. cancels) any still-pending fetch for
        // the edit that preceded it.
        debouncedFetchMacros(null);
        if ((value.name ?? "").trim().length < MIN_NAME_LENGTH) {
          cancelFetch();
        }
      } else if ((MACRO_FIELDS as readonly string[]).includes(name)) {
        debouncedFetchMacros(name as MacroField);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedFetchMacros, cancelFetch]);

  useEffect(() => {
    if (currentLogData) {
      setValue("name", currentLogData?.name?.toString());
      setValue("calories", currentLogData?.calories?.toString());
      setValue("protein", currentLogData?.protein?.toString());
      setValue("carbs", currentLogData?.carbs?.toString());
      setValue("fat", currentLogData?.fat?.toString());

      if (currentLogData?.water !== null) {
        setValue("water", currentLogData?.water?.toString());
      }
    }
  }, [currentLogData]);

  // Clears the dirty/validation state without touching what's on screen. A
  // bare `reset()` would restore the mount-time defaults instead — the
  // pre-edit numbers when updating, empty fields when adding — and the 300ms
  // wait before `goBack` is long enough to see them flash back.
  const resetToSaved = (data: any) => reset(data, { keepValues: true });

  const saveLog = (data: any) => {
    if (currentLogData) {
      updateLogApi({
        log: data,
        logId:
          type === "quickadd" ? currentLogData?.log_id : currentLogData?.id,
      })
        .then(() => {
          successAlert({
            body: "Data has been updated",
          });

          resetToSaved(data);
          setTimeout(() => {
            navigation.goBack();
          }, 300);
        })
        .catch(error => {
          const errorMessage = getError(error);
          errorAlert({ body: errorMessage || "" });
        });
    } else {
      addLogApi({ log: data })
        .then(() => {
          successAlert({
            body: "Data has been added",
          });

          resetToSaved(data);
          setTimeout(() => {
            navigation.goBack();
          }, 300);
        })
        .catch(error => {
          const errorMessage = getError(error);
          errorAlert({ body: errorMessage || "" });
        });
    }
  };

  const onSubmit = (data: any) => {
    Keyboard.dismiss();
    saveLog(data);
  };

  // Stable element/ref props so the memoized fields only re-render when the
  // fetch state actually flips, not on every parent render.
  const setNameInputRef = useCallback((ref: TextInput | null) => {
    inputRefs.current[0] = ref;
  }, []);
  const spinner = useMemo(
    () => <ActivityIndicator size="small" color={colors.TEXT} />,
    [colors.TEXT],
  );
  // The spinner sits in the field the request came from; the rest just freeze.
  const spinnerFor = useCallback(
    (field: TriggerField) => (loadingField === field ? spinner : null),
    [loadingField, spinner],
  );
  // The field being edited keeps its keyboard — only its neighbours lock.
  const isFieldLocked = useCallback(
    (field: TriggerField) => isFetchingMacros && loadingField !== field,
    [isFetchingMacros, loadingField],
  );

  const showWater = !currentLogData || !!currentLogData?.water;

  return (
    <ScreenWrapper
      isBack={true}
      isClose={true}
      hasTitle={true}
      title={currentLogData ? "Edit meal" : "New meal"}
    >
      <KeyboardController>
        <View style={styles.content}>
          <View>
            <CustomTextInput
              inputRef={setNameInputRef}
              name="name"
              label="What did you eat?"
              placeholder="Chicken burger"
              control={control}
              isLoading={isFieldLocked("name")}
              rules={REQUIRED_RULE}
              iconName={ICONS.name}
              renderInsideRightUI={spinnerFor("name")}
            />
            <View
              style={[
                styles.autoFillRow,
                {
                  backgroundColor:
                    scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
                  borderColor: colors.BORDER_COLOR,
                },
              ]}
            >
              <View style={styles.autoFillText}>
                <AppText
                  allowFontScaling={false}
                  style={[styles.autoFillTitle, { color: colors.HEADING }]}
                >
                  Auto-fill macros
                </AppText>
                <AppText
                  allowFontScaling={false}
                  style={[styles.hint, { color: colors.TEXT }]}
                >
                  {isAutoFill
                    ? "We fill in the numbers from the name. Change one and the rest adjust."
                    : "Enter the numbers yourself."}
                </AppText>
              </View>
              <Switch
                value={isAutoFill}
                onValueChange={handleToggleAutoFill}
                trackColor={{
                  false: colors.BORDER_COLOR,
                  true: colors.PRIMARY,
                }}
                ios_backgroundColor={colors.BORDER_COLOR}
              />
            </View>
          </View>

          <MacroInput
            variant="hero"
            name="calories"
            label="Calories"
            unit="kcal"
            control={control}
            rules={DECIMAL_RULE_WITH_ZERO}
            isLocked={isFieldLocked("calories")}
            isLoading={loadingField === "calories"}
          />

          <View>
            <AppText
              allowFontScaling={false}
              style={[styles.sectionTitle, { color: colors.HEADING }]}
            >
              Macros
            </AppText>
            <View style={styles.grid}>
              {MACRO_TILES.map(tile => (
                <MacroInput
                  key={tile.name}
                  name={tile.name}
                  label={tile.label}
                  unit="g"
                  control={control}
                  rules={DECIMAL_RULE_WITH_ZERO}
                  isLocked={isFieldLocked(tile.name)}
                  isLoading={loadingField === tile.name}
                />
              ))}
            </View>
          </View>

          {showWater && (
            <View>
              <AppText
                allowFontScaling={false}
                style={[styles.sectionTitle, { color: colors.HEADING }]}
              >
                Hydration
              </AppText>
              <MacroInput
                name="water"
                label="Water"
                unit="litres"
                control={control}
                rules={DECIMAL_RULE_WITH_ZERO_STATISTICS}
                isLocked={false}
                isLoading={false}
              />
            </View>
          )}
        </View>
      </KeyboardController>
      <View style={[styles.footer, { marginBottom: bottom + 10 }]}>
        <CustomButton
          title={currentLogData ? "Save changes" : "Add meal"}
          isLoading={isLoading || isUpdating}
          onPress={handleSubmit(onSubmit)}
          // Saving mid-fetch would store values the response is about to
          // replace.
          isDisabled={isLoading || isUpdating || isFetchingMacros}
        />
      </View>
    </ScreenWrapper>
  );
};

export default QuickAddNewItem;
