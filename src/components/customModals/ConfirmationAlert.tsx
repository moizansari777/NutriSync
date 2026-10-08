import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { useStyles } from "./styles";
import { activeOpacity } from "../../constant";
import { COLORS } from "../../macros/colors";
import AppText from "../appText";
import CustomButton from "../buttons";

type Props = {
  isModalOpen: boolean;
  title?: string;
  tagLine?: string;
  buttonTitle?: string;
  noButtonTitle?: string;
  handleOnClose: () => void;
  handleOnDone: () => void;
  yesButtonColor?: string;
  justConfirm?: boolean;
};

const ConfirmationAlert: FC<Props> = ({
  isModalOpen,
  title = "Are Your Sure?",
  tagLine = "Are you sure you want to log out? You will be redirected to your sign in screen.",
  buttonTitle = "Logout",
  noButtonTitle = "Cancel",
  handleOnClose,
  handleOnDone,
  yesButtonColor = COLORS.RED,
  justConfirm = false,
}) => {
  const style = useStyles();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalOpen}
      statusBarTranslucent={true}
      onRequestClose={() => handleOnClose()}
    >
      <View style={style.modalContainer}>
        <View style={style.confirmInnerView}>
          <View style={style.confirmTextContainer}>
            <AppText allowFontScaling={false} style={style.modalTitle}>
              {title}
            </AppText>
            <AppText allowFontScaling={false} style={style.modalTagLine}>
              {tagLine}
            </AppText>
          </View>
          {justConfirm ? (
            <View
              style={[
                style.confirmButtonContainer,
                { borderTopWidth: 0, justifyContent: "center" },
              ]}
            >
              <CustomButton
                title={buttonTitle}
                onPress={handleOnDone}
                customStyle={{
                  width: "50%",
                  marginBottom: 15,
                  paddingVertical:13
                }}
              />
            </View>
          ) : (
            <View style={style.confirmButtonContainer}>
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={handleOnClose}
                style={style.bottomButtonView}
              >
                <AppText
                  allowFontScaling={false}
                  style={style.cancelButtonText}
                >
                  {noButtonTitle}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={handleOnDone}
                style={[style.bottomButtonView, style.bottomButtonViewBorder]}
              >
                <AppText
                  allowFontScaling={false}
                  style={[style.logoutButtonText, { color: yesButtonColor }]}
                >
                  {buttonTitle}
                </AppText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationAlert;
