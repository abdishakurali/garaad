// User-related types
export interface User {
  id: string;
  username: string;
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

// Category with community features
export interface CommunityCategory {
  id: string;
  title: string;
  description: string;
  image?: string;
  in_progress: boolean;
  course_ids: string[];
  is_community_enabled: boolean;
  community_description?: string;
  posts_count: number;
}

// Reaction types have been moved to bottom to allow string type

// Attachment (Generic file, Video, etc.)
export interface CommunityAttachment {
  id: string;
  file: string;
  file_type: string;
  name: string;
  size: number;
  uploaded_at: string;
}

// Reply (one-level response to post)
export interface CommunityReply {
  id: string;
  author: User;
  content: string;
  video_url?: string;
  attachments?: CommunityAttachment[];
  created_at: string;
  is_edited: boolean;
  request_id?: string;
  reactions_count?: Record<string, number>;
  user_reactions?: string[];
}

// Post Image
export interface PostImage {
  id: string;
  image: string;
  uploaded_at: string;
}

// Post (main discussion item)
export interface CommunityPost {
  id: string;
  category: string;
  author: User;
  content: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  images: (string | PostImage)[];
  attachments?: CommunityAttachment[];
  replies: CommunityReply[];
  replies_count: number;
  reactions_count: Record<string, number>;
  user_reactions: ReactionType[];
  request_id?: string;
  is_public: boolean;
}

// Create post data
export interface CreatePostData {
  category: string;
  content: string;
  video_url?: string;
  images?: File[];
  attachments?: File[];
  requestId?: string;
  is_public?: boolean;
}

// Create reply data
export interface CreateReplyData {
  content: string;
  video_url?: string;
  attachments?: File[];
  requestId?: string;
}

// Post Creation Form Types
export interface PostFormData {
  title: string;
  content: string;
  room_id: string | null;
  language: string;
  post_type: string;
  images: File[];
  video_url: string;
  attachments: File[];
  is_public: boolean;
}

export type PostFormErrors = Partial<Record<keyof PostFormData | 'image' | 'general', string>>;

export interface CampusRoom {
  id: string;
  title: string;
  slug: string;
  description?: string;
  posts_count?: number;
}

// Helper to format user display name with "Garaad" prefix
export const getUserDisplayName = (user: { first_name?: string; last_name?: string; username: string } | null | undefined): string => {
  if (!user) return "Garaad Xubin";
  // User request: Show ONLY first name (not full name), prefixed with Garaad
  const name = user.first_name ? user.first_name : user.username;
  return `Garaad ${name.trim()}`;
};

// User Profile & Gamification types
export interface UserProfile extends User {
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

// Notification-related types
export interface Notification {
  id: string;
  sender?: User;
  notification_type:
  | "post_like"
  | "comment_like"
  | "post_comment"
  | "comment_reply"
  | "mention"
  | "new_campus_member"
  | "post_deleted"
  | "reply_deleted";
  notification_type_display: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  post_title?: string;
  post_id?: string;
  category_id?: string;
  comment_id?: string;
  campus_name?: string;
  campus_slug?: string;
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

// UI State types
export interface CommunityState {
  // Data
  categories: CommunityCategory[];
  posts: CommunityPost[];
  postsByCategory: Record<string, CommunityPost[]>; // Cache for instant switching
  selectedCategory: CommunityCategory | null;
  userProfile: UserProfile | null;
  notifications: Notification[];
  pinnedCategoryIds: string[];

  // UI State
  loading: {
    categories: boolean;
    posts: boolean;
    refreshingPosts: boolean; // Background refresh indicator
    profile: boolean;
    notifications: boolean;
  };

  errors: {
    categories: string | null;
    posts: string | null;
    profile: string | null;
    notifications: string | null;
  };

  // Pagination
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
  pendingRequestIds: string[];
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

// Basic types
export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | 'fire' | 'insight';

export const REACTION_ICONS: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  haha: "😆",
  wow: "😮",
  sad: "😢",
  angry: "😡",
  fire: "🔥",
  insight: "💡",
};

export const NOTIFICATION_ICONS: Record<string, string> = {
  post_like: "❤️",
  comment_like: "❤️",
  post_comment: "💬",
  comment_reply: "💬",
  mention: "@",
  new_campus_member: "👥",
};

export const SOMALI_UI_TEXT = {
  // Navigation
  categories: "Golayaasha",
  posts: "Fagaaraha",
  notifications: "Wixii Cusub",
  profile: "Xogtaada",
  community: "Bulshada",
  posts_count_label: "Jawaabood",

  // Actions
  create: "Abuur",
  edit: "Habayso",
  delete: "Tirtir",
  reply: "U jawaab",
  react: "Falcelis",
  share: "La wadaag",

  // Post actions
  createPost: "Abuur Qoraal",
  editPost: "Wax ka beddel",
  deletePost: "Tirtir qoraalka",

  // Reply actions
  addReply: "Ku dar jawaab",
  editReply: "Habayso jawaabta",
  deleteReply: "Tirtir jawaabta",

  // Status
  loading: "Waa la soo rarayaa...",
  noPosts: "Ma jiraan qoraallo weli",
  noReplies: "Ma jiraan jawaabo",
  firstPost: "Noqo qofka ugu horreeya ee bilow doodda!",

  // Time
  now: "hadda",
  minute: "daq",
  hour: "sacadood",
  day: "maalmood",
  week: "usbuuc",
  month: "bilood",
  today: "Maanta",
  yesterday: "Shalay",
  edited: "Waa la beddelay",

  // Errors
  networkError: "Cillad ayaa ka dhacday xiriirka. Fadlan isku day markale.",
  authError: "Fadlan soo gal si aad u sii wadato.",
  permissionError: "Uma lihid ogolaansho inaad tan samayso.",
  notFoundError: "Macluumaadkan lama helin.",
  validationError: "Fadlan hubi xogta aad gelisay.",

  // Success messages
  postCreated: "Qoraalkaaga waa la daabacay!",
  replyAdded: "Jawaabtaada waa la xareeyay!",
  postUpdated: "Isbeddeladaadi waa la keydiyay!",
  postDeleted: "Waa la tirtiray!",
  reactionAdded: "Waad ku mahadsantahay falcelintaada!",

  // Emoji & Pinning
  searchEmoji: "Raadi emoji...",
  pinned: "Lagu xiray",
  allRooms: "Dhammaan Golayaasha",
  pinRoom: "Xir qolka",
  unpinRoom: "Ka fur qolka",
  pinCategory: "Xiri qaybta",
  unpinCategory: "Ka fur qaybta",
  frequentlyUsed: "Mar walba",
  smileysPeople: "Dadka & Dareenka",
  animalsNature: "Xayawaanka & Dabeecadda",
  foodDrink: "Cuntada & Cabitaanka",
  activities: "Waxqabadka",
  travelPlaces: "Socdaalka & Meelaha",
  objects: "Alaabta",
  symbols: "Calaamadaha",
  flags: "Calanka",
  makePublic: "Ka dhig mid furan (Public)",
  publicDescription: "Qof kasta oo booqda bogga wuu arki karaa qoraalkan",
};
