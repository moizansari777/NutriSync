import { NativeModules } from "react-native";
// import { HealthActivityData } from "../schemas/types";

const { NutriSyncHealthKit } = NativeModules;

// Activity reads (steps / move / exercise / stand) are on hold — commented out
// so nothing calls getActivity and HealthKit is never asked for those types.
// Restore alongside the read types in ios/NativeModules/NutriSyncHealthKit.swift.
//
// const EMPTY_ACTIVITY: HealthActivityData = {
//   steps: 0,
//   move: 0,
//   exercise: 0,
//   stand: 0,
// };
//
// /**
//  * Today's steps and Apple ring totals from HealthKit.
//  *
//  * Zeroes when HealthKit is unavailable or a read was denied — HealthKit never
//  * reveals a denied read, it just returns no samples. Exercise and stand are
//  * written by the Apple Watch, so they stay at 0 for iPhone-only users.
//  */
// export const loadTodayActivity = async (): Promise<HealthActivityData> => {
//   try {
//     const available = await NutriSyncHealthKit.isHealthAvailable();
//     if (!available) return EMPTY_ACTIVITY;
//
//     await NutriSyncHealthKit.requestAuthorization();
//
//     const activity = await NutriSyncHealthKit.getActivity("today");
//
//     return {
//       steps: Math.round(activity?.steps ?? 0),
//       move: Math.round(activity?.move ?? 0),
//       exercise: Math.round(activity?.exercise ?? 0),
//       stand: Math.round(activity?.stand ?? 0),
//     };
//   } catch (e) {
//     return EMPTY_ACTIVITY;
//   }
// };

export interface HealthDayData {
  /** Kilograms, 0 when nothing was recorded. */
  weight: number;
  /** Hours, 0 when nothing was recorded. */
  sleep: number;
}

const EMPTY_HEALTH_DAY: HealthDayData = { weight: 0, sleep: 0 };

/**
 * Weight and sleep for "today" | "yesterday", reduced to the two numbers the
 * statistics form needs.
 *
 * Reads the native payloads by their own key names — `value` for weight,
 * `hours` for sleep — rather than a shared one, since the module resolves a
 * different shape per metric.
 */
export const loadHealthData = async (
  filter: string,
): Promise<HealthDayData> => {
  try {
    const available = await NutriSyncHealthKit.isHealthAvailable();
    if (!available) {
      console.log("HealthKit not available");
      return EMPTY_HEALTH_DAY;
    }

    await NutriSyncHealthKit.requestAuthorization();

    const day = filter || "today";

    // Independent queries, so the second need not wait on the first.
    const [weight, sleep] = await Promise.all([
      NutriSyncHealthKit.getWeight(day),
      NutriSyncHealthKit.getSleep(day),
    ]);

    return {
      weight: weight?.value > 0 ? weight.value : 0,
      sleep: sleep?.hours > 0 ? sleep.hours : 0,
    };
  } catch (e) {
    return EMPTY_HEALTH_DAY;
  }
};
