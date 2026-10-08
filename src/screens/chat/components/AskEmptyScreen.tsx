import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import styles from "../styles";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const AskEmptyScreen = () => {
  const { colors } = useTheme();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.emptyView}>
        <Animated.View entering={FadeInDown.springify().damping(16)}>
          <AppText
            allowFontScaling={false}
            style={[styles.emptyEyebrow, { color: colors.ACCENT_TEXT }]}
          >
            Ask NutriSync
          </AppText>
          <AppText
            allowFontScaling={false}
            style={[styles.emptyTitle, { color: colors.HEADING }]}
          >
            What’s on your plate today?
          </AppText>
          <AppText
            allowFontScaling={false}
            style={[styles.emptySubtitle, { color: colors.TEXT }]}
          >
            Ask about meals, macros or goals.
          </AppText>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AskEmptyScreen;
