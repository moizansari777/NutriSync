import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useDispatch } from "react-redux";
import styles from "./styles";
import IMAGES from "../../assets/images";
import { useTheme } from "../../hooks/useTheme";
import ScreenWrapper from "../screenWrapper";
import CustomButton from "../buttons";
import ICONS from "../../assets/icons";
import { errorAlert } from "../../utils/alerts";
import { setAllMessageList } from "../../states/reducer/chatReducer";

function NoInternet() {
  const dispatch = useDispatch();
  const { colors, scheme } = useTheme();

  useEffect(() => {
    dispatch(setAllMessageList([]));
  }, []);

  const handleOnRetry = async () => {
    dispatch(setAllMessageList([]));

    NetInfo.refresh().then(state => {
      if (!state?.isConnected) {
        errorAlert({
          title: "No Internet Connection",
          body: "Make sure wifi or cellular data is turned on",
        });
      }
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.logoContainer}>
        <Image
          source={scheme === "dark" ? IMAGES.splashLogo : IMAGES.logoPrimary}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Image
          source={ICONS.noInternet}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: colors.HEADING }]}>
          No Internet Connection
        </Text>

        <Text style={[styles.tagline, { color: colors.TEXT }]}>
          Please check your internet connection and try again.
        </Text>

        <CustomButton
          title="Try Again"
          onPress={handleOnRetry}
          customStyle={{
            paddingHorizontal: 50,
            marginTop: 40,
          }}
        />
      </View>
    </ScreenWrapper>
  );
}

export default NoInternet;
