import { Dimensions, StyleSheet, ScrollView, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { LineChart } from "react-native-chart-kit";
import { COLORS } from "../../macros/colors";
import { fontSize } from "../../utils/responsiveSize";
import { FONTS } from "../../assets/fonts";
import AppText from "../appText";
import { useTheme } from "../../hooks/useTheme";

const { width } = Dimensions.get("window");

const SEGMENTS = 4;
/**
 * chart-kit's built-in left inset for the y-axis labels (it calls the inset
 * `paddingRight`). Never pass it through the `style` prop to widen it: that
 * object is also spread onto the chart's wrapper View, so the value lands as
 * real padding on the right of the card. Labels get their clearance from
 * `yLabelsOffset` instead.
 */
const CHART_GUTTER = 64;
const POINT_SPACING = 60;
/** Breathing room kept to the right of the last point. */
const TRAILING_SPACE = 28;
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * `YYYY-MM-DD` has to be split by hand: `new Date("2026-08-12")` is parsed as
 * UTC midnight, which renders as the previous day everywhere west of UTC.
 */
const formatDayLabel = (value: string) => {
  const raw = String(value ?? "");
  const parts = DATE_ONLY.exec(raw);
  const date = parts
    ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
    : new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const formatValue = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

/**
 * Headroom for the y-axis. `step` only caps the padding: enough to keep the
 * curve off the frame, never so much that a real trend gets flattened. Bounds
 * are whole numbers spanning a multiple of SEGMENTS so the axis (drawn with
 * decimalPlaces: 0) never prints the same label twice.
 */
const getAxisBounds = (min: number, max: number, step: number) => {
  const cap = Number.isFinite(step) && step > 0 ? step : 5;
  const pad = Math.min(cap, Math.max(1, (max - min) * 0.15));

  let lower = Math.floor(min - pad);
  let upper = Math.ceil(max + pad);

  const span = Math.max(
    SEGMENTS,
    Math.ceil((upper - lower) / SEGMENTS) * SEGMENTS,
  );
  const grow = span - (upper - lower);

  lower -= Math.floor(grow / 2);
  upper += Math.ceil(grow / 2);

  if (lower < 0) {
    upper -= lower;
    lower = 0;
  }

  return { lower, upper };
};

const CurvedLineChart = ({
  label,
  prefixLabel,
  data,
  step,
  filter,
}: {
  label: string;
  prefixLabel: string;
  data: any;
  step: number;
  filter: string;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const didAutoScrollRef = useRef(false);
  const { colors, scheme } = useTheme();

  // A day with no logged reading comes back as 0/null; plotting it drops the
  // line to the baseline as if the value really was zero.
  const points = useMemo(
    () =>
      (Array.isArray(data) ? data : []).filter((item: any) => {
        const value = Number(item?.value);
        return Number.isFinite(value) && value > 0;
      }),
    [data],
  );

  const values = useMemo(
    () => points.map((item: any) => Number(item.value)),
    [points],
  );

  const scrollToEnd = useCallback(() => {
    if (didAutoScrollRef.current) return;
    didAutoScrollRef.current = true;

    // Wait a tick so the chart can measure & render its final width.
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    });
  }, []);

  useEffect(() => {
    didAutoScrollRef.current = false;
  }, [points.length, filter]);

  if (values.length === 0) {
    return (
      <View style={styles.emptyView}>
        <AppText
          allowFontScaling={false}
          style={[styles.emptyText, { color: colors.TEXT }]}
        >
          No chart data found
        </AppText>
      </View>
    );
  }

  const { lower, upper } = getAxisBounds(
    Math.min(...values),
    Math.max(...values),
    step,
  );

  // chart-kit parks the last point a full slot short of the right edge, which
  // leaves a band of empty chart after it. The slot can't be shrunk (it is the
  // point spacing), so the leftover is clipped by the wrapper instead.
  const chartWidth = Math.max(
    width * 0.9,
    CHART_GUTTER + values.length * POINT_SPACING,
  );
  const trailingSlot = (chartWidth - CHART_GUTTER) / values.length;
  const visibleWidth = Math.max(
    width * 0.9,
    chartWidth - Math.max(0, trailingSlot - TRAILING_SPACE),
  );

  const formattedData = {
    labels: points.map((item: any) => formatDayLabel(item?.date)),
    datasets: [
      { data: values },
      // chart-kit has no y-domain prop, so an invisible two-point series is how
      // the axis gets headroom without inventing points on the real line.
      {
        data: [lower, upper],
        color: () => COLORS.TRANSPARENT,
        withDots: false,
      },
    ],
  };

  return (
    <>
      <AppText
        allowFontScaling={false}
        style={[styles.title, { color: colors.HEADING }]}
      >
        {label}
      </AppText>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator
        scrollIndicatorInsets={{ bottom: 10 }}
        contentContainerStyle={{
          paddingVertical: filter === "last_7_days" ? 25 : 10,
          paddingLeft: 6,
        }}
        onContentSizeChange={scrollToEnd}
      >
        <View style={[styles.chartClip, { width: visibleWidth }]}>
          <LineChart
            data={formattedData}
            width={chartWidth}
            height={filter === "last_7_days" ? 230 : 300}
            yAxisSuffix={prefixLabel}
            yLabelsOffset={8}
            bezier
            segments={SEGMENTS}
            renderDotContent={({ x, y, index }) => (
              <View
                key={index}
                style={[
                  styles.dotView,
                  { top: y - 15, left: x - 12, backgroundColor: colors.BLACK },
                ]}
              >
                <AppText allowFontScaling={false} style={styles.dotText}>
                  {formatValue(values[index] ?? 0)}
                </AppText>
              </View>
            )}
            chartConfig={{
              backgroundColor:
                scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
              backgroundGradientFrom:
                scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
              backgroundGradientTo:
                scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
              decimalPlaces: 0,
              color: () => colors.PRIMARY,
              labelColor: () => colors.HEADING,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "0",
                strokeWidth: "2",
                stroke: colors.PRIMARY,
                color: colors.PRIMARY,
              },
              propsForBackgroundLines: {
                stroke: colors.BORDER_COLOR,
                strokeWidth: 1,
                strokeDasharray: "",
              },
            }}
            withShadow={false}
            style={{
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default CurvedLineChart;

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize(3.7),
    fontFamily: FONTS.Medium_500,
    marginBottom: 15,
    textAlign: "center",
  },
  dotView: {
    position: "absolute",
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  dotText: {
    fontSize: fontSize(2.5),
    color: COLORS.WHITE,
    fontFamily: FONTS.SemiBold_600,
  },
  chartClip: {
    overflow: "hidden",
  },
  emptyView: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: fontSize(3.9),
    color: COLORS.TEXT,
    textAlign: "center",
  },
});
