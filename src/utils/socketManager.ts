import * as ErrorReporter from "./errorReporter";
import {
  appendAssistantDelta,
  completeAssistantMessage,
  stopStreaming,
} from "../states/reducer/chatReducer";
import { store } from "../states/store/store";
import {
  clearNotificationState,
  playSound,
  showLocalNotification,
} from "./notificationManager";
import socketServices from "./socketIO";
import chatSession from "./chatSession";
import { BUILD_NUMBER, BUILD_VERSION, ENVIRONMENT } from "../config";
import { Platform } from "react-native";

class SocketManager {
  private activeConversationId: string | null = null;
  private assistantMessageId: string | null = null;
  private subscribed = false;
  private isFirstMessageInList = false;
  private isSoundOn = false;

  // The chat turn this stream belongs to. Anything arriving for a turn the user
  // has already discarded is dropped instead of dispatched. -1 means idle, and
  // never matches a real generation.
  private generation = -1;

  // The "Analyzing..." notification only needs clearing once per turn. Doing it
  // on every delta put a native round-trip inside the streaming loop, which is
  // what starved the JS thread while a stream was running.
  private notificationCleared = false;

  // FIX: store the cleanup functions returned by onMessage / onError
  // so we can remove listeners properly in cleanup().
  private removeMessageListener: (() => void) | null = null;
  private removeErrorListener: (() => void) | null = null;

  // FIX: deltaBuffer and deltaTimeout are reset in cleanup() to prevent
  // stale content bleeding into a new conversation.
  private deltaBuffer: string = "";
  private deltaTimeout: NodeJS.Timeout | null = null;

  // Terminal-state signal for the turn currently streaming, handed out by
  // whenTurnSettles(). Android's foreground service is held open on this, so it
  // has to resolve exactly once per turn and never be left hanging — cleanup()
  // is the single place that fires it, and every way a turn can end goes
  // through cleanup().
  private turnSettled: Promise<void> = Promise.resolve();
  private settleTurn: (() => void) | null = null;

  init(
    conversationId: string,
    assistantMessageId: string,
    isFirstMessage: boolean,
    isSoundOnOff: boolean,
    generation: number,
  ) {
    // A send whose response lands after "new chat" was pressed must not
    // resurrect its stream. cleanup() clears activeConversationId, so without
    // this check the "already subscribed" guard below cannot catch it and the
    // discarded conversation resubscribes and streams to nobody.
    if (!chatSession.isCurrent(generation)) {
      return;
    }

    this.isFirstMessageInList = isFirstMessage;
    this.isSoundOn = isSoundOnOff;
    if (
      this.activeConversationId === conversationId &&
      this.assistantMessageId === assistantMessageId &&
      this.subscribed
    ) {
      // Already subscribed, skip reinit
      return;
    }

    this.cleanup();

    this.generation = generation;
    this.activeConversationId = conversationId;
    this.assistantMessageId = assistantMessageId;

    // Armed before the subscription so a frame that arrives immediately still
    // finds a signal to fire, and so the caller can read it synchronously.
    this.turnSettled = new Promise<void>(resolve => {
      this.settleTurn = resolve;
    });

    socketServices.subscribeToConversation(conversationId);

    // // Attach listeners only once
    // socketServices.onMessage(this.handleMessage);
    // socketServices.onError(this.handleError);
    // this.subscribed = true;

    // FIX: store the cleanup functions so we can deregister later
    this.removeMessageListener = socketServices.onMessage(this.handleMessage);
    this.removeErrorListener = socketServices.onError(this.handleError);
    this.subscribed = true;
  }

  /**
   * Resolves once the turn `generation` belongs to reaches a terminal state:
   * the stream completed, the stream errored, or the turn was discarded.
   *
   * A generation this manager is not streaming — one that never started, or one
   * already replaced by a newer turn — is by definition already settled and
   * resolves immediately, so a caller can never end up waiting on a turn that
   * has no way left to finish.
   */
  whenTurnSettles(generation: number): Promise<void> {
    if (this.generation !== generation || !this.settleTurn) {
      return Promise.resolve();
    }

    return this.turnSettled;
  }

  /** True once the turn this stream belongs to has been discarded. */
  private isStale = (): boolean => !chatSession.isCurrent(this.generation);

