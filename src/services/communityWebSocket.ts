import AuthService from "@/services/auth";
import { useCommunityStore } from "@/store/useCommunityStore";

const BASE_RECONNECT_DELAY = 1_000;
const MAX_RECONNECT_DELAY = 30_000;
const MAX_RECONNECT_ATTEMPTS = 8;
const HEARTBEAT_INTERVAL_MS = 30_000;
const HEARTBEAT_TIMEOUT_MS = 10_000;

class CommunityWebSocket {
    private static instance: CommunityWebSocket | null = null;
    private ws: WebSocket | null = null;
    private currentCategoryId: string | null = null;
    private reconnectAttempts = 0;
    private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;

    private constructor() { }

    public static getInstance(): CommunityWebSocket {
        if (!CommunityWebSocket.instance) {
            CommunityWebSocket.instance = new CommunityWebSocket();
        }
        return CommunityWebSocket.instance;
    }

    async connect(categoryId: string | null = null) {
        if (typeof window === "undefined") return;

        const authService = AuthService.getInstance();

        // Verify the user has an active session before attempting to connect.
        // The access token is sent automatically as an httpOnly cookie — no URL param needed.
        const isAuthed = await authService.ensureValidToken();

        if (!isAuthed) {
            console.warn("[WS] No active session, skipping WebSocket connection");
            return;
        }

        const roomName = categoryId || "global";
        const currentRoom = this.currentCategoryId || "global";
        const targetRoom = categoryId || "global";

        // Don't reconnect if already connected or connecting to the same room
        if (this.ws && currentRoom === targetRoom &&
            (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        // If switching rooms, disconnect cleanly first
        if (this.ws) {
            this.stopHeartbeat();
            this.ws.onclose = null;
            this.ws.onerror = null;
            this.ws.onmessage = null;
            this.ws.close();
        }

        this.currentCategoryId = categoryId;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://api.garaad.org/ws/community/";
            const formattedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            // Token is forwarded as an httpOnly cookie — no ?token= in the URL
            const url = `${formattedBaseUrl}${roomName}/`;

            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                this.reconnectAttempts = 0;
                this.startHeartbeat();
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(event);
            };

            this.ws.onclose = (event) => {
                this.stopHeartbeat();
                if (event.code === 4001) {
                    // Server rejected: auth cookie missing or invalid. Do not reconnect.
                    console.warn("[WS] Auth rejected by server (4001). Reload or re-login required.");
                    return;
                }
                if (event.code !== 1000) { // 1000 is normal closure
                    this.attemptReconnect();
                }
            };

            this.ws.onerror = () => {
                // onclose fires after onerror; actual reconnect logic lives there
            };
        } catch {
            this.attemptReconnect();
        }
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: "ping" }));
                // Force-close if no pong within the timeout window
                this.heartbeatTimeout = setTimeout(() => {
                    console.warn("[WS] Heartbeat timeout — forcing reconnect");
                    this.ws?.close(4000, "heartbeat timeout");
                }, HEARTBEAT_TIMEOUT_MS);
            }
        }, HEARTBEAT_INTERVAL_MS);
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }

    private handleMessage(event: MessageEvent) {
        const store = useCommunityStore.getState();

        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "pong":
                    // Clear heartbeat timeout — connection is alive
                    if (this.heartbeatTimeout) {
                        clearTimeout(this.heartbeatTimeout);
                        this.heartbeatTimeout = null;
                    }
                    break;

                case "post_created":
                    store.handleWebSocketPost({ ...data.post, request_id: data.request_id });
                    break;

                case "post_updated":
                    store.handleWebSocketPost({ ...data.post, request_id: data.request_id });
                    break;

                case "post_deleted":
                    store.handleWebSocketPostDeleted(data.post_id);
                    break;

                case "reaction_updated":
                    store.handleWebSocketReactionUpdate(data.post_id, data.reactions_count);
                    break;

                case "reply_reaction_updated":
                    store.handleWebSocketReplyReactionUpdate(data.post_id, data.reply_id, data.reactions_count);
                    break;

                case "reply_created":
                    store.handleWebSocketReply(data.post_id, data.reply, data.replies_count);
                    break;

                case "reply_updated":
                    store.handleWebSocketReply(data.post_id, data.reply);
                    break;

                case "reply_deleted":
                    store.handleWebSocketReplyDeleted(data.post_id, data.reply_id, data.replies_count);
                    break;

                case "notification_created":
                    store.handleWebSocketNotification(data.notification);
                    break;

                case "notification_read":
                    store.handleWebSocketNotificationRead(data.notification_id);
                    break;

                case "all_notifications_read":
                    store.handleWebSocketAllNotificationsRead();
                    break;
            }
        } catch {
            // Malformed frame — ignore
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;

        this.reconnectAttempts++;
        const exponential = Math.min(
            BASE_RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1),
            MAX_RECONNECT_DELAY
        );
        // Add up to one base-delay of jitter to spread reconnect storms
        const delay = Math.floor(exponential + Math.random() * BASE_RECONNECT_DELAY);

        setTimeout(() => this.connect(this.currentCategoryId), delay);
    }

    disconnect() {
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.onclose = null;
            this.ws.onerror = null;
            this.ws.onmessage = null;
            this.ws.close();
            this.ws = null;
        }
        this.currentCategoryId = null;
        this.reconnectAttempts = 0;
    }
}

export default CommunityWebSocket;
