import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../states/store/store";
import { setUserWeight } from "../states/reducer/authReducer";
import { convertKgToWeightUnit } from "../utils/macroRecommendations";

/** Below this a logged weight is treated as "not entered" rather than real. */
const MIN_VALID_WEIGHT_KG = 1;

/** Ignore differences under this, in the profile's own unit, as float noise. */
const WEIGHT_EPSILON = 0.01;

/**
 * Keeps the cached `user.weight` in step with a weight logged elsewhere.
 *
 * The daily statistics log and the user profile are separate records: saving a
 * weight to statistics only invalidates that API's cache, so `user.weight`
 * would otherwise stay at whatever the last login or TDEE save wrote — and
 * redux-persist keeps the stale value across restarts. Set Custom Daily Macros
 * sizes its protein suggestion from `user.weight`, so staleness is visible to
 * the user.
 *
 * Returns a callback taking a weight **in kilograms** (the unit the Statistics
 * input and both health integrations use). It converts into whatever unit the
 * profile already stores, so `weight_unit` is never changed out from under the
 * rest of the app. No-ops on an unusable or unchanged value, which makes it
 * safe to call on every load as well as after a save.
 */
export const useProfileWeightSync = () => {
  const dispatch = useDispatch();

  const profileWeight = useSelector(
    (state: RootState) => state.authReducer?.userData?.user?.weight,
  );
  const profileWeightUnit = useSelector(
    (state: RootState) => state.authReducer?.userData?.user?.weight_unit,
  );

  return useCallback(
    (weightKg: number) => {
      // Written as `!(x >= n)` so NaN is rejected too.
      if (!(weightKg >= MIN_VALID_WEIGHT_KG)) return;

      const nextWeight = Number(
        convertKgToWeightUnit(weightKg, profileWeightUnit).toFixed(2),
      );
      if (nextWeight <= 0) return;

      const currentWeight = Number(profileWeight ?? 0);
      const isUnchanged =
        Number.isFinite(currentWeight) &&
        Math.abs(currentWeight - nextWeight) < WEIGHT_EPSILON;
      if (isUnchanged) return;

      dispatch(setUserWeight({ weight: nextWeight }));
    },
    [dispatch, profileWeight, profileWeightUnit],
  );
};
