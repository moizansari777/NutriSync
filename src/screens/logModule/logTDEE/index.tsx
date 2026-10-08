import { Keyboard, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import ScreenWrapper from "../../../components/screenWrapper";
import LogHeader from "./components/LogHeader";
import TrackedCounts from "./components/TrackedCounts";
import CustomFilters from "../../../components/customfilters";
import { TDEE_FILTER_DATA } from "../../../data/staticData";
import { RootState } from "../../../states/store/store";
import { logsTDEEServices } from "../../../services/logsTDEEServices";
import { setLogTDEEFilter } from "../../../states/reducer/filtersReducer";
import Statistics from "./components/Statistics";
import StatsCharts from "./components/StatsCharts";
import KeyboardController from "../../../components/keyboardController";

const LogTDEE = () => {
  const dispatch = useDispatch();
  const [sheetKey, setSheetKey] = useState(0);

  const isMessageProcessingCompleted = useSelector(
    (state: RootState) => state.chatReducer?.isMessageProcessing,
  );
  const filterSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );
  const logTDEEFilter = useSelector(
    (state: RootState) => state.filtersReducer?.logTDEEFilter,
  );

  const handleOpenFilterSheet = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      filterSheetRef.current?.present();
    }, 0);
  }, []);

  const handleSearch = useCallback((searchType: string, value: string) => {
    dispatch(setLogTDEEFilter(value));
    filterSheetRef.current?.close();
    setTimeout(() => {
      setSheetKey(prev => prev - 1);
    }, 300);
  }, []);

  const onRefresh = useCallback(() => {
    handeRefreshData();
  }, []);

  const handeRefreshData = async () => {
    dispatch(logsTDEEServices.util.invalidateTags(["counts"]));
    dispatch(logsTDEEServices.util.invalidateTags(["statistics"]));
  };

  return (
    <ScreenWrapper paddingTop={0}>
      <View style={styles.container}>
        <LogHeader handleOpenFilterSheet={handleOpenFilterSheet} />
        <KeyboardController onRefresh={onRefresh}>
          <View style={styles.innerContainer}>
            <TrackedCounts
              isMessageProcessingCompleted={isMessageProcessingCompleted}
            />

            {["today", "yesterday"].includes(logTDEEFilter) && (
              <Statistics filter={logTDEEFilter} />
            )}

            {["last_7_days", "last_30_days"].includes(logTDEEFilter) && (
              <StatsCharts filter={logTDEEFilter} />
            )}
          </View>
        </KeyboardController>
      </View>
      <CustomFilters
        key={sheetKey}
        filterSheetRef={filterSheetRef}
        handleSearchFilter={handleSearch}
        filterData={TDEE_FILTER_DATA}
        type="logs"
        currentValue={logTDEEFilter}
      />
    </ScreenWrapper>
  );
};

export default LogTDEE;
