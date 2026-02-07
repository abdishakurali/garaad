import { create } from 'zustand';
import {
    CommunityCategory,
    CommunityPost,
    CommunityReply,
    Notification,
    UserProfile,
    ReactionType
} from '@/types/community';
import communityService from '@/services/community';

interface CommunityStore {
    selectedCategory: CommunityCategory | null;
    posts: CommunityPost[];
    userProfile: UserProfile | null;
    notifications: Notification[];
    pinnedCategoryIds: string[];
    loading: {
        categories: boolean;
        posts: boolean;
        refreshingPosts: boolean;
        profile: boolean;
        notifications: boolean;
    };
    errors: {
        categories: string | null;
        posts: string | null;
        profile: string | null;
        notifications: string | null;
    };

    setSelectedCategory: (category: CommunityCategory | null) => void;
    setPosts: (posts: CommunityPost[]) => void;
    setUserProfile: (profile: UserProfile | null) => void;
    setNotifications: (notifications: Notification[]) => void;
    setPinnedCategoryIds: (ids: string[]) => void;
    setLoading: (key: keyof CommunityStore['loading'], value: boolean) => void;
    setError: (key: keyof CommunityStore['errors'], value: string | null) => void;

    togglePinCategory: (categoryId: string) => void;
    addPost: (post: CommunityPost) => void;
    removePost: (postId: string) => void;
    updatePost: (post: CommunityPost) => void;
    toggleReaction: (postId: string, type: ReactionType, isAdding: boolean) => void;

    addReply: (postId: string, reply: CommunityReply) => void;
    removeReply: (postId: string, replyId: string) => void;
    updateReply: (postId: string, reply: CommunityReply) => void;
    toggleReplyReaction: (postId: string, replyId: string, type: ReactionType, isAdding: boolean) => void;

    // Real-time WebSocket helpers
    handleWebSocketPost: (post: CommunityPost) => void;
    handleWebSocketPostDeleted: (postId: string) => void;
    handleWebSocketReactionUpdate: (postId: string, reactions: Record<string, number>) => void;
    handleWebSocketReply: (postId: string, reply: CommunityReply, count?: number) => void;
    handleWebSocketReplyDeleted: (postId: string, replyId: string, count?: number) => void;
    handleWebSocketNotification: (notification: Notification) => void;
    handleWebSocketNotificationRead: (notificationId: string) => void;
    handleWebSocketAllNotificationsRead: () => void;
    handleWebSocketReplyReactionUpdate: (postId: string, replyId: string, reactions: Record<string, number>) => void;

    // Notification actions
    markNotificationRead: (notificationId: string) => void;
    markAllNotificationsRead: () => void;

