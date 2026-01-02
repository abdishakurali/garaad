import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
      // Generate a unique requestId for this action
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const result = await communityService.post.createPost(categoryId, { ...postData, requestId });
      return { ...result, tempId, requestId };
    } catch (error: any) {
      return rejectWithValue({ error: handleApiError(error), tempId });
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
      const finalRequestId = requestId || `req_del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await communityService.post.deletePost(postId, finalRequestId);
      return { postId, requestId: finalRequestId };
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
      return await communityService.post.reactToPost(postId, type, requestId);
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
      const requestId = `req_rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const reply = await communityService.reply.createReply(postId, { ...replyData, requestId });
      return { postId, reply, tempId, requestId };
    } catch (error: any) {
      return rejectWithValue({ error: handleApiError(error), postId, tempId });
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
      const finalRequestId = requestId || `req_del_rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await communityService.reply.deleteReply(replyId, finalRequestId);
      return { postId, replyId, requestId: finalRequestId };
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
    },

    // OPTIMISTIC: Remove failed post
    removeOptimisticPost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id.toString() === action.payload);
      state.posts = state.posts.filter(p => p.id.toString() !== action.payload);

      // Decrement category post count if we found the post
      if (post) {
        const category = state.categories.find(c => c.id === post.category);
        if (category) {
          category.posts_count = Math.max(0, (category.posts_count || 0) - 1);
        }
      }
    },

    // OPTIMISTIC: Toggle reaction immediately
    toggleReactionOptimistic: (state, action: PayloadAction<{ postId: string; type: ReactionType; isAdding: boolean }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        const { type, isAdding } = action.payload;

        if (isAdding) {
          post.reactions_count[type] += 1;
          if (!post.user_reactions.includes(type)) {
            post.user_reactions.push(type);
          }
        } else {
          post.reactions_count[type] = Math.max(0, post.reactions_count[type] - 1);
          post.user_reactions = post.user_reactions.filter(r => r !== type);
        }
      }
    },

    // OPTIMISTIC: Add reply immediately
    addOptimisticReply: (state, action: PayloadAction<{ postId: string; reply: CommunityReply }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.replies.push(action.payload.reply);
        post.replies_count += 1;
      }
    },

    // OPTIMISTIC: Remove failed reply
    removeOptimisticReply: (state, action: PayloadAction<{ postId: string; tempId: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.replies = post.replies.filter(r => r.id.toString() !== action.payload.tempId);
        post.replies_count = Math.max(0, post.replies_count - 1);
      }
    },

    // WEBSOCKET: Handle incoming post (Create or Update)
    handleWebSocketPost: (state, action: PayloadAction<CommunityPost & { request_id?: string }>) => {
      const { request_id, id, category } = action.payload;

      // If this client initiated the request, ignore the WebSocket echo to prevent duplication
      if (request_id && state.pendingRequestIds.includes(request_id)) {
        return;
      }

      const index = state.posts.findIndex(p => p.id === id);
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
        const index = post.replies.findIndex(r => r.id === reply.id);
        if (index !== -1) {
          post.replies[index] = reply;
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
        // Enforce 3-limit check is handled in component but good to have here too
        if (state.pinnedCategoryIds.length < 3) {
          state.pinnedCategoryIds.push(categoryId);
        }
      }
    },
    setPinnedCategories: (state, action: PayloadAction<string[]>) => {
      state.pinnedCategoryIds = action.payload;
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
            // If the sets differ (e.g. server rejected a pin due to limit, or added one), we must use server properties.
            state.pinnedCategoryIds = action.payload.pinned_categories;
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
        // Cleanup requestId
        if (action.payload.requestId) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== action.payload.requestId);
        }
      })
      .addCase(createPost.pending, (state, action) => {
        // requestId is not easily accessible here without meta, let's skip for now
        // and handle it in fulfilled/rejected
      })
      .addCase(createPost.rejected, (state, action) => {
        // Remove optimistic post on failure
        const tempId = (action.meta.arg as any)?.tempId; // Assuming tempId is in meta.arg for rejected
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
        const { postId, requestId } = action.payload;
        // Find post to get category before removing (if it was in list)
        const post = state.posts.find(p => p.id === postId);
        state.posts = state.posts.filter(p => p.id !== postId);

        if (post) {
          const category = state.categories.find(c => c.id === post.category);
          if (category) {
            category.posts_count = Math.max(0, (category.posts_count || 0) - 1);
          }
        }

        // Cleanup requestId
        if (requestId) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== requestId);
        }
      });

    // React to Post - Sync with server response
    builder
      .addCase(reactToPost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.meta.arg.postId);
        if (post && action.payload) {
          // Sync with server truth
          post.reactions_count = action.payload.reactions_count || post.reactions_count;
          post.user_reactions = action.payload.user_reactions || post.user_reactions;
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
      })
      .addCase(createReply.rejected, (state, action) => {
        // Remove optimistic reply on failure
        const { postId, tempId } = action.payload as any;
        const post = state.posts.find(p => p.id === postId);
        if (post && tempId) {
          post.replies = post.replies.filter(r => r.id.toString() !== tempId);
          post.replies_count = Math.max(0, post.replies_count - 1);
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
        const { postId, replyId, requestId } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.replies = post.replies.filter(r => r.id !== replyId);
          post.replies_count = Math.max(0, post.replies_count - 1);
        }

        // Cleanup requestId
        if (requestId) {
          state.pendingRequestIds = state.pendingRequestIds.filter(id => id !== requestId);
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
        if (action.payload.reset) {
          state.notifications = action.payload.data.results || action.payload.data;
        } else {
          state.notifications.push(...(action.payload.data.results || action.payload.data));
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
} = communitySlice.actions;

export default communitySlice.reducer;
