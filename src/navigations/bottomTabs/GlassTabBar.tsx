import React, { useEffect, useState } from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  Pressable,
  View,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LiquidGlassContainerView,
  LiquidGlassView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import styles from "./styles";
import { useTheme } from "../../hooks/useTheme";
import { screens } from "../routes";

type Props = BottomTabBarProps;

const SPRING = { damping: 18, stiffness: 220, mass: 0.9 };

const BAR_HEIGHT = 64;
const BAR_TOP_PADDING = 8;

/**
 * Space the bar covers when it floats over the camera. The camera screen pads
 * its own controls by this much so they sit above the bar.
 */
export const getFloatingTabBarInset = (bottomSafeArea: number) =>
  BAR_HEIGHT + BAR_TOP_PADDING + Math.max(bottomSafeArea, 12);

/**
 * Floating Liquid Glass tab bar: every tab lives in one glass capsule with a
 * yellow selection pill that springs between them.
 *
 * Tab presses go through the normal `tabPress` event so the per-tab listeners
 * in BottomTab (AI-access gating, chat reset) keep working unchanged.
 */
const GlassTabBar = ({ state, descriptors, navigation }: Props) => {
  const { colors, scheme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [tabWidth, setTabWidth] = useState(0);
  const pillX = useSharedValue(0);

  // `tabBarHideOnKeyboard` is only honoured by the default bar, so it's
  // re-implemented here.
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, () =>
      setIsKeyboardVisible(true),
    );
    const hide = Keyboard.addListener(hideEvent, () =>
      setIsKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    pillX.value = withSpring(state.index * tabWidth, SPRING);
  }, [state.index, tabWidth, pillX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
  }));

  const handleTabsLayout = (event: LayoutChangeEvent) => {
    const inner = event.nativeEvent.layout.width - TABS_PADDING * 2;
    setTabWidth(inner / state.routes.length);
  };

  const hideOnKeyboard =
    descriptors[state.routes[state.index].key]?.options?.tabBarHideOnKeyboard;
  if (isKeyboardVisible && hideOnKeyboard) return null;

  // On the camera the bar floats over the live preview instead of sitting in
  // its own strip, so it reads as part of the viewfinder. The glass goes dark
  // there to match the feed behind it.
  const isOverCamera =
    state.routes[state.index]?.name === screens.VISION_CAMERA_SCREEN;
  const glassScheme = isOverCamera || scheme === "dark" ? "dark" : "light";
  const idleColor = isOverCamera ? colors.CAMERA_BAR_TEXT : colors.TEXT;

  const glassFallback = !isLiquidGlassSupported && {
    backgroundColor: isOverCamera
      ? colors.CAMERA_BAR_BG
      : scheme === "dark"
      ? colors.GRAY_BG
      : colors.WHITE,
    borderColor: isOverCamera ? colors.CAMERA_BAR_BORDER : colors.BORDER_COLOR,
    borderWidth: 1,
  };

  return (
    <View
      style={[
        styles.barWrap,
        {
          paddingBottom: Math.max(bottom, 12),
          backgroundColor: isOverCamera
            ? colors.TRANSPARENT
            : colors.BACKGROUND,
        },
        isOverCamera && styles.barFloating,
      ]}
    >
      <LiquidGlassContainerView spacing={12} style={styles.barRow}>
        <LiquidGlassView
          effect="regular"
          interactive
          colorScheme={glassScheme}
          style={[styles.tabsCapsule, glassFallback]}
          onLayout={handleTabsLayout}
        >
          {tabWidth > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.selectionPill,
                { width: tabWidth, backgroundColor: colors.PRIMARY },
                pillStyle,
              ]}
            />
          )}
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const color = isFocused ? colors.ON_PRIMARY : idleColor;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({ type: "tabLongPress", target: route.key });
            };

            const label =
              typeof options.tabBarLabel === "function"
                ? options.tabBarLabel({
                    focused: isFocused,
                    color,
                    position: "below-icon",
                    children: route.name,
                  })
                : null;

            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabButton}
              >
                {options.tabBarIcon?.({ focused: isFocused, color, size: 22 })}
                {label}
              </Pressable>
            );
          })}
        </LiquidGlassView>
      </LiquidGlassContainerView>
    </View>
  );
};

const TABS_PADDING = 5;

export default GlassTabBar;
