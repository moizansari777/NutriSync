import { View, Text, Image } from "react-native";
import React from "react";
import ICONS from "../../../assets/icons";
import styles from "../styles";
import { COLORS } from "../../../macros/colors";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const DATA = [
  {
    id: 1,
    title: "Invite Friends",
    descriptions:
      "Send your referral link to friends and tell them how cool NutriSync is!",
    icon: ICONS.send,
  },
  {
    id: 2,
    title: "Kick Start Their Journey",
    descriptions: "Encourage them to subscribe using your referral link.",
    icon: ICONS.checkGreen,
  },
  {
    id: 3,
    title: "Earn Rewards",
    descriptions: "When they subscribe, you’ll both be rewarded.",
    icon: ICONS.point,
  },
];

const HowItWorks = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <AppText allowFontScaling={false} style={[styles.headingText, { color: colors.HEADING }]}>How It Works</AppText>
      <View style={[styles.view, { backgroundColor: colors.WHITE }]}>
        {DATA?.map(item => {
          return (
            <View key={item.id} style={styles.itemView}>
              <Image
                source={item.icon}
                style={styles.iconImg}
                tintColor={colors.TEXT}
              />
              <View style={styles.textRightView}>
                <AppText allowFontScaling={false} style={[styles.labelText, { color: colors.HEADING }]}>{item.title}</AppText>
                <AppText allowFontScaling={false} style={[styles.desText, { color: colors.TEXT }]}>{item.descriptions}</AppText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default HowItWorks;
