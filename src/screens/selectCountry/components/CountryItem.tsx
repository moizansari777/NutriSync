import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import styles from "../styles";
import ICONS from "../../../assets/icons";
import { activeOpacity } from "../../../constant";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

type Props = {
  code: string;
  name: string;
  phoneCode: string;
  selectedCountry: { code: string; name: string; phoneCode: string } | null;
  handleOnSelectCountry: (
    code: string,
    name: string,
    phoneCode: string,
  ) => void;
};

const CountryItem = ({
  code,
  name,
  phoneCode,
  selectedCountry,
  handleOnSelectCountry,
}: Props) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={styles.mainRow}
      onPress={() => handleOnSelectCountry(code, name, phoneCode)}
    >
      <View style={styles.row}>
        <Image
          source={{ uri: `https://flagcdn.com/w40/${code}.png` }}
          style={styles.flag}
        />
        <AppText allowFontScaling={false} style={[styles.countryName, { color: colors.TEXT }]}>{name}</AppText>
      </View>
      {selectedCountry?.code === code && (
        <Image source={ICONS.checkCircle} style={styles.icon} tintColor={colors.HEADING} />
      )}
    </TouchableOpacity>
  );
};

export default memo(CountryItem);
