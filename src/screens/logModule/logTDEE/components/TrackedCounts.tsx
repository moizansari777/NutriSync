import { View, Platform, Pressable, Image, Keyboard } from "react-native";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { requestWidgetUpdate } from "react-native-android-widget";
import styles from "../styles";
import { useGetTargetKCalQuery } from "../../../../services/logsTDEEServices";
import LoadingIndicator from "../../../../components/loaders/LoadingIndicator";
import { COLORS } from "../../../../macros/colors";
import { RootState } from "../../../../states/store/store";
import { updateMacrosWidget } from "../../../../utils/widgetHelper";
import { storage } from "../../../../utils/storage";
import { AndroidMacrosWidgetView } from "../../../../components/androidMacrosWidget/AndroidMacrosWidgetView";
import {
  WIDGET_STORAGE_KEY,
  WidgetPayload,
  WidgetScheme,
} from "../../../../data/widgetDefaultData";
import CalorieRing from "./CalorieRing";
import MetricTile from "./MetricTile";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";
import { screens } from "../../../../navigations/routes";
import { useNavigation } from "@react-navigation/native";
import { Macro, RootNavigationProp } from "../../../../schemas/types";
import ICONS from "../../../../assets/icons";
import WaterTargetSheet from "./WaterTargetSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

/**
 * Widget rows are single-line, so raw floats such as 1234.5678901 would blow out
 * the layout. Match what the screen itself renders: at most one decimal.
 */
const toWidgetNumber = (value?: number | null): string =>
  Number(Number(value || 0).toFixed(1)).toString();

