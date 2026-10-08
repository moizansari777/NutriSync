import { PermissionsAndroid, Platform } from "react-native";

export const requestPermissions = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    const cameraGranted = granted["android.permission.CAMERA"] === "granted";
    const audioGranted =
      granted["android.permission.RECORD_AUDIO"] === "granted";

    return cameraGranted && audioGranted;
  }
  return true;
};

export async function requestLocationPermission() {
  if (Platform.OS === "android" && Platform.Version >= 23) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "We use your location to detect your current timezone so we can accurately reset your daily macros.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true; // Permissions automatically granted for Android < 23
  }
}
