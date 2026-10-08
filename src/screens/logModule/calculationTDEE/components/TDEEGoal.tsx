import { View, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../styles";
import { activeOpacity } from "../../../../constant";
import { COLORS } from "../../../../macros/colors";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

type Props = {
  handleSelectGoal: (goal: string) => void;
  selectedGoal: string;
};

const TDEEGoal = ({ handleSelectGoal, selectedGoal }: Props) => {
  const { colors, scheme } = useTheme();

  return (
    <TouchableOpacity>
      <AppText
        allowFontScaling={false}
        style={[styles.inputLabel, { color: colors.HEADING }]}
      >
        Goal
      </AppText>
      <View style={styles.goalContainer}>
        {["lose", "maintain", "gain"].map(item => {
          return (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => handleSelectGoal(item)}
              key={item}
              style={[
                styles.goalView,
                {
                  backgroundColor:
                    scheme === "dark" ? colors.INPUT_BG : colors.WHITE,
                  borderColor:
                    selectedGoal === item ? COLORS.PRIMARY : COLORS.TRANSPARENT,
                },
              ]}
            >
              <AppText
                allowFontScaling={false}
                style={[styles.textGoal, { color: colors.HEADING }]}
              >
                {item}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

export default TDEEGoal;
