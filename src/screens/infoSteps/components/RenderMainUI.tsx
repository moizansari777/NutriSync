import { View, Text, Image, FlatList, ListRenderItem } from "react-native";
import React, { useCallback } from "react";
import styles from "../styles";
import IMAGES from "../../../assets/images";
import { INFO_STEPS } from "../../../data/staticData";
import StepCard from "./StepCard";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const RenderMainUI = () => {
  const { colors, scheme } = useTheme();
  const keyExtractor = useCallback((item: any) => item?.id, []);

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => <StepCard item={item} />,
    [],
  );

  return (
    <View style={[styles.main, { backgroundColor: colors.GRAY_BG }]}>
      <View style={styles.topRow}>
        <Image source={scheme === "dark" ? IMAGES.splashLogo : IMAGES.logoPrimary} style={styles.logo} />
        <AppText allowFontScaling={false} style={[styles.actionText, { color: colors.HEADING }]}>IN ACTION</AppText>
      </View>
      <FlatList
        data={INFO_STEPS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEventThrottle={16}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        contentContainerStyle={styles.listScroll}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RenderMainUI;
