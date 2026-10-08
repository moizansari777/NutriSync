import { Image, Pressable, View } from "react-native";
import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../states/store/store";
import styles from "./styles";
import AppText from "../../../components/appText";
import { useTheme } from "../../../hooks/useTheme";
import { NetworkStatus } from "../../../schemas/types";
import ICONS from "../../../assets/icons";

const NoInternetBanner = () => {
  const { colors } = useTheme();

  const status = useSelector(
    (state: RootState) => state.networkReducer?.status,
  );

  const [dismissed, setDismissed] = useState(false);

  const showBanner =
    !dismissed &&
    (status === NetworkStatus.SLOW || status === NetworkStatus.NO_INTERNET);

  if (!showBanner) return null;

  return (
    <View
      style={[
        styles.bannerView,
        { flexDirection: "row", alignItems: "center", gap: 10 },
      ]}
    >
      <Image
        source={ICONS.noInternet}
        style={styles.icon}
        tintColor={colors.HEADING}
      />

      <View style={{ flex: 1, gap: 6 }}>
        <AppText
          allowFontScaling={false}
          style={[
            styles.bannerTitle,
            styles.regular,
            { color: colors.HEADING },
          ]}
        >
          Internet connection strength insufficient, please check your
          connection and try again.
        </AppText>
      </View>

      <Pressable onPress={() => setDismissed(true)}>
        <Image source={ICONS.close} style={styles.closeIcon} />
      </Pressable>
    </View>
  );
};

export default memo(NoInternetBanner);
