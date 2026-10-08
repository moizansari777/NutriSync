import { View, TouchableOpacity, Image } from "react-native";
import React from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import styles from "../styles";
import { activeOpacity } from "../../../constant";
import ICONS from "../../../assets/icons";
import { successAlert } from "../../../utils/alerts";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";
import { shareService } from "../../../utils/shareService";

const CopyReferralRUL = ({
  referral_link = "",
}: {
  referral_link: string;
}) => {
  const { colors } = useTheme();

  const handleShareURL = async () => {
    await shareService({
      message: `NutriSync Referal Link:\n`,
      url: referral_link,
      title: "NutriSync",
    });
  };

  const handleCopy = () => {
    Clipboard.setString(`NutriSync Referal Link:
${referral_link}`);

    successAlert({
      body: "Copied Successfully",
    });
  };

  return (
    <View style={styles.container}>
      <AppText
        allowFontScaling={false}
        style={[styles.headingText, { color: colors.HEADING }]}
      >
        Your Referral Link
      </AppText>
      <View
        style={[
          styles.copyView,
          {
            backgroundColor: colors.WHITE,
            borderColor: colors.BORDER_COLOR,
          },
        ]}
      >
        <AppText
          allowFontScaling={false}
          style={[styles.urlText, { color: colors.TEXT }]}
          numberOfLines={1}
        >
          {referral_link}
        </AppText>
        <View style={styles.iconRow}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={handleShareURL}
            style={[styles.iconView, { backgroundColor: colors.BACKGROUND }]}
          >
            <Image
              source={ICONS.share}
              style={styles.iconShare}
              tintColor={colors.TEXT}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={handleCopy}
            style={[styles.iconView, { backgroundColor: colors.BACKGROUND }]}
          >
            <Image
              source={ICONS.copyCircle}
              style={styles.iconShare}
              tintColor={colors.TEXT}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* <AppText allowFontScaling={false} style={styles.instructionText}>
        Share this link with friend and family. When they signup using your
        link, you’ll both get rewards!
      </AppText> */}
    </View>
  );
};

export default CopyReferralRUL;
