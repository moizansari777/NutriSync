import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import styles from "../styles";
import CurvedLineChart from "../../../../../components/customCharts/CurvedLineChart";
import { RootState } from "../../../../../states/store/store";
import { useTheme } from "../../../../../hooks/useTheme";
import AppText from "../../../../../components/appText";

const WeightGraph = ({ data }: any) => {
  const { colors } = useTheme();
  const sharedFilter = useSelector(
    (state: RootState) =>
      state.filtersReducer?.sharedFilter ?? "last_7_days",
  );

  return (
    <View style={[styles.view, { backgroundColor: colors.WHITE }]}>
      {data?.weight_data?.length > 0 ? (
        <CurvedLineChart
          label="Weight (Kg)"
          prefixLabel="kg   "
          data={data?.weight_data || []}
          step={sharedFilter === "last_7_days" ? 5 : 10}
          filter={sharedFilter}
        />
      ) : (
        <View style={styles.noFoundView}>
          <AppText allowFontScaling={false} style={[styles.noFoundText, { color: colors.TEXT }]}>
            No chart data found
          </AppText>
        </View>
      )}
    </View>
  );
};

export default WeightGraph;
