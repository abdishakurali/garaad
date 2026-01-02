import AuthService from "@/services/auth";
import type { AppDispatch } from "@/store/store";
import {
    handleWebSocketPost,
    handleWebSocketPostDeleted,
    handleWebSocketReactionUpdate,
    handleWebSocketReply,
    addNotification,
    handleWebSocketNotificationRead,
    handleWebSocketAllNotificationsRead,
} from "@/store/features/communitySlice";

export class CommunityWebSocket {
    private static instance: CommunityWebSocket | null = null;
    private ws: WebSocket | null = null;
    private dispatch: AppDispatch | null = null;
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

    async connect(categoryId: string | null = null, dispatch: AppDispatch) {
        if (typeof window === "undefined") return;

        const authService = AuthService.getInstance();

        // Ensure we have a valid token (refresh if needed) before connecting
        const token = await authService.ensureValidToken();

        if (!token) {
            console.warn("No auth token, skipping WebSocket connection");
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

        this.dispatch = dispatch;
        this.currentCategoryId = categoryId;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://api.garaad.org/ws/community/";
            // Ensure baseUrl ends in a slash
            const formattedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            // Connect to community WebSocket
            const url = `${formattedBaseUrl}${roomName}/?token=${token}`;
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
        if (!this.dispatch) return;

        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "post_created":
                    this.dispatch(handleWebSocketPost({ ...data.post, request_id: data.request_id }));
                    break;

                case "post_updated":
                    this.dispatch(handleWebSocketPost({ ...data.post, request_id: data.request_id }));
                    break;

                case "post_deleted":
                    this.dispatch(handleWebSocketPostDeleted({ post_id: data.post_id, request_id: data.request_id }));
                    break;

                case "reaction_updated":
                    this.dispatch(handleWebSocketReactionUpdate({
                        post_id: data.post_id,
                        reactions_count: data.reactions_count,
                        request_id: data.request_id
                    }));
                    break;

                case "reply_created":
                    this.dispatch(handleWebSocketReply({
                        postId: data.post_id,
                        reply: data.reply,
                        request_id: data.request_id
                    }));
                    break;

                case "reply_updated":
                    this.dispatch(handleWebSocketReply({
                        postId: data.post_id,
                        reply: data.reply,
                        request_id: data.request_id
                    }));
                    break;

                case "reply_deleted":
                    this.dispatch(handleWebSocketReply({
                        postId: data.post_id,
                        reply_id: data.reply_id,
                        request_id: data.request_id
                    }));
                    break;

                case "notification_created":
                    // New notification for the current user
                    this.dispatch(addNotification(data.notification));
                    break;

                case "notification_read":
                    this.dispatch(handleWebSocketNotificationRead({ notification_id: data.notification_id }));
                    break;

                case "all_notifications_read":
                    this.dispatch(handleWebSocketAllNotificationsRead());
                    break;

                default:
                    console.log("Unknown WebSocket event type:", data.type);
            }
        } catch (error) {
            console.warn("Error parsing WebSocket message:", error);
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.dispatch) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(
                    `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
                );
                this.connect(this.currentCategoryId, this.dispatch!);
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
        this.dispatch = null;
        this.currentCategoryId = null;
        this.reconnectAttempts = 0;
    }
}

export default CommunityWebSocket;

