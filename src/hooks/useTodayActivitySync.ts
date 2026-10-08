// Activity sync is on hold.
//
// The whole implementation below is commented out so nothing reads steps /
// move / exercise / stand and, more importantly, so no health permission is
// requested for them on either platform. The hook stays exported as a no-op
// only so an existing call site cannot crash; the real body is preserved
// verbatim for when this work resumes.

// import { useCallback, useEffect, useRef } from "react";
// import { Platform } from "react-native";
// import { useFocusEffect } from "@react-navigation/native";
// import { getTodayActivity } from "../utils/getHealthDataAndroid";
// import { loadTodayActivity } from "../utils/healthHelper";
// import { useForegroundOnce } from "./useForegroundOnce";

/**
 * Re-syncs today's activity — steps, move, exercise and stand — from Health
 * Connect (Android) / HealthKit (iOS) every time the screen is opened and every
 * time the app returns from the background. The totals move while the user is
 * elsewhere, so a mount-only fetch would show stale numbers.
 *
 * Holds no state, so a sync never re-renders the consumer. The totals are only
 * logged for now; the API call will hook in where the log is.
 *
 * @param enabled the user's "Sync Activity Data" setting.
 */
export const useTodayActivitySync = (_enabled: boolean = true) => {
  // Disabled — no health read, no permission request.
};

// export const useTodayActivitySync = (enabled: boolean = true) => {
//   const isSyncing = useRef(false);
//   const isMounted = useRef(true);
//
//   // Read through a ref so toggling the setting doesn't re-create `sync` and
//   // re-subscribe the AppState listener underneath us.
//   const enabledRef = useRef(enabled);
//   enabledRef.current = enabled;
//
//   useEffect(() => {
//     isMounted.current = true;
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);
//
//   const sync = useCallback(async () => {
//     // Focus and foreground can fire back to back (e.g. returning from the
//     // Health Connect permission screen); one in-flight read is enough.
//     if (!enabledRef.current || isSyncing.current) return;
//
//     isSyncing.current = true;
//
//     try {
//       const activity =
//         Platform.OS === "android"
//           ? await getTodayActivity()
//           : await loadTodayActivity();
//
//       // Screen left while the native read was in flight — drop the result.
//       if (!isMounted.current) return;
//
//       console.log("Today's activity:", activity);
//     } finally {
//       isSyncing.current = false;
//     }
//   }, []);
//
//   useFocusEffect(
//     useCallback(() => {
//       sync();
//     }, [sync]),
//   );
//
//   useForegroundOnce(sync);
// };
