import {
  initialize,
  requestPermission,
  readRecords,
  // aggregateRecord, // activity reads are on hold
  SleepStageType,
} from "react-native-health-connect";
// import { HealthActivityData } from "../schemas/types";

let healthInitPromise: Promise<void> | null = null;

// ✅ Initialize Health Connect (ONLY ONCE)
//
// Memoised as a promise, not a boolean: the stats read and the steps read can
// start in the same tick, and a boolean flag would let both through and raise
// two permission dialogs. Callers now await the same init.
const initHealthConnect = () => {
  if (!healthInitPromise) {
    healthInitPromise = (async () => {
      const isInitialized = await initialize();

      if (!isInitialized) {
        throw new Error("Health Connect not initialized");
      }

      // Only what the statistics form actually reads. The activity record
      // types stay commented out so Health Connect never asks the user for
      // them while that feature is on hold.
      await requestPermission([
        { accessType: "read", recordType: "Weight" }, // ✅ weight
        { accessType: "read", recordType: "SleepSession" }, // ✅ sleep
        // { accessType: "read", recordType: "Steps" }, // ✅ steps
        // { accessType: "read", recordType: "ActiveCaloriesBurned" }, // ✅ move
        // { accessType: "read", recordType: "ExerciseSession" }, // ✅ exercise
      ]);
    })().catch(error => {
      healthInitPromise = null; // failed init must not be cached
      throw error;
    });
  }

  return healthInitPromise;
};

// ✅ Time range helper
const getTimeRange = (type: string) => {
  const now = new Date();

  let start: Date;
  let end: Date;

  if (type === "today") {
    start = new Date();
    start.setHours(0, 0, 0, 0);

    end = now;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    start = new Date(yesterday);
    start.setHours(0, 0, 0, 0);

    end = new Date(yesterday);
    end.setHours(23, 59, 59, 999);
  }

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface SleepSessionLike {
  startTime: string;
  endTime: string;
  stages?: Array<{ startTime: string; endTime: string; stage: number }>;
}

/** Stages inside a sleep session that are not actually sleep. */
const AWAKE_STAGES: number[] = [
  SleepStageType.AWAKE,
  SleepStageType.OUT_OF_BED,
];

const minutesBetween = (startTime: string, endTime: string) =>
  Math.max(
    0,
    Math.round(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) /
        (1000 * 60),
    ),
  );

/**
 * Asleep minutes in one session.
 *
 * Stage-aware when the source records stages (Wear OS, Fitbit, Samsung), so
 * mid-night awake stretches are not counted as sleep — matching what HealthKit
 * reports on iOS. Sources that only write a start and end fall back to the
 * full session.
 */
const getAsleepMinutes = (session: SleepSessionLike) => {
  const stages = session.stages ?? [];

  if (stages.length === 0) {
    return minutesBetween(session.startTime, session.endTime);
  }

  return stages.reduce(
    (sum, stage) =>
      AWAKE_STAGES.includes(stage.stage)
        ? sum
        : sum + minutesBetween(stage.startTime, stage.endTime),
    0,
  );
};

