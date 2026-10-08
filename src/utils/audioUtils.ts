// utils/audioUtils.ts
import * as RNFS from "@dr.pogodin/react-native-fs";
import Sound from "react-native-sound";
import * as ErrorReporter from "./errorReporter";
import { Platform } from "react-native";
import { BUILD_NUMBER, BUILD_VERSION, ENVIRONMENT } from "../config";
import { errorAlert } from "./alerts";
import { getError } from "./errors";

Sound.setCategory("Playback");

export type VoicePlaybackState =
  | "busy"
  | "loading"
  | "playing"
  | "done"
  | "error"
  | "stopped";

// single global playback session
let currentSound: Sound | null = null;
let currentMessageId: number | string | null = null;
let currentOnStateChange: ((state: VoicePlaybackState) => void) | null = null;
// Incremented on every new play/stop. Async continuations (fetch, file write,
// sound load, play completion) compare against it and no-op when preempted,
// so a stale callback can never touch a newer session's state.
let sessionToken = 0;

/**
 * Stop the current playback session, including one still in the loading
 * (fetch/write) phase — the in-flight work is invalidated via sessionToken.
 * Notifies the preempted message's UI so its button resets.
 */
function stopCurrentSession() {
  sessionToken++;

  const sound = currentSound;
  const notifyPrevious = currentOnStateChange;
  currentSound = null;
  currentMessageId = null;
  currentOnStateChange = null;

  if (sound) {
    sound.stop(() => sound.release());
  }
  notifyPrevious?.("stopped");
}

/**
 * Stop current playing/loading sound (optional messageId to stop only if same)
 * - onStateChange: optional callback to update UI ("stopped")
 */
export function stopSound(
  messageId?: number | string,
  onStateChange?: (state: "stopped") => void,
) {
  if (currentMessageId === null) return;

  // If messageId provided, only stop if it matches current session's message
  if (typeof messageId !== "undefined" && currentMessageId !== messageId) {
    return;
  }

  stopCurrentSession();
  onStateChange?.("stopped");
}

/**
 * Returns whether a playback session is active (loading or playing)
 */
export function isSoundPlaying() {
  return currentMessageId !== null;
}

/**
 * Fetch voice message (mp3) from API and play it.
 *
 * Tapping a new message preempts whatever is currently loading or playing:
 * the previous session is stopped (its UI gets "stopped") and the new one
 * takes over — the latest tap always wins.
 *
 * - url: FULL URL to the mp3 endpoint (include BASE_URL)
 * - token: optional bearer token
 * - messageId: id of the message (used to guard single-play)
 * - onStateChange: callback(state) where state is:
 *     "loading" -> fetching + writing file
 *     "playing" -> playback started
 *     "done"    -> playback finished
 *     "stopped" -> stopped or preempted by another message
 *     "error"   -> any error occurred
 */

export async function fetchAndPlayMessageVoice(
  url: string,
  token?: string,
  messageId?: number | string,
  email?: string,
  onStateChange?: (state: VoicePlaybackState) => void,
) {
  // Re-tapping the message that's already loading/playing: ignore
  if (typeof messageId !== "undefined" && currentMessageId === messageId) {
    return;
  }

  // Preempt any current session (also invalidates its in-flight work)
  stopCurrentSession();

  const myToken = sessionToken;
  currentMessageId = messageId ?? null;
  currentOnStateChange = onStateChange ?? null;
  onStateChange?.("loading");

  try {
    // fetch binary data (ensure url is full & correct)
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (myToken !== sessionToken) return; // preempted/stopped while fetching

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (myToken !== sessionToken) return;

    // write to temp file
    const filePath = `${RNFS.CachesDirectoryPath}/voice_${
      messageId ?? Date.now()
    }.mp3`;
    const bytes = new Uint8Array(arrayBuffer);

    // write in ascii (this matches your working approach)
    const ascii = Array.from(bytes)
      .map(b => String.fromCharCode(b))
      .join("");
    await RNFS.writeFile(filePath, ascii, "ascii");
    if (myToken !== sessionToken) return;

    // create sound and play
    const sound = new Sound(filePath, "", error => {
      if (myToken !== sessionToken) {
        // preempted while loading the file — this session no longer owns state
        sound.release();
        return;
      }

      if (error) {
        currentSound = null;
        currentMessageId = null;
        currentOnStateChange = null;
        onStateChange?.("error");
        return;
      }

      onStateChange?.("playing");

      sound.play(success => {
        if (myToken !== sessionToken) {
          // stop()/preemption already handled cleanup and released the sound
          return;
        }

        currentSound = null;
        currentMessageId = null;
        currentOnStateChange = null;
        sound.release();
        onStateChange?.(success ? "done" : "error");
      });
    });
    currentSound = sound;
  } catch (err) {
    const errorMessage = getError(err);
    errorAlert({ body: errorMessage || "" });

    if (myToken === sessionToken) {
      currentSound = null;
      currentMessageId = null;
      currentOnStateChange = null;
      onStateChange?.("error");
    }

    ErrorReporter.captureException(err, {
      extra: {
        userEmail: email,
        device: Platform.OS,
        action: "Error while playing message voice - API Error",
        env: ENVIRONMENT,
        appVersion: `${BUILD_VERSION}(${BUILD_NUMBER})`,
      },
    });
  }
}
