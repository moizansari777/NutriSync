import React, { useCallback } from "react";
import { Platform, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { RootNavigationProp } from "../../schemas/types";
import {
  setCurrentSelectedImage,
  setIsFromCropEditOrNext,
} from "../../states/reducer/chatReducer";
import { screens } from "../../navigations/routes";
import CustomImageCropper from "./components/CustomImageCropper";
import { COLORS } from "../../macros/colors";

const PreviewFullImage = ({ route }: any) => {
  const dispatch = useDispatch();
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation<RootNavigationProp>();

  const imageUri: string = route?.params?.imageURL || "";

  const handleNavigate = useCallback(
    (isEditCrop: boolean, imagePayload: any) => {
      navigation.navigate(screens.MAIN_SCREEN_STACK, {
        screen: screens.BOTTOM_TAB_STACK,
        params: { screen: screens.CHAT_SCREEN },
      });

      dispatch(setIsFromCropEditOrNext(isEditCrop));
      dispatch(setCurrentSelectedImage(imagePayload));
    },
    [dispatch, navigation],
  );

  const handleRetake = useCallback(() => {
    navigation.goBack();
    dispatch(setCurrentSelectedImage(null));
  }, [dispatch, navigation]);

  const handleNext = useCallback(
    (croppedObj: any) => {
      const imagePayload = {
        name: `photo_${Date.now()}.jpg`,
        uri:
          Platform.OS === "android"
            ? croppedObj?.uri
            : croppedObj?.uri?.replace("file://", ""),
        type: croppedObj?.type || "image/jpeg",
      };

      handleNavigate(false, imagePayload);
    },
    [handleNavigate],
  );

  const handleAddDescription = useCallback(
    (croppedObj: any) => {
      const imagePayload = {
        name: `photo_${Date.now()}.jpg`,
        uri:
          Platform.OS === "android"
            ? croppedObj?.uri
            : croppedObj?.uri?.replace("file://", ""),
        type: croppedObj?.type || "image/jpeg",
      };

      handleNavigate(true, imagePayload);
    },
    [handleNavigate],
  );

  return (
    <SafeAreaView style={[styles.root, {}]} edges={["top"]}>
      <CustomImageCropper
        imageUri={imageUri}
        onRetake={handleRetake}
        onNext={handleNext}
        onAddDescription={handleAddDescription}
        bottomInset={bottom}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.BLACK },
  frameWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  frameWrapView: {
    position: "absolute",
    width: 55,
    height: 55,
    backgroundColor: "rgba(0,0,0,.7)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
    paddingLeft: 1,
  },
});

export default PreviewFullImage;
