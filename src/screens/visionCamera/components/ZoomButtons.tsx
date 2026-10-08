import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styles from "../styles";
import { activeOpacity } from "../../../constant";
import { CameraZoomProps } from "../../../schemas/types";
import { useTheme } from "../../../hooks/useTheme";
import { COLORS, darkColors, lightColors } from "../../../macros/colors";
import AppText from "../../../components/appText";

type Props = {
  zoomValue: CameraZoomProps;
  zoomLevels: CameraZoomProps[];
  handleCameraZoom: (value: CameraZoomProps) => void;
};

const ZoomButtons = ({ zoomValue, zoomLevels, handleCameraZoom }: Props) => {
  const { colors, scheme } = useTheme();
  return (
    <View
      style={[
        styles.zoomView,
        {
          backgroundColor:
            scheme === "light" ? COLORS.MIRROR_BG : COLORS.MIRROR_BG,
        },
      ]}
    >
      {zoomLevels?.map(item => {
        return (
          <TouchableOpacity
            key={item?.key}
            activeOpacity={activeOpacity}
            style={[
              styles.zoomButton,
              zoomValue?.key === item?.key && {
                backgroundColor:
                  scheme === "dark" ? colors.BLACK : colors.WHITE,
              },
            ]}
            onPress={() => handleCameraZoom(item)}
          >
            <AppText
              allowFontScaling={false}
              style={[
                styles.zoomText,
                { color: darkColors.TEXT },
                zoomValue?.key === item?.key && { color: colors.HEADING },
              ]}
            >
              {`${item?.key}${zoomValue?.key === item?.key ? "x" : ""}`}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ZoomButtons;
