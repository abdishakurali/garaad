import { createSlice, createAsyncThunk, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type {
  CommunityCategory,
  CommunityPost,
  CommunityReply,
  Notification,
  UserProfile,
  CommunityState,
  CreatePostData,
  CreateReplyData,
  ReactionType,
} from "@/types/community";
import communityService, { handleApiError } from "@/services/community";
import type { RootState } from "@/store/store";

// Initial state
const initialState: CommunityState = {
  // Data
  categories: [],
  posts: [],
  selectedCategory: null,
  userProfile: null,
  notifications: [],

  // UI State
  loading: {
    categories: false,
    posts: false,
    profile: false,
    notifications: false,
  },

  errors: {
    categories: null,
    posts: null,
    profile: null,
    notifications: null,
  },

  // Pagination
  pagination: {
    posts: {
      page: 1,
      hasMore: false,
    },
    notifications: {
      page: 1,
      hasMore: false,
    },
  },
  pendingRequestIds: [],
  pinnedCategoryIds: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("pinnedCategoryIds") || "[]")
    : [],
};

// Async Thunks

// Fetch categories (filter community-enabled)
export const fetchCategories = createAsyncThunk(
  "community/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await communityService.category.getCategories();
      // Ensure each category has necessary community fields with fallbacks
      return data.map((cat: any) => ({
        ...cat,
        posts_count: cat.posts_count || 0,
        community_description: cat.community_description || cat.description || "",
        is_community_enabled: cat.is_community_enabled ?? true,
      }));
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch posts for a category (ONLY on initial load)
export const fetchCategoryPosts = createAsyncThunk(
  "community/fetchCategoryPosts",
  async (
    { categoryId, page }: { categoryId: string; page?: number },
    { rejectWithValue }
  ) => {
    try {
      return await communityService.post.getPosts(categoryId, page);
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Create a new post (optimistic)
export const createPost = createAsyncThunk(
  "community/createPost",
  async (
    { categoryId, postData, tempId }: { categoryId: string; postData: CreatePostData; tempId: string },
    { rejectWithValue }
  ) => {
    try {
      // Use the request_id provided by the component (for optimistic matching) or generate one
      const request_id = postData.requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const result = await communityService.post.createPost(categoryId, { ...postData, requestId: request_id });
      return { ...result, tempId, request_id };
    } catch (error: any) {
      // On failure, pass back the same info for cleanup
      const request_id = postData.requestId;
      return rejectWithValue({ error: handleApiError(error), tempId, request_id });
    }
  }
);

// Update a post
export const updatePost = createAsyncThunk(
  "community/updatePost",
  async (
    { postId, content }: { postId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      return await communityService.post.updatePost(postId, content);
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Delete a post
export const deletePost = createAsyncThunk(
  "community/deletePost",
  async (
    { postId, requestId }: { postId: string; requestId?: string },
    { rejectWithValue }
  ) => {
    try {
      const final_request_id = requestId || `req_del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await communityService.post.deletePost(postId, final_request_id);
      return { postId, request_id: final_request_id };
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// React to a post (optimistic handled in reducer)
export const reactToPost = createAsyncThunk(
  "community/reactToPost",
  async (
    { postId, type, requestId }: { postId: string; type: ReactionType; requestId?: string },
    { rejectWithValue }
  ) => {
    try {
      const final_request_id = requestId || `req_react_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const result = await communityService.post.reactToPost(postId, type, final_request_id);
      return { ...result, postId, request_id: final_request_id };
    } catch (error: any) {
      return rejectWithValue({ error: handleApiError(error), postId, type });
    }
  }
);

// Create a reply (optimistic)
export const createReply = createAsyncThunk(
  "community/createReply",
  async (
    { postId, replyData, tempId }: { postId: string; replyData: CreateReplyData; tempId: string },
    { rejectWithValue }
  ) => {
    try {
      const request_id = replyData.requestId || `req_rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const reply = await communityService.reply.createReply(postId, { ...replyData, requestId: request_id });
      return { postId, reply, tempId, request_id };
    } catch (error: any) {
      const request_id = replyData.requestId;
      return rejectWithValue({ error: handleApiError(error), postId, tempId, request_id });
    }
  }
);

// Update a reply
export const updateReply = createAsyncThunk(
  "community/updateReply",
  async (
    { replyId, content }: { replyId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      return await communityService.reply.updateReply(replyId, content);
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Delete a reply
export const deleteReply = createAsyncThunk(
  "community/deleteReply",
  async (
    { postId, replyId, requestId }: { postId: string; replyId: string; requestId?: string },
    { rejectWithValue }
  ) => {
    try {
      const final_request_id = requestId || `req_del_rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await communityService.reply.deleteReply(replyId, final_request_id);
      return { postId, replyId, request_id: final_request_id };
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "community/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await communityService.profile.getUserProfile();
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Toggle pin category (Backend-persisted)
export const togglePinCategory = createAsyncThunk(
  "community/togglePinCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const result = await communityService.category.togglePinCategory(categoryId);
      return { categoryId, ...result };
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "community/fetchNotifications",
  async (
    { page, reset }: { page?: number; reset?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const data = await communityService.notification.getNotifications(page);
      return { data, reset };
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Mark notification as read
export const markNotificationRead = createAsyncThunk(
  "community/markNotificationRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await communityService.notification.markNotificationRead(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "community/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await communityService.notification.markAllNotificationsRead();
      return true;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Community Slice
const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<CommunityCategory | null>) => {
      // Clear posts when changing category
      if (action.payload?.id !== state.selectedCategory?.id) {
        state.posts = [];
        state.pagination.posts = { page: 1, hasMore: false };
      }
      state.selectedCategory = action.payload;
    },

    // OPTIMISTIC: Add post immediately
    addOptimisticPost: (state, action: PayloadAction<CommunityPost>) => {
      state.posts.unshift(action.payload);
      // Increment category post count
      const category = state.categories.find(c => c.id === action.payload.category);
      if (category) {
        category.posts_count = (category.posts_count || 0) + 1;
      }
      if (action.payload.request_id) {
        state.pendingRequestIds.push(action.payload.request_id);
      }
    },

    // OPTIMISTIC: Remove failed post
    removeOptimisticPost: (state, action: PayloadAction<{ postId: string; request_id?: string }>) => {
      const post = state.posts.find(p => p.id.toString() === action.payload.postId);
      state.posts = state.posts.filter(p => p.id.toString() !== action.payload.postId);

      // Decrement category post count if we found the post
      if (post) {
        const category = state.categories.find(c => c.id === post.category);
        if (category) {
          category.posts_count = Math.max(0, (category.posts_count || 0) - 1);
        }
      }

      if (action.payload.request_id) {
        state.pendingRequestIds.push(action.payload.request_id);
      }
    },

    // OPTIMISTIC: Toggle reaction immediately
    toggleReactionOptimistic: (state, action: PayloadAction<{ postId: string; type: ReactionType; isAdding: boolean; request_id?: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const { type, isAdding, request_id } = action.payload;

        if (isAdding) {
          post.reactions_count[type] += 1;
          if (!post.user_reactions.includes(type)) {
            post.user_reactions.push(type);
          }
        } else {
          post.reactions_count[type] = Math.max(0, post.reactions_count[type] - 1);
          post.user_reactions = post.user_reactions.filter(r => r !== type);
        }

        if (request_id) {
          state.pendingRequestIds.push(request_id);
        }
      }
    },

    // OPTIMISTIC: Add reply immediately
    addOptimisticReply: (state, action: PayloadAction<{ postId: string; reply: CommunityReply }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.replies.push(action.payload.reply);
        post.replies_count += 1;
        if (action.payload.reply.request_id) {
          state.pendingRequestIds.push(action.payload.reply.request_id);
        }
      }
    },

    // OPTIMISTIC: Remove failed reply
    removeOptimisticReply: (state, action: PayloadAction<{ postId: string; tempId: string; request_id?: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.replies = post.replies.filter(r => r.id.toString() !== action.payload.tempId);
        post.replies_count = Math.max(0, post.replies_count - 1);
        if (action.payload.request_id) {
          state.pendingRequestIds.push(action.payload.request_id);
        }
      }
    },

    // WEBSOCKET: Handle incoming post (Create or Update)
    handleWebSocketPost: (state, action: PayloadAction<CommunityPost & { request_id?: string }>) => {
      const { request_id, id, category } = action.payload;

      // If this client initiated the request, ignore the WebSocket echo to prevent duplication
      // This is a short-term filter for messages arriving *during* the HTTP request
      if (request_id && state.pendingRequestIds.includes(request_id)) {
        return;
      }

      // Robust check: Is there any post with this ID or this REQUEST_ID?
      // Matches both real IDs and optimistic temp IDs if they share the same requestId
      const index = state.posts.findIndex(p => p.id === id || (request_id && p.request_id === request_id));
      if (index !== -1) {
        // Update existing post (authoritative sync)
        state.posts[index] = { ...state.posts[index], ...action.payload };
      } else {
        // Add new post
        state.posts.unshift(action.payload);
        // Increment category post count
        const cat = state.categories.find(c => c.id === category);
        if (cat) {
          cat.posts_count = (cat.posts_count || 0) + 1;
        }
      }
    },

    // WEBSOCKET: Handle post deletion
    handleWebSocketPostDeleted: (state, action: PayloadAction<{ post_id: string; request_id?: string }>) => {
      const { post_id, request_id } = action.payload;

      // Ignore if we initiated the delete
      if (request_id && state.pendingRequestIds.includes(request_id)) {
        return;
      }

      const post = state.posts.find(p => p.id === post_id);
      state.posts = state.posts.filter(p => p.id !== post_id);

      if (post) {
        const category = state.categories.find(c => c.id === post.category);
        if (category) {
          category.posts_count = Math.max(0, (category.posts_count || 0) - 1);
        }
      }
    },

    // WEBSOCKET: Handle reaction update
    handleWebSocketReactionUpdate: (state, action: PayloadAction<{ post_id: string; reactions_count: Record<string, number>; request_id?: string }>) => {
      const { post_id, reactions_count, request_id } = action.payload;

      // Ignore if we initiated the reaction (optimistic UI handles it)
      if (request_id && state.pendingRequestIds.includes(request_id)) {
        return;
      }

      const post = state.posts.find(p => p.id === post_id);
      if (post) {
        post.reactions_count = reactions_count;
      }
    },

    // WEBSOCKET: Handle reply (Create, Update, or Delete)
    handleWebSocketReply: (state, action: PayloadAction<{
      postId: string;
      reply?: CommunityReply;
      reply_id?: string;
      request_id?: string
    }>) => {
      const { postId, reply, reply_id, request_id } = action.payload;

      // Ignore if we initiated the request
      if (request_id && state.pendingRequestIds.includes(request_id)) {
        return;
      }

      const post = state.posts.find(p => p.id === postId);
      if (!post) return;

      if (reply) {
        // Handle Creation or Update
        // Check by ID or requestId for robust duplication prevention
        const index = post.replies.findIndex(r => r.id === reply.id || (request_id && r.request_id === request_id));
        if (index !== -1) {
          post.replies[index] = { ...post.replies[index], ...reply };
        } else {
          post.replies.push(reply);
          post.replies_count += 1;
        }
      } else if (reply_id) {
        // Handle Deletion
        const exists = post.replies.some(r => r.id === reply_id);
        if (exists) {
          post.replies = post.replies.filter(r => r.id !== reply_id);
          post.replies_count = Math.max(0, post.replies_count - 1);
        }
      }
    },

    clearPosts: (state) => {
      state.posts = [];
      state.pagination.posts = { page: 1, hasMore: false };
    },

    clearErrors: (state) => {
      state.errors = {
        categories: null,
        posts: null,
        profile: null,
        notifications: null,
      };
    },

    togglePinCategoryOptimistic: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      if (state.pinnedCategoryIds.includes(categoryId)) {
        state.pinnedCategoryIds = state.pinnedCategoryIds.filter(id => id !== categoryId);
      } else {
        if (state.pinnedCategoryIds.length < 3) {
          state.pinnedCategoryIds.push(categoryId);
        }
      }
      // Persist to localStorage immediately for better UX on refresh
      if (typeof window !== "undefined") {
        localStorage.setItem("pinnedCategoryIds", JSON.stringify(state.pinnedCategoryIds));
      }
    },
    setPinnedCategories: (state, action: PayloadAction<string[]>) => {
      state.pinnedCategoryIds = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("pinnedCategoryIds", JSON.stringify(state.pinnedCategoryIds));
      }
    },
    // Action to load from localStorage explicitly
    loadPinnedCategoriesFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("pinnedCategoryIds");
        if (stored) {
          try {
            state.pinnedCategoryIds = JSON.parse(stored);
          } catch (e) {
            console.error("Failed to parse pinned categories", e);
          }
        }
      }
    },

    // WEBSOCKET: Add new notification in real-time
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Check for duplicates
      if (state.notifications.some(n => n.id === action.payload.id)) {
        return;
      }
      // Add to beginning of notifications array
      state.notifications.unshift(action.payload);
    },

    // WEBSOCKET: Sync read status
    handleWebSocketNotificationRead: (state, action: PayloadAction<{ notification_id: string }>) => {
      const notification = state.notifications.find(n => n.id === action.payload.notification_id);
      if (notification) {
        notification.is_read = true;
      }
    },

    // WEBSOCKET: Sync all read
    handleWebSocketAllNotificationsRead: (state) => {
      state.notifications.forEach(n => {
        n.is_read = true;
      });
    },

    // Mark all notifications as read
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => {
        n.is_read = true;
      });
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading.categories = true;
        state.errors.categories = null;
      })
      .addCase(togglePinCategory.fulfilled, (state, action) => {
        // SMART SYNC (Authoritative):
        // Server returns the official list of IDs.
        // If the SET of IDs matches our local state (which has the user's preferred order),
        // we keep our local order. We only overwrite if the server logic (e.g. limits) changed the set.
        if (action.payload.pinned_categories) {
          const serverSet = new Set(action.payload.pinned_categories);
          const localSet = new Set(state.pinnedCategoryIds);

          const isSameSet = serverSet.size === localSet.size &&
            action.payload.pinned_categories.every((id: string) => localSet.has(id));

          if (!isSameSet) {
            state.pinnedCategoryIds = action.payload.pinned_categories;
            if (typeof window !== "undefined") {
              localStorage.setItem("pinnedCategoryIds", JSON.stringify(state.pinnedCategoryIds));
            }
          }
          // Else: Sets match, so we keep state.pinnedCategoryIds which has the optimistic sort order.
        }
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.errors.categories = (action.payload as any)?.message || "Failed to fetch categories";
      });

    // Fetch Category Posts (ONLY on initial load)
    builder
      .addCase(fetchCategoryPosts.pending, (state) => {
        state.loading.posts = true;
        state.errors.posts = null;
      })
      .addCase(fetchCategoryPosts.fulfilled, (state, action) => {
        state.loading.posts = false;
        state.posts = action.payload;
      })
      .addCase(fetchCategoryPosts.rejected, (state, action) => {
        state.loading.posts = false;
        state.errors.posts = (action.payload as any)?.message || "Failed to fetch posts";
      });

    // Create Post - Replace temp with real
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.tempId);
        if (index !== -1) {
          state.posts[index] = action.payload;
        } else {
          // If not found (maybe not added optimistically), add it
          state.posts.unshift(action.payload);
        }
        // Cleanup request_id
        if (action.payload.request_id) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== action.payload.request_id);
        }
      })
      .addCase(createPost.pending, (state, action) => {
        // requestId is not easily accessible here without meta, let's skip for now
        // and handle it in fulfilled/rejected
      })
      .addCase(createPost.rejected, (state, action) => {
        // Remove optimistic post on failure
        const { tempId, postData, request_id } = action.meta.arg as any || {};
        const requestId = request_id || postData?.requestId;

        if (tempId) {
          // Find post to get category before removing
          const post = state.posts.find(p => p.id.toString() === tempId);
          state.posts = state.posts.filter(p => p.id.toString() !== tempId);

          if (post) {
            const category = state.categories.find(c => c.id === post.category);
            if (category) {
              category.posts_count = Math.max(0, (category.posts_count || 0) - 1);
            }
          }
        }

        // Cleanup request_id
        if (requestId) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== requestId);
        }
      });

    // Update Post
    builder
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      });

    // Delete Post
    builder
      .addCase(deletePost.fulfilled, (state, action) => {
        const { postId, request_id } = action.payload;
        // Find post to get category before removing (if it was in list)
        const post = state.posts.find(p => p.id === postId);
        state.posts = state.posts.filter(p => p.id !== postId);

        if (post) {
          const category = state.categories.find(c => c.id === post.category);
          if (category) {
            category.posts_count = Math.max(0, (category.posts_count || 0) - 1);
          }
        }

        // Cleanup request_id
        if (request_id) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== request_id);
        }
      });

    // React to Post - Sync with server response
    builder
      .addCase(reactToPost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post && action.payload) {
          // Sync with server truth
          post.reactions_count = action.payload.reactions_count || post.reactions_count;
          post.user_reactions = action.payload.user_reactions || post.user_reactions;
        }
        // Cleanup request_id
        if (action.payload.request_id) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== action.payload.request_id);
        }
      })
      .addCase(reactToPost.rejected, (state, action) => {
        // Rollback optimistic update
        const { postId, type } = action.meta.arg;
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          // Reverse the optimistic change
          const wasAdding = post.user_reactions.includes(type);
          if (wasAdding) {
            post.reactions_count[type] = Math.max(0, post.reactions_count[type] - 1);
            post.user_reactions = post.user_reactions.filter(r => r !== type);
          } else {
            post.reactions_count[type] += 1;
            post.user_reactions.push(type);
          }
        }
      });

    // Create Reply - Replace temp with real
    builder
      .addCase(createReply.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          const index = post.replies.findIndex(r => r.id.toString() === action.payload.tempId);
          if (index !== -1) {
            post.replies[index] = action.payload.reply;
          }
        }
        // Cleanup request_id
        if (action.payload.request_id) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== action.payload.request_id);
        }
      })
      .addCase(createReply.rejected, (state, action) => {
        // Remove optimistic reply on failure
        const { postId, tempId, request_id } = action.payload as any || {};
        const post = state.posts.find(p => p.id === postId);
        if (post && tempId) {
          post.replies = post.replies.filter(r => r.id.toString() !== tempId);
          post.replies_count = Math.max(0, post.replies_count - 1);
        }
        // Cleanup request_id
        if (request_id) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== request_id);
        }
      });

    // Update Reply
    builder
      .addCase(updateReply.fulfilled, (state, action) => {
        const post = state.posts.find(p =>
          p.replies.some(r => r.id === action.payload.id)
        );
        if (post) {
          const replyIndex = post.replies.findIndex(r => r.id === action.payload.id);
          if (replyIndex !== -1) {
            post.replies[replyIndex] = action.payload;
          }
        }
      });

    // Delete Reply
    builder
      .addCase(deleteReply.fulfilled, (state, action) => {
        const { postId, replyId, request_id } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.replies = post.replies.filter(r => r.id !== replyId);
          post.replies_count = Math.max(0, post.replies_count - 1);
        }

        // Cleanup request_id
        if (request_id) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== request_id);
        }
      });




    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.errors.profile = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.userProfile = action.payload;

        // Sync pinned categories from server profile
        // SMART SYNC: 
        // 1. If server is empty, keep local (assume sync lag/fresh).
        // 2. If server has data, check if it matches local set (ignoring order).
        //    If it matches, KEEP LOCAL ORDER (preserves user's manual sorting/pinning sequence).
        //    If it differs (new pins from other device), use server data.
        if (action.payload.pinned_categories && action.payload.pinned_categories.length > 0) {
          const serverSet = new Set(action.payload.pinned_categories);
          const localSet = new Set(state.pinnedCategoryIds);

          // Check if sets are equal size and content
          const isSameSet = serverSet.size === localSet.size &&
            action.payload.pinned_categories.every((id: any) => localSet.has(id as string));

          if (!isSameSet) {
            state.pinnedCategoryIds = action.payload.pinned_categories;
            if (typeof window !== "undefined") {
              localStorage.setItem("pinnedCategoryIds", JSON.stringify(state.pinnedCategoryIds));
            }
          }
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.errors.profile = (action.payload as any)?.message || "Failed to fetch profile";
      });

    // Fetch Notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading.notifications = true;
        state.errors.notifications = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading.notifications = false;
        const newNotifications = action.payload.data.results || action.payload.data;

        if (action.payload.reset) {
          // Instead of overwriting, merge to preserve notifications added via WebSocket
          // while this request was flying
          const existingIds = new Set(newNotifications.map((n: any) => n.id));
          const webSocketOnly = state.notifications.filter(n => !existingIds.has(n.id));
          state.notifications = [...webSocketOnly, ...newNotifications];
        } else {
          // Append for pagination
          const existingIds = new Set(state.notifications.map(n => n.id));
          const filtered = newNotifications.filter((n: any) => !existingIds.has(n.id));
          state.notifications.push(...filtered);
        }
        state.pagination.notifications.hasMore = !!action.payload.data.next;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading.notifications = false;
        state.errors.notifications = (action.payload as any)?.message || "Failed to fetch notifications";
      });

    // Mark Notification Read
    builder
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification) {
          notification.is_read = true;
        }
      });

    // Mark All Notifications Read
    builder
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => {
          n.is_read = true;
        });
      });

    // Toggle Pin Category
    builder.addCase(togglePinCategory.rejected, (state, action) => {
      // Rollback on failure (simplified: re-fetch profile or just undo local - let's just undo)
      const categoryId = action.meta.arg;
      if (state.pinnedCategoryIds.includes(categoryId)) {
        state.pinnedCategoryIds = state.pinnedCategoryIds.filter(id => id !== categoryId);
      } else {
        state.pinnedCategoryIds.push(categoryId);
      }
      state.errors.categories = (action.payload as any)?.message || "Cillad ayaa dhacday.";
    });

  },
});

