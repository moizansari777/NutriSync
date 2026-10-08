import { AppState, PermissionsAndroid, Platform } from "react-native";
import Voice from "@react-native-voice/voice";
import * as ErrorReporter from "./errorReporter";
import { BUILD_NUMBER, BUILD_VERSION, ENVIRONMENT } from "../config";

/**
 * Single owner of the @react-native-voice/voice singleton.
 *
 * The library keeps one native recognizer and one set of JS handlers for the
 * whole app lifetime, so handlers are installed exactly once here instead of
 * inside a component effect. That removes the two biggest failure modes of the
 * previous implementation: a React unmount tearing down a live session, and a
 * remount clobbering the handlers of an in-flight one.
 *
 * Everything else in here works around documented misbehaviour of the native
 * module (see comments at each guard) so the feature degrades loudly instead of
 * silently.
 */

export type SpeechFailureReason =
  | "unavailable"
  | "permission_denied"
  | "permission_blocked"
  | "busy"
  | "network"
  | "no_speech"
  | "language"
  | "audio"
  | "timeout"
  | "unknown";

export type SpeechSessionHandlers = {
  /** Fired for every partial and for the final transcript. */
  onTranscript: (text: string, isFinal: boolean) => void;
  /** Fired on real transitions only (never twice for the same state). */
  onListeningChange: (listening: boolean) => void;
  /** Terminal, non-recoverable outcome. Not fired for a clean stop. */
  onFailure: (reason: SpeechFailureReason, message: string) => void;
};

type Phase = "idle" | "preparing" | "listening" | "finalizing";

/** Voice.start()'s promise can never settle — see startSpeech guards below. */
const START_ACK_TIMEOUT_MS = 4000;
/** Cold-start of the OEM recognition service on low-end devices. */
const SPEECH_START_TIMEOUT_MS = 8000;
/** iOS server recognition dies around 60s; Android varies. Stop first. */
const MAX_SESSION_MS = 55000;
/** Android delivers onResults after onEndOfSpeech; iOS after finish(). */
const FINALIZE_GRACE_MS = 3000;
/** Recreating a SpeechRecognizer immediately after destroy() → ERROR_CLIENT. */
const RESTART_COOLDOWN_MS = 400;
/**
 * iOS-only end-of-utterance silence window: how long the user may pause before
 * the mic closes itself, measured from the last new word. SFSpeechRecognizer
 * runs until it is told to stop and has no endpointing of its own, so on iOS
 * this is the entire auto-stop mechanism.
 *
 * Android is deliberately excluded. Its recogniser endpoints natively (~2s of
 * silence → onEndOfSpeech, or ERROR_SPEECH_TIMEOUT if nothing was said), and a
 * JS timer keyed off transcript arrivals is actively wrong there: the Google
 * recogniser withholds partials for seconds while the user is plainly speaking,
 * so the timer expires mid-sentence and stops the recogniser before it has
 * emitted anything at all.
 */
const SILENCE_TIMEOUT_MS = 5000;
/** iOS-only: silence window before any speech at all has been recognised. */
const NO_SPEECH_TIMEOUT_MS = 7000;
/** Android's availability probe answers from a local service lookup. */
const AVAILABILITY_PROBE_TIMEOUT_MS = 3000;
/**
 * iOS presents the Speech Recognition consent dialog *inside* the same probe
 * and only calls back once the user has answered it, so the window has to be
 * wide enough for a human to read a dialog.
 */
const IOS_AUTH_PROMPT_TIMEOUT_MS = 30000;

const isAndroid = Platform.OS === "android";

function deviceLocale(): string | null {
  try {
    const tag = Intl.DateTimeFormat().resolvedOptions().locale;
    return tag && tag !== "en-US" ? tag : null;
  } catch {
    return null;
  }
}

/**
 * Tried in order. A device with no en-US model (very common outside the US,
 * and on any device with offline recognition only) fails hard on "en-US"; the
 * fallbacks let it use whatever it actually has.
 */
function localeChain(): string[] {
  const chain = ["en-US"];
  const local = deviceLocale();
  if (local) {
    chain.push(local);
  }
  chain.push(""); // "" → native module falls back to Locale.getDefault()
  return chain;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Rejects instead of hanging when the native callback is never invoked. */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms,
    );
    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

