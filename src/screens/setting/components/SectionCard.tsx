import { View, Text } from "react-native";
import React from "react";
import styles from "../styles";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  children: React.ReactNode;
  sectionLable?: string;
};

const SectionCard = ({ children, sectionLable }: Props) => {
  const { colors, scheme } = useTheme();

  return (
    <View>
      {sectionLable && (
        <AppText allowFontScaling={false} style={[styles.sectionLable, { color: colors.HEADING }]}>
          {sectionLable}
        </AppText>
      )}
      <View style={[styles.sectionView, { backgroundColor: scheme === "dark" ? colors.GRAY_BG : colors.WHITE }]}>
        {children}
      </View>
    </View>
  );
};

export default SectionCard;
