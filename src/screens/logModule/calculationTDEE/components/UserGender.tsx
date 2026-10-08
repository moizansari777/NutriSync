import { View, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../styles";
import { activeOpacity } from "../../../../constant";
import { COLORS } from "../../../../macros/colors";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

type Props = {
  handleSelectGender: (goal: string) => void;
  selectedGender: string;
};

const UserGender = ({ handleSelectGender, selectedGender }: Props) => {
  const { colors, scheme } = useTheme();

  return (
    <TouchableOpacity>
      <AppText
        allowFontScaling={false}
        style={[styles.inputLabel, { color: colors.HEADING }]}
      >
        Gender (Assigned at birth)
      </AppText>
      <View style={styles.goalContainer}>
        {["male", "female"].map(item => {
          return (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => handleSelectGender(item)}
              key={item}
              style={[
                styles.goalView,
                {
                  backgroundColor:
                    scheme === "dark" ? colors.INPUT_BG : colors.WHITE,
                  borderColor:
                    selectedGender === item
                      ? COLORS.PRIMARY
                      : COLORS.TRANSPARENT,
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

export default UserGender;
