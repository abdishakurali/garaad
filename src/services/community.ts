import AuthService from "@/services/auth";

const BASE_URL = "/api/community/";

// Helper function for making authenticated API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const authService = AuthService.getInstance();
  const token = authService.getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const config: RequestInit = {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: response.statusText,
      data: errorData,
    };
  }

  return response.json();
};

// Campus Management APIs
export const campusService = {
  // List all campuses with optional filters
  getCampuses: async (
    filters: {
      subject_tag?: string;
      search?: string;
      page?: number;
    } = {}
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return apiCall(`campuses/?${params}`);
  },

  // Get campus details by slug
  getCampusDetails: async (slug: string) => {
    return apiCall(`campuses/${slug}/`);
  },

  // Join a campus
  joinCampus: async (slug: string) => {
    return apiCall(`campuses/${slug}/join/`, {
      method: "POST",
    });
  },

  // Leave a campus
  leaveCampus: async (slug: string) => {
    return apiCall(`campuses/${slug}/leave/`, {
      method: "POST",
    });
  },

  // Get campus rooms
  getCampusRooms: async (slug: string, groupByMetadata: boolean = false) => {
    const params = groupByMetadata ? "?group_by_category=true" : "";
    return apiCall(`campuses/${slug}/rooms/${params}`);
  },
};

// Room Management APIs
export const roomService = {
  // List rooms with campus filter
  getRooms: async (campusSlug?: string) => {
    const params = campusSlug ? `?campus=${campusSlug}` : "";
    return apiCall(`rooms/${params}`);
  },

  // Get room posts (v1 - legacy)
  getRoomPosts: async (roomId: number, page?: number) => {
    const params = page ? `?page=${page}` : "";
    return apiCall(`rooms/${roomId}/posts/${params}`);
  },
};