type ParsedError = {
  reason: SpeechFailureReason;
  code: string;
  message: string;
  /** Retrying the same session is worth a shot (transient native state). */
  retryable: boolean;
  /** The locale itself is the problem — advance the locale chain. */
  localeProblem: boolean;
};

/**
 * Android sends "<code>/<text>" (e.g. "7/No match"); iOS sends a symbolic code
 * plus an English message. Both arrive on the same event, so parse both.
 */
function parseSpeechError(raw: unknown): ParsedError {
  const error = (raw as { error?: { code?: string; message?: string } })?.error;
  const message = String(error?.message ?? "");
  const code = String(error?.code ?? "");
  const numeric = Number(message.split("/")[0]);

  if (isAndroid && Number.isFinite(numeric)) {
    switch (numeric) {
      case 1: // ERROR_NETWORK_TIMEOUT
      case 2: // ERROR_NETWORK
      case 4: // ERROR_SERVER
      case 11: // ERROR_SERVER_DISCONNECTED
        return r("network", code, message, true, false);
      case 3: // ERROR_AUDIO
        return r("audio", code, message, true, false);
      case 5: // ERROR_CLIENT
      case 8: // ERROR_RECOGNIZER_BUSY
      case 10: // ERROR_TOO_MANY_REQUESTS
        return r("busy", code, message, true, false);
      case 6: // ERROR_SPEECH_TIMEOUT
      case 7: // ERROR_NO_MATCH
        return r("no_speech", code, message, false, false);
      case 9: // ERROR_INSUFFICIENT_PERMISSIONS
        return r("permission_blocked", code, message, false, false);
      case 12: // ERROR_LANGUAGE_NOT_SUPPORTED
      case 13: // ERROR_LANGUAGE_UNAVAILABLE
        return r("language", code, message, false, true);
      default:
        return r("unknown", code, message, false, false);
    }
  }

  const lowered = `${code} ${message}`.toLowerCase();
  if (lowered.includes("denied")) {
    return r("permission_blocked", code, message, false, false);
  }
  if (lowered.includes("not yet authorized")) {
    return r("permission_denied", code, message, false, false);
  }
  if (lowered.includes("restricted")) {
    return r("permission_blocked", code, message, false, false);
  }
  if (lowered.includes("already started")) {
    return r("busy", code, message, true, false);
  }
  if (lowered.includes("recognition_init") || lowered.includes("input")) {
    return r("audio", code, message, true, false);
  }
  // kAFAssistantErrorDomain 203/1110 ("Retry"/"No speech") and friends arrive
  // as recognition_fail*. They are the normal iOS end-of-utterance failures.
  if (lowered.includes("recognition_fail")) {
    return r("no_speech", code, message, false, false);
  }
  return r("unknown", code, message, false, false);
}

function r(
  reason: SpeechFailureReason,
  code: string,
  message: string,
  retryable: boolean,
  localeProblem: boolean,
): ParsedError {
  return { reason, code, message, retryable, localeProblem };
}

function breadcrumb(message: string, data?: Record<string, unknown>) {
  ErrorReporter.addBreadcrumb({ category: "voice", level: "info", message, data });
  if (__DEV__) {
    // The native callback order differs per platform and per OEM recogniser;
    // this trace is the fastest way to see what a given device actually did.
    console.log(`[voice] ${message}`, data ?? "");
  }
}

class SpeechRecognizerManager {
  private handlersInstalled = false;
  private phase: Phase = "idle";
  /** Guards against late events from a session we already abandoned. */
  private sessionId = 0;
  private handlers: SpeechSessionHandlers | null = null;

  private transcript = "";
  private sawSpeechStart = false;
  private localeIndex = 0;
  private retriedForCurrentTap = false;
  private lastTeardownAt = 0;

  private startTimer: ReturnType<typeof setTimeout> | null = null;
  private maxTimer: ReturnType<typeof setTimeout> | null = null;
  private finalizeTimer: ReturnType<typeof setTimeout> | null = null;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;

