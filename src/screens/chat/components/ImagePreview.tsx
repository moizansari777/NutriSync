import { TouchableOpacity, Image, View } from "react-native";
import React, { memo, useState } from "react";
import { activeOpacity } from "../../../constant";
import styles from "../styles";
import ICONS from "../../../assets/icons";
import { COLORS } from "../../../macros/colors";
import { SelectedImageProps } from "../../../schemas/types";
import ImagePreviewer from "../../../components/imagePreviewer";

type Props = {
  currentSelectedImage: SelectedImageProps;
  handleDeselectImage: () => void;
};

const ImagePreview = ({ currentSelectedImage, handleDeselectImage }: Props) => {
  const [isPreviewVisible, setPreviewVisible] = useState<boolean>(false);

  const handlePreviewImage = () => {
    setPreviewVisible(true);
  };

  return (
    <>
      <View style={styles.selctedImgView}>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={handlePreviewImage}
        >
          <Image
            source={{ uri: currentSelectedImage?.uri }}
            style={styles.selctedImg}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={handleDeselectImage}
          style={styles.closeIconView}
        >
          <Image
            source={ICONS.closeRed}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
      </View>

      {isPreviewVisible && (
        <ImagePreviewer
          visible={isPreviewVisible}
          onClose={() => setPreviewVisible(false)}
          images={[{ url: currentSelectedImage?.uri }]}
        />
      )}
    </>
  );
};

export default memo(ImagePreview);
