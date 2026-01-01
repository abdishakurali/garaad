import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
    CommunityPost,
    UserProfile,
    ReactionType,
    REACTION_ICONS,
    SOMALI_UI_TEXT,
} from "@/types/community";
import {
    reactToPost,
    toggleReactionOptimistic,
    deletePost,
    removeOptimisticPost,
} from "@/store/features/communitySlice";
import { getMediaUrl, cn } from "@/lib/utils";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, Loader2 } from "lucide-react";
import { ReplyList } from "./ReplyList";
import { formatDistanceToNow } from "date-fns";
import { UserProfileModal } from "./UserProfileModal";

interface PostCardProps {
    post: CommunityPost;
    userProfile: UserProfile | null;
}

export function PostCard({ post, userProfile }: PostCardProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [showReplies, setShowReplies] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const isOwnPost = userProfile?.id === post.author?.id;
    const isPending = post.id?.toString().startsWith("temp-") || false;

    // OPTIMISTIC: Handle reaction click
    const handleReaction = (type: ReactionType) => {
        if (!post.id) return;
        const isAdding = !post.user_reactions?.includes(type);

        // 1. Immediately update UI
        dispatch(toggleReactionOptimistic({ postId: post.id, type, isAdding }));

        // 2. Send to server (will sync via WebSocket)
        dispatch(reactToPost({ postId: post.id, type }));
    };

    const handleDelete = async () => {
        if (!post.id) return;
        if (!confirm("Ma hubtaa inaad tirtirto qoraalkan?")) return;

        // 1. Instantly remove from UI for better UX
        dispatch(removeOptimisticPost(post.id));

        // 2. Sync with server in background
        try {
            await dispatch(deletePost(post.id)).unwrap();
        } catch (error) {
            console.error("Failed to delete post:", error);
            // On failure, the user might see it again on refresh, 
            // but we don't want to block the UI now.
        }
    };

    const timeAgo = post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : SOMALI_UI_TEXT.now;

    return (
        <div className={cn(
            "bg-white dark:bg-[#1E1F22] rounded-2xl border border-gray-100 dark:border-white/5 p-5 transition-all shadow-sm hover:shadow-md",
            isPending && "opacity-60",
            isDeleting && "opacity-40 pointer-events-none"
        )}>
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                <div
                    className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    onClick={() => setIsProfileModalOpen(true)}
                >
                    <AuthenticatedAvatar
                        src={getMediaUrl(post.author?.profile_picture, 'profile_pics')}
                        alt={post.author?.first_name || post.author?.username || "User"}
                        size="md"
                        fallback={post.author?.first_name?.[0] || post.author?.username?.[0] || "?"}
                        className="ring-2 ring-gray-50 dark:ring-white/5 ring-offset-2 dark:ring-offset-black"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                        <span
                            className="font-bold text-sm dark:text-white cursor-pointer hover:text-primary transition-colors leading-tight"
                            onClick={() => setIsProfileModalOpen(true)}
                        >
                            {post.author?.first_name || post.author?.username || "User"}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                                {timeAgo}
                            </span>
                            {post.is_edited && (
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    • {SOMALI_UI_TEXT.edited}
                                </span>
                            )}
                            {isPending && (
                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                            )}
                        </div>
                    </div>
                </div>
                {isOwnPost && !isPending && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors rounded-full"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title={SOMALI_UI_TEXT.delete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className="text-[15px] dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </p>
            </div>

            {/* Images */}
            {post.images && post.images.length > 0 && (
                <div className={cn(
                    "mb-4 grid gap-3 overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5",
                    post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                )}>
                    {post.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-video group cursor-zoom-in">
                            <img
                                src={img}
                                alt="Post image"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Reactions & Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 p-1 bg-gray-50/50 dark:bg-white/5 rounded-full">
                    {(['like', 'fire', 'insight'] as ReactionType[]).map((type) => {
                        const count = post.reactions_count[type] || 0;
                        const isActive = post.user_reactions.includes(type);

                        return (
                            <button
                                key={type}
                                onClick={() => handleReaction(type)}
                                disabled={isPending}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                                    isActive
                                        ? "bg-white dark:bg-[#2B2D31] text-primary shadow-sm scale-105"
                                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                <span className="text-sm">{REACTION_ICONS[type]}</span>
                                {count > 0 && <span>{count}</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Reply Toggle */}
                <button
                    onClick={() => setShowReplies(!showReplies)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ml-auto outline-none",
                        showReplies
                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                            : "bg-gray-50/50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                    )}
                >
                    <MessageSquare className={cn("h-4 w-4", showReplies ? "fill-current" : "")} />
                    <span>{post.replies_count} {SOMALI_UI_TEXT.posts_count_label || 'Jawaab'}</span>
                </button>
            </div>

            {/* Replies */}
            {showReplies && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                    <ReplyList
                        postId={post.id}
                        replies={post.replies}
                        userProfile={userProfile}
                    />
                </div>
            )}

            <UserProfileModal
                userId={post.author?.id || null}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
}