  private availability: boolean | null = null;
  private appStateSubscribed = false;

  isActive(): boolean {
    return this.phase !== "idle";
  }

  /**
   * Installs the native handlers once per app process. The library exposes
   * setters only, so the assignments below are the single source of truth for
   * the whole app — nothing else may assign Voice.onSpeech*.
   */
  private install() {
    if (this.handlersInstalled) {
      return;
    }
    this.handlersInstalled = true;

    Voice.onSpeechStart = () => {
      // Android emits this twice (onReadyForSpeech + onBeginningOfSpeech).
      if (this.phase === "idle" || this.sawSpeechStart) {
        return;
      }
      this.sawSpeechStart = true;
      this.clearTimer("startTimer");
      this.phase = "listening";
      breadcrumb("onSpeechStart");
      this.armSilenceTimer(NO_SPEECH_TIMEOUT_MS);
      this.handlers?.onListeningChange(true);
    };

    Voice.onSpeechPartialResults = event => {
      this.absorbTranscript(event?.value?.[0], false);
    };

    Voice.onSpeechResults = event => {
      // Android: final results. iOS: every result, partial included (the iOS
      // module sets shouldReportPartialResults and routes them here), so this
      // is only authoritative on Android.
      this.absorbTranscript(event?.value?.[0], isAndroid);
    };

    Voice.onSpeechEnd = () => {
      if (this.phase === "idle") {
        return;
      }
      breadcrumb("onSpeechEnd", { hasText: this.transcript.length > 0 });
      // Android fires this before onResults, so wait for the final text.
      // iOS fires it after the last result, so the grace window closes fast.
      this.beginFinalize();
    };

    Voice.onSpeechError = event => {
      if (this.phase === "idle") {
        return;
      }
      const parsed = parseSpeechError(event);
      breadcrumb("onSpeechError", {
        reason: parsed.reason,
        // Raw native string, e.g. "7/No match" on Android — the only way to
        // tell a genuine silent mic from a truncated or wedged session.
        native: parsed.message,
        phase: this.phase,
        hasText: this.transcript.length > 0,
      });

      // Text already heard is never thrown away because the tail errored —
      // this is the main cause of "I spoke and nothing appeared" on iOS.
      if (this.transcript.trim()) {
        this.finish("error-with-text");
        return;
      }

      if (parsed.localeProblem && this.localeIndex < localeChain().length - 1) {
        this.localeIndex += 1;
        this.restart(parsed);
        return;
      }

      if (parsed.retryable && !this.retriedForCurrentTap) {
        this.retriedForCurrentTap = true;
        this.restart(parsed);
        return;
      }

      this.fail(parsed.reason, parsed.message);
    };
  }

  private absorbTranscript(value: string | undefined, isFinal: boolean) {
    const text = (value ?? "").trim();
    if (this.phase === "idle" || !text) {
      return;
    }
    const changed = text !== this.transcript;
    // Both platforms send cumulative transcripts for one utterance, so the
    // newest value replaces the previous one rather than concatenating.
    this.transcript = text;
    if (changed) {
      // Only new words count as activity. iOS in particular re-emits identical
      // partials, which would otherwise hold the silence window open forever.
      this.armSilenceTimer(SILENCE_TIMEOUT_MS);
    }
    this.handlers?.onTranscript(text, false);
    if (isFinal) {
      this.finish("final-results");
    }
  }

  /**
   * Auto-closes the mic once the user has been quiet for `ms`. Re-armed on
   * every new word, so it measures silence rather than total duration.
   */
  private armSilenceTimer(ms: number) {
    if (isAndroid) {
      // Android endpoints natively; see SILENCE_TIMEOUT_MS. Arming this here
      // truncated real speech whenever partials were slow to arrive.
      return;
    }
    this.clearTimer("silenceTimer");
    const mySession = this.sessionId;
    this.silenceTimer = setTimeout(() => {
      if (this.sessionId !== mySession || this.phase !== "listening") {
        return;
      }
      breadcrumb("silence timeout", {
        ms,
        hasText: this.transcript.length > 0,
      });
      this.stop();
    }, ms);
  }

