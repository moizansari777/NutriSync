import { View, Pressable, Image } from "react-native";
import React, { FC } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useStyles } from "./styles";
import LoadingIndicator from "../loaders/LoadingIndicator";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  title: string;
  isLoading?: boolean;
  onPress: () => void;
  customStyle?: object;
  customTitleStyle?: object;
  isDisabled?: boolean;
  buttonIcon?: any;
  leftButtonIcon?: any;
  testID?: string;
  tintColor?: any;
};

const CustomButton: FC<Props> = ({
  title,
  isLoading,
  onPress,
  customStyle,
  customTitleStyle,
  isDisabled,
  buttonIcon,
  leftButtonIcon,
  testID,
  tintColor,
}) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  // Native-feeling press: a quick squish with spring release, like UIKit buttons.
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <>
      {isLoading ? (
        <View style={[styles.buttonContainer, customStyle]}>
          <LoadingIndicator />
        </View>
      ) : isDisabled ? (
        <View
          style={[
            styles.buttonContainer,
            styles.disableButtonContainer,
            customStyle,
          ]}
        >
          <AppText
            allowFontScaling={false}
            style={[styles.label, customTitleStyle]}
          >
            {title}
          </AppText>
        </View>
      ) : (
        <AnimatedPressable
          style={[styles.buttonContainer, customStyle, pressStyle]}
          onPress={onPress}
          onPressIn={() => {
            scale.value = withSpring(0.96, { damping: 18, stiffness: 340 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 14, stiffness: 260 });
          }}
          accessibilityRole="button"
          testID={testID}
        >
          {leftButtonIcon && (
            <Image
              source={leftButtonIcon}
              style={styles.buttonIcon}
              tintColor={tintColor ?? colors.ON_PRIMARY}
            />
          )}
          <AppText
            allowFontScaling={false}
            style={[styles.label, customTitleStyle]}
          >
            {title}
          </AppText>
          {buttonIcon && (
            <Image
              source={buttonIcon}
              style={styles.buttonIcon}
              tintColor={tintColor ?? colors.ON_PRIMARY}
            />
          )}
        </AnimatedPressable>
      )}
    </>
  );
};

export default CustomButton;
