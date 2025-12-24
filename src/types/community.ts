// User-related types
export interface User {
  id: number;
  username: string;
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

// Campus-related types
export interface Campus {
  id: number;
  name: string;
  name_somali: string;
  description: string;
  description_somali: string;
  subject_tag: string;
  subject_display_somali: string;
  icon: string;
  slug: string;
  color_code: string;
  member_count: number;
  post_count: number;
  user_is_member: boolean;
  created_at: string;
  updated_at: string;
}

export interface CampusDetails extends Campus {
  user_membership: {
    is_member: boolean;
    is_moderator: boolean;
    joined_at: string;
    posts_count: number;
    reputation_score: number;
  };
  recent_posts: PostSummary[];
}

export interface CampusRoom {
  id: number;
  uuid: string;
  name: string;
  name_somali: string;
  description_somali: string;
  room_type: "general" | "qa" | "announcements" | "projects";
  room_type_display: string;
  member_count: number;
  post_count: number;
  is_private: boolean;
  category: string | null; // UUID of the category
  min_badge_level?: "dhalinyaro" | "dhexe" | "sare" | "weyne" | "hogaamiye";
  is_locked: boolean;
  campus: {
    id: number;
    name_somali: string;
    slug: string;
  };
}

export type GroupedRooms = Record<string, CampusRoom[]>;

// Post-related types
export interface PostSummary {
  id: string;
  title: string;
  user: string;
  room: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  user: User;
  room: {
    id: number;
    name_somali: string;
    campus: {
      id: number;
      name_somali: string;
      color_code: string;
      slug: string;
    };
  };
  language: "so" | "en";
  language_display: string;
  post_type: "question" | "discussion" | "announcement" | "poll";
  post_type_display: string;
  image?: string;
  video_url?: string;
  is_pinned: boolean;
  is_featured: boolean;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  user_has_liked: boolean;
  tags?: string[];
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  count: number;
  user_has_reacted?: boolean;
}

export interface PostDetails extends Post {
  comments: Comment[];
}

export interface CreatePostData {
  title: string;
  content: string;
  room_id: number;
  language: "so" | "en";
  post_type: "question" | "discussion" | "announcement" | "poll";
  image?: File | null;
  video_url?: string;
}

// Comment-related types
export interface Comment {
  id: string;
  content: string;
  user: User;
  post_id: string;
  parent_comment_id?: string;
  language: "so" | "en";
  language_display: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user_has_liked: boolean;
  replies_count: number;
  replies?: Comment[];
  reactions?: MessageReaction[];
}

export interface CreateCommentData {
  content: string;
  post_id: string;
  parent_comment_id?: string;
  language: "so" | "en";
}

// Notification-related types
export interface Notification {
  id: number;
  sender?: User;
  notification_type:
  | "post_like"
  | "comment_like"
  | "post_comment"
  | "comment_reply"
  | "mention"
  | "new_campus_member";
  notification_type_display: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  post_title?: string;
  post_id?: string;
  comment_id?: string;
  campus_name?: string;
  campus_slug?: string;
}

// User Profile & Gamification types
export interface UserProfile {
  user: User;
  community_points: number;
  badge_level: "dhalinyaro" | "dhexe" | "sare" | "weyne" | "hogaamiye";
  badge_level_display: string;
  total_posts: number;
  total_comments: number;
  total_likes_received: number;
  total_likes_given: number;
  preferred_language: "so" | "en";
  email_notifications: boolean;
  mention_notifications: boolean;
  joined_campuses_count: number;
  streak_days: number;
  level: number;
  xp_to_next_level: number;
  level_progress_percentage: number;
  last_activity: string;
}

export interface LeaderboardEntry {
  user: User;
  community_points: number;
  badge_level: string;
  badge_level_display: string;
  total_posts: number;
  total_comments: number;
  level: number;
  rank: number;
  position?: number;
}

// Badge and Achievement types
export interface Badge {
  level: "dhalinyaro" | "dhexe" | "sare" | "weyne" | "hogaamiye";
  display_name: string;
  emoji: string;
  color: string;
  points_required: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points_reward: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
}

// Search and Filter types
export interface SearchFilters {
  subject_tag?: string;
  search?: string;
  post_type?: string;
  language?: "so" | "en";
  campus?: string;
  room?: number;
  page?: number;
}

export interface SearchResult {
  type: "post" | "campus" | "user";
  id: string | number;
  title: string;
  description: string;
  relevance_score: number;
  created_at?: string;
}

export interface TrendingTag {
  tag: string;
  count: number;
  type: "seasonal" | "subject" | "event" | "general";
  trend_direction: "up" | "down" | "stable";
}

// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

export interface ApiErrorResponse {
  type:
  | "validation"
  | "auth"
  | "permission"
  | "notFound"
  | "server"
  | "unknown";
  message: string;
  errors?: Record<string, string[]>;
}

// WebSocket message types
export interface WebSocketMessage {
  type:
  | "new_post"
  | "new_comment"
  | "like_update"
  | "notification"
  | "user_online"
  | "user_offline";
  data: any;
  timestamp: string;
}

export interface PostLikeUpdate {
  post_id: string;
  likes_count: number;
  user_has_liked: boolean;
}

export interface CommentLikeUpdate {
  comment_id: string;
  likes_count: number;
  user_has_liked: boolean;
}

// Analytics types (for admin/moderator views)
export interface CampusAnalytics {
  campus_id: number;
  period: "day" | "week" | "month";
  total_posts: number;
  total_comments: number;
  total_likes: number;
  active_users: number;
  new_members: number;
  engagement_rate: number;
  top_contributors: User[];
  popular_posts: PostSummary[];
}

export interface UserEngagement {
  period: "day" | "week" | "month";
  total_active_users: number;
  posts_created: number;
  comments_created: number;
  likes_given: number;
  average_session_duration: number;
  retention_rate: number;
}

// Form validation types
export interface PostFormData {
  title: string;
  content: string;
  room_id: number | null;
  language: "so" | "en";
  post_type: "question" | "discussion" | "announcement" | "poll";
  image?: File | null;
  video_url?: string;
}

export interface PostFormErrors {
  title?: string;
  content?: string;
  room_id?: string;
  image?: string;
  video_url?: string;
  general?: string;
}

export interface CommentFormData {
  content: string;
  language: "so" | "en";
}

export interface CommentFormErrors {
  content?: string;
  general?: string;
}

// UI State types
export interface CommunityState {
  // Data
  campuses: Campus[];
  posts: Post[];
  rooms: CampusRoom[];
  groupedRooms: GroupedRooms | null;
  messages: Post[];
  selectedCampus: Campus | null;
  selectedRoom: CampusRoom | null;
  selectedPost: PostDetails | null;
  userProfile: UserProfile | null;
  notifications: Notification[];
  leaderboard: LeaderboardEntry[];
  trendingTags: TrendingTag[];

