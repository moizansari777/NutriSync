import { View, Text, Pressable } from "react-native";
import React from "react";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../../../macros/colors";
import styles from "../../homeCoach/styles";
import { ClientProps, RootNavigationProp } from "../../../../../schemas/types";
import { screens } from "../../../../../navigations/routes";
import { useTheme } from "../../../../../hooks/useTheme";
import AppText from "../../../../../components/appText";

type Props = {
  item: ClientProps;
};

const ClientCard = ({ item }: Props) => {
  const { colors } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const handleGoToDetails = () => {
    navigation.navigate(screens.CLIENT_DETAILS_SCREEN, {
      clientName: item?.name || "",
      clientId: item?.id,
    });
  };

  return (
    <Pressable onPress={handleGoToDetails}>
      <View style={[styles.view, { backgroundColor: colors.WHITE }]}>
        <View style={styles.row}>
          <AppText allowFontScaling={false} style={[styles.title, { color: colors.HEADING }]}>
            {item?.name || ""}
          </AppText>
          <View style={styles.rowBottom}>
            <View style={styles.topRow}>
              <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>
                Joined at:
              </AppText>
              <AppText allowFontScaling={false} style={[styles.label, styles.bold, { color: colors.TEXT }]}>
                {item?.created_at
                  ? format(new Date(item?.created_at), "PP")
                  : ""}
              </AppText>
            </View>
            <View style={styles.topRow}>
              <AppText allowFontScaling={false} style={[styles.label, { color: colors.TEXT }]}>
                Subscription:
              </AppText>
              <View
                style={[
                  styles.subCard,
                  {
                    backgroundColor: item?.active ? COLORS.GREEN : COLORS.RED,
                  },
                ]}
              >
                <AppText allowFontScaling={false} style={styles.subsText}>
                  {item?.active ? "Active" : "InActive"}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ClientCard;
