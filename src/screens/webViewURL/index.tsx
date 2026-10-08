import { View } from "react-native";
import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "../../navigations/routes";
import ScreenWrapper from "../../components/screenWrapper";
import WebView from "react-native-webview";
import styles from "./styles";
import PositionedLoader from "../../components/loaders/PositionedLoader";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.WEB_VIEW_URL_SCREEN
>;

const WebViewURL: FC<Props> = ({ route }) => {
  const { URL, title } = route.params;
  return (
    <ScreenWrapper isBack={true} hasTitle={true} title={title}>
      <View style={styles.container}>
        <WebView
          source={{ uri: URL }}
          style={{ flex: 1 }}
          renderLoading={() => <PositionedLoader />}
          startInLoadingState
        />
      </View>
    </ScreenWrapper>
  );
};

export default WebViewURL;
