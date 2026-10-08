import { Platform } from "react-native";
import { AppEnvironment, ENVIRONMENTS } from "../schemas/types";

// export const SERVER_URL =
//   "https://bedbug-trusting-starling.ngrok-free.app/";
// export const SERVER_URL =
//   "https://bitebro-backend-staging-0a8a8d9b3de1.herokuapp.com/";
export const SERVER_URL = "https://www.bitebro.com/";

const API_VERSION = "api/v2/";
export const BASE_URL = `${SERVER_URL}${API_VERSION}`;

// export const SOCKET_URL = `wss://bedbug-trusting-starling.ngrok-free.app/cable`;
// export const SOCKET_URL = `wss://bitebro-backend-staging-0a8a8d9b3de1.herokuapp.com/cable`;
export const SOCKET_URL = `wss://www.bitebro.com/cable`;


// export const ENVIRONMENT: AppEnvironment = ENVIRONMENTS.LOCAL;
export const ENVIRONMENT: AppEnvironment = ENVIRONMENTS.STAGING;
// export const ENVIRONMENT: AppEnvironment = ENVIRONMENTS.PRODUCTION;

export const BUILD_VERSION = Platform.OS === "ios" ? "1.0.22" : "1.0.26";
export const BUILD_NUMBER = Platform.OS === "ios" ? "136" : "43";


