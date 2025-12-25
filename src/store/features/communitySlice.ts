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
      const result = await communityService.post.createPost(categoryId, postData);
      return { ...result, tempId };
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
  async (postId: string, { rejectWithValue }) => {
    try {
      await communityService.post.deletePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// React to a post (optimistic handled in reducer)
export const reactToPost = createAsyncThunk(
  "community/reactToPost",
  async (
    { postId, type }: { postId: string; type: ReactionType },
    { rejectWithValue }
  ) => {
    try {
      return await communityService.post.reactToPost(postId, type);
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
      const reply = await communityService.reply.createReply(postId, replyData);
      return { postId, reply, tempId };
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
    { postId, replyId }: { postId: string; replyId: string },
    { rejectWithValue }
  ) => {
    try {
      await communityService.reply.deleteReply(replyId);
      return { postId, replyId };
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
    },

    // OPTIMISTIC: Remove failed post
    removeOptimisticPost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id.toString() !== action.payload);
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

    // WEBSOCKET: Handle incoming post
    handleWebSocketPost: (state, action: PayloadAction<CommunityPost>) => {
      // Only add if not already in list (avoid duplicates)
      const exists = state.posts.find(p => p.id === action.payload.id);
      if (!exists) {
        state.posts.unshift(action.payload);
      }
    },

    // WEBSOCKET: Handle post deletion
    handleWebSocketPostDeleted: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
    },

    // WEBSOCKET: Handle reaction update
    handleWebSocketReactionUpdate: (state, action: PayloadAction<{ post_id: string; reactions_count: any; user_reactions?: ReactionType[] }>) => {
      const post = state.posts.find(p => p.id === action.payload.post_id);
      if (post) {
        post.reactions_count = action.payload.reactions_count;
        if (action.payload.user_reactions) {
          post.user_reactions = action.payload.user_reactions;
        }
      }
    },

    // WEBSOCKET: Handle new reply
    handleWebSocketReply: (state, action: PayloadAction<{ postId: string; reply: CommunityReply }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        // Only add if not already in list
        const exists = post.replies.find(r => r.id === action.payload.reply.id);
        if (!exists) {
          post.replies.push(action.payload.reply);
          post.replies_count += 1;
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
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading.categories = true;
        state.errors.categories = null;
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
        const index = state.posts.findIndex(p => p.id.toString() === action.payload.tempId);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        // Remove optimistic post on failure
        const tempId = (action.payload as any)?.tempId;
        if (tempId) {
          state.posts = state.posts.filter(p => p.id.toString() !== tempId);
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
        state.posts = state.posts.filter(p => p.id !== action.payload);
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
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.replies = post.replies.filter(r => r.id !== action.payload.replyId);
          post.replies_count = Math.max(0, post.replies_count - 1);
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
} = communitySlice.actions;

export default communitySlice.reducer;
