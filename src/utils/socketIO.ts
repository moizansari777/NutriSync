import { SOCKET_URL } from "../config";

type MessageCallback = (data: any) => void;
type EventCallback = () => void;

class WebSocketServices {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isIntentionallyClosed: boolean = false;

  // Support multiple listeners (important for React)
  private messageListeners: Set<MessageCallback> = new Set();
  private errorListeners: Set<EventCallback> = new Set();
  private closeListeners: Set<EventCallback> = new Set();
  private openListeners: Set<EventCallback> = new Set();

  // Track active subscriptions
  private activeSubscriptions: Set<string> = new Set();

  /**
   * Initialize socket connection (idempotent - won't recreate if already connected)
   */
  initializeSocket = (token: string): void => {
    // Prevent duplicate connections
    if (this.ws?.readyState === WebSocket.OPEN && this.token === token) {
      console.log("✅ Socket already connected...");
      return;
    }

    this.token = token;
    this.isIntentionallyClosed = false;
    this.connect();
  };

  // private isSocketUsable = (): boolean => {
  //   return this.ws?.readyState === WebSocket.OPEN;
  // };

  private connect = (): void => {
    if (!this.token) return;

    // Clean up existing connection
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.close();
    }

    this.ws = new WebSocket(SOCKET_URL, [], {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    this.ws.onopen = () => {
      console.log("🔌 WebSocket Connected");
      this.notifyListeners(this.openListeners);

      // Resubscribe to all active conversations
      this.activeSubscriptions.forEach(convId => {
        this.subscribeToConversation(convId);
      });
    };

    this.ws.onclose = () => {
      console.log("🔌 WebSocket Disconnected");
      this.notifyListeners(this.closeListeners);

      // Auto-reconnect if not intentionally closed
      if (!this.isIntentionallyClosed && this.token) {
        // console.log("🔄 Reconnecting in 3s...");
        this.reconnectTimeout = setTimeout(() => this.connect(), 5000);
      }
    };

    this.ws.onerror = error => {
      // console.log("❌ WebSocket Error:", error);
      this.notifyListeners(this.errorListeners);
    };

    this.ws.onmessage = event => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.message) {
          // defer notify to next tick
          setTimeout(() => this.notifyMessageListeners(payload.message), 0);
        } else if (payload.type === "ping") {
          this.ws?.send(JSON.stringify({ type: "pong" }));
        }
      } catch (e) {
        console.log("❌ Failed to parse message:");
      }
    };
  };

  private notifyListeners = (listeners: Set<EventCallback>): void => {
    listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error("Listener error:", e);
      }
    });
  };

  private notifyMessageListeners = (data: any): void => {
    this.messageListeners.forEach(cb => {
      try {
        cb(data);
      } catch (e) {
        console.error("Message listener error:", e);
      }
    });
  };

  /**
   * Subscribe to a conversation (idempotent - won't resubscribe if already subscribed)
   */
  subscribeToConversation = (conversationId: string | number): void => {
    const convIdStr = String(conversationId);

    if (this.activeSubscriptions.has(convIdStr)) {
      // console.log("✅ Already subscribed to:", convIdStr);
      return;
    }

    const msg = {
      command: "subscribe",
      identifier: JSON.stringify({
        channel: "ConversationChannel",
        conversation_id: conversationId,
      }),
    };

    this.safeSend(msg);
    this.activeSubscriptions.add(convIdStr);
    // console.log("📡 Subscribed to conversation:", conversationId);
  };

  /**
   * Unsubscribe from a conversation
   */
  unsubscribeFromConversation = (conversationId: string | number): void => {
    const convIdStr = String(conversationId);

    const msg = {
      command: "unsubscribe",
      identifier: JSON.stringify({
        channel: "ConversationChannel",
        conversation_id: conversationId,
      }),
    };

    this.safeSend(msg);
    this.activeSubscriptions.delete(convIdStr);
    // console.log("🔕 Unsubscribed from conversation:", conversationId);
  };

  private safeSend = (msg: object): void => {
    const trySend = (attempts = 0): void => {
      if (attempts > 50) {
        // console.warn("⚠️ Failed to send message after 5s");
        return;
      }

      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(msg));
      } else {
        setTimeout(() => trySend(attempts + 1), 100);
      }
    };

    trySend();
  };

  // === Event Listeners (support multiple listeners) ===
  onMessage = (cb: MessageCallback): (() => void) => {
    this.messageListeners.add(cb);
    // Return cleanup function
    return () => this.messageListeners.delete(cb);
  };

  onError = (cb: EventCallback): (() => void) => {
    this.errorListeners.add(cb);
    return () => this.errorListeners.delete(cb);
  };

  onClose = (cb: EventCallback): (() => void) => {
    this.closeListeners.add(cb);
    return () => this.closeListeners.delete(cb);
  };

  onOpen = (cb: EventCallback): (() => void) => {
    this.openListeners.add(cb);
    return () => this.openListeners.delete(cb);
  };

  /**
   * Check if socket is connected
   */
  isConnected = (): boolean => {
    return this.ws?.readyState === WebSocket.OPEN;
  };

  /**
   * Disconnect socket (call only on logout or app termination)
   */
  disconnect = (): void => {
    // console.log("🔌 Disconnecting WebSocket");
    this.isIntentionallyClosed = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.close();
      this.ws = null;
    }

    this.token = null;
    this.activeSubscriptions.clear();
    this.messageListeners.clear();
    this.errorListeners.clear();
    this.closeListeners.clear();
    this.openListeners.clear();
  };
}

const socketServices = new WebSocketServices();
export default socketServices;
