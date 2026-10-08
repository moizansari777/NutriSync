import { ActivityIndicator } from "react-native";
import React from "react";
import { COLORS } from "../../macros/colors";

const LoadingIndicator = ({
  color = COLORS.WHITE,
  size = "small",
}: {
  color?: string;
  size?: "small" | "large" | number;
}) => {
  return <ActivityIndicator size={size ?? "small"} color={color} />;
};

export default LoadingIndicator;
