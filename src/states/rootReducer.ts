import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import chatReducer from "./reducer/chatReducer";
import logReducer from "./reducer/logReducer";
import filtersReducer from "./reducer/filtersReducer";
import locationReducer from "./reducer/locationReducer";
import cameraReducer from "./reducer/cameraReducer";
import settingReducer from "./reducer/settingReducer";
import networkReducer from "./reducer/networkReducer";
import { authService } from "../services/authService";
import { profileServices } from "../services/profileServices";
import { chatServices } from "../services/chatServices";
import { referralServices } from "../services/referralServices";
import { affiliateAuthServices } from "../services/affiliateServices/affiliateAuthServices";
import { affiliateServices } from "../services/affiliateServices/affiliateServices";
import { logsTDEEServices } from "../services/logsTDEEServices";
import { externalServices } from "../services/externalServices";
import { coachServices } from "../services/affiliateServices/coachServices";
import { friendAccessServices } from "../services/friendAccessServices";

const rootReducer = combineReducers({
  authReducer: authReducer,
  chatReducer: chatReducer,
  logReducer: logReducer,
  filtersReducer: filtersReducer,
  locationReducer: locationReducer,
  cameraReducer: cameraReducer,
  settingReducer: settingReducer,
  networkReducer: networkReducer,
  [authService.reducerPath]: authService.reducer,
  [profileServices.reducerPath]: profileServices.reducer,
  [chatServices.reducerPath]: chatServices.reducer,
  [referralServices.reducerPath]: referralServices.reducer,
  [affiliateAuthServices.reducerPath]: affiliateAuthServices.reducer,
  [affiliateServices.reducerPath]: affiliateServices.reducer,
  [logsTDEEServices.reducerPath]: logsTDEEServices.reducer,
  [externalServices.reducerPath]: externalServices.reducer,
  [coachServices.reducerPath]: coachServices.reducer,
  [friendAccessServices.reducerPath]: friendAccessServices.reducer,
});

export default rootReducer;
