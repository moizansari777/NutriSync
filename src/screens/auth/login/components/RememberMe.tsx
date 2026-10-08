import { Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import ICONS from "../../../../assets/icons";
import styles from "../styles";
import { activeOpacity } from "../../../../constant";
import { useDispatch, useSelector } from "react-redux";
import {
  setAffiliateIsRememberMeEnabled,
  setIsRememberMeEnabled,
} from "../../../../states/reducer/authReducer";
import { RootState } from "../../../../states/store/store";
import { useTheme } from "../../../../hooks/useTheme";
import AppText from "../../../../components/appText";

const RememberMe = ({ isAffiliate = false }: { isAffiliate?: boolean }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const isRememberMeEnabled = useSelector(
    (state: RootState) => state.authReducer?.isRememberMeEnabled,
  );

  const isAffiliateRememberMeEnabled = useSelector(
    (state: RootState) => state.authReducer?.isAffiliateRememberMeEnabled,
  );

  const handleRememberMe = (value: boolean) => {
    if (isAffiliate) {
      dispatch(setAffiliateIsRememberMeEnabled(!value));
    } else {
      dispatch(setIsRememberMeEnabled(!value));
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={() =>
        handleRememberMe(
          isAffiliate
            ? isAffiliateRememberMeEnabled === undefined
              ? false
              : isAffiliateRememberMeEnabled
            : isRememberMeEnabled === undefined
            ? false
            : isRememberMeEnabled,
        )
      }
      style={styles.rememberView}
    >
      <Image
        source={
          isAffiliate
            ? isAffiliateRememberMeEnabled
              ? ICONS.checkbox
              : ICONS.unCheckbox
            : isRememberMeEnabled
            ? ICONS.checkbox
            : ICONS.unCheckbox
        }
        style={styles.checkbox}
        tintColor={colors.TEXT}
      />
      <AppText allowFontScaling={false} style={[styles.loginText, { color: colors.TEXT }]}>
        Remember Me
      </AppText>
    </TouchableOpacity>
  );
};

export default RememberMe;
