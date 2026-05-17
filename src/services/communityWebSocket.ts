import AuthService from "@/services/auth";
import { useCommunityStore } from "@/store/useCommunityStore";

class CommunityWebSocket {
    private static instance: CommunityWebSocket | null = null;
    private ws: WebSocket | null = null;
    private currentCategoryId: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

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

        // If categoryId is null, we connect to "global" which receives private notifications
        const roomName = categoryId || "global";

        const currentRoom = this.currentCategoryId || "global";
        const targetRoom = categoryId || "global";

        // Don't reconnect if already connected or connecting to the same room
        if (this.ws && currentRoom === targetRoom &&
            (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        // If switching rooms, disconnect first
        if (this.ws) {
            // Prevent old socket from triggering reconnects or errors
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
            console.log(`[WS] Connecting to: ${url}`);

            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                console.log(`[WS] Connected to ${roomName}`);
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(event);
            };

            this.ws.onclose = (event) => {
                console.log(`[WS] Disconnected from ${roomName} (Code: ${event.code})`);
                if (event.code === 4001) {
                    // Server rejected: auth cookie missing or invalid. Do not reconnect.
                    console.warn("[WS] Auth rejected by server (4001). Reload or re-login required.");
                    return;
                }
                if (event.code !== 1000) { // 1000 is normal closure
                    this.attemptReconnect();
                }
            };

            this.ws.onerror = (error) => {
                console.warn("WebSocket connection issue:", error);
            };
        } catch (error) {
            console.warn("Failed to connect to WebSocket:", error);
        }
    }


    private handleMessage(event: MessageEvent) {
        const store = useCommunityStore.getState();

        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
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
                    // New notification for the current user
                    store.handleWebSocketNotification(data.notification);
                    break;

                case "notification_read":
                    store.handleWebSocketNotificationRead(data.notification_id);
                    break;

                case "all_notifications_read":
                    store.handleWebSocketAllNotificationsRead();
                    break;

                default:
                    console.log("Unknown WebSocket event type:", data.type);
            }
        } catch (error) {
            console.warn("Error parsing WebSocket message:", error);
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(
                    `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
                );
                this.connect(this.currentCategoryId);
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    disconnect() {
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