  // UI State
  loading: {
    campuses: boolean;
    rooms: boolean;
    posts: boolean;
    messages: boolean;
    profile: boolean;
    notifications: boolean;
  };

  errors: {
    campuses: string | null;
    rooms: string | null;
    posts: string | null;
    messages: string | null;
    profile: string | null;
    notifications: string | null;
  };

  // Filters and pagination
  filters: SearchFilters;
  pagination: {
    posts: {
      page: number;
      hasMore: boolean;
    };
    notifications: {
      page: number;
      hasMore: boolean;
    };
  };

  // Real-time updates
  unreadNotifications: number;
  onlineUsers: string[];
}

// Hook return types
export interface UseCampusesResult {
  campuses: Campus[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

export interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  refetch: () => void;
}

// Utility types
export type SortOrder = "newest" | "oldest" | "most_liked" | "most_commented";

export type ContentLanguage = "so" | "en" | "both";

export type UserRole = "student" | "moderator" | "admin";

export type CampusSubject =
  | "math"
  | "physics"
  | "chemistry"
  | "biology"
  | "programming"
  | "language"
  | "general";

// Constants
export const BADGE_LEVELS: Record<string, Badge> = {
  dhalinyaro: {
    level: "dhalinyaro",
    display_name: "Garaad Dhalinyaro",
    emoji: "🌱",
    color: "#22C55E",
    points_required: 0,
    description: "Bilaabayaasha cusub",
  },
  dhexe: {
    level: "dhexe",
    display_name: "Garaad Dhexe",
    emoji: "⭐",
    color: "#3B82F6",
    points_required: 500,
    description: "Xubnaha firfircoon",
  },
  sare: {
    level: "sare",
    display_name: "Garaad Sare",
    emoji: "🏆",
    color: "#F59E0B",
    points_required: 1500,
    description: "Khubarada waxbarashada",
  },
  weyne: {
    level: "weyne",
    display_name: "Garaad Weyne",
    emoji: "💎",
    color: "#8B5CF6",
    points_required: 5000,
    description: "Hogaamiyaasha bulshada",
  },
  hogaamiye: {
    level: "hogaamiye",
    display_name: "Garaad Hogaamiye",
    emoji: "👑",
    color: "#EF4444",
    points_required: 15000,
    description: "Ugu heerka sarreeya",
  },
};

export const NOTIFICATION_ICONS: Record<string, string> = {
  post_like: "Jeclasho Qoraal",
  comment_like: "Jeclasho Faallo",
  post_comment: "Faallo Cusub",
  comment_reply: "Jawaab Faallo",
  mention: "Lagugu xusay",
  new_campus_member: "Xubin Cusub",
};

export const SOMALI_UI_TEXT = {
  // Navigation
  campuses: "Campusyada",
  posts: "Qoraallada",
  notifications: "Ogeysiisyada",
  profile: "Profile-ka",
  leaderboard: "Tartanka",
  unreads: "Aan la akhrin",
  history: "Taariikhda",
  search: "Raadi...",

  // Actions
  join: "Ku biir",
  leave: "Ka bax",
  like: "Jeclaasho",
  comment: "Ka faallee",
  share: "La wadaag",
  create: "Samee",
  edit: "Wax ka beddel",
  delete: "Tirtir",
  reply: "U jawaab",

  // Status
  member: "Xubin",
  moderator: "Maamule",
  online: "Jooga",
  offline: "Ma joogo",
  loading: "Waa la soo rarayaa...",
  noPosts: "Ma jiraan qoraallo",
  firstPost: "Noqo qofka ugu horreeya ee halkan wax ku qora!",

  // Time
  now: "hadda",
  minute: "daqiiqad",
  hour: "saacad",
  day: "maalin",
  week: "usbuuc",
  month: "bilood",
  today: "Maanta",
  yesterday: "Shalay",

  // Content types
  question: "Su'aal",
  discussion: "Dood",
  announcement: "Ogeysiis",
  poll: "Codbixin",

  // Errors
  networkError: "Cillad ayaa ka dhacday shabakada. Fadlan dib u day.",
  authError: "Waa inaad galato si aad u isticmaasho.",
  permissionError: "Ma lehe ogolaansho inaad tan samayso.",
  notFoundError: "Wixii aad raadinaysay lama helin.",
  validationError: "Macluumaadka waxay ku jiraan qalad.",

  // Success messages
  postCreated: "Qoraalka waa la sameeyay si guul leh!",
  commentAdded: "Faallada waa la dhigay!",
  campusJoined: "Si guul leh ayaad ugu biirtay campus-ka!",
  campusLeft: "Waa ka baxday campus-ka.",
  notificationRead: "Ogeysiiska waa la akhriyay.",
};
