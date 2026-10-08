import { View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../styles";
import { activeOpacity } from "../../../../constant";
import { ACTIVITY_LEVEL_DATA } from "../../../../data/staticData";
import { ActivityLevelProps } from "../../../../schemas/types";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

type Props = {
  handleSaveActivity: (levelValue: ActivityLevelProps) => void;
  currentValue?: string;
};

const ActivityLevelSheet = ({
  handleSaveActivity,
  currentValue = "",
}: Props) => {
  const { colors, scheme } = useTheme();
  const [levelValue, setLevelValue] = useState<ActivityLevelProps>({
    value: "",
    title: "",
    tagLine: "",
  });

  useEffect(() => {
    if (currentValue) {
      const found = ACTIVITY_LEVEL_DATA?.find(
        item => item?.value === currentValue,
      );
      if (found) {
        setLevelValue(found);
      }
    }
  }, [currentValue]);

  // Selecting a level saves it and closes the sheet, there is no save button
  const handleSelectActivityLevel = (selectedLevel: ActivityLevelProps) => {
    setLevelValue(selectedLevel);
    handleSaveActivity(selectedLevel);
  };

  return (
    <View>
      <View style={styles.sheetListView}>
        {ACTIVITY_LEVEL_DATA?.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => handleSelectActivityLevel(item)}
              key={item?.value}
              style={
                item?.value === levelValue?.value
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
                style={[styles.itemText, { color: colors.HEADING }]}
              >
                {item?.title}
              </AppText>
              <AppText
                allowFontScaling={false}
                style={[styles.itemTagText, { color: colors.TEXT }]}
              >
                {item?.tagLine}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ActivityLevelSheet;
