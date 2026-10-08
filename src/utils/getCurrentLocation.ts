import Geolocation from "@react-native-community/geolocation";
import { requestLocationPermission } from "./permissions";
import { Alert } from "react-native";

export async function getCurrentLocation() {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    Alert.alert(
      "Permission denied",
      "Cannot access location to detect timezone.",
    );
    return null;
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: any) => {
        // On Android API >= 18, you can check if it's mocked
        const isMocked = position?.mocked || false;
        resolve({ ...position, isMocked });
      },
      error => {
        console.warn("Geolocation error:", error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
}
