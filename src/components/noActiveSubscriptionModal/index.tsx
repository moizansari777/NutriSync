import { View, Modal, Image, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import CustomButton from "../buttons";
import { useStyles } from "../customModals/styles";
import { FONTS } from "../../assets/fonts";
import { width } from "../../utils/responsiveSize";
import IMAGES from "../../assets/images";
import AppText from "../appText";
import { useTheme } from "../../hooks/useTheme";
import { activeOpacity } from "../../constant";
import { openURL } from "../../utils/openURL";

type Props = {
  isVisible: boolean;
  setIsVisible: any;
  planURL: string;
};

const NoActiveSubscriptionModal: FC<Props> = ({
  isVisible,
  setIsVisible,
  planURL,
}) => {
  const styles = useStyles();
  const { colors } = useTheme();

  const handleUpdatePress = () => {
    openURL(planURL);
    setIsVisible(false);
  };

  const handleOnCancel = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      statusBarTranslucent={true}
      onRequestClose={handleOnCancel}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.innerView,
            {
              width: width(80),
              paddingHorizontal: 0,
              paddingVertical: 0,
            },
          ]}
        >
          <Image source={IMAGES.noActiveSubs2} style={styles.updateAppImage} />
          {/* <Image source={IMAGES.noActiveSubs} style={styles.updateAppImage} /> */}
          <View style={[styles.textContainer, { paddingHorizontal: 7 }]}>
            <AppText
              allowFontScaling={false}
              style={[styles.headingText, { color: colors.HEADING }]}
            >
              No Active Subscription
            </AppText>
            <AppText
              allowFontScaling={false}
              style={[styles.subHeadingText, { color: colors.TEXT }]}
            >
              Please subscribe to access this app.
            </AppText>
          </View>
          <View style={styles.updateButtonContainer}>
            <CustomButton
              title="Subscribe Now"
              onPress={handleUpdatePress}
              customTitleStyle={{
                fontFamily: FONTS.Medium_500,
              }}
              customStyle={{
                paddingVertical: 13,
              }}
            />
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={handleOnCancel}
            >
              <AppText style={[styles.cancel, { color: colors.TEXT }]}>
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NoActiveSubscriptionModal;
