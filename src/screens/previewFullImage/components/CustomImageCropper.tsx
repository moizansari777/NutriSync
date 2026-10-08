import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import ImageEditor from "@react-native-community/image-editor";
import ICONS from "../../../assets/icons";
import { COLORS } from "../../../macros/colors";
import AppText from "../../../components/appText";
import { activeOpacity } from "../../../constant";
import styles from "../styles";
import LoadingIndicator from "../../../components/loaders/LoadingIndicator";

const { width: SCREEN_W } = Dimensions.get("window");

const MIN_BOX = 60; // minimum crop box dimension (px)
const HANDLE_HIT = 36; // touch target size for handles (px)

type HandleId = "tl" | "tc" | "tr" | "ml" | "mr" | "bl" | "bc" | "br";

interface HandleCfg {
  id: HandleId;
  /** position as fraction of box size */
  fx: number;
  fy: number;
  left: boolean;
  top: boolean;
  right: boolean;
  bottom: boolean;
}

export interface CustomImageCropperProps {
  imageUri: string;
  onAddDescription: (croppedObj: any) => void;
  onNext: (croppedObj: any) => void;
  onRetake: () => void;
  bottomInset?: number;
}

const HANDLES: HandleCfg[] = [
  {
    id: "tl",
    fx: 0,
    fy: 0,
    left: true,
    top: true,
    right: false,
    bottom: false,
  },
  {
    id: "tc",
    fx: 0.5,
    fy: 0,
    left: false,
    top: true,
    right: false,
    bottom: false,
  },
  {
    id: "tr",
    fx: 1,
    fy: 0,
    left: false,
    top: true,
    right: true,
    bottom: false,
  },
  {
    id: "ml",
    fx: 0,
    fy: 0.5,
    left: true,
    top: false,
    right: false,
    bottom: false,
  },
  {
    id: "mr",
    fx: 1,
    fy: 0.5,
    left: false,
    top: false,
    right: true,
    bottom: false,
  },
  {
    id: "bl",
    fx: 0,
    fy: 1,
    left: true,
    top: false,
    right: false,
    bottom: true,
  },
  {
    id: "bc",
    fx: 0.5,
    fy: 1,
    left: false,
    top: false,
    right: false,
    bottom: true,
  },
  {
    id: "br",
    fx: 1,
    fy: 1,
    left: false,
    top: false,
    right: true,
    bottom: true,
  },
];

function clamp(v: number, lo: number, hi: number) {
  "worklet";
  return Math.min(Math.max(v, lo), hi);
}

