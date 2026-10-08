import { TouchableOpacity, Image, View } from "react-native";
import React, { ReactNode } from "react";
import styles from "../styles";
import { activeOpacity } from "../../../constant";
import ICONS from "../../../assets/icons";
import LoadingIndicator from "../../../components/loaders/LoadingIndicator";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  iconName: any;
  title: string;
  handlePress: () => void;
  isDisable?: boolean;
  rightText?: string;
  hasBorder?: boolean;
  hasRightArrow?: boolean;
  isLoading?: boolean;
  renderExtraUI?: ReactNode;
};

const MenuCard = ({
  iconName,
  title,
  handlePress,
  isDisable = false,
  rightText = "",
  hasBorder = true,
  hasRightArrow = true,
  isLoading = false,
  renderExtraUI = null,
}: Props) => {
  const { colors } = useTheme();
  // const fontSize = useFontSize()

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handlePress}
      style={[
        styles.rowView,
        {
          borderBottomWidth: hasBorder ? 0.7 : 0,
          borderBottomColor: colors.BORDER_COLOR,
        },
      ]}
    >
      <View style={styles.view}>
        <Image
          source={iconName}
          style={styles.icon}
          tintColor={isDisable ? colors.ICON_COLOR : colors.TEXT}
        />
        <AppText
          allowFontScaling={false}
          style={[
            styles.title,
            {
              color: isDisable ? colors.ICON_COLOR : colors.HEADING,
            },
          ]}
        >
          {title}
        </AppText>
      </View>
      <View style={styles.rightView}>
        {renderExtraUI && renderExtraUI}
        {rightText && (
          <AppText
            allowFontScaling={false}
            style={[styles.rightText, { color: colors.HEADING }]}
          >
            {rightText}
          </AppText>
        )}
        {isLoading && (
          <View style={{ marginLeft: 10 }}>
            <LoadingIndicator color={colors.HEADING} />
          </View>
        )}

        {hasRightArrow && (
          <Image
            source={ICONS.rightArrowGray}
            style={styles.icon}
            tintColor={colors.ICON_COLOR}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MenuCard;
