import { View, TextInput, TouchableOpacity, Image } from "react-native";
import React, { memo, useCallback, useState } from "react";
import styles from "./styles";
import { COLORS } from "../../macros/colors";
import { activeOpacity } from "../../constant";
import ICONS from "../../assets/icons";
import { useTheme } from "../../hooks/useTheme";
import Svg, { Circle, Path } from "react-native-svg";

const SearchInput = ({
  handleSearch,
  placeholder,
}: {
  handleSearch: (searchType: string, text: string) => void;
  placeholder: string;
}) => {
  let typingTimeout: NodeJS.Timeout;
  const { colors } = useTheme();
  const [queryText, setQueryText] = useState<string>("");

  const handleOnChange = (text: string) => {
    setQueryText(text);
    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      handleSearch("search", text);
    }, 500);
  };

  // const handleSetVoiceResult = useCallback((text: string) => {
  //   handleOnChange(text);
  // }, []);

  const handleReset = () => {
    setQueryText("");
    handleSearch("search", "");
  };

  // const handleSetIsListening = useCallback((value: boolean) => {}, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.INPUT_BG, borderColor: colors.INPUT_BORDER },
      ]}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" style={styles.searchIcon}>
        <Circle
          cx={11}
          cy={11}
          r={7}
          stroke={colors.ICON_COLOR}
          strokeWidth={2.4}
          fill="none"
        />
        <Path
          d="M16.5 16.5 21 21"
          stroke={colors.ICON_COLOR}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      </Svg>
      <TextInput
        allowFontScaling={false}
        value={queryText}
        autoCapitalize="none"
        onChangeText={handleOnChange}
        style={[styles.inputStyle, { color: colors.HEADING }]}
        placeholder={placeholder}
        placeholderTextColor={colors.ICON_COLOR}
        selectionColor={colors.PRIMARY}
        autoComplete="off"
      />
      {queryText && (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={handleReset}
          style={[styles.iconCircleView, { backgroundColor: colors.GRAY_BG }]}
        >
          <Image
            source={ICONS.cross}
            style={styles.sendIcon}
            tintColor={colors.HEADING}
          />
        </TouchableOpacity>
      )}
      {/* {queryText ? (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={handleReset}
          style={styles.iconCircleView}
        >
          <Image source={ICONS.cross} style={styles.sendIcon} />
        </TouchableOpacity>
      ) : (
        <VoiceInput
          handleSetVoiceResult={handleSetVoiceResult}
          handleSetIsListening={handleSetIsListening}
        />
      )} */}
    </View>
  );
};

export default memo(SearchInput);
