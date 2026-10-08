import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationStates } from "../../schemas/types";

const initialState: LocationStates = {
  lastLatLng: {
    lat: null,
    lng: null,
  },
  dismissedTimezone: null,
};

const locationReducer = createSlice({
  name: "locationReducer",
  initialState,
  reducers: {
    setLastLatLngs: (state, action: PayloadAction<{ lat: any; lng: any }>) => {
      state.lastLatLng = action.payload;
    },
    setDismissedTimezone: (state, action: PayloadAction<string | null>) => {
      state.dismissedTimezone = action.payload;
    },
  },
});

export const { setLastLatLngs, setDismissedTimezone } =
  locationReducer.actions;
export default locationReducer.reducer;
