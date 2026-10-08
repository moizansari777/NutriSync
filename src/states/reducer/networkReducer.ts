import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NetworkState, NetworkStatus } from "../../schemas/types";

const initialState: NetworkState = {
  status: NetworkStatus.ONLINE,
  isConnected: true,
  isInternetReachable: true,
  type: null,
  cellularGeneration: null,
};

const networkReducer = createSlice({
  name: "networkReducer",
  initialState,
  reducers: {
    setNetworkState: (state, action: PayloadAction<NetworkState>) => {
      return action.payload;
    },
  },
});

export const { setNetworkState } = networkReducer.actions;

export default networkReducer.reducer;
