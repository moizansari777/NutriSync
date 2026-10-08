import { Platform } from "react-native";

export const FONTS = {
  Black_900: "Poppins-Black", // 900
  ExtraBold_800: "Poppins-ExtraBold", // 800

  Bold_700: Platform.OS === "ios" ? "Poppins-Bold" : "Poppins-ExtraBold", // 700

  SemiBold_600: Platform.OS === "ios" ? "Poppins-SemiBold" : "Poppins-Bold", // 600

  Medium_500: Platform.OS === "ios" ? "Poppins-Medium" : "Poppins-SemiBold", // 500

  Regular_400: "Poppins-Regular", // 400
  Light_300: "Poppins-Light", // 300
};