// Activity reads (steps / move / exercise) are on hold — commented out so the
// permission request above can stay narrowed to weight and sleep. Restore this
// block together with those record types when the feature resumes.
//
// const EMPTY_ACTIVITY: HealthActivityData = {
//   steps: 0,
//   move: 0,
//   exercise: 0,
//   // Health Connect has no equivalent of the Apple stand ring — no record type
//   // tracks hours stood — so it stays unavailable rather than reporting a zero.
//   stand: null,
// };
//
// /** Keeps one declined metric from voiding the rest of the read. */
// const readTotal = async (read: () => Promise<number>, label: string) => {
//   try {
//     return await read();
//   } catch (error) {
//     console.log(`Health Connect ${label} error`);
//     return 0;
//   }
// };
//
// /**
//  * Today's activity totals from Health Connect.
//  *
//  * Aggregated rather than read as raw records: aggregateRecord de-duplicates
//  * overlapping samples when several apps/devices write the same metric, which
//  * summing readRecords() would double count.
//  */
// export const getTodayActivity = async (): Promise<HealthActivityData> => {
//   try {
//     await initHealthConnect();
//   } catch (error) {
//     console.log("Health Connect activity error");
//     return EMPTY_ACTIVITY;
//   }
//
//   const { startTime, endTime } = getTimeRange("today");
//
//   const timeRangeFilter = {
//     operator: "between" as const,
//     startTime,
//     endTime,
//   };
//
//   const [steps, move, exercise] = await Promise.all([
//     readTotal(async () => {
//       const result = await aggregateRecord({
//         recordType: "Steps",
//         timeRangeFilter,
//       });
//       return result?.COUNT_TOTAL ?? 0;
//     }, "steps"),
//
//     readTotal(async () => {
//       const result = await aggregateRecord({
//         recordType: "ActiveCaloriesBurned",
//         timeRangeFilter,
//       });
//       return result?.ACTIVE_CALORIES_TOTAL?.inKilocalories ?? 0;
//     }, "move"),
//
//     readTotal(async () => {
//       const result = await aggregateRecord({
//         recordType: "ExerciseSession",
//         timeRangeFilter,
//       });
//       return (result?.EXERCISE_DURATION_TOTAL?.inSeconds ?? 0) / 60;
//     }, "exercise"),
//   ]);
//
//   return {
//     steps: Math.round(steps),
//     move: Math.round(move),
//     exercise: Math.round(exercise),
//     stand: null,
//   };
// };

// ✅ Main function
export const getHealthData = async (type: string) => {
  try {
    // 1. Init once
    await initHealthConnect();

    const { startTime, endTime } = getTimeRange(type);

    // A night that starts at 23:30 belongs to the next day's log, so the read
    // reaches back a day and the session is then filed by when it *ended*.
    // Reading wide also keeps this correct whichever way Health Connect treats
    // records straddling the edge of a "between" filter.
    const sleepReadStart = new Date(
      new Date(startTime).getTime() - MS_PER_DAY,
    ).toISOString();

    // 2. Fetch data in parallel
    const [weightRes, sleepRes] = await Promise.all([
      readRecords("Weight", {
        timeRangeFilter: {
          operator: "between",
          startTime,
          endTime,
        },
      }),
      readRecords("SleepSession", {
        timeRangeFilter: {
          operator: "between",
          startTime: sleepReadStart,
          endTime,
        },
      }),
    ]);

    // 3. Process Weight
    const weight =
      weightRes?.records?.map(item => ({
        valueKg: item?.weight?.inKilograms ?? 0,
        time: item?.time,
      })) || [];

    const latestWeight = weight.length > 0 ? weight[weight.length - 1] : null;

    // 4. Process Sleep — keep only the sessions that ended within the day
    const dayStart = new Date(startTime).getTime();
    const dayEnd = new Date(endTime).getTime();

    const sleep =
      sleepRes?.records
        ?.filter(item => {
          const end = new Date(item.endTime).getTime();
          return end >= dayStart && end <= dayEnd;
        })
        .map(item => ({
          startTime: item.startTime,
          endTime: item.endTime,
          durationMinutes: getAsleepMinutes(item),
        })) || [];

    const totalSleepMinutes = sleep.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );

    // 5. Final response
    return {
      type, // "today" | "yesterday"

      weight: {
        all: weight,
        latest: latestWeight,
      },

      sleep: {
        sessions: sleep,
        totalMinutes: totalSleepMinutes,
        totalHours: Number((totalSleepMinutes / 60).toFixed(2)),
      },
    };
  } catch (error) {
    console.error("Health Data Error:", error);
    return {
      type,
      weight: { all: [], latest: null },
      sleep: { sessions: [], totalMinutes: 0, totalHours: 0 },
    };
  }
};
