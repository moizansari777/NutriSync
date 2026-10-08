import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { FC, ReactNode } from "react";
import { useStyles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useKeyboardVisibility } from "../../../hooks/useKeyboardVisibility";
import ICONS from "../../../assets/icons";
import { activeOpacity } from "../../../constant";
import { RootNavigationProp } from "../../../schemas/types";
import BiometricsUI from "./BiometricsUI";
import AppText from "../../../components/appText";

type Props = {
  children: ReactNode;
  heading: string;
  subHeading?: string;
  isBack?: boolean;
  hasBiometrics?: boolean;
  rightUI?: React.ReactNode;
};

const AuthScreenWrapper: FC<Props> = ({
  children,
  heading,
  subHeading,
  isBack = false,
  hasBiometrics = false,
  rightUI = null,
}) => {
  const navigation = useNavigation<RootNavigationProp>();
  const styles = useStyles();
  const isKeyboadOpen = useKeyboardVisibility();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "position" : "height"}
          >
            <>
              <View style={styles.textContainer}>
                {isBack && (
                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    onPress={handleGoBack}
                    style={styles.iconBackContainer}
                    hitSlop={25}
                  >
                    <Image
                      source={ICONS.backArrowCircle}
                      style={styles.backIcon}
                    />
                  </TouchableOpacity>
                )}
                <View
                  style={[
                    styles.rightUIMain,
                    { justifyContent: rightUI ? "space-between" : "center" },
                  ]}
                >
                  <View style={styles.headingContainer}>
                    <AppText
                      allowFontScaling={false}
                      style={styles.headingText}
                    >
                      {heading}
                    </AppText>
                    {subHeading && (
                      <AppText
                        allowFontScaling={false}
                        style={styles.subHeadingText}
                      >
                        {subHeading}
                      </AppText>
                    )}
                  </View>
                  {rightUI && rightUI}
                </View>
              </View>
              {/* // Children */}
              <View style={styles.childContainer}>{children}</View>
            </>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        {hasBiometrics && !isKeyboadOpen && <BiometricsUI />}
      </View>
    </>
  );
};

export default AuthScreenWrapper;
