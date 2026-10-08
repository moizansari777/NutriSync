import { configureStore } from "@reduxjs/toolkit";

import {
  createMigrate,
  FLUSH,
  PAUSE,
  PERSIST,
  PersistConfig,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import rootReducer from "../rootReducer";
import { setupListeners } from "@reduxjs/toolkit/query";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { authService } from "../../services/authService";
import { profileServices } from "../../services/profileServices";
import { chatServices } from "../../services/chatServices";
import { referralServices } from "../../services/referralServices";
import { affiliateServices } from "../../services/affiliateServices/affiliateServices";
import { affiliateAuthServices } from "../../services/affiliateServices/affiliateAuthServices";
import { logsTDEEServices } from "../../services/logsTDEEServices";
import { externalServices } from "../../services/externalServices";
import { coachServices } from "../../services/affiliateServices/coachServices";
import { friendAccessServices } from "../../services/friendAccessServices";

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage: AsyncStorage,
  version: 0,
  stateReconciler: autoMergeLevel2,
  timeout: undefined,
  blacklist: [
    "chatReducer",
    "logReducer",
    "cameraReducer",
    "networkReducer",
    // APIs
    authService.reducerPath,
    profileServices.reducerPath,
    logsTDEEServices.reducerPath,
    externalServices.reducerPath,
    coachServices.reducerPath,
    referralServices.reducerPath,
    chatServices.reducerPath,
    affiliateServices.reducerPath,
    affiliateAuthServices.reducerPath,
    friendAccessServices.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authService.middleware,
      profileServices.middleware,
      chatServices.middleware,
      referralServices.middleware,
      affiliateAuthServices.middleware,
      affiliateServices.middleware,
      logsTDEEServices.middleware,
      externalServices.middleware,
      coachServices.middleware,
      friendAccessServices.middleware,
    ),
});

const persistor = persistStore(store, null, () => {
  console.log("REHYDRATED");
  // console.log("canUseAI REHYDRATED =>>", store.getState().authReducer?.canUseAI);
});

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

setupListeners(store.dispatch);
