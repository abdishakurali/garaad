import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Campus,
  CampusRoom,
  Post,
  PostDetails,
  Comment,
  Notification,
  UserProfile,
  LeaderboardEntry,
  TrendingTag,
  CommunityState,
  SearchFilters,
  PaginatedResponse,
  CreatePostData,
  CreateCommentData,
} from "@/types/community";
import communityService, { handleApiError } from "@/services/community";

// Initial state
const initialState: CommunityState = {
  // Data
  campuses: [],
  rooms: [],
  groupedRooms: null,
  posts: [],
  messages: [],
  selectedCampus: null,
  selectedRoom: null,
  selectedPost: null,
  userProfile: null,
  notifications: [],
  leaderboard: [],
  trendingTags: [],

  // UI State
  loading: {
    campuses: false,
    rooms: false,
    posts: false,
    messages: false,
    profile: false,
    notifications: false,
  },

  errors: {
    campuses: null,
    rooms: null,
    posts: null,
    messages: null,
    profile: null,
    notifications: null,
  },

  // Filters and pagination
  filters: {},
  pagination: {
    posts: {
      page: 1,
      hasMore: true,
    },
    notifications: {
      page: 1,
      hasMore: true,
    },
  },

  // Real-time updates
  unreadNotifications: 0,
  onlineUsers: [],
};

