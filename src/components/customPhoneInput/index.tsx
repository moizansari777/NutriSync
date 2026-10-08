import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTextInput from "../forms/CustomTextInput";
import { PHONE_RULES2 } from "../../utils/validationRules";
import ICONS from "../../assets/icons";
import styles from "./styles";
import { RootState } from "../../states/store/store";
import { getPhoneDetails } from "../../utils/validatePhoneNumber";
import { setUserCountry } from "../../states/reducer/authReducer";
import { COUNTRIES } from "../../data/staticData";
import { useTheme } from "../../hooks/useTheme";
import AppText from "../appText";

type Props = {
  user: any;
  control: any;
  watch: any;
  setValue: any;
  setError: any;
  clearErrors: any;
  phoneRef: any;
  isRequired?: boolean;
};

const CustomPhoneInput = ({
  user,
  control,
  watch,
  setValue,
  setError,
  clearErrors,
  phoneRef,
  isRequired = false,
}: Props) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const currentValue = watch("phone_number");
  const selectedCountry = useSelector(
    (state: RootState) => state.authReducer?.selectedCountry,
  );

  const [phoneData, setPhoneData] = useState<any>(null);

  useEffect(() => {
    let countryObj;
    if (user?.user?.country) {
      countryObj = COUNTRIES.find(item => item.code === user.user.country);
      if (countryObj) dispatch(setUserCountry(countryObj));
    }

    if (user?.user?.phone_number) {
      const result = getPhoneDetails(
        user?.user?.phone_number,
        countryObj?.code,
      );
      if (result?.nationalNumber) {
        setValue("phone_number", result?.nationalNumber);
      } else {
        setValue("phone_number", user.user.phone_number);
      }
    }
  }, [user?.user]);

  useEffect(() => {
    const phoneToCheck = currentValue || user?.user?.phone_number || "";
    const countryCode = selectedCountry?.code;

    if (!countryCode) return;

    const result = getPhoneDetails(phoneToCheck, countryCode);
    setPhoneData(result);
    phoneRef.current = result;

    if (!result?.isValid) {
      setError("phone_number", {
        type: "custom",
        message: "Invalid phone number format",
      });
    } else {
      clearErrors("phone_number");
    }
  }, [currentValue, selectedCountry]);

  return (
    <View style={styles.mainView}>
      {/* Country code */}
      <View>
        <AppText
          allowFontScaling={false}
          style={[styles.inputLabel, { color: colors.HEADING }]}
        >
          Code
        </AppText>
        <View
          style={[
            styles.inputFieldMain,
            {
              borderColor: colors.INPUT_BORDER,
              backgroundColor: colors.INPUT_BG,
            },
          ]}
        >
          <AppText allowFontScaling={false} style={{ color: colors.TEXT }}>
            {phoneData?.countryCode || selectedCountry?.phoneCode}
          </AppText>
        </View>
      </View>

      {/* Phone number input */}
      <View style={{ flex: 1 }}>
        <CustomTextInput
          name="phone_number"
          label="Phone Number"
          placeholder={phoneData?.nationalNumber || "Enter phone number"}
          control={control}
          requiredLabel={isRequired}
          isLoading={false}
          rules={PHONE_RULES2(selectedCountry?.code)}
          iconName={ICONS.phone}
          mainStyle={{ flex: 1 }}
          onBlur={() => {
            if (phoneData?.nationalNumber) {
              setValue("phone_number", phoneData.nationalNumber);
            }
          }}
        />
      </View>
    </View>
  );
};

export default CustomPhoneInput;