  private handleMessage = async (msg: any) => {
    try {
      const convId = this.activeConversationId;
      const assistantId = this.assistantMessageId;
      if (!convId || !assistantId) return;

      // The user started a new chat mid-stream: tear down rather than keep
      // decoding frames for a message that is no longer in the list.
      if (this.isStale()) {
        this.cleanup();
        return;
      }

      // FIX 1: Guard against non-object messages (e.g. socket ACK numbers)
      if (!msg || typeof msg !== "object") return;

      if (
        msg.conversation_id &&
        String(msg.conversation_id) !== String(convId)
      ) {
        return;
      }

      if (msg.type === "delta") {
        this.deltaBuffer = msg.full_content;

        // Once per turn, and not awaited: the first token means the request is
        // through, so the "Analyzing..." notification and its sound can go. See
        // notificationCleared.
        if (!this.notificationCleared) {
          this.notificationCleared = true;
          clearNotificationState().catch(() => {});
        }

        if (!this.deltaTimeout) {
          this.deltaTimeout = setTimeout(() => {
            // FIX 2: Capture buffer value at dispatch time, not closure creation time
            const contentToDispatch = this.deltaBuffer;
            this.deltaTimeout = null;

            // FIX 3: Only dispatch if buffer is non-empty and manager is still active
            if (
              contentToDispatch &&
              this.activeConversationId === convId &&
              !this.isStale()
            ) {
              store.dispatch(
                appendAssistantDelta({
                  id: assistantId,
                  fullContent: contentToDispatch,
                }),
              );
            }
          }, 80);
        }
      } else if (msg.type === "complete") {
        // FIX 4: Flush pending delta BEFORE checking buffer, capture value first
        // console.log("Flushing pending delta before completion", msg);
        if (this.deltaTimeout) {
          clearTimeout(this.deltaTimeout);
          this.deltaTimeout = null;
        }

        // FIX 5: Use msg.content as fallback if deltaBuffer was cleared
        const finalContent = msg.content || msg.full_content;
        // const finalContent = this.deltaBuffer || msg.content || msg.full_content;
        if (finalContent) {
          store.dispatch(
            appendAssistantDelta({
              id: assistantId,
              fullContent: finalContent,
            }),
          );
        }

        store.dispatch(
          completeAssistantMessage({
            id: assistantId,
            message_id: msg?.message_id,
            conversationId: msg.conversation_id || convId,
          }),
        );

        if (this.isSoundOn && this.isFirstMessageInList) {
          showLocalNotification(
            "Analysis complete!",
            "Your results are ready to view.",
          );
          playSound("analyse_done.mp3");
        }

        store.dispatch(stopStreaming());
        this.cleanup();
        await clearNotificationState();
      } else if (msg.type === "error") {
        ErrorReporter.captureMessage("Socket stream error received from server", {
          level: "error",
          extra: {
            conversationId: convId,
            assistantMessageId: assistantId,
            serverError: msg.error,
            app_version: `${BUILD_VERSION}(${BUILD_NUMBER})`,
            env: ENVIRONMENT,
            os: Platform.OS,
          },
        });

        if (this.deltaTimeout) clearTimeout(this.deltaTimeout);
        this.deltaTimeout = null;
        store.dispatch(
          completeAssistantMessage({
            id: assistantId,
            conversationId: convId,
            error: msg.error || "Stream error occurred",
          }),
        );
        await clearNotificationState();
        store.dispatch(stopStreaming());
        this.cleanup();
      }
    } catch (err) {
      ErrorReporter.captureException(err, {
        extra: {
          context: "SocketManager.handleMessage",
          conversationId: this.activeConversationId,
          assistantMessageId: this.assistantMessageId,
          app_version: `${BUILD_VERSION}(${BUILD_NUMBER})`,
          env: ENVIRONMENT,
          os: Platform.OS,
        },
      });
    }
  };

  private handleError = (error?: any) => {
    const convId = this.activeConversationId;
    const assistantId = this.assistantMessageId;
    if (!convId || !assistantId) return;

    // A transport error on a discarded turn is not the user's problem: it must
    // not surface as an error bubble in the chat they just started.
    if (this.isStale()) {
      this.cleanup();
      return;
    }

    const errorMessage =
      error?.message ||
      error?.description ||
      error?.reason ||
      "Internet connection strength insufficient, please check your connection and try again.";

    ErrorReporter.captureMessage("Socket transport error (handleError triggered)", {
      level: "error",
      extra: {
        rawError: error,
        conversationId: convId,
        assistantMessageId: assistantId,
        app_version: `${BUILD_VERSION}(${BUILD_NUMBER})`,
        env: ENVIRONMENT,
        os: Platform.OS,
      },
    });

    store.dispatch(
      completeAssistantMessage({
        id: assistantId,
        conversationId: convId,
        error: errorMessage,
      }),
    );
    store.dispatch(stopStreaming());
    this.cleanup();
  };

  cleanup() {
    // FIX: deregister listeners BEFORE clearing IDs so the handlers
    // can still guard against stale calls via the null checks.
    if (this.removeMessageListener) {
      this.removeMessageListener();
      this.removeMessageListener = null;
    }
    if (this.removeErrorListener) {
      this.removeErrorListener();
      this.removeErrorListener = null;
    }

    if (this.subscribed) {
      if (this.activeConversationId) {
        socketServices.unsubscribeFromConversation(this.activeConversationId);
      }
      // this.activeConversationId = null;
      // this.assistantMessageId = null;
      this.subscribed = false;
    }

    // FIX: always reset delta state so stale content can't bleed into the
    // next conversation.
    if (this.deltaTimeout) {
      clearTimeout(this.deltaTimeout);
      this.deltaTimeout = null;
    }
    this.deltaBuffer = "";
    this.activeConversationId = null;
    this.assistantMessageId = null;

    // Back to idle. -1 matches no real generation, so any frame or late init()
    // that still references this turn is refused.
    this.generation = -1;
    this.notificationCleared = false;

    // Released last, once the turn really is torn down. Whatever ended it —
    // complete, error, or a new chat replacing it — anything holding the
    // process awake for this stream is free to let go.
    if (this.settleTurn) {
      this.settleTurn();
      this.settleTurn = null;
    }
  }
}

const socketManager = new SocketManager();
export default socketManager;
