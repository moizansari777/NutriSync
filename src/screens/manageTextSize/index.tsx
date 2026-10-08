import React, { FC, useRef, useState, useCallback } from "react";
import { View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../navigations/routes";
import ScreenWrapper from "../../components/screenWrapper";
import styles from "./styles";
import CustomButton from "../../components/buttons";
import { useTheme } from "../../hooks/useTheme";
import { fontSize } from "../../utils/responsiveSize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setTextScaleValue } from "../../states/reducer/settingReducer";
import { successAlert } from "../../utils/alerts";
import { RootState } from "../../states/store/store";
import AppText from "../../components/appText";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const SCALE_VALUES: number[] = [0.8, 0.9, 1.0, 1.1, 1.2];
const DEFAULT_IDX = 2; // index of 1.0

const THUMB_SIZE = 30;
const H_PAD = 20;
const CARD_PAD = 24;

const SPRING = { damping: 80, stiffness: 220 } as const;
const SPRING_SOFT = { damping: 60, stiffness: 150 } as const;

const { width: SCREEN_W } = Dimensions.get("window");

// Actual drawable track width: screen - root padding - card padding
const TRACK_W = SCREEN_W - H_PAD * 2 - CARD_PAD * 2;
const STEP = TRACK_W / (SCALE_VALUES.length - 1);

// ── Worklet helpers (run on UI thread) ───────────────────────────────────────
const snapIdx = (x: number): number => {
  "worklet";
  return Math.round(Math.max(0, Math.min(x, TRACK_W)) / STEP);
};

const scaleAt = (x: number): number => {
  "worklet";
  const idx = Math.round(Math.max(0, Math.min(x, TRACK_W)) / STEP);
  return SCALE_VALUES[idx] ?? 1;
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.MANAGE_TEXT_SIZE_SCREEN
>;

const ManageTextSize: FC<Props> = ({ navigation }) => {
  const textScaleValue = useSelector(
    (state: RootState) => state.settingReducer?.textScaleValue,
  );

  const initialIndex = React.useMemo(() => {
    const idx = SCALE_VALUES.findIndex(v => v === textScaleValue);
    return idx !== -1 ? idx : DEFAULT_IDX;
  }, [textScaleValue]);

  // JS refs — never cause re-renders
  const savedIdxRef = useRef(initialIndex);
  const curIdxRef = useRef(initialIndex);
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();

  // Minimal state — only drives button disabled look
  const [hasChanges, setHasChanges] = useState(false);

  // ── UI-thread shared values ───────────────────────────────────────────────
  const thumbX = useSharedValue(initialIndex * STEP);
  const thumbScale = useSharedValue(1);
  const startX = useSharedValue(0);

  // ── JS-thread callback — called directly since gesture runs on JS thread ──
  const onCommit = useCallback((idx: number) => {
    curIdxRef.current = idx;
    setHasChanges(idx !== savedIdxRef.current);
  }, []);

  // ── Gestures ──────────────────────────────────────────────────────────────
  // .runOnJS(true) → all callbacks execute on the JS thread (Reanimated v4)
  // Shared value writes still animate on the UI thread via the render loop.
  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(6)
    .onBegin(() => {
      startX.value = thumbX.value;
      thumbScale.value = withSpring(1.35, SPRING_SOFT);
    })
    .onUpdate(e => {
      thumbX.value = Math.max(
        0,
        Math.min(startX.value + e.translationX, TRACK_W),
      );
    })
    .onEnd(() => {
      const idx = snapIdx(thumbX.value);
      thumbX.value = withSpring(idx * STEP, SPRING);
      thumbScale.value = withSpring(1, SPRING_SOFT);
      onCommit(idx);
    })
    .onFinalize(() => {
      thumbScale.value = withSpring(1, SPRING_SOFT);
    });

  const tapTrack = Gesture.Tap()
    .runOnJS(true)
    .onEnd(e => {
      const idx = snapIdx(e.x);
      thumbX.value = withSpring(idx * STEP, SPRING);
      onCommit(idx);
    });

  // Tap wins for quick taps; pan wins when movement > minDistance
  const composed = Gesture.Race(tapTrack, pan);

  // ── Animated styles (all on UI thread, zero JS re-renders) ───────────────
  const thumbAnim = useAnimatedStyle(() => ({
    transform: [
      { translateX: thumbX.value - THUMB_SIZE / 2 },
      { scale: thumbScale.value },
    ],
  }));

  const fillAnim = useAnimatedStyle(() => ({
    width: thumbX.value,
  }));

  // Text sizes update in real-time as thumb moves
  let headingSize = fontSize(4);
  let taglineSize = fontSize(3.5);

  const headingAnim = useAnimatedStyle(() => ({
    fontSize: headingSize * scaleAt(thumbX.value),
  }));

  const taglineAnim = useAnimatedStyle(() => ({
    fontSize: taglineSize * scaleAt(thumbX.value),
  }));

  const handleReset = useCallback(() => {
    thumbX.value = withSpring(DEFAULT_IDX * STEP, SPRING);
    curIdxRef.current = DEFAULT_IDX;
    setHasChanges(false);
    dispatch(setTextScaleValue(1));
    successAlert({
      body: "Text size reset successfully.",
    });

    setTimeout(() => {
      navigation.goBack();
    }, 1200);
  }, [thumbX]);

  const handleSave = useCallback(() => {
    savedIdxRef.current = curIdxRef.current;
    dispatch(setTextScaleValue(SCALE_VALUES[curIdxRef.current]));
    setHasChanges(false);

    successAlert({
      body: "Text size reset successfully.",
    });

    navigation.goBack();
  }, []);

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Text Size">
      <View style={styles.root} testID="text_size_screen">
        <View style={styles.previewBody}>
          <Animated.Text
            allowFontScaling={false}
            style={[
              styles.appHeading,
              {
                color: colors.HEADING,
              },
              headingAnim,
            ]}
          >
            At NutriSync, our mission is simple:
          </Animated.Text>
          <Animated.Text
            allowFontScaling={false}
            style={[
              styles.appTagline,
              {
                color: colors.TEXT,
              },
              taglineAnim,
            ]}
          >
            To make healthy eating easier, more accessible, and less
            overwhelming.
            {`\n\n`}
            We believe people don’t need more rules, restrictions, or guilt.
            They need practical guidance they can use in the real world.
          </Animated.Text>
        </View>

        <View>
          <View style={[styles.sliderCard, { backgroundColor: colors.WHITE }]}>
            <AppText style={[styles.sliderTitle, { color: colors.HEADING }]}>
              Text Scale
            </AppText>

            <GestureDetector gesture={composed}>
              <View style={styles.trackHit}>
                {/* Inactive track */}
                <View
                  style={[
                    styles.trackBg,
                    { backgroundColor: colors.ICON_COLOR },
                  ]}
                />
                {/* Active fill */}
                <Animated.View
                  style={[
                    styles.trackFill,
                    { backgroundColor: colors.PRIMARY },
                    fillAnim,
                  ]}
                />

                {/* Tick marks (always on top of fill/track) */}
                {SCALE_VALUES.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.tick,
                      { left: i * STEP - 3, backgroundColor: colors.BLACK },
                    ]}
                  />
                ))}

                {/* Draggable thumb */}
                <Animated.View
                  style={[
                    styles.thumb,
                    { backgroundColor: colors.PRIMARY },
                    thumbAnim,
                  ]}
                >
                  <View
                    style={[
                      styles.thumbCore,
                      { backgroundColor: colors.WHITE },
                    ]}
                  />
                </Animated.View>
              </View>
            </GestureDetector>

            {/* Step labels */}
            <View style={styles.labelsRow}>
              <AppText style={[styles.stepLabel, { color: colors.TEXT }]}>
                Aa
              </AppText>
              <AppText style={[styles.stepLabel, { color: colors.TEXT }]}>
                Default
              </AppText>
              <AppText style={[styles.stepLabelLarge, { color: colors.TEXT }]}>
                Aa
              </AppText>
            </View>
          </View>

          <View style={[styles.btnRow, { paddingBottom: bottom + 10 }]}>
            <CustomButton
              title="Reset"
              onPress={handleReset}
              customStyle={{
                flex: 1,
              }}
              customTitleStyle={{
                color: colors.RED,
              }}
            />
            <CustomButton
              title="Save"
              onPress={handleSave}
              isDisabled={!hasChanges}
              customStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ManageTextSize;
