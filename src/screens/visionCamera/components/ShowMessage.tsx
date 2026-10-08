import { View, Platform, Linking, Alert } from "react-native";
import React, { memo } from "react";
import styles from "../styles";
import LoadingIndicator from "../../../components/loaders/LoadingIndicator";
import CustomButton from "../../../components/buttons";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  msg: string;
  permission?: boolean;
};

const ShowMessage = ({ msg, permission }: Props) => {
  const { colors } = useTheme();

  const handleOpenSetting = () => {
    try {
      Alert.alert(
        "Permission Needed",
        "Please enable Camera access in Settings to take photos.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              } else {
                Linking.openSettings(); // ✅ works on Android
              }
            },
          },
        ],
      );
    } catch (error) {
      // console.log("error>>");
    }
  };

  return (
    <View style={[styles.center, { backgroundColor: colors.BACKGROUND }]}>
      <LoadingIndicator color={colors.HEADING} />
      <AppText
        allowFontScaling={false}
        style={[styles.looksLikeText, { color: colors.TEXT }]}
      >
        {msg}
      </AppText>
      {permission && (
        <View style={styles.btnView}>
          <CustomButton title="Open Setting" onPress={handleOpenSetting} />
        </View>
      )}
    </View>
  );
};

export default memo(ShowMessage);