  private clearTimer(
    name: "startTimer" | "maxTimer" | "finalizeTimer" | "silenceTimer",
  ) {
    const timer = this[name];
    if (timer) {
      clearTimeout(timer);
      this[name] = null;
    }
  }

  private clearTimers() {
    this.clearTimer("startTimer");
    this.clearTimer("maxTimer");
    this.clearTimer("finalizeTimer");
    this.clearTimer("silenceTimer");
  }

  /** Waits briefly for a final transcript, then commits whatever we have. */
  private beginFinalize() {
    if (this.phase === "finalizing") {
      return;
    }
    this.phase = "finalizing";
    this.handlers?.onListeningChange(false);
    this.clearTimer("startTimer");
    this.clearTimer("silenceTimer");
    this.clearTimer("finalizeTimer");
    this.finalizeTimer = setTimeout(
      () => this.finish("finalize-timeout"),
      FINALIZE_GRACE_MS,
    );
  }

  private finish(via: string, reportEmpty = true) {
    if (this.phase === "idle") {
      return;
    }
    const text = this.transcript.trim();
    const handlers = this.handlers;
    breadcrumb("finish", { via, hasText: text.length > 0 });
    this.reset();
    if (text) {
      handlers?.onTranscript(text, true);
    } else if (reportEmpty) {
      handlers?.onFailure("no_speech", "No speech was recognised.");
    }
  }

  private fail(reason: SpeechFailureReason, message: string) {
    const handlers = this.handlers;
    this.reset();
    ErrorReporter.captureMessage(`Voice input failed: ${reason}`, {
      level: reason === "no_speech" ? "info" : "warning",
      extra: {
        reason,
        message,
        device: Platform.OS,
        osVersion: String(Platform.Version),
        locale: localeChain()[this.localeIndex] || "device-default",
        env: ENVIRONMENT,
        appVersion: `${BUILD_VERSION}(${BUILD_NUMBER})`,
      },
    });
    handlers?.onFailure(reason, message);
  }

  private reset() {
    this.clearTimers();
    this.phase = "idle";
    this.sessionId += 1;
    this.transcript = "";
    this.sawSpeechStart = false;
    this.lastTeardownAt = Date.now();
    this.handlers?.onListeningChange(false);
  }

  /** Full native teardown. Never leaves an unhandled rejection behind. */
  private async teardownNative() {
    try {
      await withTimeout(Voice.cancel(), 1500, "Voice.cancel");
    } catch {
      // Best effort — cancel throws when no task exists.
    }
    try {
      // destroy() removes the emitter subscriptions itself; start() re-adds
      // them. Handlers in _events survive, which is why they stay installed.
      await withTimeout(Voice.destroy(), 1500, "Voice.destroy");
    } catch {
      // Ignore: a failed destroy must not block the next attempt.
    }
    this.lastTeardownAt = Date.now();
  }

  /**
   * Android only. There `isAvailable()` resolves from the RecognitionService
   * lookup, so a negative really does mean the device cannot do speech
   * recognition and is safe to cache for the process.
   */
  private async ensureAvailable(): Promise<boolean> {
    if (this.availability !== null) {
      return this.availability;
    }
    try {
      const available = await withTimeout(
        Voice.isAvailable(),
        AVAILABILITY_PROBE_TIMEOUT_MS,
        "Voice.isAvailable",
      );
      this.availability = available === 1 || (available as unknown) === true;
    } catch {
      // A thrown/timed-out probe is not proof of absence; let start() decide.
      this.availability = true;
    }

    if (this.availability) {
      try {
        const services = await Voice.getSpeechRecognitionServices();
        breadcrumb("recognitionServices", { services });
        if (Array.isArray(services) && services.length === 0) {
          // No RecognitionService at all: devices without Google app / GMS.
          this.availability = false;
        }
      } catch {
        // Requires the <queries> manifest entry on API 30+; ignore failures.
      }
    }
    return this.availability;
  }

