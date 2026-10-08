import { View, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import styles from "./styles";
import { activeOpacity } from "../../../constant";
import {
  useLazyGetPlanURLQuery,
  useTrackBillingClickedMutation,
} from "../../../services/chatServices";
import { getError } from "../../../utils/errors";
import { errorAlert } from "../../../utils/alerts";
import LoadingIndicator from "../../../components/loaders/LoadingIndicator";
import { openURL } from "../../../utils/openURL";
import AppText from "../../../components/appText";
import { useTheme } from "../../../hooks/useTheme";

const NoSubscription = ({ canUseAI }: { canUseAI: boolean }) => {
  const { colors } = useTheme();

  const [planURL, { isLoading: isGettingURL }] = useLazyGetPlanURLQuery();
  const [trackPlan] = useTrackBillingClickedMutation();

  const handleGoToScriptionScreen = async () => {
    try {
      const [_, planResponse] = await Promise.all([
        trackPlan({
          clicked_subscription_button: true,
        }).unwrap(),

        planURL(undefined).unwrap(),
      ]);

      openURL(planResponse?.plans_url);
    } catch (error) {
      const errorMessage = getError(error);
      errorAlert({ body: errorMessage || "" });
    }
  };

  return (
    <>
      {canUseAI ? (
        <View />
      ) : (
        <>
          <View style={styles.blockView} />
          <View style={styles.bannerView}>
            <AppText
              allowFontScaling={false}
              style={[styles.bannerTitle, { color: colors.HEADING }]}
            >
              No Active Subscription
            </AppText>
            <AppText
              allowFontScaling={false}
              style={[styles.bannerText, { color: colors.TEXT }]}
            >
              Subscribe now for{" "}
              <AppText
                allowFontScaling={false}
                style={[styles.darkText, { color: colors.HEADING }]}
              >{`$15USD `}</AppText>
              per month for access
            </AppText>
            {isGettingURL ? (
              <TouchableOpacity activeOpacity={1} style={styles.buttonView}>
                <LoadingIndicator color={colors.HEADING} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={handleGoToScriptionScreen}
                style={styles.buttonView}
              >
                <AppText
                  allowFontScaling={false}
                  style={[styles.buttonText, { color: colors.HEADING }]}
                >
                  Subscribe Now
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </>
  );
};

export default memo(NoSubscription);
