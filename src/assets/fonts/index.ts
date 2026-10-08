import { Platform } from "react-native";

export const FONTS = {
  Black_900: "PlusJakartaSans-ExtraBold", // 900 (family tops out at 800)
  ExtraBold_800: "PlusJakartaSans-ExtraBold", // 800

  Bold_700:
    Platform.OS === "ios"
      ? "PlusJakartaSans-Bold"
      : "PlusJakartaSans-ExtraBold", // 700

  SemiBold_600:
    Platform.OS === "ios" ? "PlusJakartaSans-SemiBold" : "PlusJakartaSans-Bold", // 600

  Medium_500:
    Platform.OS === "ios"
      ? "PlusJakartaSans-Medium"
      : "PlusJakartaSans-SemiBold", // 500

  Regular_400: "PlusJakartaSans-Regular", // 400
  Light_300: "PlusJakartaSans-Light", // 300
};