  /**
   * iOS only. `Voice.isAvailable()` looks like a capability check, but the
   * native side is `SFSpeechRecognizer requestAuthorization`: it answers true
   * for Authorized and false for NotDetermined / Denied / Restricted. It says
   * nothing whatsoever about the hardware — every iPhone that can run this app
   * supports dictation — so a negative is a permissions problem (Speech
   * Recognition switched off for the app, or Siri & Dictation blocked by
   * Screen Time or an MDM profile) and has to be reported as one. Reporting it
   * as "unavailable" is what left users on perfectly capable phones staring at
   * "not supported on this device" with no way out.
   *
   * The result is deliberately never cached: the user can flip the switch in
   * Settings and come straight back, and once the status is determined the
   * probe returns instantly anyway.
   */
  private async ensureIosAuthorization(): Promise<
    "granted" | "blocked" | "unknown"
  > {
    try {
      const authorized = await withTimeout(
        Voice.isAvailable(),
        IOS_AUTH_PROMPT_TIMEOUT_MS,
        "Voice.isAvailable",
      );
      const granted = authorized === 1 || (authorized as unknown) === true;
      breadcrumb("iOS speech authorization", { granted });
      return granted ? "granted" : "blocked";
    } catch (error) {
      // Most likely the consent dialog is still on screen. That is not proof
      // of anything; start() surfaces the real status via onSpeechError.
      breadcrumb("iOS speech authorization probe failed", {
        message: String(error),
      });
      return "unknown";
    }
  }

