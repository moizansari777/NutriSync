import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useIsFocused } from "@react-navigation/native";

type Callback = () => void | Promise<void>;

export function useForegroundOnce(onForeground: Callback) {
  const isFocused = useIsFocused();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      const prevState = appState.current;

      const isComingToForeground =
        prevState.match(/inactive|background/) && nextAppState === "active";

      if (isComingToForeground && isFocused && !isProcessingRef.current) {
        isProcessingRef.current = true;

        try {
          await onForeground();
        } finally {
          // allow next background → foreground cycle
          isProcessingRef.current = false;
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [isFocused, onForeground]);
}
