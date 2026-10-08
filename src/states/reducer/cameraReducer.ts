import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveScanState } from "../../schemas/types";

const initialState: LiveScanState = {
  isLiveScanActive: false,
  isScreenFromLogHistory: "",
};

const cameraReducer = createSlice({
  name: "cameraReducer",
  initialState,
  reducers: {
    setLiveScanActivate: (state, action: PayloadAction<boolean>) => {
      state.isLiveScanActive = action.payload;
    },
    setScreenFromLogHistory: (state, action: PayloadAction<string>) => {
      state.isScreenFromLogHistory = action.payload;
    },
  },
});

export const { setLiveScanActivate, setScreenFromLogHistory } =
  cameraReducer.actions;
export default cameraReducer.reducer;
