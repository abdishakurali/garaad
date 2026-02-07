import { api } from "@/lib/api";
import type { CreatePostData, CreateReplyData, ReactionType } from "@/types/community";

// Category Management APIs
export const categoryService = {
  // Get all categories (Campuses)
  getCategories: async () => {
    return api.get("/api/community/categories/");
  },

  getPublicCategories: async () => {
    return api.get("/api/community/categories/");
  },

  // Get category details (Optional, but keeping for completeness)
  getCategoryDetails: async (categoryId: string) => {
    return api.get(`/api/community/categories/${categoryId}/`);
  },

  // Toggle pin status
  togglePinCategory: async (categoryId: string) => {
    return api.post(`/api/community/categories/${categoryId}/toggle_pin/`);
  },
};

// Post Management APIs
export const postService = {
  getPosts: async (categoryId: string, page?: number) => {
    return api.get(`/api/community/categories/${categoryId}/posts/`, page ? { page: page.toString() } : undefined);
  },

  getPublicPosts: async (page?: number) => {
    return api.get(`/api/community/posts/public/`, page ? { page: page.toString() } : undefined);
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

      if (postData.is_public !== undefined) {
        formData.append("is_public", String(postData.is_public));
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

      return api.post(`/api/community/posts/`, formData);
    } else {
      const { images, attachments, ...jsonData } = postData;
      return api.post(`/api/community/posts/`, jsonData);
    }
  },

  // Update post
  updatePost: async (postId: string, content?: string, is_public?: boolean) => {
    const body: any = {};
    if (content !== undefined) body.content = content;
    if (is_public !== undefined) body.is_public = is_public;

    return api.patch(`/api/community/posts/${postId}/`, body);
  },

  // Delete post
  deletePost: async (postId: string, requestId?: string) => {
    return api.delete(`/api/community/posts/${postId}/`, {
      params: requestId ? { requestId } : undefined
    });
  },

  // React to post (toggle)
  reactToPost: async (postId: string, type: ReactionType, requestId?: string) => {
    return api.post(`/api/community/posts/${postId}/react/`, {
      type,
      reaction: type, // Mirror for compatibility
      requestId
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

      return api.post(`/api/community/posts/${postId}/reply/`, formData);
    } else {
      const { attachments, ...jsonData } = replyData;
      return api.post(`/api/community/posts/${postId}/reply/`, jsonData);
    }
  },

  // Update reply
  updateReply: async (replyId: string, content: string) => {
    return api.patch(`/api/community/replies/${replyId}/`, { content });
  },

  // Delete reply
  deleteReply: async (replyId: string, requestId?: string) => {
    return api.delete(`/api/community/replies/${replyId}/`, {
      params: requestId ? { requestId } : undefined
    });
  },

  // React to reply (toggle)
  reactToReply: async (replyId: string, type: ReactionType, requestId?: string) => {
    return api.post(`/api/community/replies/${replyId}/react/`, {
      type,
      reaction: type,
      requestId
    });
  },
};

// User Profile APIs
export const profileService = {
  getUserProfile: async () => {
    return api.get("/api/community/profiles/me/");
  },

  // Get other user profile for community interactions
  getOtherUserProfile: async (userId: string) => {
    return api.get(`/api/community/profiles/${userId}/`);
  },

  // Get users who have enabled notifications
  getNotificationEnabledUsers: async () => {
    return api.get('/api/community/profiles/notification_enabled/');
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

      return api.patch("/api/community/profiles/me/", formData);
    } else {
      // Standard JSON update
      return api.patch("/api/community/profiles/me/", profileData);
    }
  },
};

// Notification Management APIs
export const notificationService = {
  // List notifications
  getNotifications: async (page?: number) => {
    return api.get("/api/community/notifications/", page ? { page: page.toString() } : undefined);
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string) => {
    return api.post(`/api/community/notifications/${notificationId}/mark_as_read/`);
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    return api.post("/api/community/notifications/mark_all_as_read/");
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
