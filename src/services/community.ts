import AuthService from "@/services/auth";
import { API_BASE_URL } from "@/lib/constants";
import type { CreatePostData, CreateReplyData, ReactionType } from "@/types/community";

const BASE_URL = `${API_BASE_URL}/api/`;

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

  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const responseText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { raw: responseText };
      }

      console.error(`API Error [${response.status}] ${url}:`, JSON.stringify(errorData, null, 2));

      throw {
        status: response.status,
        message: response.statusText || "Request failed",
        data: errorData,
      };
    }

    // Check for empty response (e.g. 204 No Content)
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType || contentType.indexOf("application/json") === -1) {
      return {};
    }

    try {
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      // DEBUG: Log posts response to see if replies are included
      if (typeof url === 'string' && url.includes('/posts')) {
        console.log(`[API] Response from ${url}:`, JSON.stringify(data, null, 2));
      }

      return data;
    } catch (e) {
      console.warn(`Failed to parse JSON response from ${url}:`, e);
      return {};
    }
  } catch (error: any) {
    if (error.status) throw error; // Re-throw structured API errors

    console.error(`Network Error ${url}:`, error);
    throw {
      status: 0,
      message: error.message || "Network request failed",
      data: error,
    };
  }
};

// Category Management APIs
export const categoryService = {
  // Get all categories (Campuses)
  getCategories: async () => {
    return apiCall("community/categories/");
  },

  // Get category details (Optional, but keeping for completeness)
  getCategoryDetails: async (categoryId: string) => {
    return apiCall(`community/categories/${categoryId}/`);
  },

  // Toggle pin status
  togglePinCategory: async (categoryId: string) => {
    return apiCall(`community/categories/${categoryId}/toggle_pin/`, {
      method: "POST",
    });
  },
};

// Post Management APIs
export const postService = {
  getPosts: async (categoryId: string, page?: number) => {
    const params = page ? `?page=${page}` : "";
    return apiCall(`community/categories/${categoryId}/posts/${params}`);
  },

  // Create post
  createPost: async (categoryId: string, postData: CreatePostData) => {
    // Handle file uploads (images or attachments) if present
    if ((postData.images && postData.images.length > 0) || (postData.attachments && postData.attachments.length > 0) || postData.video_url) {
      const formData = new FormData();
      formData.append("category", postData.category);
      formData.append("content", postData.content);

      if (postData.requestId) {
        formData.append("requestId", postData.requestId);
      }

      if (postData.video_url) {
        formData.append("video_url", postData.video_url);
      }

      if (postData.images) {
        postData.images.forEach((image) => {
          formData.append(`images`, image);
        });
      }

      if (postData.attachments) {
        postData.attachments.forEach((file) => {
          formData.append(`attachments`, file);
        });
      }

      return apiCall(`community/posts/`, {
        method: "POST",
        body: formData,
      });
    } else {
      const { images, attachments, ...jsonData } = postData;
      return apiCall(`community/posts/`, {
        method: "POST",
        body: JSON.stringify(jsonData),
      });
    }
  },

  // Update post
  updatePost: async (postId: string, content: string) => {
    return apiCall(`community/posts/${postId}/`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },

  // Delete post
  deletePost: async (postId: string, requestId?: string) => {
    const params = requestId ? `?requestId=${requestId}` : "";
    return apiCall(`community/posts/${postId}/${params}`, {
      method: "DELETE",
    });
  },

  // React to post (toggle)
  reactToPost: async (postId: string, type: ReactionType, requestId?: string) => {
    return apiCall(`community/posts/${postId}/react/`, {
      method: "POST",
      body: JSON.stringify({
        type,
        reaction: type, // Mirror for compatibility
        requestId
      }),
    });
  },
};

// Reply Management APIs
export const replyService = {
  // Reply to post
  createReply: async (postId: string, replyData: CreateReplyData) => {
    // If there are attachments, we must use FormData
    if ((replyData.attachments && replyData.attachments.length > 0) || replyData.video_url) {
      const formData = new FormData();
      formData.append("content", replyData.content);

      if (replyData.requestId) {
        formData.append("requestId", replyData.requestId);
      }

      if (replyData.video_url) {
        formData.append("video_url", replyData.video_url);
      }

      if (replyData.attachments) {
        replyData.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      return apiCall(`community/posts/${postId}/reply/`, {
        method: "POST",
        body: formData,
      });
    } else {
      const { attachments, ...jsonData } = replyData;
      return apiCall(`community/posts/${postId}/reply/`, {
        method: "POST",
        body: JSON.stringify(jsonData),
      });
    }
  },

  // Update reply
  updateReply: async (replyId: string, content: string) => {
    return apiCall(`community/replies/${replyId}/`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
  },

  // Delete reply
  deleteReply: async (replyId: string, requestId?: string) => {
    const params = requestId ? `?requestId=${requestId}` : "";
    return apiCall(`community/replies/${replyId}/${params}`, {
      method: "DELETE",
    });
  },
};

// User Profile APIs
export const profileService = {
  getUserProfile: async () => {
    return apiCall("community/profiles/me/");
  },

  // Get other user profile for community interactions
  getOtherUserProfile: async (userId: string) => {
    return apiCall(`community/profiles/${userId}/`);
  },

  // Get users who have enabled notifications
  getNotificationEnabledUsers: async () => {
    return apiCall('community/profiles/notification_enabled/');
  },

  // Update profile settings
  updateProfile: async (profileData: {
    preferred_language?: "so" | "en";
    email_notifications?: boolean;
    mention_notifications?: boolean;
    profile_picture?: File; // Add support for image file
    first_name?: string;
    last_name?: string;
    bio?: string;
  }) => {
    // If there's a file, we must use FormData
    if (profileData.profile_picture) {
      const formData = new FormData();
      if (profileData.preferred_language) formData.append('preferred_language', profileData.preferred_language);
      if (profileData.email_notifications !== undefined) formData.append('email_notifications', String(profileData.email_notifications));
      if (profileData.mention_notifications !== undefined) formData.append('mention_notifications', String(profileData.mention_notifications));
      if (profileData.first_name) formData.append('first_name', profileData.first_name);
      if (profileData.last_name) formData.append('last_name', profileData.last_name);
      if (profileData.bio) formData.append('bio', profileData.bio);

      // Append the file properly
      formData.append('profile_picture', profileData.profile_picture);

      return apiCall("community/profiles/me/", {
        method: "PATCH",
        body: formData,
      });
    } else {
      // Standard JSON update
      return apiCall("community/profiles/me/", {
        method: "PATCH",
        body: JSON.stringify(profileData),
      });
    }
  },
};

// Notification Management APIs
export const notificationService = {
  // List notifications
  getNotifications: async (page?: number) => {
    const params = page ? `?page=${page}` : "";
    const path = `community/notifications/${params}`.replace(/\/+/g, '/');
    return apiCall(path);
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string) => {
    return apiCall(`community/notifications/${notificationId}/mark_as_read/`, {
      method: "POST",
    });
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    return apiCall("community/notifications/mark_all_as_read/", {
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
