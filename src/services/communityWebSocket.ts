import AuthService from "@/services/auth";
import type { AppDispatch } from "@/store/store";
import {
    handleWebSocketPost,
    handleWebSocketPostDeleted,
    handleWebSocketReactionUpdate,
    handleWebSocketReply,
} from "@/store/features/communitySlice";

export class CommunityWebSocket {
    private ws: WebSocket | null = null;
    private dispatch: AppDispatch | null = null;
    private currentCategoryId: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    connect(categoryId: string, dispatch: AppDispatch) {
        if (typeof window === "undefined") return;

        const authService = AuthService.getInstance();
        const token = authService.getToken();
        if (!token) {
            console.warn("No auth token, skipping WebSocket connection");
            return;
        }

        if (!categoryId || categoryId === "null" || categoryId === "undefined") {
            console.warn("Invalid categoryId, skipping WebSocket connection:", categoryId);
            return;
        }

        this.dispatch = dispatch;
        this.currentCategoryId = categoryId;

        try {
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://api.garaad.org/ws/community/";
            // Connect to community WebSocket
            const url = `${wsUrl}?token=${token}`;
            console.log(`Connecting to WebSocket: ${categoryId}`);

            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                console.log(`WebSocket connected to category_${categoryId}`);
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.warn("Error parsing WebSocket message:", error);
                }
            };

            this.ws.onclose = () => {
                console.log(`WebSocket disconnected from category_${categoryId}`);
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.warn("WebSocket connection issue:", error);
            };
        } catch (error) {
            console.warn("Failed to connect to WebSocket:", error);
        }
    }

    private handleMessage(data: any) {
        if (!this.dispatch) return;

        switch (data.type) {
            case "post_created":
                // New post from another user
                this.dispatch(handleWebSocketPost(data.post));
                break;

            case "post_deleted":
                // Post deleted by another user
                this.dispatch(handleWebSocketPostDeleted(data.post_id));
                break;

            case "reaction_updated":
                // Reaction changed (sync truth)
                this.dispatch(handleWebSocketReactionUpdate({
                    post_id: data.post_id,
                    reactions_count: data.reactions_count,
                    user_reactions: data.user_reactions,
                }));
                break;

            case "reply_created":
                // New reply from another user
                this.dispatch(handleWebSocketReply({
                    postId: data.post_id,
                    reply: data.reply,
                }));
                break;

            default:
                console.log("Unknown WebSocket event type:", data.type);
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.currentCategoryId && this.dispatch) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(
                    `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
                );
                this.connect(this.currentCategoryId!, this.dispatch!);
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.dispatch = null;
        this.currentCategoryId = null;
        this.reconnectAttempts = 0;
    }

    // Send is not needed - we use HTTP POST for all mutations
    // WebSocket is ONLY for receiving sync events
}

export default CommunityWebSocket;
