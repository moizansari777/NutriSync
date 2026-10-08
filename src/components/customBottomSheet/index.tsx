import { View, Platform } from "react-native";
import React, { FC, useCallback, useMemo } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import { useTheme } from "../../hooks/useTheme";

type Props = {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  children: React.ReactNode;
  customSanps?: string[];
  isShowOfTop?: boolean;
  isBackDrop?: boolean;
  enableDrag?: boolean;
  enableDynamicSizing?: boolean;
  // Pan down (on the handle indicator) to close, without enabling the
  // content panning gesture. Falls back to `enableDrag` when not provided.
  enablePanDownClose?: boolean;
  // What a press on the backdrop does. Kept as "collapse" by default to
  // preserve the existing behaviour of the sheets already using this.
  backdropPressBehavior?: "none" | "close" | "collapse";
  // Opt in for sheets that hold a text input, so the sheet lifts itself above
  // the keyboard on Android. See the `android_keyboardInputMode` note below.
  keyboardAware?: boolean;
  onSheetChange?: (index: number) => void;
};

const CustomBottomSheet: FC<Props> = ({
  bottomSheetRef,
  children,
  customSanps = ["28%"],
  isShowOfTop = false,
  isBackDrop = true,
  enableDrag = true,
  enableDynamicSizing = true,
  enablePanDownClose,
  backdropPressBehavior = "collapse",
  keyboardAware = false,
  onSheetChange,
}) => {
  const { bottom } = useSafeAreaInsets();

  const handleSheetChanges = useCallback(
    (index: number) => {
      onSheetChange?.(index);
    },
    [onSheetChange],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        pressBehavior={backdropPressBehavior}
      />
    ),
    [backdropPressBehavior],
  );

  // The "90%" fallback lets a sheet grow past its own snap point on Android.
  // Keyboard aware sheets leave it out: `interactive` lifts the sheet by the
  // keyboard height measured from the *highest* snap point, so a 90% one would
  // throw the sheet to full screen as soon as the keyboard shows.
  const snapPoints = useMemo(
    () => (keyboardAware ? [...customSanps] : [...customSanps, "90%"]),
    [customSanps, keyboardAware],
  );

  // eslint-disable-next-line react/no-unstable-nested-components
  const RenderMainSheetComponent = () => {
    const {colors} = useTheme();
    return (
      <BottomSheetModal
        snapPoints={
          enableDynamicSizing
            ? Platform.OS === "android"
              ? snapPoints
              : []
            : customSanps
        }
        ref={bottomSheetRef}
        index={0}
        enableDynamicSizing={enableDynamicSizing}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        /**
         * `adjustResize` tells the sheet the window itself shrinks for the
         * keyboard, so the sheet does not move. That holds on iOS, but not on
         * Android: `KeyboardProvider` (react-native-keyboard-controller, mounted
         * in App.tsx) calls `setDecorFitsSystemWindows(false)`, so the window
         * keeps its full height and the sheet stays behind the keyboard.
         * `adjustPan` makes the sheet lift itself instead.
         */
        android_keyboardInputMode={keyboardAware ? "adjustPan" : "adjustResize"}
        onChange={handleSheetChanges}
        backdropComponent={isBackDrop ? renderBackdrop : undefined}
        backgroundStyle={{
          backgroundColor: isBackDrop ? colors.BACKGROUND : colors.INPUT_BG,
          borderRadius: 32,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.ICON_COLOR, width: 40 }}
        enableContentPanningGesture={enableDrag}
        enablePanDownToClose={enablePanDownClose ?? enableDrag}
        enableDismissOnClose={false}
      >
        {enableDynamicSizing ? (
          <BottomSheetView style={styles.container}>
            <View
              style={{ flex: 1, width: "100%", paddingBottom: bottom + 10 }}
            >
              {children}
            </View>
          </BottomSheetView>
        ) : (
          <View style={{ flex: 1, width: "100%", paddingBottom: bottom + 10 }}>
            {children}
          </View>
        )}
      </BottomSheetModal>
    );
  };

  return (
    <>
      {isShowOfTop ? (
        <BottomSheetModalProvider>
          <RenderMainSheetComponent />
        </BottomSheetModalProvider>
      ) : (
        <RenderMainSheetComponent />
      )}
    </>
  );
};

export default CustomBottomSheet;