const TrackedCounts = ({
  isMessageProcessingCompleted,
}: {
  isMessageProcessingCompleted: boolean;
}) => {
  const { colors, scheme } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();
  const waterSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );
  const logTDEEFilter = useSelector(
    (state: RootState) => state.filtersReducer?.logTDEEFilter,
  );

  const { data, isFetching } = useGetTargetKCalQuery(
    { date: logTDEEFilter, autoRefetch: isMessageProcessingCompleted },
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );

  const { caloriesWidth, proteinWidth, waterWidth } = useMemo(() => {
    const calories = Math.min(
      (data?.tracked?.calories / data?.target_kcal) * 100,
      100,
    );
    const protein = Math.min(
      (data?.tracked?.protein / data?.target_protein) * 100,
      100,
    );
    const water = Math.min(
      (data?.tracked?.water / data?.target_water) * 100,
      100,
    );

    return {
      caloriesWidth: calories,
      proteinWidth: protein,
      waterWidth: water,
    };
  }, [data]);

  const bgColorCalories = useMemo(() => {
    const isTargetHit = data?.tracked?.calories >= data?.target_kcal;

    if (data?.goal_tdee === "lose") {
      // Lose → Green until target, Red after
      return isTargetHit ? COLORS.RED : COLORS.GREEN;
    }

    if (data?.goal_tdee === "gain") {
      // Gain → Red until target, Green after
      return isTargetHit ? COLORS.GREEN : COLORS.RED;
    }
    return !data?.tracked?.calories ? COLORS.GRAY_BG : COLORS.GREEN;
  }, [data?.goal_tdee, data?.tracked?.calories, data?.target_kcal]);

  const getStatusColor = (target: number, tracked: number) => {
    if (!target) return COLORS.GRAY_BG;
    return target > tracked ? COLORS.RED : COLORS.GREEN;
  };

  const proteinsBgColor = getStatusColor(
    data?.target_protein,
    data?.tracked?.protein,
  );

  const waterBgColor = getStatusColor(data?.target_water, data?.tracked?.water);

  useEffect(() => {
    if (logTDEEFilter === "today" && data) {
      if (Platform.OS === "ios") {
        handleWidgetDataForiOS();
      } else {
        handleWidgetDataForAndroid();
      }
    }
  }, [data, scheme]);

  const handleWidgetDataForAndroid = async () => {
    // The widget renderer only understands hex / rgba colors — named colors such
    // as "green" silently fall back to white and the progress bar disappears.
    const widgetData: Macro[] = [
      {
        title: "Calories (kcal)",
        total: toWidgetNumber(data?.target_kcal),
        tracked: toWidgetNumber(data?.tracked?.calories),
        color: bgColorCalories,
      },
      {
        title: "Protein (g)",
        total: toWidgetNumber(data?.target_protein),
        tracked: toWidgetNumber(data?.tracked?.protein),
        color: proteinsBgColor,
      },
      {
        title: "Water (ltr)",
        total: toWidgetNumber(data?.target_water),
        tracked: toWidgetNumber(data?.tracked?.water),
        color: waterBgColor,
      },
    ];

    const widgetScheme: WidgetScheme = scheme === "dark" ? "dark" : "light";

    await storage.set<WidgetPayload>(WIDGET_STORAGE_KEY, {
      macrosData: widgetData,
      scheme: widgetScheme,
    });

    requestWidgetUpdate({
      widgetName: "Macro",
      renderWidget: () => (
        <AndroidMacrosWidgetView
          macrosData={widgetData}
          scheme={widgetScheme}
        />
      ),
      widgetNotFound: () => {
        // console.log("Widget not found");
      },
    });
  };

  const handleWidgetDataForiOS = () => {
    const widgetData = [
      {
        title: "Cals",
        total: data?.target_kcal || 0,
        tracked: data?.tracked?.calories || 0,
        color: bgColorCalories === "#34C16C" ? "green" : "red",
        width: caloriesWidth || 0,
      },
      {
        title: "Protein",
        total: data?.target_protein,
        tracked: data?.tracked?.protein || 0,
        color: proteinsBgColor === "#34C16C" ? "green" : "red",
        width: proteinWidth || 0,
      },
      {
        title: "Water",
        total: data?.target_water,
        tracked: data?.tracked?.water || 0,
        color: proteinsBgColor === "#34C16C" ? "green" : "red",
        width: waterWidth || 0,
      },
    ];

    updateMacrosWidget(widgetData);
  };

  const handleGoToAddMacros = () => {
    navigation.navigate(screens.ADD_CUSTOM_MACROS_SCREEN);
  };

  // Dismiss first so a keyboard already up elsewhere does not fight the
  // sheet's own open animation.
  const handleOpenWaterSheet = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      waterSheetRef.current?.present();
    }, 0);
  }, []);

  const trackedKcal = Number(data?.tracked?.calories) || 0;
  const targetKcal = Number(data?.target_kcal) || 0;
  const remainingKcal = Math.round(targetKcal - trackedKcal);

  return (
    <View style={styles.dashboard}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Edit calorie target"
        onPress={handleGoToAddMacros}
        style={({ pressed }) => [
          styles.heroCard,
          { backgroundColor: colors.PRIMARY, shadowColor: colors.PRIMARY },
          pressed && styles.optionTilePressed,
        ]}
      >
        <CalorieRing
          percent={caloriesWidth || 0}
          size={132}
          strokeWidth={14}
          trackColor={`${colors.ON_PRIMARY}1A`}
          fillColor={colors.ON_PRIMARY}
          textColor={colors.ON_PRIMARY}
          value={String(Math.round(trackedKcal))}
          caption="kcal eaten"
        />
        <View style={styles.heroBody}>
          <AppText
            allowFontScaling={false}
            style={[styles.heroEyebrow, { color: colors.ON_PRIMARY }]}
          >
            {remainingKcal >= 0 ? "Remaining" : "Over target"}
          </AppText>
          <AppText
            allowFontScaling={false}
            style={[styles.heroNumber, { color: colors.ON_PRIMARY }]}
          >
            {Math.abs(remainingKcal)}
            <AppText
              allowFontScaling={false}
              style={[styles.heroUnit, { color: colors.ON_PRIMARY }]}
            >
              {" "}
              kcal
            </AppText>
          </AppText>
          <View
            style={[
              styles.heroTargetPill,
              { backgroundColor: `${colors.ON_PRIMARY}14` },
            ]}
          >
            <AppText
              allowFontScaling={false}
              style={[styles.heroTargetText, { color: colors.ON_PRIMARY }]}
            >
              Target {Math.round(targetKcal)}
            </AppText>
            <Image
              source={ICONS.edit2}
              style={styles.editIcon}
              tintColor={colors.ON_PRIMARY}
            />
          </View>
        </View>
        {isFetching && (
          <View style={styles.heroLoader}>
            <LoadingIndicator color={colors.ON_PRIMARY} />
          </View>
        )}
      </Pressable>

      <View style={styles.metricRow}>
        <MetricTile
          label="Protein"
          unit="g"
          tracked={data?.tracked?.protein}
          target={data?.target_protein}
          percent={proteinWidth}
          onPress={handleGoToAddMacros}
        />
        <MetricTile
          label="Water"
          unit="L"
          tracked={data?.tracked?.water}
          target={data?.target_water}
          percent={waterWidth}
          onPress={handleOpenWaterSheet}
        />
      </View>

      <WaterTargetSheet waterSheetRef={waterSheetRef} />
    </View>
  );
};

export default memo(TrackedCounts);
