import NetInfo from "@react-native-community/netinfo";
import { NetworkStatus } from "../schemas/types";
import { store } from "../states/store/store";
import { setNetworkState } from "../states/reducer/networkReducer";

export const initializeNetworkListener = () => {
  return NetInfo.addEventListener(state => {
    let status = NetworkStatus.ONLINE;

    const isConnected = state?.isConnected === true;
    const isInternetReachable = state?.isInternetReachable;

    if (!isConnected) {
      status = NetworkStatus.OFFLINE;
    } else if (isInternetReachable === false) {
      status = NetworkStatus.NO_INTERNET;
    } else if (
      state.type === "cellular" &&
      (state?.details?.cellularGeneration === "2g" ||
        state?.details?.cellularGeneration === "3g")
    ) {
      status = NetworkStatus.SLOW;
    }

    const cellularGeneration =
      state?.type === "cellular" &&
      state?.details &&
      "cellularGeneration" in state?.details
        ? state?.details?.cellularGeneration
        : null;

    store.dispatch(
      setNetworkState({
        status,
        isConnected,
        isInternetReachable,
        type: state?.type,
        cellularGeneration: cellularGeneration,
      }),
    );
  });
};
