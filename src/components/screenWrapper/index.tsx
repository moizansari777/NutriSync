import { Image, TouchableOpacity, View } from "react-native";
import React, { memo, ReactNode } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import ICONS from "../../assets/icons";
import { activeOpacity } from "../../constant";
import { RootNavigationProp } from "../../schemas/types";
import { screens } from "../../navigations/routes";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

type Props = {
  children: React.ReactNode;
  bgColor?: string;
  isBack?: boolean;
  type?: string;
  isClose?: boolean;
  hasTitle?: boolean;
  title?: string;
  paddingTop?: number;
  hasFilter?: boolean;
  hasMenu?: boolean;
  onPressOnFilter?: () => void;
  onPressSave?: () => void;
  onPressRefresh?: () => void;
  hasButton?: boolean;
  hasRefresh?: boolean;
  renderExtraUI?: ReactNode;
};

const ScreenWrapper = ({
  children,
  bgColor,
  isBack = false,
  type = "",
  isClose = false,
  hasTitle = false,
  title = "",
  paddingTop = 11,
  hasFilter = false,
  hasMenu = false,
  hasRefresh = false,
  onPressOnFilter = () => {},
  onPressSave = () => {},
  onPressRefresh = () => {},
  hasButton = false,
  renderExtraUI = null,
}: Props) => {
  const { top } = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      if (type === "log_history") {
        navigation.navigate(screens.BOTTOM_TAB_STACK, {
          screen: screens.LOG_TDEE_ROOT_SCREEN,
        });
      }
    }
  };

  const onPressMenu = () => {
    navigation.navigate(screens.SETTING_SCREEN);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top + paddingTop,
          backgroundColor: bgColor ? bgColor : colors.BACKGROUND,
        },
      ]}
    >
      {hasTitle && (
        <View style={styles.headerContainer}>
          <View style={styles.headerView}>
            {isBack && (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={handleGoBack}
              >
                {isClose ? (
                  <Image source={ICONS.close} style={styles.backArrow} />
                ) : (
                  <Image
                    source={ICONS.backArrowCircle}
                    style={styles.backArrow}
                  />
                )}
              </TouchableOpacity>
            )}

            {title && (
              <AppText
                allowFontScaling={false}
                style={[styles.headerTitle, { color: colors.HEADING }]}
              >
                {title}
              </AppText>
            )}
          </View>
          <View style={styles.actionView}>
            {renderExtraUI && renderExtraUI}
            {hasFilter && (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={onPressOnFilter}
              >
                <Image
                  source={ICONS.filter}
                  style={styles.backArrow}
                  tintColor={colors.HEADING}
                />
              </TouchableOpacity>
            )}
            {hasButton && (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={onPressSave}
              >
                <AppText
                  allowFontScaling={false}
                  style={[styles.buttonText, { color: colors.HEADING }]}
                >
                  Save
                </AppText>
              </TouchableOpacity>
            )}
            {hasMenu && (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={onPressMenu}
              >
                <Image
                  source={ICONS.menu}
                  style={styles.backArrow}
                  tintColor={colors.HEADING}
                />
              </TouchableOpacity>
            )}
            {hasRefresh && (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={onPressRefresh}
              >
                <Image
                  source={ICONS.retake}
                  style={styles.backArrow}
                  tintColor={colors.HEADING}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      {children}
    </View>
  );
};

export default memo(ScreenWrapper);
