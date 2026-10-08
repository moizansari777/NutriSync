import { Linking } from "react-native";
import { errorAlert } from "./alerts";

export const openURL = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    errorAlert({
      title: "Error",
      body: "Something went wrong while trying to open the link.",
    });
  }
};
