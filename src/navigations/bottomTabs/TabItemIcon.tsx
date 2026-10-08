import { Image, ImageSourcePropType } from "react-native";
import React from "react";
import styles from "./styles";

// The selection pill is drawn once by GlassTabBar and slides between tabs, so
// the icon itself only needs the colour it's given.
const TabItemIcon = ({
  iconName,
  color,
}: {
  iconName: ImageSourcePropType;
  color: string;
  focused: boolean;
}) => {
  return (
    <Image source={iconName} tintColor={color} style={styles.tabIconImg} />
  );
};

export default TabItemIcon;
