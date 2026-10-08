import { View, Text, Modal, Image } from "react-native";
import React, { FC } from "react";
import { useStyles } from "./styles";
import CustomButton from "../buttons";
import ICONS from "../../assets/icons";
import { COLORS } from "../../macros/colors";
import AppText from "../appText";

type Props = {
  isModalOpen: boolean;
  title: string;
  tagLine: string;
  handleOnClose: () => void;
  handleOnDone: () => void;
  doneButtonText?: string;
};

const CustomModal: FC<Props> = ({
  isModalOpen,
  title,
  tagLine,
  handleOnClose,
  handleOnDone,
  doneButtonText = "Done",
}) => {
  const styles = useStyles();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalOpen}
      statusBarTranslucent={true}
      onRequestClose={() => handleOnClose()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.innerView}>
          <View style={styles.dineIconView}>
            <Image
              source={ICONS.checkCircle}
              style={styles.doneIcon}
              tintColor={COLORS.PRIMARY}
            />
          </View>
          <View style={styles.textContainer}>
            <AppText allowFontScaling={false} style={styles.modalTitle}>{title}</AppText>
            <AppText allowFontScaling={false} style={styles.modalTagLine}>{tagLine}</AppText>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title={doneButtonText}
              isLoading={false}
              onPress={handleOnDone}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
