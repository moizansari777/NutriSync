import { View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";
import styles from "./styles";
import { FILTER_DATA } from "../../data/staticData";
import { FilterProps } from "../../schemas/types";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

type Props = {
  handleSelectFilter: (filterValue: FilterProps) => void;
  filterData?: any;
  type?: string;
  currentValue?: string;
  title?: string;
};

const FilsterList = ({
  handleSelectFilter,
  filterData = FILTER_DATA,
  type = "",
  currentValue = "",
  title,
}: Props) => {
  const { colors, scheme } = useTheme();
  const [filter, setFilter] = useState<FilterProps>();

  useEffect(() => {
    if (currentValue && filterData) {
      let found = filterData?.find((i: FilterProps) => i?.id === currentValue);
      setFilter(found);
    }
  }, [currentValue, type]);

  const onPressFilter = (filterValue: FilterProps) => {
    setFilter(filterValue);
    handleSelectFilter(filterValue);
  };

  const heading = title ?? (type === "logs" ? "Show data for" : "Filter");

  return (
    <View style={styles.sheetBody}>
      <AppText
        allowFontScaling={false}
        style={[styles.sheetTitle, { color: colors.HEADING }]}
      >
        {heading}
      </AppText>
      <View
        style={[
          styles.group,
          {
            backgroundColor: scheme === "dark" ? colors.GRAY_BG : colors.WHITE,
            borderColor: colors.BORDER_COLOR,
          },
        ]}
      >
        {filterData?.map((item: any, index: number) => {
          const isSelected = item?.id === filter?.id;
          const isLast = index === filterData.length - 1;

          return (
            <Pressable
              key={item?.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onPressFilter(item)}
              style={({ pressed }) => [
                styles.row,
                !isLast && {
                  borderBottomColor: colors.BORDER_COLOR,
                  borderBottomWidth: styles.row.borderBottomWidth,
                },
                isLast && styles.rowLast,
                pressed && { backgroundColor: colors.BORDER_COLOR },
              ]}
            >
              <AppText
                allowFontScaling={false}
                style={[
                  styles.itemText,
                  isSelected && styles.itemTextActive,
                  { color: colors.HEADING },
                ]}
              >
                {item?.name}
              </AppText>
              {isSelected ? (
                <View
                  style={[styles.radio, { backgroundColor: colors.PRIMARY }]}
                >
                  <Svg width={14} height={14} viewBox="0 0 24 24">
                    <Path
                      d="M5 12.5 10 17.5 19 7"
                      stroke={colors.ON_PRIMARY}
                      strokeWidth={3.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </Svg>
                </View>
              ) : (
                <View
                  style={[
                    styles.radio,
                    styles.radioEmpty,
                    { borderColor: colors.ICON_COLOR },
                  ]}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default FilsterList;
