import ImagePicker, { Image, Video } from "react-native-image-crop-picker";
import { PickedFile, PickedResult, PickerProps } from "../schemas/types";

const buildFile = (file: Image | Video): PickedFile => {
  return {
    uri: file.path,
    name: file.filename ?? `file_${Date.now()}.${file.mime.split("/")[1]}`,
    type: file.mime,
    size: file.size ?? 0,
  };
};

export const pickFromCamera = async (
  props: PickerProps = {},
): Promise<PickedResult | null> => {
  const {
    width = 800,
    height = 800,
    includeBase64 = false,
    mediaType = "photo",
    cropping = true,
  } = props;

  try {
    const response = await ImagePicker.openCamera({
      width,
      height,
      mediaType,
      cropping,
      includeBase64,
      compressImageQuality: 0.8,
      freeStyleCropEnabled: true,
    });

    const file = buildFile(response);
    const base64 =
      includeBase64 && "data" in response
        ? [response?.data as string]
        : undefined;

    return {
      files: [file],
      ...(base64 && { base64 }),
    };
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    if (err.code === "E_PICKER_CANCELLED") return null;
    console.error("Camera Picker Error:", error);
    throw error;
  }
};

export const pickFromGallery = async (
  props: PickerProps = {},
): Promise<PickedResult | null> => {
  const {
    width = 800,
    height = 800,
    includeBase64 = false,
    multiple = false,
    mediaType = "photo",
    cropping = false,
  } = props;

  try {
    const response = await ImagePicker.openPicker({
      width,
      height,
      mediaType,
      cropping,
      includeBase64,
      multiple,
      compressImageQuality: 0.8,
      freeStyleCropEnabled: true,
    });

    const responses = Array.isArray(response) ? response : [response];
    const files = responses.map(buildFile);
    const base64 = includeBase64
      ? responses
          .filter(item => item?.data !== undefined)
          .map(item => item?.data as string)
      : undefined;

    return {
      files,
      ...(base64 && { base64 }),
    };
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    if (err.code === "E_PICKER_CANCELLED") return null;
    console.error("Gallery Picker Error:", error);
    throw error;
  }
};

export const cleanupImagePicker = async (): Promise<void> => {
  try {
    await ImagePicker.clean();
  } catch (err) {
    console.warn("ImagePicker cleanup error:", err);
  }
};
