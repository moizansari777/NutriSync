import React, { memo, useEffect, useMemo } from "react";
import CustomSelect from "../../../components/customSelect";
import ICONS from "../../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "../../../schemas/types";
import { screens } from "../../../navigations/routes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../states/store/store";
import { COUNTRIES } from "../../../data/staticData";
import { setUserCountry } from "../../../states/reducer/authReducer";

type Props = {
  isSelectionOutSide?: boolean;
  isRequired?: boolean;
  label?: string;
  placeHolder?: string;
};

const RenderCountry = ({
  isSelectionOutSide,
  isRequired = false,
  label = "Country",
  placeHolder = "Select Country",
}: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavigationProp>();
  const selectedCountry = useSelector(
    (state: RootState) => state.authReducer?.selectedCountry,
  );
  const countrySelection = useSelector(
    (state: RootState) => state.authReducer?.countrySelection,
  );
  const country = useSelector(
    (state: RootState) => state.authReducer?.userData?.user?.country,
  );

  const countryName = useMemo(() => {
    if (isSelectionOutSide) {
      if (countrySelection) {
        return countrySelection?.name;
      } else {
        return COUNTRIES?.find(item => item?.code === country)?.name ?? "";
      }
    } else {
      if (selectedCountry) {
        return selectedCountry?.name;
      } else {
        return COUNTRIES?.find(item => item?.code === country)?.name ?? "";
      }
    }
  }, [country, selectedCountry, isSelectionOutSide, countrySelection]);

  const handleOpenCountrySheet = () => {
    navigation.navigate(screens.SELECT_COUNTRY_SCREEN, {
      isSelectionOutSide,
    });
  };

  useEffect(() => {
    return () => {
      dispatch(setUserCountry(null));
    };
  }, []);

  return (
    <CustomSelect
      label={label}
      isRequired={isRequired}
      placeHolder={placeHolder}
      value={countryName?.toString() || ""}
      handleOnPress={handleOpenCountrySheet}
      iconName={ICONS.country}
    />
  );
};

export default memo(RenderCountry);
