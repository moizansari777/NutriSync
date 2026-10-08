import { View } from "react-native";
import React, { memo } from "react";
import { format } from "date-fns";
import styles from "../styles";
import { useTheme } from "../../../../hooks/useTheme";
import { useSelector } from "react-redux";
import { RootState } from "../../../../states/store/store";
import AppText from "../../../../components/appText";
import FilterWithText from "../../components/FilterWithText";
import SettingsButton from "../../../../components/settingsButton";
import { TDEE_FILTER_DATA } from "../../../../data/staticData";

const LogHeader = ({
  handleOpenFilterSheet,
}: {
  handleOpenFilterSheet: () => void;
}) => {
  const { colors } = useTheme();
  const logTDEEFilter = useSelector(
    (state: RootState) => state.filtersReducer?.logTDEEFilter,
  );

  const title =
    TDEE_FILTER_DATA.find(option => option.id === logTDEEFilter)?.name ??
    "Today";

  return (
    <View style={styles.headerView}>
      <View style={styles.headerTitleWrap}>
        <AppText
          allowFontScaling={false}
          style={[styles.headerEyebrow, { color: colors.ACCENT_TEXT }]}
        >
          {format(new Date(), "EEEE, MMM d")}
        </AppText>
        <AppText
          allowFontScaling={false}
          style={[styles.headerTitle, { color: colors.HEADING }]}
        >
          {title}
        </AppText>
      </View>

      <View style={styles.rightIconsView}>
        <FilterWithText
          handleOpenFilterSheet={handleOpenFilterSheet}
          value={logTDEEFilter}
        />
        <SettingsButton />
      </View>
    </View>
  );
};

export default memo(LogHeader);