const CustomImageCropper: React.FC<CustomImageCropperProps> = ({
  imageUri,
  onAddDescription,
  onNext,
  onRetake,
  bottomInset = 0,
}) => {
  const [containerSize, setContainerSize] = useState({
    w: SCREEN_W,
    h: SCREEN_W,
  });
  const [naturalSize, setNaturalSize] = useState({ w: 1, h: 1 });
  const [isCropping, setIsCropping] = useState(false);

  // Normalize once: ImageEditor + Image.getSize both need file:// on iOS
  const normalizedUri = useMemo(
    () =>
      Platform.OS === "ios" && !imageUri.startsWith("file://")
        ? `file://${imageUri}`
        : imageUri,
    [imageUri],
  );

  // Shared values — the crop box in container-pixel space
  const bx = useSharedValue(0);
  const by = useSharedValue(0);
  const bw = useSharedValue(0);
  const bh = useSharedValue(0);

  // 1 = overlay visible (idle), 0 = hidden (during gesture)
  const overlayAlpha = useSharedValue(1);

  // Snapshot shared values — live on the UI thread so worklets read them correctly.
  // Plain useRef cannot be reliably accessed inside worklets (UI thread vs JS thread).
  const snapX = useSharedValue(0);
  const snapY = useSharedValue(0);
  const snapW = useSharedValue(0);
  const snapH = useSharedValue(0);

  // Image bounds shared values — same reason, must be on UI thread for worklets.
  const ibX = useSharedValue(0);
  const ibY = useSharedValue(0);
  const ibW = useSharedValue(containerSize.w);
  const ibH = useSharedValue(containerSize.h);

  // ── Fetch natural image size ────────────────────────────────────────────────
  useEffect(() => {
    // Image.getSize also needs file:// on iOS for bare paths
    Image.getSize(
      normalizedUri,
      (w, h) => setNaturalSize({ w, h }),
      () => {},
    );
  }, [normalizedUri]);

  // ── Initialise box to exactly match the rendered image area ──────────────────
  // Runs whenever container layout or natural image size changes.
  // Uses the same contain-fit math as handleDone so box never exceeds the image.
  useEffect(() => {
    const cw = containerSize.w;
    const ch = containerSize.h;
    const iw = naturalSize.w;
    const ih = naturalSize.h;
    if (!cw || !ch || iw === 1 || ih === 1) return; // not ready yet

    const containerRatio = cw / ch;
    const imageRatio = iw / ih;

    let rendW: number, rendH: number, offX: number, offY: number;
    if (imageRatio > containerRatio) {
      // letterboxed — image fills width, bars on top/bottom
      rendW = cw;
      rendH = cw / imageRatio;
      offX = 0;
      offY = (ch - rendH) / 2;
    } else {
      // pillarboxed — image fills height, bars on left/right
      rendH = ch;
      rendW = ch * imageRatio;
      offX = (cw - rendW) / 2;
      offY = 0;
    }

    // Store rendered image bounds as shared values so worklets read them on UI thread
    ibX.value = offX;
    ibY.value = offY;
    ibW.value = rendW;
    ibH.value = rendH;

    // Set crop box to exactly the rendered image bounds
    bx.value = offX;
    by.value = offY;
    bw.value = rendW;
    bh.value = rendH;
  }, [containerSize, naturalSize, bx, by, bw, bh, ibX, ibY, ibW, ibH]);

  // ── Box drag gesture ──────────────────────────────────────────────
  const dragGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          "worklet";
          snapX.value = bx.value;
          snapY.value = by.value;
          snapW.value = bw.value;
          snapH.value = bh.value;
          overlayAlpha.value = withTiming(0, { duration: 100 });
        })
        .onUpdate(e => {
          "worklet";
          bx.value = clamp(
            snapX.value + e.translationX,
            ibX.value,
            ibX.value + ibW.value - snapW.value,
          );
          by.value = clamp(
            snapY.value + e.translationY,
            ibY.value,
            ibY.value + ibH.value - snapH.value,
          );
        })
        .onEnd(() => {
          "worklet";
          overlayAlpha.value = withTiming(1, {
            duration: 280,
            easing: Easing.out(Easing.quad),
          });
        }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerSize.w, containerSize.h],
  );

  // ── Handle gesture factory ──────────────────────────────────────────
  const makeHandleGesture = useCallback(
    (cfg: HandleCfg) =>
      Gesture.Pan()
        .onBegin(() => {
          "worklet";
          snapX.value = bx.value;
          snapY.value = by.value;
          snapW.value = bw.value;
          snapH.value = bh.value;
          overlayAlpha.value = withTiming(0, { duration: 100 });
        })
        .onUpdate(e => {
          "worklet";
          const sx = snapX.value;
          const sy = snapY.value;
          const sw = snapW.value;
          const sh = snapH.value;
          let nx = sx,
            ny = sy,
            nw = sw,
            nh = sh;

          if (cfg.left) {
            const px = clamp(sx + e.translationX, ibX.value, sx + sw - MIN_BOX);
            nw = sw - (px - sx);
            nx = px;
          }
          if (cfg.right) {
            nw = clamp(
              sw + e.translationX,
              MIN_BOX,
              ibX.value + ibW.value - sx,
            );
          }
          if (cfg.top) {
            const py = clamp(sy + e.translationY, ibY.value, sy + sh - MIN_BOX);
            nh = sh - (py - sy);
            ny = py;
          }
          if (cfg.bottom) {
            nh = clamp(
              sh + e.translationY,
              MIN_BOX,
              ibY.value + ibH.value - sy,
            );
          }

          bx.value = nx;
          by.value = ny;
          bw.value = nw;
          bh.value = nh;
        })
        .onEnd(() => {
          "worklet";
          overlayAlpha.value = withTiming(1, {
            duration: 280,
            easing: Easing.out(Easing.quad),
          });
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerSize.w, containerSize.h],
  );

  const handleGestures = useMemo(() => {
    const map = {} as Record<HandleId, ReturnType<typeof Gesture.Pan>>;
    HANDLES.forEach(cfg => {
      map[cfg.id] = makeHandleGesture(cfg);
    });
    return map;
  }, [makeHandleGesture]);

  // ── Animated styles ─────────────────────────────────────────────────────────
  const boxAnimStyle = useAnimatedStyle(() => ({
    left: bx.value,
    top: by.value,
    width: bw.value,
    height: bh.value,
  }));

  // Each of the 4 dark masks around the crop box.
  // We keep them as 4 separate absolute views to avoid clipping issues.
  const maskTop = useAnimatedStyle(() => ({
    width: containerSize.w,
    height: by.value,
    opacity: overlayAlpha.value,
  }));
  const maskBottom = useAnimatedStyle(() => ({
    top: by.value + bh.value,
    width: containerSize.w,
    bottom: 0,
    opacity: overlayAlpha.value,
  }));
  const maskLeft = useAnimatedStyle(() => ({
    top: by.value,
    width: bx.value,
    height: bh.value,
    opacity: overlayAlpha.value,
  }));
  const maskRight = useAnimatedStyle(() => ({
    top: by.value,
    left: bx.value + bw.value,
    right: 0,
    height: bh.value,
    opacity: overlayAlpha.value,
  }));

  // ── Pixel-accurate crop ─────────────────────────────────────────────────────
  // Core crop logic — returns the cropped image object.
  // Shared by both handleAddDescription and handleNext so there's no duplication.
  const cropImage = useCallback(async () => {
    const cw = containerSize.w;
    const ch = containerSize.h;
    let iw = naturalSize.w;
    let ih = naturalSize.h;

    // ── Android: resize by 1px to bake EXIF into pixel data ─────────────
    let uriToCrop = normalizedUri;
    if (Platform.OS === "android") {
      try {
        const resized = await ImageResizer.createResizedImage(
          normalizedUri,
          iw - 1, // 1px smaller to force new file with correct metadata
          ih - 1,
          "JPEG",
          85,
          0,
        );
        uriToCrop = resized.uri;
        iw = resized.width;
        ih = resized.height;
      } catch (e) {
        console.warn("[cropImage] resize trick failed, using original:");
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    const containerRatio = cw / ch;
    const imageRatio = iw / ih;

    let rendW: number, rendH: number, offX: number, offY: number;
    if (imageRatio > containerRatio) {
      rendW = cw;
      rendH = cw / imageRatio;
      offX = 0;
      offY = (ch - rendH) / 2;
    } else {
      rendH = ch;
      rendW = ch * imageRatio;
      offX = (cw - rendW) / 2;
      offY = 0;
    }

    const scaleX = iw / rendW;
    const scaleY = ih / rendH;

    const cropX = Math.max(0, (bx.value - offX) * scaleX);
    const cropY = Math.max(0, (by.value - offY) * scaleY);
    const cropW = Math.min(bw.value * scaleX, iw - cropX);
    const cropH = Math.min(bh.value * scaleY, ih - cropY);

    return ImageEditor.cropImage(uriToCrop, {
      offset: { x: cropX, y: cropY },
      size: { width: cropW, height: cropH },
    });
  }, [containerSize, naturalSize, bx, by, bw, bh, normalizedUri]);

  const handleAddDescription = useCallback(async () => {
    setIsCropping(true);
    try {
      const croppedObj = await cropImage();

      onAddDescription(croppedObj);
    } catch (err) {
      // console.warn("Crop failed:");
    } finally {
      setIsCropping(false);
    }
  }, [cropImage, onAddDescription]);

  const handleNext = useCallback(async () => {
    setIsCropping(true);
    try {
      const croppedObj = await cropImage();
      onNext(croppedObj);
    } catch (err) {
      // console.warn("Crop failed:");
    } finally {
      setIsCropping(false);
    }
  }, [cropImage, onNext]);

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* ── Image + cropper overlay ── */}
      <View
        style={[styles.imageContainer, { marginBottom: 120 }]}
        onLayout={e => {
          const { width: cw, height: ch } = e.nativeEvent.layout;
          setContainerSize({ w: cw, h: ch });
        }}
      >
        {/* The actual image */}
        <Image
          source={{ uri: normalizedUri }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />

        {/* ── Dark masks around crop box ──
            We stack a second blurred-looking layer by nesting them.
            No blur lib needed: the dark overlay at ~55% opacity + the
            slight desaturation from `overlayColor` gives the native-feel.
            On RN ≥ 0.76 you can add style={{ filter: 'blur(4px)' }} to
            a second Image copy behind these masks for a true blur.         */}

        <Animated.View style={[styles.mask, maskTop]} />
        <Animated.View style={[styles.mask, maskBottom]} />
        <Animated.View style={[styles.mask, maskLeft]} />
        <Animated.View style={[styles.mask, maskRight]} />

        {/* ── Crop box ── */}
        <Animated.View style={[styles.cropBox, boxAnimStyle]}>
          {/* Border */}
          <View style={styles.cropBorder} pointerEvents="none" />

          {/* Rule-of-thirds grid */}
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <View style={styles.grid33H} />
            <View style={styles.grid66H} />
            <View style={styles.grid33V} />
            <View style={styles.grid66V} />
          </View>

          {/* L-shaped corner brackets */}
          <View style={[styles.corner, styles.cornerTL]} pointerEvents="none" />
          <View style={[styles.corner, styles.cornerTR]} pointerEvents="none" />
          <View style={[styles.corner, styles.cornerBL]} pointerEvents="none" />
          <View style={[styles.corner, styles.cornerBR]} pointerEvents="none" />

          {/* Drag-the-whole-box — covers interior, below handles */}
          <GestureDetector gesture={dragGesture}>
            <View style={styles.dragLayer} />
          </GestureDetector>

          {/* Resize handles */}
          {HANDLES.map(cfg => (
            <GestureDetector key={cfg.id} gesture={handleGestures[cfg.id]}>
              <View
                style={[
                  styles.handleHit,
                  {
                    left: `${cfg.fx * 100}%` as any,
                    top: `${cfg.fy * 100}%` as any,
                    marginLeft: -HANDLE_HIT / 2,
                    marginTop: -HANDLE_HIT / 2,
                  },
                ]}
              >
                {/* Only show dot for edge handles; corners use the L-bracket */}
                {!(
                  (cfg.fx === 0 || cfg.fx === 1) &&
                  (cfg.fy === 0 || cfg.fy === 1)
                ) && (
                  <View
                    style={[
                      styles.handleDot,
                      cfg.fy === 0.5
                        ? styles.handleDotEdgeH // left / right edge → tall pill
                        : styles.handleDotEdgeV, // top / bottom edge → wide pill
                    ]}
                  />
                )}
              </View>
            </GestureDetector>
          ))}
        </Animated.View>
      </View>

      {/* ── Bottom action bar ── */}
      <View
        style={[
          styles.previewButtons,
          {
            paddingBottom: bottomInset,
          },
        ]}
      >
        <View style={styles.previewInnerButtons}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            style={styles.itemButtom}
            onPress={onRetake}
          >
            <Image source={ICONS.retake} style={styles.actionIcon} />
            <AppText allowFontScaling={false} style={styles.textLabel}>
              Retake
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={activeOpacity}
            style={styles.itemButtom}
            onPress={handleAddDescription}
          >
            <Image
              source={ICONS.text}
              style={styles.actionIcon}
              tintColor={COLORS.WHITE}
            />
            <AppText allowFontScaling={false} style={styles.textLabel}>
              Add Description
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={activeOpacity}
            style={styles.itemButtom}
            onPress={handleNext}
          >
            <Image source={ICONS.tick} style={styles.actionIcon} />
            <AppText allowFontScaling={false} style={styles.textLabel}>
              Done
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      {isCropping && (
        <View style={styles.frameWrap}>
          <View style={styles.frameWrapView}>
            <LoadingIndicator color={COLORS.PINK} size="large" />
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default CustomImageCropper;
