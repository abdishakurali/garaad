import AuthService from "@/services/auth";
import type { CreatePostData, CreateReplyData, ReactionType } from "@/types/community";

const BASE_URL = "/api/";

// Helper function for making authenticated API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const authService = AuthService.getInstance();
  const token = authService.getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const isFormData = options.body instanceof FormData;
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
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

// Category Management APIs
export const categoryService = {
  // Get all categories (filter community-enabled on frontend)
  getCategories: async () => {
    return apiCall("lms/categories/");
  },

  // Get category details
  getCategoryDetails: async (categoryId: string) => {
    return apiCall(`lms/categories/${categoryId}/`);
  },
};

// Post Management APIs
export const postService = {
  // List posts in category
  getPosts: async (categoryId: string, page?: number) => {
    const params = page ? `?page=${page}` : "";
    return apiCall(`community/categories/${categoryId}/posts/${params}`);
  },

  // Create post
  createPost: async (categoryId: string, postData: CreatePostData) => {
    // Handle image uploads if present
    if (postData.images && postData.images.length > 0) {
      const formData = new FormData();
      formData.append("category", postData.category);
      formData.append("content", postData.content);

      postData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      return apiCall(`community/categories/${categoryId}/posts/`, {
        method: "POST",
        body: formData,
      });
    } else {
      const { images, ...jsonData } = postData;
      return apiCall(`community/categories/${categoryId}/posts/`, {
        method: "POST",
        body: JSON.stringify(jsonData),
      });
    }
  },

  // Update post
  updatePost: async (postId: number, content: string) => {
    return apiCall(`community/posts/${postId}/`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },

  // Delete post
  deletePost: async (postId: number) => {
    return apiCall(`community/posts/${postId}/`, {
      method: "DELETE",
    });
  },

  // React to post (toggle)
  reactToPost: async (postId: number, type: ReactionType) => {
    return apiCall(`community/posts/${postId}/react/`, {
      method: "POST",
      body: JSON.stringify({ type }),
    });
  },
};

// Reply Management APIs
export const replyService = {
  // Reply to post
  createReply: async (postId: number, replyData: CreateReplyData) => {
    return apiCall(`community/posts/${postId}/reply/`, {
      method: "POST",
      body: JSON.stringify(replyData),
    });
  },

  // Update reply
  updateReply: async (replyId: number, content: string) => {
    return apiCall(`community/replies/${replyId}/`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },

  // Delete reply
  deleteReply: async (replyId: number) => {
    return apiCall(`community/replies/${replyId}/`, {
      method: "DELETE",
    });
  },
};

// User Profile APIs
export const profileService = {
  // Get current user profile
  getUserProfile: async () => {
    return apiCall("community/profiles/me/");
  },

  // Update profile settings
  updateProfile: async (profileData: {
    preferred_language?: "so" | "en";
    email_notifications?: boolean;
    mention_notifications?: boolean;
  }) => {
    return apiCall("community/profiles/me/", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  },
};

// Notification Management APIs
export const notificationService = {
  // List notifications
  getNotifications: async (page?: number) => {
    const params = page ? `?page=${page}` : "";
    return apiCall(`community/notifications/${params}`);
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: number) => {
    return apiCall(`community/notifications/${notificationId}/mark_read/`, {
      method: "POST",
    });
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    return apiCall("community/notifications/mark_all_read/", {
      method: "POST",
    });
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

// Export the main service object
const communityService = {
  category: categoryService,
  post: postService,
  reply: replyService,
  profile: profileService,
  notification: notificationService,
  handleApiError,
};

export default communityService;
