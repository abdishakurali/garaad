import React, { useState, useMemo } from "react";
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
    updatePost
} from "@/store/features/communitySlice";
import { getMediaUrl, cn, formatSomaliRelativeTime } from "@/lib/utils";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, Loader2, Plus, Smile, Play, Globe, Share2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ReplyList } from "./ReplyList";
import { AttachmentDisplay } from "./AttachmentDisplay";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { UserProfileModal } from "./UserProfileModal";
import { SharePostModal } from "./SharePostModal";

interface PostCardProps {
    post: CommunityPost;
    userProfile: UserProfile | null;
    initiallyShowReplies?: boolean;
    targetReplyId?: string | null;
    isReadOnly?: boolean;
}

export function PostCard({ post, userProfile, initiallyShowReplies = false, targetReplyId = null, isReadOnly = false }: PostCardProps) {
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
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [editPublic, setEditPublic] = useState(post.is_public);

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
        if (!post.id || isReadOnly) return;

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

    const handleEditClick = () => {
        setIsEditing(true);
        setEditContent(post.content || "");
        setEditPublic(post.is_public);
    };

    const handleUpdatePost = async () => {
        if (!editContent.trim()) return;
        try {
            await dispatch(updatePost({ postId: post.id, content: editContent, is_public: editPublic })).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update post:", error);
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
                            {post.is_public && (
                                <span className="flex items-center gap-1 text-[10px] text-blue-500 font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-md">
                                    <Globe className="h-2.5 w-2.5" />
                                    Dadweynaha
                                </span>
                            )}
                            {isPending && (
                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                            )}
                        </div>
                    </div>
                </div>
                {isOwnPost && !isPending && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-gray-400 hover:text-primary transition-colors rounded-full text-[10px] font-bold"
                            onClick={handleEditClick}
                            disabled={isDeleting}
                        >
                            BEDEL
                        </Button>
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
                    </div>
                )}
            </div>

            <div className="mb-4">
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-4 text-sm bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none min-h-[120px] resize-none"
                            autoFocus
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                                <Globe className={cn("h-3.5 w-3.5", editPublic ? "text-blue-500" : "text-gray-400")} />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Kaga dhig mid dadka u furan</span>
                                <Switch
                                    checked={editPublic}
                                    onCheckedChange={setEditPublic}
                                    className="scale-75"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-500 underline text-xs"
                                >
                                    Ka noqo
                                </Button>
                                <Button
                                    onClick={handleUpdatePost}
                                    disabled={!editContent.trim() || (editContent === post.content && editPublic === post.is_public)}
                                    className="bg-primary text-white rounded-lg px-6 h-9 text-xs font-bold"
                                >
                                    Kaydi
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-[15px] dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                        <LinkifiedText text={post.content} />
                    </div>
                )}
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

            {/* File Attachments */}
            {post.attachments && post.attachments.length > 0 && (
                <AttachmentDisplay attachments={post.attachments} />
            )}

            {/* Reactions & Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-gray-100 dark:border-white/5 mt-2">
                <div className="flex items-center gap-1 p-1 bg-gray-50/50 dark:bg-white/5 rounded-full">
                    {/* Reaction Bar / Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                disabled={isPending || isReadOnly}
                                className={cn(
                                    "flex items-center justify-center h-9 px-3 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-white/10 outline-none gap-2",
                                    post.user_reactions.length > 0 ? "text-primary font-bold" : "text-gray-500",
                                    isReadOnly && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {post.user_reactions.length > 0 ? (
                                    <>
                                        <span className="text-lg">{REACTION_ICONS[post.user_reactions[0] as ReactionType] || post.user_reactions[0]}</span>
                                        <span className="text-xs capitalize">{post.user_reactions[0]}</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        <span className="text-xs">{SOMALI_UI_TEXT.react || "React"}</span>
                                    </>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        {!isReadOnly && (
                            <DropdownMenuContent align="start" className="flex items-center gap-1 p-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                {(Object.entries(REACTION_ICONS) as [ReactionType, string][]).map(([type, icon]) => (
                                    <DropdownMenuItem
                                        key={type}
                                        onClick={() => handleReaction(type)}
                                        className="p-1.5 h-10 w-10 flex items-center justify-center text-2xl cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-transform hover:scale-125 focus:bg-gray-100 dark:focus:bg-white/10 outline-none"
                                        title={type}
                                    >
                                        {icon}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        )}
                    </DropdownMenu>

                    {/* Quick Counts Summary (Facebook style) */}
                    <div className="flex items-center -space-x-1.5 ml-1">
                        {Object.entries(post.reactions_count)
                            .filter(([_, count]) => count > 0)
                            .sort(([_, a], [__, b]) => b - a)
                            .slice(0, 3)
                            .map(([type]) => (
                                <div key={type} className="w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 flex items-center justify-center text-[11px] shadow-sm z-10">
                                    {REACTION_ICONS[type as ReactionType] || type}
                                </div>
                            ))
                        }
                    </div>
                    {Object.values(post.reactions_count).reduce((a, b) => (a as number) + (b as number), 0) > 0 && (
                        <span className="text-xs text-muted-foreground ml-1.5 font-medium">
                            {Object.values(post.reactions_count).reduce((a, b) => (a as number) + (b as number), 0)}
                        </span>
                    )}
                </div>

                {/* Reply Toggle */}
                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50/50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all outline-none text-xs font-bold"
                        title={SOMALI_UI_TEXT.share}
                    >
                        <Share2 className="h-4 w-4" />
                        <span>{SOMALI_UI_TEXT.share}</span>
                    </button>

                    <button
                        onClick={() => !isReadOnly && setShowReplies(!showReplies)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all outline-none",
                            showReplies
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "bg-gray-50/50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10",
                            isReadOnly && "opacity-75 cursor-default"
                        )}
                    >
                        <MessageSquare className={cn("h-4 w-4", showReplies ? "fill-current" : "")} />
                        <span>{post.replies_count} {SOMALI_UI_TEXT.posts_count_label}</span>
                    </button>
                </div>
            </div>

            {/* Replies */}
            {showReplies && !isReadOnly && (
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

            <SharePostModal
                post={post}
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />
        </div>
    );
}