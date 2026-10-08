import { View, Image, Modal } from "react-native";
import React from "react";
import CustomButton from "../buttons";
import { FONTS } from "../../assets/fonts";
import styles from "./styles";
import IMAGES from "../../assets/images";
import { width } from "../../utils/responsiveSize";
import { UserAuthData } from "../../schemas/types";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

type Props = {
  isVisible: boolean;
  handleOnCancel: () => void;
  handleUpdatePress: () => void;
  currentTimeZone: string;
  isLoading: boolean;
  user: UserAuthData | null;
};

const LocationModal = ({
  isVisible,
  handleOnCancel,
  currentTimeZone,
  handleUpdatePress,
  isLoading,
  user,
}: Props) => {
  const { colors, scheme } = useTheme();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      statusBarTranslucent={true}
      onRequestClose={handleOnCancel}
    >
      <View style={[styles.modalContainer, {backgroundColor: scheme === "dark" ? "rgba(0,0,0,.8)" : "rgba(0,0,0,.55)"}]}>
        <View
          style={[
            styles.innerView,
            {
              width: width(80),
              paddingHorizontal: 0,
              paddingVertical: 0,
              backgroundColor: colors.BACKGROUND,
            },
          ]}
        >
          <Image source={IMAGES.location} style={styles.updateAppImage} />
          <View style={[styles.textContainer, { paddingHorizontal: 7 }]}>
            <AppText allowFontScaling={false} style={[styles.headingText,{color:colors.HEADING}]}>Your timezone has changed!</AppText>
            <AppText allowFontScaling={false} style={[styles.subHeadingText,{color:colors.TEXT}]}>
              Do you want to update your timezone from{" "}
              <AppText allowFontScaling={false} style={[styles.rowValue,{color:colors.HEADING}]}>{user?.user?.timezone || ""}</AppText>{" "}
              to <AppText allowFontScaling={false} style={[styles.rowValue,{color:colors.HEADING}]}>{currentTimeZone || ""}</AppText>?
            </AppText>
          </View>
          <View style={styles.updateButtonContainer}>
            <CustomButton
              title="Yes, update"
              isLoading={isLoading}
              onPress={handleUpdatePress}
              isDisabled={isLoading}
              customTitleStyle={{
                fontFamily: FONTS.Medium_500,
              }}
              customStyle={{
                paddingVertical: 12,
              }}
            />
            {!isLoading && (
              <CustomButton
                title="No, cancel"
                isLoading={false}
                onPress={handleOnCancel}
                customStyle={{
                  backgroundColor: "transparent",
                  borderWidth: 0.7,
                  borderColor: colors.HEADING,
                  paddingVertical: 12,
                }}
                customTitleStyle={{
                  color: colors.HEADING,
                  fontFamily: FONTS.Medium_500,
                }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocationModal;