// Messaging Management APIs
export const messageService = {
  // Fetch messages for a specific room
  getMessages: async (roomUuid: string) => {
    return apiCall(`messages/?room=${roomUuid}`);
  },

  // Toggle reaction on a message
  toggleReaction: async (messageId: string, emoji: string) => {
    return apiCall(`messages/${messageId}/react/`, {
      method: "POST",
      body: JSON.stringify({ emoji }),
    });
  },

  // Send a new message
  sendMessage: async (messageData: {
    room: string; // UUID
    content: string;
    reply_to?: string; // Optional UUID
  }) => {
    return apiCall("messages/", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  },
};

// Presence Management APIs
export const presenceService = {
  // Get current user's presence
  getPresence: async () => {
    return apiCall("presence/");
  },

  // Update presence status
  setStatus: async (presenceData: {
    status: "online" | "idle" | "dnd" | "offline";
    custom_status?: string;
  }) => {
    return apiCall("presence/set_status/", {
      method: "POST",
      body: JSON.stringify(presenceData),
    });
  },
};

// Post Management APIs
export const postService = {
  // List posts with filters
  getPosts: async (
    filters: {
      room?: number;
      campus?: string;
      post_type?: string;
      search?: string;
      page?: number;
    } = {}
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return apiCall(`posts/?${params}`);
  },

  // Create a new post
  createPost: async (postData: {
    title: string;
    content: string;
    room_id: number;
    language: "so" | "en";
    post_type: "question" | "discussion" | "announcement" | "poll";
    image?: File | null;
    video_url?: string;
  }) => {
    // Handle file upload if image is provided
    if (postData.image) {
      const formData = new FormData();
      Object.entries(postData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      return apiCall("posts/", {
        method: "POST",
        headers: {
          // Remove Content-Type to let browser set it for FormData
          Authorization: `Bearer ${AuthService.getInstance().getToken()}`,
        },
        body: formData,
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image, ...jsonData } = postData;
      return apiCall("posts/", {
        method: "POST",
        body: JSON.stringify(jsonData),
      });
    }
  },

  // Get post details
  getPostDetails: async (postId: string) => {
    return apiCall(`posts/${postId}/`);
  },

  // Like/unlike a post
  togglePostLike: async (postId: string) => {
    return apiCall(`posts/${postId}/like/`, {
      method: "POST",
    });
  },

  // Delete a post
  deletePost: async (postId: string) => {
    return apiCall(`posts/${postId}/`, {
      method: "DELETE",
    });
  },

  // Update a post
  updatePost: async (
    postId: string,
    postData: Partial<{
      title: string;
      content: string;
      language: "so" | "en";
      post_type: string;
    }>
  ) => {
    return apiCall(`posts/${postId}/`, {
      method: "PATCH",
      body: JSON.stringify(postData),
    });
  },
};

// Comment Management APIs
export const commentService = {
  // List comments for a post
  getComments: async (postId: string) => {
    return apiCall(`comments/?post=${postId}`);
  },

  // Create a comment or reply
  createComment: async (commentData: {
    content: string;
    post_id: string;
    parent_comment_id?: string;
    language: "so" | "en";
  }) => {
    return apiCall("comments/", {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  },

  // Like/unlike a comment
  toggleCommentLike: async (commentId: string) => {
    return apiCall(`comments/${commentId}/like/`, {
      method: "POST",
    });
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    return apiCall(`comments/${commentId}/`, {
      method: "DELETE",
    });
  },

  // Update a comment
  updateComment: async (commentId: string, content: string) => {
    return apiCall(`comments/${commentId}/`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },
};

// User Profile & Gamification APIs
export const profileService = {
  // Get current user profile
  getUserProfile: async () => {
    return apiCall("profiles/me/");
  },

  // Get leaderboard
  getLeaderboard: async (campusSlug?: string) => {
    const params = campusSlug ? `?campus=${campusSlug}` : "";
    return apiCall(`profiles/leaderboard/${params}`);
  },

  // Update profile settings
  updateProfile: async (profileData: {
    preferred_language?: "so" | "en";
    email_notifications?: boolean;
    mention_notifications?: boolean;
  }) => {
    return apiCall("profiles/me/", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  },

  // Get user's activity stats
  getUserStats: async (userId?: number) => {
    const endpoint = userId
      ? `profiles/${userId}/stats/`
      : "profiles/me/stats/";
    return apiCall(endpoint);
  },
};

// Notification Management APIs
export const notificationService = {
  // List notifications
  getNotifications: async (page?: number) => {
    const params = page ? `?page=${page}` : "";
    return apiCall(`notifications/${params}`);
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: number) => {
    return apiCall(`notifications/${notificationId}/mark_read/`, {
      method: "POST",
    });
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    return apiCall("notifications/mark_all_read/", {
      method: "POST",
    });
  },
};

// Trending Tags API
export const trendingService = {
  // Get trending tags
  getTrendingTags: async (period: "day" | "week" | "month" = "week") => {
    return apiCall(`trending/tags/?period=${period}`);
  },
};

// Error handling helper
export const handleApiError = (error: {
  status: number;
  data?: unknown;
  message?: string;
}) => {
  // Demote to warn to avoid cluttering console with expected API errors (404s etc)
  if (error.status !== 404 && error.status !== 401) {
    console.warn("API Error:", error);
  }

  switch (error.status) {
    case 400:
      return {
        type: "validation",
        message:
          "Macluumaadka waxay ku jiraan qalad. Fadlan hubi oo dib u day.",
        errors: error.data,
      };
    case 401:
      return {
        type: "auth",
        message: "Waa inaad galato si aad u isticmaasho adeeggan.",
      };
    case 403:
      return {
        type: "permission",
        message: "Ma lehe ogolaansho inaad tan samayso.",
      };
    case 404:
      return {
        type: "notFound",
        message: "Wixii aad raadinaysay lama helin.",
      };
    case 500:
      return {
        type: "server",
        message: "Cillad ayaa ka dhacday server-ka. Fadlan dib u day.",
      };
    default:
      return {
        type: "unknown",
        message: "Cillad aan la aqoon ayaa dhacday. Fadlan dib u day.",
      };
  }
};

// WebSocket connection for real-time updates (future implementation)
export class CommunityWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(onMessage: (data: unknown) => void) {
    if (typeof window === "undefined") return;

    const authService = AuthService.getInstance();
    const token = authService.getToken();
    if (!token) return;

    try {
      // Use environment variable for WS URL or fallback to default
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://api.garaad.org/ws/community/";
      this.ws = new WebSocket(`${wsUrl}?token=${token}`);

      this.ws.onopen = () => {
        console.log("Community WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.warn("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("Community WebSocket disconnected");
        this.attemptReconnect(onMessage);
      };

      this.ws.onerror = (error) => {
        // WebSocket errors are often uninformative (empty object), so we warn instead of error
        console.warn("Community WebSocket connection issue (check network/backend):", error);
      };
    } catch (error) {
      console.warn("Failed to connect to Community WebSocket:", error);
    }
  }

  private attemptReconnect(onMessage: (data: unknown) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(
          `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect(onMessage);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

// Export the main service object
const communityService = {
  campus: campusService,
  room: roomService,
  message: messageService,
  presence: presenceService,
  post: postService,
  comment: commentService,
  profile: profileService,
  notification: notificationService,
  trending: trendingService,
  handleApiError,
  CommunityWebSocket,
};

export default communityService;
