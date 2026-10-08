import { View, Keyboard } from "react-native";
import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "./styles";
import { RootStackParamList, screens } from "../../../navigations/routes";
import { RootState } from "../../../states/store/store";
import ScreenWrapper from "../../../components/screenWrapper";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { getError } from "../../../utils/errors";
import KeyboardController from "../../../components/keyboardController";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import {
  EMAIL_RULES,
  PHONE_RULES,
  REQUIRED_RULE,
} from "../../../utils/validationRules";
import ICONS from "../../../assets/icons";
import RenderCountry from "../../accounts/components/RenderCountry";
import CustomButton from "../../../components/buttons";
import { useUpdateAffiliatePartnerMutation } from "../../../services/affiliateServices/affiliateServices";

type Props = NativeStackScreenProps<
  RootStackParamList,
  screens.AFFILIATE_ACCOUNTS_SCREEN
>;

const AffiliateAccounts: FC<Props> = ({ navigation }) => {
  const countrySelection = useSelector(
    (state: RootState) => state.authReducer?.countrySelection,
  );

  const [updateAffiliateUserInfo, { isLoading }] =
    useUpdateAffiliatePartnerMutation();

  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    const propsData = { ...data, country: countrySelection?.name };

    updateAffiliateUserInfo(propsData)
      .unwrap()
      .then(async payload => {
        successAlert({ body: "Account has been updated successfully" });

        navigation.goBack();
      })
      .catch(error => {
        // console.log("Update affiliate user info error", error);
        const errorMessage = getError(error);
        errorAlert({ body: errorMessage || "" });
      });
  };

  return (
    <ScreenWrapper isBack={true} hasTitle={true} title="Accounts">
      <KeyboardController>
        <View style={styles.container}>
          <CustomTextInput
            name="company_name"
            label="Company Name"
            placeholder={""}
            control={control}
            isLoading={false}
            rules={REQUIRED_RULE}
            iconName={ICONS.company}
          />
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="contact_email"
              label="Business Email"
              placeholder={""}
              control={control}
              isLoading={false}
              rules={EMAIL_RULES}
              iconName={ICONS.email}
            />
          </View>
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="contact_phone"
              label="Business Phone"
              placeholder={""}
              control={control}
              isLoading={false}
              rules={PHONE_RULES}
              iconName={ICONS.phone}
            />
          </View>
          <View style={styles.topInputMargin}>
            <RenderCountry
              isSelectionOutSide={true}
              placeHolder=""
              label="Bussiness Country"
            />
          </View>
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="business_type"
              label="Business Type"
              placeholder={""}
              control={control}
              isLoading={false}
              rules={REQUIRED_RULE}
              iconName={ICONS.user}
            />
          </View>
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="business_address"
              label="Business Address"
              placeholder={""}
              control={control}
              isLoading={false}
              rules={REQUIRED_RULE}
              iconName={ICONS.point}
            />
          </View>
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="facebook_profile_url"
              label="Facebook Profile URL"
              placeholder={""}
              control={control}
              isLoading={false}
              rules={{}}
              iconName={ICONS.fb}
            />
          </View>
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="instagram_profile_url"
              label="Instagram Profile URL"
              placeholder={""}
              control={control}
              isLoading={false}
              rules={{}}
              iconName={ICONS.insta}
            />
          </View>
          <View style={styles.topInputMargin}>
            <CustomTextInput
              name="tiktok_profile_url"
              label="Tiktok Profile URL"
              placeholder={""}
              control={control}
              isLoading={false}
              rules={{}}
              iconName={ICONS.insta}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Save Changes"
              isLoading={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </KeyboardController>
    </ScreenWrapper>
  );
};

export default AffiliateAccounts;
