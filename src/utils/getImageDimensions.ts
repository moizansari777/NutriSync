import { Image } from "react-native";

export const getImageDimensions = (
  uri: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
};
