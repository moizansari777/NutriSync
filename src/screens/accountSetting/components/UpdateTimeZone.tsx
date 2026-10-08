import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ICONS from "../../../assets/icons";
import { RootState } from "../../../states/store/store";
import { errorAlert, successAlert } from "../../../utils/alerts";
import { useSaveTimezoneMutation } from "../../../services/profileServices";
import { setUserAuthData } from "../../../states/reducer/authReducer";
import { getError } from "../../../utils/errors";
import { Image, Platform, TouchableOpacity, View } from "react-native";
import { activeOpacity } from "../../../constant";
import styles from "../../setting/styles";
import { COLORS } from "../../../macros/colors";
import LoadingIndicator from "../../../components/loaders/LoadingIndicator";
import LocationModal from "../../../components/locationUpdateModal/LocationModal";
import { useTheme } from "../../../hooks/useTheme";
import AppText from "../../../components/appText";

const UpdateTimeZone = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const user = useSelector((state: RootState) => state.authReducer?.userData);
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const isTimeZone = user?.user?.timezone && user?.user?.timezone === timezone;
  const [isVisible, setIsVisible] = useState(false);

  const [saveTimeZoneAPI, { isLoading }] = useSaveTimezoneMutation();

  const handleUpdateTimeZone = () => {
    if (isLoading) return;
    if (isTimeZone) {
      errorAlert({
        body: "Your timezone is already set. We’ll automatically update it if your location changes.",
      });
      return;
    }
    setIsVisible(true);
  };

  const handleUpdatePress = () => {
    if (isTimeZone && !timezone) {
      return;
    }
    handleSaveTimeZone();
  };

  const handleOnCancel = () => {
    setIsVisible(false);
  };

  const handleSaveTimeZone = () => {
    saveTimeZoneAPI({ timezone:"America/New_York" })
      .unwrap()
      .then(async () => {
        successAlert({ body: "Timezone has been updated" });
        setIsVisible(false);
        if (user?.user) {
          dispatch(
            setUserAuthData({
              user: { ...user?.user, timezone },
              token: user?.token || "",
              login: false,
            }),
          );
        }
      })
      .catch(error => {
        const errorMessage = getError(error);
        errorAlert({
          body: errorMessage || "Something went wrong, please try again",
        });
      });
  };

  return (
    <>
      <View style={[styles.rowView, { paddingRight: 3, borderBottomWidth: 0 }]}>
        <View style={styles.view}>
          <Image
            source={ICONS.timezone}
            style={styles.icon}
            tintColor={colors.TEXT}
          />
          <View>
            <AppText
              allowFontScaling={false}
              style={[styles.title, { color: colors.HEADING }]}
            >
              Timezone
            </AppText>
            <AppText
              allowFontScaling={false}
              style={[styles.description, { color: colors.TEXT }]}
            >
              {user?.user?.timezone || "No, TimeZone"}
            </AppText>
          </View>
        </View>
        <View style={styles.rightView}>
          {isLoading ? (
            <View style={{ marginLeft: 10 }}>
              <LoadingIndicator color={colors.HEADING} />
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={handleUpdateTimeZone}
              style={[
                styles.updateView,
                {
                  backgroundColor: colors.SECONDARY,
                  borderWidth: 0.5,
                  borderColor: colors.BLACK,
                  marginRight: Platform.OS === "ios" ? 11 : 7,
                },
                isTimeZone && {
                  backgroundColor: colors.GRAY_BG,
                  borderWidth: 0.5,
                  borderColor: colors.BORDER_COLOR,
                },
              ]}
            >
              <AppText
                allowFontScaling={false}
                style={[
                  styles.updateText,
                  { color: isTimeZone ? colors.HEADING : COLORS.WHITE },
                ]}
              >
                Update
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <LocationModal
        isVisible={isVisible}
        handleOnCancel={handleOnCancel}
        currentTimeZone={timezone}
        handleUpdatePress={handleUpdatePress}
        isLoading={isLoading}
        user={user}
      />
    </>
  );
};

export default UpdateTimeZone;
