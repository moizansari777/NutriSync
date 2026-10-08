import notifee, { AndroidImportance } from "@notifee/react-native";
import { Platform } from "react-native";
import Sound from "react-native-sound";

Sound.setCategory("Playback");

let currentSound: Sound | null = null;
let lastNotificationId: string | null = null;

/**
 * Stop any currently playing sound
 */
export function stopSound() {
  if (currentSound) {
    currentSound.stop(() => {
      currentSound?.release();
      currentSound = null;
    });
  }
}

/**
 * Cancel previous notification if exists
 */
export async function cancelPreviousNotification() {
  if (lastNotificationId) {
    await notifee.cancelNotification(lastNotificationId);
    lastNotificationId = null;
  }
}

export async function setupNotificationChannel() {
  await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH, // Must be HIGH for popups
  });
}

/**
 * Show a new local notification (and cancel previous one)
 */
export async function showLocalNotification(title: string, body?: string) {
  await notifee.requestPermission();

  if (Platform.OS === "android") {
    await setupNotificationChannel();
  }

  // Remove any previous one first
  await cancelPreviousNotification();

  const id = await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: "default",
      importance: AndroidImportance.HIGH,
      pressAction: { id: "default" },
    },
  });

  lastNotificationId = id;
}

/**
 * Play a sound (and stop any previous one)
 */
export function playSound(soundFileName: string) {
  stopSound(); // Stop previous sound before playing new one

  currentSound = new Sound(soundFileName, Sound.MAIN_BUNDLE, error => {
    if (error) {
      // console.log("Sound load error", error);
      return;
    }

    currentSound?.play(success => {
      if (success) {
        // console.log("Sound played successfully");
      } else {
        // console.log("Sound playback failed");
      }
      currentSound?.release();
      currentSound = null;
    });
  });
}

/**
 * Utility: Stop all active notification-related sounds & clears current notification
 */
export async function clearNotificationState() {
  stopSound();
  await cancelPreviousNotification();
}
