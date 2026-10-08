import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export type ResponsiveValue = number | string;

export const wps = wp

// For width responsiveness
export const width = (value: ResponsiveValue): number => {
  if (typeof value === "string" && value.includes("%")) {
    return wp(parseFloat(value)); // parse percentage string and convert it
  }
  return wp(value);
};

// For height responsiveness
export const height = (value: ResponsiveValue): number => {
  if (typeof value === "string" && value.includes("%")) {
    return hp(parseFloat(value));
  }
  return hp(value);
};

// For size responsiveness
export const fontSize = (value: ResponsiveValue): number => {
 // 0.8 - 1.15

  if (typeof value === "string" && value.includes("%")) {
    return wp(parseFloat(value));
  }
  return wp(value);
};

export const SCREENS_DIMENSION = Dimensions.get("screen");
