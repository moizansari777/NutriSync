import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentLocation } from "../../utils/getCurrentLocation";
import { RootState } from "../../states/store/store";
import { useLazyGetTimezoneQuery } from "../../services/externalServices";
import { useSaveTimezoneMutation } from "../../services/profileServices";
import { getError } from "../../utils/errors";
import { errorAlert, successAlert } from "../../utils/alerts";
import { setUserAuthData } from "../../states/reducer/authReducer";
import { getDistanceInKm } from "../../utils/getDistanceInKm";
import { DISTANCE_THRESHOLD_KM } from "../../constant";
import {
  setLastLatLngs,
  setDismissedTimezone,
} from "../../states/reducer/locationReducer";
import LocationModal from "./LocationModal";

type Props = {};

const LocationUpdateModal: FC<Props> = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authReducer?.userData);
  const isLoggedIn = useSelector(
    (state: RootState) => state.authReducer?.isUserLoggedIn,
  );
  const lastLatLng = useSelector(
    (state: RootState) => state.locationReducer?.lastLatLng,
  );
  const dismissedTimezone = useSelector(
    (state: RootState) => state.locationReducer?.dismissedTimezone,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [currentTimeZone, setCurrentTimeZone] = useState("");
  const [newLatLng, setNewLatLng] = useState({
    lat: null,
    lng: null,
  });
  const [getTimeZoneAPI] = useLazyGetTimezoneQuery();
  const [saveTimeZoneAPI, { isLoading }] = useSaveTimezoneMutation();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isLoggedIn) {
      timeout = setTimeout(() => {
        handleGetLatLng();
      }, 4500);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const handleUpdatePress = () => {
    if (!currentTimeZone) {
      return;
    }
    handleSaveTimeZone(currentTimeZone);
  };

  const handleOnCancel = () => {
    if (currentTimeZone) {
      dispatch(setDismissedTimezone(currentTimeZone));
    }
    setIsVisible(false);
  };

  const handleGetLatLng = async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!timezone) {
      const coordinates: any = await getCurrentLocation();
      const distance = getDistanceInKm(
        lastLatLng?.lat,
        lastLatLng?.lng,
        coordinates?.coords?.latitude,
        coordinates?.coords?.longitude,
      );
      if (distance > DISTANCE_THRESHOLD_KM) {
        getTimeZoneAPI({
          lat: coordinates?.coords?.latitude,
          lng: coordinates?.coords?.longitude,
        })
          .unwrap()
          .then(async payload => {
            if (
              payload?.zoneName !== user?.user?.timezone &&
              payload?.zoneName !== dismissedTimezone
            ) {
              setCurrentTimeZone(payload?.zoneName);
              setIsVisible(true);
              setNewLatLng({
                lat: coordinates?.coords?.latitude,
                lng: coordinates?.coords?.longitude,
              });
            }
          })
          .catch(error => {});
      }
    } else {
      if (timezone !== user?.user?.timezone && timezone !== dismissedTimezone) {
        setCurrentTimeZone(timezone);
        setIsVisible(true);
      }
    }
  };

  const handleSaveTimeZone = (timezone: string) => {
    if (timezone !== user?.user?.timezone) {
      saveTimeZoneAPI({ timezone })
        .unwrap()
        .then(async () => {
          successAlert({ body: "Timezone has been updated" });
          setIsVisible(false);
          setCurrentTimeZone("");
          dispatch(setDismissedTimezone(null));
          dispatch(
            setLastLatLngs({
              lat: newLatLng?.lat,
              lng: newLatLng?.lng,
            }),
          );
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
          errorAlert({ body: errorMessage || "" });
        });
    }
  };

  return (
    <LocationModal
      isVisible={isVisible}
      handleOnCancel={handleOnCancel}
      currentTimeZone={currentTimeZone}
      handleUpdatePress={handleUpdatePress}
      isLoading={isLoading}
      user={user}
    />
  );
};

export default LocationUpdateModal;