    // Async actions
    fetchPublicPosts: (page?: number) => Promise<void>;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
    selectedCategory: null,
    posts: [],
    userProfile: null,
    notifications: [],
    pinnedCategoryIds: typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('pinnedCategoryIds') || '[]')
        : [],
    loading: {
        categories: false,
        posts: false,
        refreshingPosts: false,
        profile: false,
        notifications: false,
    },
    errors: {
        categories: null,
        posts: null,
        profile: null,
        notifications: null,
    },

    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    setPosts: (posts) => set({ posts }),
    setUserProfile: (userProfile) => set({ userProfile }),
    setNotifications: (notifications) => set({ notifications }),
    setPinnedCategoryIds: (pinnedCategoryIds) => {
        set({ pinnedCategoryIds });
        localStorage.setItem('pinnedCategoryIds', JSON.stringify(pinnedCategoryIds));
    },
    setLoading: (key, value) => set((state) => ({
        loading: { ...state.loading, [key]: value }
    })),
    setError: (key, value) => set((state) => ({
        errors: { ...state.errors, [key]: value }
    })),

    togglePinCategory: (categoryId) => set((state) => {
        const isPinned = state.pinnedCategoryIds.includes(categoryId);
        const newIds = isPinned
            ? state.pinnedCategoryIds.filter(id => id !== categoryId)
            : [...state.pinnedCategoryIds, categoryId];

        localStorage.setItem('pinnedCategoryIds', JSON.stringify(newIds));
        return { pinnedCategoryIds: newIds };
    }),

    addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
    removePost: (postId) => set((state) => ({
        posts: state.posts.filter(p => p.id !== postId)
    })),
    updatePost: (updatedPost) => set((state) => ({
        posts: state.posts.map(p => p.id === updatedPost.id ? updatedPost : p)
    })),
    toggleReaction: (postId, type, isAdding) => set((state) => ({
        posts: state.posts.map(p => {
            if (p.id !== postId) return p;

            const newReactions = { ...p.reactions_count };
            newReactions[type] = (newReactions[type] || 0) + (isAdding ? 1 : -1);
            if (newReactions[type] < 0) newReactions[type] = 0;

            const newUserReactions = isAdding
                ? [...p.user_reactions.filter(r => r !== type), type]
                : p.user_reactions.filter(r => r !== type);

            return {
                ...p,
                reactions_count: newReactions,
                user_reactions: newUserReactions as ReactionType[]
            };
        })
    })),

    addReply: (postId, reply) => set((state) => ({
        posts: state.posts.map(p => p.id === postId
            ? { ...p, replies: [reply, ...(p.replies || [])], replies_count: (p.replies_count || 0) + 1 }
            : p)
    })),

    removeReply: (postId, replyId) => set((state) => ({
        posts: state.posts.map(p => p.id === postId
            ? { ...p, replies: (p.replies || []).filter(r => r.id !== replyId), replies_count: Math.max(0, (p.replies_count || 0) - 1) }
            : p)
    })),

    updateReply: (postId, updatedReply) => set((state) => ({
        posts: state.posts.map(p => p.id === postId
            ? { ...p, replies: (p.replies || []).map(r => r.id === updatedReply.id ? updatedReply : r) }
            : p)
    })),

    toggleReplyReaction: (postId, replyId, type, isAdding) => set((state) => ({
        posts: state.posts.map(p => {
            if (p.id !== postId) return p;

            return {
                ...p,
                replies: (p.replies || []).map(r => {
                    if (r.id !== replyId) return r;

                    const newReactions = { ...r.reactions_count };
                    newReactions[type] = (newReactions[type] || 0) + (isAdding ? 1 : -1);
                    if (newReactions[type] < 0) newReactions[type] = 0;

                    const newUserReactions = isAdding
                        ? [...(r.user_reactions || []).filter((re: string) => re !== type), type]
                        : (r.user_reactions || []).filter((re: string) => re !== type);

                    return {
                        ...r,
                        reactions_count: newReactions,
                        user_reactions: newUserReactions
                    };
                })
            };
        })
    })),

    handleWebSocketPost: (post) => set((state) => {
        // Check by ID or request_id to replace optimistic posts
        const existingIndex = state.posts.findIndex(p =>
            p.id === post.id || (post.request_id && p.request_id === post.request_id)
        );

        if (existingIndex !== -1) {
            const newPosts = [...state.posts];
            newPosts[existingIndex] = { ...newPosts[existingIndex], ...post };
            return { posts: newPosts };
        }
        return { posts: [post, ...state.posts] };
    }),

    handleWebSocketPostDeleted: (postId) => set((state) => ({
        posts: state.posts.filter(p => p.id !== postId)
    })),

    handleWebSocketReactionUpdate: (postId, reactions) => set((state) => ({
        posts: state.posts.map(p => p.id === postId ? { ...p, reactions_count: reactions } : p)
    })),

    handleWebSocketReply: (postId, reply, count) => set((state) => ({
        posts: state.posts.map(p => {
            if (p.id !== postId) return p;
            const replies = [...(p.replies || [])];
            // Check by ID or request_id to replace optimistic replies
            const existingIndex = replies.findIndex(r =>
                r.id === reply.id || (reply.request_id && r.request_id === reply.request_id)
            );

            if (existingIndex !== -1) {
                replies[existingIndex] = { ...replies[existingIndex], ...reply };
            } else {
                replies.unshift(reply);
            }
            return {
                ...p,
                replies,
                replies_count: count !== undefined ? count : (p.replies_count || 0) + (existingIndex === -1 ? 1 : 0)
            };
        })
    })),

    handleWebSocketReplyDeleted: (postId, replyId, count) => set((state) => ({
        posts: state.posts.map(p => {
            if (p.id !== postId) return p;
            return {
                ...p,
                replies: (p.replies || []).filter(r => r.id !== replyId),
                replies_count: count !== undefined ? count : Math.max(0, (p.replies_count || 0) - 1)
            };
        })
    })),

    handleWebSocketNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
    })),

    handleWebSocketNotificationRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, is_read: true } : n
        )
    })),

    handleWebSocketAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, is_read: true }))
    })),

    handleWebSocketReplyReactionUpdate: (postId, replyId, reactions) => set((state) => ({
        posts: state.posts.map(p => {
            if (p.id !== postId) return p;
            return {
                ...p,
                replies: (p.replies || []).map(r =>
                    r.id === replyId ? { ...r, reactions_count: reactions } : r
                )
            };
        })
    })),

    markNotificationRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, is_read: true } : n
        )
    })),

    markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, is_read: true }))
    })),

    fetchPublicPosts: async (page) => {
        set((state) => ({
            loading: { ...state.loading, posts: true },
            errors: { ...state.errors, posts: null }
        }));
        try {
            const data = await communityService.post.getPublicPosts(page);
            set((state) => ({
                posts: (data as any).results || data,
                loading: { ...state.loading, posts: false }
            }));
        } catch (error: any) {
            set((state) => ({
                loading: { ...state.loading, posts: false },
                errors: { ...state.errors, posts: error?.message || 'Failed to fetch public posts' }
            }));
        }
    },
}));
