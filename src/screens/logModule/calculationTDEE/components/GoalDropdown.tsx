import { View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../styles";
import { activeOpacity } from "../../../../constant";
import { WEEKLY_GOAL_DATA } from "../../../../data/staticData";
import { GoalDropdownSheetProps } from "../../../../schemas/types";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

type Props = {
  handleSaveActivity: (goalValue: GoalDropdownSheetProps) => void;
  selectedGoal: string;
  currentValue?: string;
};

const GoalDropdown = ({
  handleSaveActivity,
  selectedGoal = "",
  currentValue = "",
}: Props) => {
  const { colors, scheme } = useTheme();
  const [goalValue, setGoalValue] = useState<GoalDropdownSheetProps>({
    value: "",
    title: "",
    kcal: "",
  });

  useEffect(() => {
    if (currentValue) {
      const found = WEEKLY_GOAL_DATA?.find(
        item => item?.value === currentValue,
      );
      if (found) {
        setGoalValue(found);
      }
    }
  }, [currentValue]);

  // Selecting a goal saves it and closes the sheet, there is no save button
  const handleSelectActivityLevel = (selectedLevel: GoalDropdownSheetProps) => {
    setGoalValue(selectedLevel);
    handleSaveActivity(selectedLevel);
  };

  return (
    <View>
      <View style={styles.sheetListView}>
        {WEEKLY_GOAL_DATA?.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => handleSelectActivityLevel(item)}
              key={item?.value}
              style={
                item?.value === goalValue?.value
                  ? [
                      styles.activeItemView,
                      {
                        backgroundColor:
                          scheme === "dark" ? colors.BLACK : colors.WHITE,
                        borderBottomColor: colors.BORDER_COLOR,
                      },
                    ]
                  : [
                      styles.itemView,
                      {
                        backgroundColor: colors.TRANSPARENT,
                        borderBottomColor: colors.BORDER_COLOR,
                      },
                    ]
              }
            >
              <AppText
                allowFontScaling={false}
                style={[
                  styles.itemText,
                  { color: colors.HEADING, textTransform: "capitalize" },
                ]}
              >
                {`${selectedGoal} ${item?.title} (${item?.kcal})`}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default GoalDropdown;
