import { View } from "react-native";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import CurvedLineChart from "../../../../components/customCharts/CurvedLineChart";
import styles from "../styles";
import { useGetGraphStatisticsQuery } from "../../../../services/logsTDEEServices";
import PositionedLoader from "../../../../components/loaders/PositionedLoader";
import AppText from "../../../../components/appText";
import { useTheme } from "../../../../hooks/useTheme";
import { RootState } from "../../../../states/store/store";
import { getWeightInKg } from "../../../../utils/macroRecommendations";

const StatsCharts = ({ filter }: { filter: string }) => {
  const { colors, scheme } = useTheme();

  const profileWeightUnit = useSelector(
    (state: RootState) => state.authReducer?.userData?.user?.weight_unit,
  );

  const { data, isFetching } = useGetGraphStatisticsQuery(
    {
      period: filter,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  const weightData = useMemo(
    () =>
      (Array.isArray(data?.weight) ? data.weight : []).map((item: any) => ({
        ...item,
        value: Math.round(getWeightInKg(item?.value, profileWeightUnit)),
      })),
    [data?.weight, profileWeightUnit],
  );

  const hasWeightData = weightData.length > 0;

  return (
    <View style={styles.mainChartView}>
      <View style={styles.container}>
        <View
          style={[
            styles.view,
            {
              paddingTop: 12,
              paddingBottom: 0,
              paddingLeft: 0,
              backgroundColor:
                scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
            },
          ]}
        >
          {hasWeightData ? (
            <CurvedLineChart
              label="Weight (Kg)"
              prefixLabel="kg"
              data={weightData}
              step={filter === "last_7_days" ? 5 : 10}
              filter={filter}
            />
          ) : (
            <View
              style={[
                styles.noFoundView,
                {
                  backgroundColor:
                    scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
                },
              ]}
            >
              <AppText
                allowFontScaling={false}
                style={[styles.noFoundText, { color: colors.TEXT }]}
              >
                No chart data found
              </AppText>
            </View>
          )}
          {isFetching && <PositionedLoader msg="Fetching data" />}
        </View>
        {hasWeightData && (
          <AppText
            allowFontScaling={false}
            style={[styles.scrollText, { color: colors.TEXT }]}
          >
            Scroll left for earlier days
          </AppText>
        )}
      </View>
    </View>
  );
};

export default StatsCharts;
