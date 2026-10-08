import React from "react";
import { Image, Modal, TouchableOpacity, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import ICONS from "../../assets/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../macros/colors";
import { activeOpacity } from "../../constant";
import LoadingIndicator from "../loaders/LoadingIndicator";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

interface ImagePreviewerProps {
  visible: boolean;
  onClose: () => void;
  images: { url: string }[];
}

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  visible,
  onClose,
  images,
}) => {
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent={false}
      statusBarTranslucent={true}
      onRequestClose={onClose}
      backdropColor={COLORS.BLACK}
    >
      <ImageViewer
        imageUrls={images}
        enableSwipeDown={true}
        onSwipeDown={onClose}
        saveToLocalByLongPress={false}
        onCancel={onClose}
        style={{ marginTop: top + 10 }}
        renderIndicator={() => <></>}
        loadingRender={() => <LoadingIndicator color={colors.HEADING} />}
      />
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onClose}
        style={{
          position: "absolute",
          top: top + 10,
          right: 25,
          backgroundColor: COLORS.GRAY_BG,
          borderRadius: 100,
          padding: 2,
        }}
      >
        <Image source={ICONS.close} style={{ height: 30, width: 30 }} />
      </TouchableOpacity>
    </Modal>
  );
};

export default ImagePreviewer;
