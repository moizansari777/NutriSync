import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LogState } from "../../schemas/types";

const initialState: LogState = {
  hasMacros: null,
  hasActivityDataEnabled: false,
};

const logReducer = createSlice({
  name: "logReducer",
  initialState,
  reducers: {
    setTargetMacros: (state, action: PayloadAction<any>) => {
      state.hasMacros = action.payload;
    },
    setActivityDataEnabled: (state, action: PayloadAction<boolean>) => {
      state.hasActivityDataEnabled = action.payload;
    },

    resetLogInitialState: state => {
      state.hasMacros = null;
    },
  },
});

export const { setTargetMacros, setActivityDataEnabled, resetLogInitialState } =
  logReducer.actions;
export default logReducer.reducer;
