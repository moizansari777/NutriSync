import { View, Image, Platform } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import MenuCard from "./MenuCard";
import ICONS from "../../../assets/icons";
import CustomBottomSheet from "../../../components/customBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { APP_NAME } from "../../../constant";
import styles from "../styles";
import IMAGES from "../../../assets/images";
import { BUILD_NUMBER, BUILD_VERSION, ENVIRONMENT } from "../../../config";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const AppAbout = () => {
  const { colors } = useTheme();
  const aboutSheetRef = useRef<BottomSheetModal>(
    null as unknown as BottomSheetModal,
  );
  const [sheetKey, setSheetKey] = useState(0);

  const handlePressOnAbout = () => {
    aboutSheetRef?.current?.present();
  };

  // Remount the sheet once it is fully closed, no matter how it got closed
  // (backdrop press or drag down) so it opens cleanly again.
  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setSheetKey(prev => prev - 1);
    }
  }, []);

  return (
    <>
      <MenuCard
        iconName={ICONS.info}
        title="About"
        handlePress={handlePressOnAbout}
      />

      <CustomBottomSheet
        key={sheetKey}
        bottomSheetRef={aboutSheetRef}
        isBackDrop={true}
        enableDrag={false}
        enablePanDownClose={true}
        backdropPressBehavior="close"
        onSheetChange={handleSheetChange}
        customSanps={Platform.OS === "ios" ? ["28%"] : ["40%"]}
      >
        <View style={[styles.topView, styles.sheetTopView]}>
          <View>
            <View style={styles.nameRow}>
              <Image source={IMAGES.appicon} style={styles.logo} />
              <View>
                <AppText allowFontScaling={false} style={[styles.title, { color: colors.HEADING }]}>
                  {APP_NAME}
                </AppText>
                <AppText allowFontScaling={false} style={[styles.subTitle, { color: colors.TEXT }]}>
                  Your On-Demand AI Coach
                </AppText>
              </View>
            </View>
            <View style={styles.infoView}>
              <View>
                <AppText allowFontScaling={false} style={[styles.rowHead, { color: colors.TEXT }]}>
                  Version
                </AppText>
                <AppText
                  style={[styles.rowValue, { color: colors.HEADING }]}
                >{`${ENVIRONMENT} ${BUILD_VERSION}(${BUILD_NUMBER})`}</AppText>
              </View>

              <AppText allowFontScaling={false} style={[styles.rowValue, { color: colors.HEADING }]}>
                © 2026 NutriSync
              </AppText>
            </View>
          </View>
        </View>
      </CustomBottomSheet>
    </>
  );
};

export default AppAbout;