export const {
  setSelectedCategory,
  addOptimisticPost,
  removeOptimisticPost,
  toggleReactionOptimistic,
  addOptimisticReply,
  removeOptimisticReply,
  handleWebSocketPost,
  handleWebSocketPostDeleted,
  handleWebSocketReactionUpdate,
  handleWebSocketReply,
  clearPosts,
  clearErrors,
  togglePinCategoryOptimistic,
  setPinnedCategories,
  loadPinnedCategoriesFromStorage,
  addNotification,
  handleWebSocketNotificationRead,
  handleWebSocketAllNotificationsRead,
  markAllNotificationsAsRead: markAllNotificationsAsReadAction,
} = communitySlice.actions;

export default communitySlice.reducer;

// Selectors
const selectCommunityState = (state: RootState) => state.community;

export const selectSortedCategories = createSelector(
  [selectCommunityState],
  (community) => {
    const { categories, pinnedCategoryIds } = community;
    return [...categories].sort((a, b) => {
      const aIndex = pinnedCategoryIds.indexOf(a.id);
      const bIndex = pinnedCategoryIds.indexOf(b.id);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  }
);

// Selector for unread notification count
export const selectUnreadNotificationCount = createSelector(
  [selectCommunityState],
  (community) => {
    return community.notifications.filter((n: Notification) => !n.is_read).length;
  }
);
