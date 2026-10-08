import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingStates } from "../../schemas/types";

const initialState: SettingStates = {
  themeMode: "system",
  textScaleValue: 1,
  appreview: {
    lastShownAt: null,
    hasReviewed: false,
  },
};

const settingReducer = createSlice({
  name: "settingReducer",
  initialState,
  reducers: {
    setThemeMode: (
      state,
      action: PayloadAction<SettingStates["themeMode"]>,
    ) => {
      state.themeMode = action.payload;
    },
    setTextScaleValue: (state, action: PayloadAction<number>) => {
      state.textScaleValue = action.payload ?? 1;
    },

    setLastShownAt: (state, action: PayloadAction<number>) => {
      // 👇 if appreview doesn't exist yet, create it first
      if (!state.appreview) {
        state.appreview = {
          lastShownAt: action.payload,
          hasReviewed: false,
        };
      } else {
        state.appreview.lastShownAt = action.payload;
      }
    },

    setMarkAsReviewed: state => {
      if (!state.appreview) {
        state.appreview = {
          lastShownAt: Date.now(),
          hasReviewed: true,
        };
      } else {
        state.appreview.hasReviewed = true;
        state.appreview.lastShownAt = Date.now();
      }
    },

    setMarkAsDismissed: state => {
      if (!state.appreview) {
        state.appreview = {
          lastShownAt: Date.now(),
          hasReviewed: false,
        };
      } else {
        state.appreview.lastShownAt = Date.now();
      }
    },
  },
});

export const {
  setThemeMode,
  setTextScaleValue,
  setLastShownAt,
  setMarkAsDismissed,
  setMarkAsReviewed,
} = settingReducer.actions;
export default settingReducer.reducer;
