import { View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "../../../../schemas/types";
import { screens } from "../../../../navigations/routes";
import styles from "../styles";
import CustomButton from "../../../../components/buttons";
import ICONS from "../../../../assets/icons";
import { useKeyboardVisibility } from "../../../../hooks/useKeyboardVisibility";

const NavigateTDEEButtom = () => {
  const isKeyboardOpen = useKeyboardVisibility();
  const navigation = useNavigation<RootNavigationProp>();

  const handlePressOnTDEECalculate = () => {
    navigation.navigate(screens.TDEE_CALCULATION_SCREEN, {
      hasBack: true,
      showLogin: "no",
      from: "logs",
    });
  };

  return (
    <>
      {!isKeyboardOpen && (
        <View style={styles.tdeeButton}>
          <CustomButton
            title="Calculate TDEE"
            onPress={handlePressOnTDEECalculate}
            customStyle={{
              paddingHorizontal: 20,
            }}
            leftButtonIcon={ICONS.calory}
          />
        </View>
      )}
    </>
  );
};

export default NavigateTDEEButtom;
