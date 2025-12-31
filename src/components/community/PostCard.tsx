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
} from "@/store/features/communitySlice";
import { getMediaUrl, cn } from "@/lib/utils";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, MoreHorizontal, Loader2, Heart, Flame, Lightbulb } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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

    const isOwnPost = userProfile?.user?.id === post.author?.id;
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

        setIsDeleting(true);
        try {
            await dispatch(deletePost(post.id)).unwrap();
        } catch (error) {
            console.error("Failed to delete post:", error);
            setIsDeleting(false);
        }
    };

    const timeAgo = post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : SOMALI_UI_TEXT.now;

    return (
        <div className={cn(
            "bg-white dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-[#1E1F22] p-4 transition-opacity",
            isPending && "opacity-60",
            isDeleting && "opacity-40 pointer-events-none"
        )}>
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setIsProfileModalOpen(true)}
                >
                    <AuthenticatedAvatar
                        src={getMediaUrl(post.author?.profile_picture, 'profile_pics')}
                        alt={post.author?.first_name || post.author?.username || "User"}
                        size="md"
                        fallback={post.author?.first_name?.[0] || post.author?.username?.[0] || "?"}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span
                            className="font-bold text-sm dark:text-white cursor-pointer hover:text-primary transition-colors"
                            onClick={() => setIsProfileModalOpen(true)}
                        >
                            {post.author?.first_name || post.author?.username || "User"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {timeAgo}
                        </span>
                        {post.is_edited && (
                            <span className="text-xs text-gray-400 italic">
                                ({SOMALI_UI_TEXT.edited})
                            </span>
                        )}
                        {isPending && (
                            <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                        )}
                    </div>
                </div>
                {isOwnPost && !isPending && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="mb-3">
                <p className="text-sm dark:text-gray-200 whitespace-pre-wrap">
                    {post.content}
                </p>
            </div>

            {/* Images */}
            {post.images && post.images.length > 0 && (
                <div className={cn(
                    "mb-3 grid gap-2",
                    post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                )}>
                    {post.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-video lg:aspect-auto">
                            <img
                                src={img}
                                alt="Post image"
                                className="rounded-xl w-full h-full object-cover border border-gray-100 dark:border-white/5"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Reactions */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            disabled={isPending}
                            className={cn(
                                "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                                post.user_reactions.length > 0
                                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                        >
                            {post.user_reactions.includes('fire') ? <Flame className="h-4 w-4 fill-orange-500 text-orange-500" /> :
                                post.user_reactions.includes('insight') ? <Lightbulb className="h-4 w-4 fill-yellow-500 text-yellow-500" /> :
                                    post.user_reactions.includes('like') ? <Heart className="h-4 w-4 fill-red-500 text-red-500" /> :
                                        <Heart className="h-4 w-4" />}

                            <span>
                                {Object.values(post.reactions_count).reduce((a, b) => a + b, 0) > 0
                                    ? Object.values(post.reactions_count).reduce((a, b) => a + b, 0)
                                    : "Like"}
                            </span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1.5 flex gap-1 rounded-full border-none shadow-xl bg-white dark:bg-[#1E1F22]" side="top">
                        {(['like', 'fire', 'insight'] as ReactionType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => handleReaction(type)}
                                className={cn(
                                    "p-2 rounded-full transition-transform hover:scale-125 hover:bg-gray-100 dark:hover:bg-white/10",
                                    post.user_reactions.includes(type) && "bg-primary/10"
                                )}
                            >
                                <span className="text-xl">{REACTION_ICONS[type]}</span>
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>

                {/* Reply Toggle */}
                <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 rounded-full text-[10px] sm:text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ml-auto"
                >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{post.replies_count}</span>
                </button>
            </div>

            {/* Replies */}
            {showReplies && (
                <ReplyList
                    postId={post.id}
                    replies={post.replies}
                    userProfile={userProfile}
                />
            )}

            <UserProfileModal
                userId={post.author?.id || null}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
}