// Async thunks for campuses
export const fetchCampuses = createAsyncThunk(
  "community/fetchCampuses",
  async (filters: SearchFilters = {}, { rejectWithValue }) => {
    try {
      const response = await communityService.campus.getCampuses(filters);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const joinCampus = createAsyncThunk(
  "community/joinCampus",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await communityService.campus.joinCampus(slug);
      return { slug, ...response };
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const leaveCampus = createAsyncThunk(
  "community/leaveCampus",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await communityService.campus.leaveCampus(slug);
      return { slug, ...response };
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const fetchCampusDetails = createAsyncThunk(
  "community/fetchCampusDetails",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await communityService.campus.getCampusDetails(slug);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

// Async thunks for rooms
export const fetchCampusRooms = createAsyncThunk(
  "community/fetchCampusRooms",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await communityService.campus.getCampusRooms(slug, true);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

// Async thunks for messages
export const fetchRoomMessages = createAsyncThunk(
  "community/fetchRoomMessages",
  async (roomUuid: string, { rejectWithValue }) => {
    try {
      const response = await communityService.message.getMessages(roomUuid);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const sendRoomMessage = createAsyncThunk(
  "community/sendRoomMessage",
  async (
    messageData: {
      room: string;
      content: string;
      reply_to?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await communityService.message.sendMessage(messageData);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

// Async thunks for posts
export const fetchPosts = createAsyncThunk(
  "community/fetchPosts",
  async (
    {
      filters = {},
      reset = false,
    }: { filters?: SearchFilters; reset?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response: PaginatedResponse<Post> =
        await communityService.post.getPosts(filters);
      return { ...response, reset };
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const createPost = createAsyncThunk(
  "community/createPost",
  async (postData: CreatePostData, { rejectWithValue }) => {
    try {
      const response = await communityService.post.createPost(postData);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const fetchPostDetails = createAsyncThunk(
  "community/fetchPostDetails",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await communityService.post.getPostDetails(postId);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const togglePostLike = createAsyncThunk(
  "community/togglePostLike",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await communityService.post.togglePostLike(postId);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

// Async thunks for comments
export const createComment = createAsyncThunk(
  "community/createComment",
  async (commentData: CreateCommentData, { rejectWithValue }) => {
    try {
      const response = await communityService.comment.createComment(
        commentData
      );
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  "community/toggleCommentLike",
  async (commentId: string, { rejectWithValue }) => {
    try {
      const response = await communityService.comment.toggleCommentLike(
        commentId
      );
      return { commentId, ...response };
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

// Async thunks for user profile
export const fetchUserProfile = createAsyncThunk(
  "community/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await communityService.profile.getUserProfile();
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  "community/fetchLeaderboard",
  async (campusSlug: string | undefined, { rejectWithValue }) => {
    try {
      const response = await communityService.profile.getLeaderboard(
        campusSlug
      );
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

// Async thunks for notifications
export const fetchNotifications = createAsyncThunk(
  "community/fetchNotifications",
  async (
    { page, reset = false }: { page?: number; reset?: boolean } = {},
    { rejectWithValue }
  ) => {
    try {
      const response: PaginatedResponse<Notification> =
        await communityService.notification.getNotifications(page);
      return { ...response, reset };
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "community/markNotificationRead",
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await communityService.notification.markNotificationRead(
        notificationId
      );
      return { notificationId, ...response };
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "community/markAllNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await communityService.notification.markAllNotificationsRead();
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

// Async thunks for search and trending
export const fetchTrendingTags = createAsyncThunk(
  "community/fetchTrendingTags",
  async (period: "day" | "week" | "month" = "week", { rejectWithValue }) => {
    try {
      const response = await communityService.trending.getTrendingTags(period);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as any));
    }
  }
);

// Community slice
const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    // Filter actions
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },

    // UI state actions
    clearErrors: (state) => {
      state.errors = {
        campuses: null,
        rooms: null,
        posts: null,
        messages: null,
        profile: null,
        notifications: null,
      };
    },

    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },

    clearSelectedCampus: (state) => {
      state.selectedCampus = null;
    },

    setSelectedCampus: (state, action: PayloadAction<Campus>) => {
      state.selectedCampus = action.payload;
    },

    setSelectedRoom: (state, action: PayloadAction<CampusRoom>) => {
      state.selectedRoom = action.payload;
    },

    // Real-time updates
    updateOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },

    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        (user) => user !== action.payload
      );
    },

    // WebSocket updates
    handleNewPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },

    handleNewComment: (
      state,
      action: PayloadAction<{ postId: string; comment: Comment }>
    ) => {
      if (
        state.selectedPost &&
        state.selectedPost.id === action.payload.postId
      ) {
        state.selectedPost.comments.push(action.payload.comment);
        state.selectedPost.comments_count += 1;
      }

      // Update post in posts array
      const postIndex = state.posts.findIndex(
        (p) => p.id === action.payload.postId
      );
      if (postIndex !== -1) {
        state.posts[postIndex].comments_count += 1;
      }
    },

    handleLikeUpdate: (
      state,
      action: PayloadAction<{
        postId: string;
        liked: boolean;
        likesCount: number;
      }>
    ) => {
      const { postId, liked, likesCount } = action.payload;

      // Update in posts array
      const postIndex = state.posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].user_has_liked = liked;
        state.posts[postIndex].likes_count = likesCount;
      }

      // Update selected post
      if (state.selectedPost && state.selectedPost.id === postId) {
        state.selectedPost.user_has_liked = liked;
        state.selectedPost.likes_count = likesCount;
      }
    },

    handleNewNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadNotifications += 1;
    },

    handleNewMessage: (state, action: PayloadAction<any>) => {
      // If the message is for the currently selected room, add it to the messages array
      if (state.selectedRoom && (action.payload.room === state.selectedRoom.uuid || action.payload.room_id === state.selectedRoom.id)) {
        state.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // Campuses
    builder
      .addCase(fetchCampuses.pending, (state) => {
        state.loading.campuses = true;
        state.errors.campuses = null;
      })
      .addCase(fetchCampuses.fulfilled, (state, action) => {
        state.loading.campuses = false;
        state.campuses = action.payload.results || action.payload;
      })
      .addCase(fetchCampuses.rejected, (state, action) => {
        state.loading.campuses = false;
        state.errors.campuses =
          (action.payload as any)?.message || "Cillad ayaa dhacday";
      })

      .addCase(joinCampus.fulfilled, (state, action) => {
        const campusIndex = state.campuses.findIndex(
          (c) => c.slug === action.payload.slug
        );
        if (campusIndex !== -1) {
          state.campuses[campusIndex].user_is_member = true;
          state.campuses[campusIndex].member_count += 1;
        }
      })

      .addCase(leaveCampus.fulfilled, (state, action) => {
        const campusIndex = state.campuses.findIndex(
          (c) => c.slug === action.payload.slug
        );
        if (campusIndex !== -1) {
          state.campuses[campusIndex].user_is_member = false;
          state.campuses[campusIndex].member_count -= 1;
        }
      })

      .addCase(fetchCampusDetails.fulfilled, (state, action) => {
        state.selectedCampus = action.payload;
      })

      // Rooms
      .addCase(fetchCampusRooms.pending, (state) => {
        state.loading.rooms = true;
        state.errors.rooms = null;
      })
      .addCase(fetchCampusRooms.fulfilled, (state, action) => {
        state.loading.rooms = false;
        state.groupedRooms = action.payload as any;
        state.rooms = Object.values(action.payload as any).flat() as CampusRoom[];
      })
      .addCase(fetchCampusRooms.rejected, (state, action) => {
        state.loading.rooms = false;
        state.errors.rooms = (action.payload as any)?.message || "Cillad ayaa dhacday";
      })

      // Messages
      .addCase(fetchRoomMessages.pending, (state) => {
        state.loading.messages = true;
        state.errors.messages = null;
      })
      .addCase(fetchRoomMessages.fulfilled, (state, action) => {
        state.loading.messages = false;
        state.messages = action.payload.results || action.payload;
      })
      .addCase(fetchRoomMessages.rejected, (state, action) => {
        state.loading.messages = false;
        state.errors.messages = (action.payload as any)?.message || "Cillad ayaa dhacday";
      })

      .addCase(sendRoomMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });

    // Posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading.posts = true;
        state.errors.posts = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading.posts = false;
        if (action.payload.reset) {
          state.posts = action.payload.results;
          state.pagination.posts.page = 1;
        } else {
          state.posts.push(...action.payload.results);
          state.pagination.posts.page += 1;
        }
        state.pagination.posts.hasMore = !!action.payload.next;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading.posts = false;
        state.errors.posts = (action.payload as any)?.message || "Cillad ayaa dhacday";
      })

      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.selectedPost = action.payload;
      })

      .addCase(togglePostLike.fulfilled, (state, action) => {
        const { postId, liked, likes_count } = action.payload;

        // Update in posts array
        const postIndex = state.posts.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].user_has_liked = liked;
          state.posts[postIndex].likes_count = likes_count;
        }

        // Update selected post
        if (state.selectedPost && state.selectedPost.id === postId) {
          state.selectedPost.user_has_liked = liked;
          state.selectedPost.likes_count = likes_count;
        }
      });

    // Comments
    builder
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.selectedPost) {
          state.selectedPost.comments.push(action.payload);
          state.selectedPost.comments_count += 1;
        }

        // Update post comments count in posts array
        const postIndex = state.posts.findIndex(
          (p) => p.id === action.payload.post_id
        );
        if (postIndex !== -1) {
          state.posts[postIndex].comments_count += 1;
        }
      })

      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, liked, likes_count } = action.payload;

        if (state.selectedPost) {
          const updateCommentLike = (comments: Comment[]): Comment[] => {
            return comments.map((comment) => {
              if (comment.id === commentId) {
                return { ...comment, user_has_liked: liked, likes_count };
              }
              if (comment.replies) {
                return {
                  ...comment,
                  replies: updateCommentLike(comment.replies),
                };
              }
              return comment;
            });
          };

          state.selectedPost.comments = updateCommentLike(
            state.selectedPost.comments
          );
        }
      });

    // User Profile
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
        state.errors.profile = (action.payload as any)?.message || "Cillad ayaa dhacday";
      })

      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      });

    // Notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading.notifications = true;
        state.errors.notifications = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading.notifications = false;
        if (action.payload.reset) {
          state.notifications = action.payload.results;
          state.pagination.notifications.page = 1;
        } else {
          state.notifications.push(...action.payload.results);
          state.pagination.notifications.page += 1;
        }
        state.pagination.notifications.hasMore = !!action.payload.next;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading.notifications = false;
        state.errors.notifications =
          (action.payload as any)?.message || "Cillad ayaa dhacday";
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notificationIndex = state.notifications.findIndex(
          (n) => n.id === action.payload.notificationId
        );
        if (
          notificationIndex !== -1 &&
          !state.notifications[notificationIndex].is_read
        ) {
          state.notifications[notificationIndex].is_read = true;
          state.unreadNotifications = Math.max(
            0,
            state.unreadNotifications - 1
          );
        }
      })

      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          is_read: true,
        }));
        state.unreadNotifications = 0;
      });

    // Trending Tags
    builder.addCase(fetchTrendingTags.fulfilled, (state, action) => {
      state.trendingTags = action.payload;
    });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  clearErrors,
  clearSelectedPost,
  clearSelectedCampus,
  setSelectedCampus,
  setSelectedRoom,
  updateOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  handleNewPost,
  handleNewComment,
  handleLikeUpdate,
  handleNewNotification,
  handleNewMessage,
} = communitySlice.actions;

// Export reducer
export default communitySlice.reducer;
