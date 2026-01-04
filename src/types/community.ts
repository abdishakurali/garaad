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
}

// Create post data
export interface CreatePostData {
  category: string;
  content: string;
  video_url?: string;
  images?: File[];
  attachments?: File[];
  requestId?: string;
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
  selectedCategory: CommunityCategory | null;
  userProfile: UserProfile | null;
  notifications: Notification[];
  pinnedCategoryIds: string[];

  // UI State
  loading: {
    categories: boolean;
    posts: boolean;
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
export type ReactionType = string; // Was 'like' | 'fire' | 'insight', now any string for full emoji support

export const REACTION_ICONS: Record<string, string> = {
  like: "👍",
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
  categories: "Qaybaha",
  posts: "Qoraallada",
  notifications: "Ogeysiisyada",
  profile: "Profile-ka",
  community: "Bulshada",
  posts_count_label: "Jawaab",

  // Actions
  create: "Samee",
  edit: "Wax ka beddel",
  delete: "Tirtir",
  reply: "U jawaab",
  react: "Ka faallee",

  // Post actions
  createPost: "Qoraal Cusub",
  editPost: "Wax ka beddel qoraalka",
  deletePost: "Tirtir qoraalka",

  // Reply actions
  addReply: "Ku dar jawaab",
  editReply: "Wax ka beddel jawaabta",
  deleteReply: "Tirtir jawaabta",

  // Status
  loading: "Waa la soo rarayaa...",
  noPosts: "Ma jiraan qoraallo",
  noReplies: "Ma jiraan jawaabo",
  firstPost: "Noqo qofka ugu horreeya ee halkan wax ku qora!",

  // Time
  now: "hadda",
  minute: "daqiiqad",
  hour: "SAAC",
  day: "maalin",
  week: "usbuuc",
  month: "bilood",
  today: "Maanta",
  yesterday: "Shalay",
  edited: "Waa la beddelay",

  // Errors
  networkError: "Cillad ayaa ka dhacday shabakada. Fadlan dib u day.",
  authError: "Waa inaad galato si aad u isticmaasho.",
  permissionError: "Ma lehe ogolaansho inaad tan samayso.",
  notFoundError: "Wixii aad raadinaysay lama helin.",
  validationError: "Macluumaadka waxay ku jiraan qalad.",

  // Success messages
  postCreated: "Qoraalka waa la sameeyay si guul leh!",
  replyAdded: "Jawaabta waa la dhigay!",
  postUpdated: "Qoraalka waa la cusboonaysiiyay!",
  postDeleted: "Qoraalka waa la tirtiray!",
  reactionAdded: "Falcelinta waa la dhigay!",

  // Emoji & Pinning
  searchEmoji: "Raadi emoji...",
  pinned: "Lagu xiray",
  allRooms: "Dhammaan qolalka",
  pinRoom: "Xir qolka",
  unpinRoom: "Ka fur qolka",
  pinCategory: "Xir qaybta",
  unpinCategory: "Ka fur qaybta",
  frequentlyUsed: "Mar walba la isticmaalo",
  smileysPeople: "Dhoola cadeyn & Dad",
  animalsNature: "Xayawaan & Dabeecad",
  foodDrink: "Cunto & Cabitaan",
  activities: "Waxqabadyo",
  travelPlaces: "Socdaal & Meelo",
  objects: "Alaab",
  symbols: "Calaamado",
  flags: "Calanka",
};
