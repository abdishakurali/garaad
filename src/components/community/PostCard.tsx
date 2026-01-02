import React, { useState } from "react";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
    CommunityPost,
    UserProfile,
    ReactionType,
    REACTION_ICONS,
    SOMALI_UI_TEXT,
    getUserDisplayName,
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
import { MessageSquare, Trash2, Loader2, Plus, Smile } from "lucide-react";
import { ReplyList } from "./ReplyList";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

        // Find if user has any OTHER reaction active
        const activeReaction = post.user_reactions.find(r => r !== type);

        // If switching reaction (e.g. was 'like', now 'fire'), remove the old one first
        if (activeReaction) {
            dispatch(toggleReactionOptimistic({ postId: post.id, type: activeReaction, isAdding: false }));
        }

        const isAdding = !post.user_reactions.includes(type);

        const requestId = `req_react_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // 1. Immediately update UI (Toggle the clicked one)
        dispatch(toggleReactionOptimistic({ postId: post.id, type, isAdding }));

        // 2. Send to server (will sync via WebSocket)
        // If switching, we technically send two requests: remove old, add new. 
        // Or backend handles 'set' logic? 
        // Current backend 'reactToPost' toggles. So if we want to switch, 
        // we might rely on backend to handle "if exists, delete, then add new"? 
        // Or we invoke it twice? 
        // Let's rely on the fact that if we click a new one, we want to toggle it on. 
        // But we MUST also toggle OFF the old one if it exists and is different.

        if (activeReaction) {
            dispatch(reactToPost({ postId: post.id, type: activeReaction, requestId })); // Toggle off old
        }
        dispatch(reactToPost({ postId: post.id, type, requestId })); // Toggle on new
    };

    const handleDelete = async () => {
        if (!post.id) return;
        if (!confirm("Ma hubtaa inaad tirtirto qoraalkan?")) return;

        const requestId = `req_del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // 1. Instantly remove from UI for better UX
        dispatch(removeOptimisticPost(post.id));

        // 2. Sync with server in background
        try {
            await dispatch(deletePost({ postId: post.id, requestId })).unwrap();
        } catch (error) {
            console.error("Failed to delete post:", error);
            // On failure, the user might see it again on refresh, 
            // but we don't want to block the UI now.
        }
    };

    const replySectionRef = React.useRef<HTMLDivElement>(null);

    // Scroll to replies when opened
    React.useEffect(() => {
        if (showReplies && replySectionRef.current) {
            replySectionRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [showReplies]);

    const formatSomaliDate = (dateString: string) => {
        if (!dateString) return SOMALI_UI_TEXT.now;
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "hadda";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiiqo ka hor`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saacadood ka hor`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} maalmood ka hor`;
        return date.toLocaleDateString('so-SO');
    };

    const timeAgo = post.created_at ? formatSomaliDate(post.created_at) : SOMALI_UI_TEXT.now;

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
                        alt={getUserDisplayName(post.author)}
                        size="md"
                        fallback={post.author?.first_name?.[0] || post.author?.username?.[0] || "?"}
                        className="ring-2 ring-gray-50 dark:ring-white/5 ring-offset-2 dark:ring-offset-black"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                        <span
                            className="font-bold text-sm text-primary cursor-pointer hover:underline transition-all leading-tight"
                            onClick={() => setIsProfileModalOpen(true)}
                        >
                            {getUserDisplayName(post.author)}
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
                    {post.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) => (
                        part.match(/^https?:\/\//)
                            ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline" onClick={(e) => e.stopPropagation()}>{part}</a>
                            : part
                    ))}
                </p>
            </div>

            {/* Images */}
            {post.images && post.images.length > 0 && (
                <div className={cn(
                    "mb-4 grid gap-3 overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5",
                    post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                )}>
                    {post.images.map((img, idx) => {
                        const imgSrc = typeof img === 'string'
                            ? img
                            : getMediaUrl(img?.image, 'community_posts');

                        if (!imgSrc || imgSrc.includes('[object Object]')) return null;

                        return (
                            <div key={idx} className="relative aspect-video group cursor-zoom-in">
                                <img
                                    src={imgSrc}
                                    alt="Sawirka qoraalka"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reactions & Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 p-1 bg-gray-50/50 dark:bg-white/5 rounded-full">
                    {/* Active Reactions Display (Counter) */}
                    {(['like', 'fire', 'insight'] as ReactionType[]).map((type) => {
                        const count = post.reactions_count[type] || 0;
                        if (count === 0) return null;
                        return (
                            <div key={type} className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-white/10 rounded-full text-xs font-bold shadow-sm">
                                <span>{REACTION_ICONS[type]}</span>
                                <span>{count}</span>
                            </div>
                        )
                    })}

                    {/* Reaction Trigger Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                disabled={isPending}
                                className={cn(
                                    "flex items-center justify-center h-8 w-8 rounded-full transition-all hover:bg-gray-200 dark:hover:bg-white/10",
                                    post.user_reactions.length > 0 ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "text-gray-400"
                                )}
                            >
                                {/* Show user's active reaction emoji if they have one, else a generic 'Add' icon */}
                                {post.user_reactions.length > 0
                                    ? <span className="text-sm">{REACTION_ICONS[post.user_reactions[0] as ReactionType] || post.user_reactions[0]}</span> /* Fallback to raw emoji if not in map */
                                    : <span className="text-lg">👍</span>
                                }
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="p-0 border-none bg-transparent shadow-none">
                            <EmojiPicker
                                onEmojiClick={(emojiData) => handleReaction(emojiData.emoji as ReactionType)}
                                theme={Theme.AUTO}
                                searchDisabled={false}
                                skinTonesDisabled
                                width={300}
                                height={400}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                    <span>{post.replies_count} {SOMALI_UI_TEXT.posts_count_label}</span>
                </button>
            </div>

            {/* Replies */}
            {showReplies && (
                <div ref={replySectionRef} className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
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