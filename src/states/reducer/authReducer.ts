import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  SelectedCountryProps,
  UserAuthData,
} from "../../schemas/types";

const initialState: AuthState = {
  userData: null,
  isUserLoggedIn: false,
  fcm_token: [],
  selectedCountry: null,
  isOnboarding: true,
  isSoundOff: true,
  isPushNotificationEnabled: false,
  countrySelection: null,
  isBiometricsEnabled: false,
  isRememberMeEnabled: false,
  rememberMeInfo: {
    email: "",
  },
  canUseAI: false,
  isAffiliateRememberMeEnabled: false,
  rememberMeAffiliateInfo: {
    email: "",
  },
};

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    setUserAuthData: (state, action: PayloadAction<UserAuthData>) => {
      state.userData = action.payload;
      if (action.payload?.login) {
        state.isUserLoggedIn = true;
      }
    },
    setUserCountry: (
      state,
      action: PayloadAction<SelectedCountryProps | null>,
    ) => {
      state.selectedCountry = action.payload;
    },
    setIsOnboarding: (state, action: PayloadAction<boolean>) => {
      state.isOnboarding = action.payload;
    },
    setDeviceFCMToken: (state, action: PayloadAction<string[]>) => {
      state.fcm_token = action.payload;
    },
    setIsSoundOnOff: (state, action: PayloadAction<boolean>) => {
      state.isSoundOff = action.payload;
    },
    setIsBiometricsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isBiometricsEnabled = action.payload;
    },
    setIsRememberMeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isRememberMeEnabled = action.payload;
    },
    setRememberMeInfo: (state, action: PayloadAction<{ email: string }>) => {
      state.rememberMeInfo = action.payload;
    },
    setCanUseAI: (state, action: PayloadAction<any>) => {
      state.canUseAI = action.payload;
    },
    setCustomMacrosMode: (state, action: PayloadAction<string>) => {
      if (state?.userData?.user) {
        state.userData.user.custom_macros_mode = action.payload;
      }
    },
    setDotDetailsResponse: (state, action: PayloadAction<string>) => {
      if (state?.userData?.user) {
        state.userData.user.chat_response_style = action.payload;
      }
    },
    /**
     * Patch just the body weight on the cached user.
     *
     * The daily statistics log and the user profile are separate records, so
     * saving a weight there leaves `user.weight` — which drives the macro
     * suggestions on Set Custom Daily Macros — at whatever the last login or
     * TDEE save wrote. `weight` must already be in the profile's existing
     * `weight_unit`; pass `weight_unit` only when the unit itself changed.
     */
    setUserWeight: (
      state,
      action: PayloadAction<{ weight: number; weight_unit?: string | null }>,
    ) => {
      if (state?.userData?.user) {
        state.userData.user.weight = action.payload.weight;
        if (action.payload.weight_unit) {
          state.userData.user.weight_unit = action.payload.weight_unit;
        }
      }
    },

    // ======= Affiliate User ======
    setAffiliateIsRememberMeEnabled: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.isAffiliateRememberMeEnabled = action.payload;
    },
    setAffiliateRememberMeInfo: (
      state,
      action: PayloadAction<{ email: string }>,
    ) => {
      state.rememberMeAffiliateInfo = action.payload;
    },
    setTemporaryCountrySelection: (
      state,
      action: PayloadAction<SelectedCountryProps>,
    ) => {
      state.countrySelection = action.payload;
    },
    // ======= Affiliate User ======

    logoutFromStore: state => {
      // console.log("🔴 LOGOUT TRIGGERED - Stack trace below");
      console.trace();
      state.userData = null;
      state.fcm_token = [];
      state.isUserLoggedIn = false;
      state.countrySelection = null;
      state.isOnboarding = true;
    },
  },
});

export const {
  setUserAuthData,
  setUserCountry,
  logoutFromStore,
  setIsOnboarding,
  setIsSoundOnOff,
  setIsBiometricsEnabled,
  setIsRememberMeEnabled,
  setRememberMeInfo,
  setDeviceFCMToken,
  setCanUseAI,
  setCustomMacrosMode,
  setDotDetailsResponse,
  setUserWeight,

  // ======= Affiliate User ======
  setAffiliateIsRememberMeEnabled,
  setAffiliateRememberMeInfo,
  setTemporaryCountrySelection,
} = authReducer.actions;
export default authReducer.reducer;
