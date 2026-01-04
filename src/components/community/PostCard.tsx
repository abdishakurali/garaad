import React, { useState } from "react";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { LinkifiedText } from "@/components/ui/linkified-text";
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
import { getMediaUrl, cn, formatSomaliRelativeTime } from "@/lib/utils";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, Loader2, Plus, Smile, Play, File, Download, Film } from "lucide-react";
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
    initiallyShowReplies?: boolean;
    targetReplyId?: string | null;
}

export function PostCard({ post, userProfile, initiallyShowReplies = false, targetReplyId = null }: PostCardProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [showReplies, setShowReplies] = useState(initiallyShowReplies);

    // Update showReplies if prop changes
    React.useEffect(() => {
        if (initiallyShowReplies) {
            setShowReplies(true);
        }
    }, [initiallyShowReplies]);

    const [isDeleting, setIsDeleting] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Scroll to reply if it's the target
    React.useEffect(() => {
        if (showReplies && targetReplyId) {
            const element = document.getElementById(`reply-${targetReplyId}`);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
            }
        }
    }, [showReplies, targetReplyId]);

    const isOwnPost = userProfile?.id === post.author?.id;
    const isPending = post.id?.toString().startsWith("temp-") || false;

    // OPTIMISTIC: Handle reaction click
    const handleReaction = (type: ReactionType) => {
        if (!post.id) return;

        // Find if user has any OTHER reaction active
        const activeReaction = post.user_reactions.find(r => r !== type);

        // If switching reaction (e.g. was 'like', now 'fire'), remove the old one first
        const requestId = `req_react_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        if (activeReaction) {
            dispatch(toggleReactionOptimistic({ postId: post.id, type: activeReaction, isAdding: false, request_id: requestId }));
        }

        const isAdding = !post.user_reactions.includes(type);

        // 1. Immediately update UI (Toggle the clicked one)
        dispatch(toggleReactionOptimistic({ postId: post.id, type, isAdding, request_id: requestId }));

        // 2. Send to server (will sync via WebSocket)
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
        dispatch(removeOptimisticPost({ postId: post.id, request_id: requestId }));

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

    const timeAgo = formatSomaliRelativeTime(post.created_at);

    // DEBUG: Log render to verify updates
    // console.log(`[PostCard] Rendering post ${post.id}, replies: ${post.replies?.length}`);

    return (
        <div id={`post-${post.id}`} className={cn(
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

            <div className="mb-4">
                <div className="text-[15px] dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    <LinkifiedText text={post.content} />
                </div>
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

            {/* Video Support */}
            {post.video_url && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5">
                    {post.video_url.includes('youtube.com') || post.video_url.includes('youtu.be') ? (
                        <div className="relative aspect-video">
                            <iframe
                                src={post.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                className="absolute inset-0 w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-white/5 p-4 flex items-center gap-3">
                            <Play className="h-5 w-5 text-primary" />
                            <a
                                href={post.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary hover:underline truncate"
                            >
                                {post.video_url}
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* Attachments (Docs, Videos, etc.) */}
            {post.attachments && post.attachments.length > 0 && (
                <div className="mb-4 space-y-2">
                    {post.attachments.map((file) => (
                        <div key={file.id} className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                {file.file_type.includes('video') ? (
                                    <Film className="h-5 w-5 text-purple-500" />
                                ) : (
                                    <File className="h-5 w-5 text-blue-500" />
                                )}
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium truncate">{file.name}</span>
                                    <span className="text-[10px] text-gray-400 capitalize">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.file_type.split('/')[1] || 'Fayl'}
                                    </span>
                                </div>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                asChild
                            >
                                <a href={getMediaUrl(file.file, 'community_attachments')} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    ))}
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