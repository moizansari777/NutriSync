import { Platform } from "react-native";

/**
 * Returns the Android API level as a number.
 * Example: Android 14 → 34, Android 13 → 33.
 * Returns 0 if not Android or cannot detect.
 */
export function getAndroidVersion(): number {
  if (Platform.OS === "android" && typeof Platform.Version === "number") {
    return Platform.Version;
  }
  return 0;
}
