import { useRef } from 'react';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

export function useBackExit(message = 'Press back again to exit', delay = 2000) {
  const pressedRef = useRef<boolean>(false);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      const onBackPress = () => {
        // ✅ If there's history, let the navigator handle going back normally
        if (navigation.canGoBack()) {
          return false;
        }

        // ✅ No history left — show the double-tap-to-exit behavior
        if (pressedRef.current) {
          BackHandler.exitApp();
          return true;
        }

        pressedRef.current = true;
        ToastAndroid.show(message, ToastAndroid.SHORT);

        timerRef.current = setTimeout(() => {
          pressedRef.current = false;
        }, delay);

        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        subscription.remove();
        if (timerRef.current) clearTimeout(timerRef.current);
        pressedRef.current = false;
      };
    }, [navigation, message, delay])
  );
}