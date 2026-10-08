import React, { useMemo, useState, useCallback, FC } from "react";
import { FlatList, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styles from "./styles";
import ScreenWrapper from "../../components/screenWrapper";
import { COLORS } from "../../macros/colors";
import CountryItem from "./components/CountryItem";
import { COUNTRIES } from "../../data/staticData";
import {
  setTemporaryCountrySelection,
  setUserCountry,
} from "../../states/reducer/authReducer";
import { RootState } from "../../states/store/store";
import { errorAlert } from "../../utils/alerts";
import { RootStackParamList, screens } from "../../navigations/routes";
import { useTheme } from "../../hooks/useTheme";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.SELECT_COUNTRY_SCREEN
>;

const SelectCountry: FC<Props> = ({ navigation, route }) => {
  const isSelectionOutSide = route.params?.isSelectionOutSide ?? false;
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const country = useSelector(
    (state: RootState) => state.authReducer?.userData?.user?.country,
  );

  const countryName = useMemo(() => {
    if (!country) return "";
    return COUNTRIES?.find(item => item?.code === country) ?? "";
  }, [country]);

  const [queryText, setQueryText] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<{
    code: string;
    name: string;
    phoneCode: string;
  } | null>(countryName || null);

  const handleOnChange = (text: string) => {
    setQueryText(text);
  };

  const handleSaveCountry = () => {
    if (selectedCountry) {
      if (isSelectionOutSide) {
        dispatch(setTemporaryCountrySelection(selectedCountry));
      } else {
        dispatch(setUserCountry(selectedCountry));
      }
      navigation.goBack();
    } else {
      errorAlert({ body: "Select the country first" });
    }
  };

  const handleOnSelectCountry = useCallback(
    (code: string, name: string, phoneCode: string) => {
      setSelectedCountry({ code, name, phoneCode });
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: any) => (
      <CountryItem
        code={item?.code}
        name={item?.name}
        phoneCode={item?.phoneCode}
        selectedCountry={selectedCountry}
        handleOnSelectCountry={handleOnSelectCountry}
      />
    ),
    [handleOnSelectCountry, selectedCountry],
  );

  const keyExtractor = useCallback(
    (item: { code: string; name: string }, index: number) =>
      `${item?.code}-${index}`,
    [],
  );

  const filteredData = useMemo(() => {
    if (!queryText?.trim()) return COUNTRIES;
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(queryText?.toLowerCase()),
    );
  }, [queryText]);

  return (
    <ScreenWrapper
      hasTitle={true}
      isBack={true}
      title="Select Country"
      isClose={true}
      hasButton={true}
      onPressSave={handleSaveCountry}
    >
      <View style={styles.container}>
        <TextInput
        allowFontScaling={false}
          value={queryText}
          autoCapitalize="none"
          onChangeText={handleOnChange}
          style={[
            styles.inputStyle,
            { borderColor: colors.INPUT_BORDER, backgroundColor: colors.INPUT_BG, color:colors.HEADING },
          ]}
          placeholder="Search country"
          placeholderTextColor={colors.ICON_COLOR}
          selectionColor={colors.PRIMARY}
          autoComplete="off"
        />

        <FlatList
          data={filteredData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={15}
          windowSize={5}
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={15}
          removeClippedSubviews
          contentContainerStyle={styles.listScroll}
        />
      </View>
    </ScreenWrapper>
  );
};

export default SelectCountry;