  private async ensurePermission(): Promise<"granted" | "denied" | "blocked"> {
    if (!isAndroid) {
      // Only reachable defensively: start() routes iOS through
      // ensureIosAuthorization, and the mic prompt itself is raised by the
      // native module, surfacing through onSpeechError which start() maps.
      return "granted";
    }
    const permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    if (await PermissionsAndroid.check(permission)) {
      return "granted";
    }
    const result = await PermissionsAndroid.request(permission);
    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      // The permission dialog just closed; the activity may not have regained
      // window focus, and starting the recognizer now yields ERROR_CLIENT.
      await sleep(300);
      return "granted";
    }
    return result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ? "blocked"
      : "denied";
  }

  private subscribeAppState() {
    if (this.appStateSubscribed) {
      return;
    }
    this.appStateSubscribed = true;
    AppState.addEventListener("change", state => {
      // Android 14+ mutes the mic for background apps and iOS suspends the
      // audio session; commit what we have instead of hanging in "listening".
      if (state !== "active" && this.phase !== "idle") {
        breadcrumb("backgrounded mid-session");
        this.finish("app-backgrounded", false);
        this.teardownNative();
      }
    });
  }

  /** Re-runs the native start for the current session (locale/busy retry). */
  private async restart(parsed: ParsedError) {
    breadcrumb("restart", { reason: parsed.reason });
    await this.teardownNative();
    await sleep(RESTART_COOLDOWN_MS);
    if (this.phase === "idle") {
      return;
    }
    this.sawSpeechStart = false;
    await this.nativeStart();
  }

  private async nativeStart() {
    const locale = localeChain()[this.localeIndex] ?? "en-US";
    const mySession = this.sessionId;

    this.clearTimer("startTimer");
    this.startTimer = setTimeout(() => {
      if (this.sessionId !== mySession || this.sawSpeechStart) {
        return;
      }
      // The service accepted the intent but never called back: no usable
      // recognizer, or it is wedged. Do not leave the UI stuck in "listening".
      this.teardownNative();
      this.fail(
        "timeout",
        "The speech recogniser did not respond. Please try again.",
      );
    }, SPEECH_START_TIMEOUT_MS);

    try {
      await withTimeout(
        Voice.start(locale, {
          EXTRA_PARTIAL_RESULTS: true,
          // Deliberately NOT setting EXTRA_SPEECH_INPUT_*_SILENCE_LENGTH_MILLIS.
          // Android documents them as advisory, most recognisers ignore them,
          // and on the Google recogniser supplying them makes endpointing fire
          // almost immediately — the recogniser closes before the first word is
          // transcribed and returns ERROR_NO_MATCH. Android's own defaults are
          // correct; leave the endpointing to it.
          // We request RECORD_AUDIO ourselves; the module's auto-request path
          // starts recognition even when the user denied it.
          REQUEST_PERMISSIONS_AUTO: false,
        }),
        START_ACK_TIMEOUT_MS,
        "Voice.start",
      );
      breadcrumb("Voice.start accepted", { locale: locale || "device" });
    } catch (error) {
      if (this.sessionId !== mySession) {
        return;
      }
      // iOS returns without invoking the callback when a previous
      // recognitionTask is still set, so this promise never settles — the
      // timeout above turns that permanent wedge into a recoverable error.
      breadcrumb("Voice.start rejected", { message: String(error) });
      await this.teardownNative();
      if (!this.retriedForCurrentTap) {
        this.retriedForCurrentTap = true;
        await sleep(RESTART_COOLDOWN_MS);
        if (this.sessionId === mySession) {
          this.sawSpeechStart = false;
          await this.nativeStart();
        }
        return;
      }
      this.fail("busy", "Voice input could not start. Please try again.");
    }
  }

  /** Entry point for a mic tap. Safe to call repeatedly; never rejects. */
  async start(handlers: SpeechSessionHandlers): Promise<void> {
    try {
      await this.startInternal(handlers);
    } catch (error) {
      // A rejection here would surface as an unhandled promise rejection and
      // leave the UI stuck, so it is always converted into a reported failure.
      this.fail("unknown", "Voice input could not start. Please try again.");
      ErrorReporter.captureException(error, {
        extra: { action: "speechRecognizer.start", device: Platform.OS },
      });
    }
  }

  private async startInternal(handlers: SpeechSessionHandlers): Promise<void> {
    this.install();
    this.subscribeAppState();

    if (this.phase !== "idle") {
      breadcrumb("start ignored: session active", { phase: this.phase });
      return;
    }

    this.handlers = handlers;

    if (isAndroid) {
      if (!(await this.ensureAvailable())) {
        this.fail(
          "unavailable",
          "Speech recognition is not available on this device.",
        );
        return;
      }

      const permission = await this.ensurePermission();
      if (permission !== "granted") {
        this.fail(
          permission === "blocked" ? "permission_blocked" : "permission_denied",
          "Microphone access is required for voice input.",
        );
        return;
      }
    } else if ((await this.ensureIosAuthorization()) === "blocked") {
      // Denied or restricted. Never "unavailable" — see ensureIosAuthorization.
      this.fail(
        "permission_blocked",
        "Speech Recognition access is required for voice input.",
      );
      return;
    }

    // Clean slate: a leftover native recognizer is the single most common
    // reason the second and later taps fail.
    await this.teardownNative();
    const sinceTeardown = Date.now() - this.lastTeardownAt;
    if (sinceTeardown < RESTART_COOLDOWN_MS) {
      await sleep(RESTART_COOLDOWN_MS - sinceTeardown);
    }

    this.phase = "preparing";
    this.sessionId += 1;
    this.transcript = "";
    this.sawSpeechStart = false;
    this.localeIndex = 0;
    this.retriedForCurrentTap = false;

    this.clearTimer("maxTimer");
    this.maxTimer = setTimeout(() => {
      breadcrumb("max session reached");
      this.stop();
    }, MAX_SESSION_MS);

    await this.nativeStart();
  }

  /** User tapped stop. Commits whatever the recognizer has produced. */
  async stop(): Promise<void> {
    if (this.phase === "idle") {
      return;
    }
    breadcrumb("stop requested", { phase: this.phase });
    if (this.phase === "preparing") {
      // Aborted before recognition even began — that is a cancel, not a failed
      // dictation, so it must not raise a "we didn't hear anything" error.
      await this.cancel();
      return;
    }
    this.beginFinalize();
    try {
      await withTimeout(Voice.stop(), 2000, "Voice.stop");
    } catch {
      // stop() resolves before results arrive anyway; the finalize timer wins.
    }
  }

  /** Abandons the session without committing text (navigation, teardown). */
  async cancel(): Promise<void> {
    if (this.phase === "idle") {
      return;
    }
    breadcrumb("cancel requested", { phase: this.phase });
    this.reset();
    await this.teardownNative();
  }
}

const speechRecognizer = new SpeechRecognizerManager();

export default speechRecognizer;
