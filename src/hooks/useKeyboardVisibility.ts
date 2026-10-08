import { useState, useEffect } from "react";
import { Keyboard, Platform } from "react-native";

export const useKeyboardVisibility = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      // Clear any pending hide timeouts
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      setIsKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      if (Platform.OS === "android") {
        // Use a longer delay for Android to ensure smooth transition
        hideTimeout = setTimeout(() => {
          setIsKeyboardVisible(false);
        }, 250); // Increased delay to prevent flickering
      } else {
        setIsKeyboardVisible(false);
      }
    });

    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return isKeyboardVisible;
};
