import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoachFilterKeyProps, FiltersState } from "../../schemas/types";

const initialState: FiltersState = {
  logTDEEFilter: "today",
  quickAddFilter: "last_30_days",
  historyTDEEFilter: "today",
  coachDashboardFilter: "last_7_days",
  coachClientFilter: "last_7_days",
  coachClientDetailsFilter: "last_7_days",
  sharedFilter: "last_7_days",
  chatHistoryFilter: "all",
};

const filtersReducer = createSlice({
  name: "filtersReducer",
  initialState,
  reducers: {
    setLogTDEEFilter: (state, action: PayloadAction<string>) => {
      state.logTDEEFilter = action.payload;
    },

    setQuickAddFilter: (state, action: PayloadAction<string>) => {
      state.quickAddFilter = action.payload;
    },

    setHistoryTDEEFilter: (state, action: PayloadAction<string>) => {
      state.historyTDEEFilter = action.payload;
    },

    setSharedDashboardFilter: (state, action: PayloadAction<string>) => {
      state.sharedFilter = action.payload;
    },

    setChatHistoryFilter: (state, action: PayloadAction<string>) => {
      state.chatHistoryFilter = action.payload;
    },

    setCoachFilter: (
      state,
      action: PayloadAction<{ key: CoachFilterKeyProps; value: string }>,
    ) => {
      state[action.payload.key] = action.payload.value;
    },

    resetFiletrsToInitialState: state => {
      state.logTDEEFilter = "today";
      state.quickAddFilter = "last_30_days";
      state.historyTDEEFilter = "today";
      state.coachDashboardFilter = "today";
      state.coachClientFilter = "today";
      state.coachClientDetailsFilter = "today";
      state.sharedFilter = "last_7_days";
      state.chatHistoryFilter = "today";
    },
  },
});

export const {
  setLogTDEEFilter,
  setQuickAddFilter,
  setHistoryTDEEFilter,
  setCoachFilter,
  resetFiletrsToInitialState,
  setSharedDashboardFilter,
  setChatHistoryFilter
} = filtersReducer.actions;
export default filtersReducer.reducer;
