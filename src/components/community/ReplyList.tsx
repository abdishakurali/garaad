import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
    CommunityReply,
    UserProfile,
    SOMALI_UI_TEXT,
    getUserDisplayName,
} from "@/types/community";
import {
    createReply,
    addOptimisticReply,
    deleteReply,
    removeOptimisticReply,
} from "@/store/features/communitySlice";
import { getMediaUrl, formatSomaliRelativeTime } from "@/lib/utils";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserProfileModal } from "./UserProfileModal";

interface ReplyListProps {
    postId: string;
    replies: CommunityReply[];
    userProfile: UserProfile | null;
}

export function ReplyList({ postId, replies, userProfile }: ReplyListProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleOpenProfile = (userId: string) => {
        setSelectedUserId(userId);
        setIsProfileModalOpen(true);
    };

    // OPTIMISTIC: Handle reply submission
    const handleSubmit = async () => {
        if (!replyContent.trim() || !userProfile) return;

        const requestId = `req_rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const tempId = `temp-${Date.now()}`;
        const optimisticReply: CommunityReply = {
            id: tempId as any,
            author: userProfile as any,
            content: replyContent,
            created_at: new Date().toISOString(),
            is_edited: false,
            request_id: requestId,
        };

        // 1. Immediately add to UI
        dispatch(addOptimisticReply({ postId, reply: optimisticReply }));
        setReplyContent("");
        setIsSubmitting(true);

        // 2. Send to server
        try {
            await dispatch(createReply({
                postId,
                replyData: { content: replyContent, requestId },
                tempId,
            })).unwrap();
        } catch (error) {
            console.error("Failed to create reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (replyId: string) => {
        if (!confirm("Ma hubtaa inaad tirtirto jawaabtan?")) return;

        const requestId = `req_del_rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // 1. Instantly remove from UI for better UX
        dispatch(removeOptimisticReply({ postId, tempId: replyId, request_id: requestId }));

        // 2. Sync with server in background
        try {
            await dispatch(deleteReply({ postId, replyId, requestId })).unwrap();
        } catch (error) {
            console.error("Failed to delete reply:", error);
        }
    };

    return (
        <div className="space-y-3">
            {/* Reply Input */}
            {userProfile && (
                <div className="flex gap-2">
                    <AuthenticatedAvatar
                        src={getMediaUrl(userProfile.profile_picture, 'profile_pics')}
                        alt={getUserDisplayName(userProfile)}
                        size="sm"
                        fallback={userProfile.first_name?.[0] || userProfile.username[0]}
                    />
                    <div className="flex-1 flex gap-2">
                        <Textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={SOMALI_UI_TEXT.addReply}
                            className="min-h-[60px] text-sm"
                            disabled={isSubmitting}
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={!replyContent.trim() || isSubmitting}
                            size="icon"
                            className="h-[60px] w-12"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {/* Replies List */}
            {replies.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">
                    {SOMALI_UI_TEXT.noReplies}
                </p>
            ) : (
                <div className="space-y-3">
                    {replies.map((reply) => {
                        const isPending = reply.id?.toString().startsWith("temp-") || false;
                        const isOwnReply = userProfile?.id === reply.author?.id;
                        const timeAgo = formatSomaliRelativeTime(reply.created_at);

                        return (
                            <div
                                key={reply.id}
                                id={`reply-${reply.id}`}
                                className={`flex gap-2 ${isPending ? 'opacity-60' : ''}`}
                            >
                                <div
                                    className="cursor-pointer transition-transform hover:scale-105"
                                    onClick={() => reply.author?.id && handleOpenProfile(reply.author.id)}
                                >
                                    <AuthenticatedAvatar
                                        src={getMediaUrl(reply.author?.profile_picture, 'profile_pics')}
                                        alt={getUserDisplayName(reply.author)}
                                        size="sm"
                                        fallback={reply.author?.first_name?.[0] || reply.author?.username?.[0] || "?"}
                                    />
                                </div>
                                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="font-bold text-xs text-primary cursor-pointer hover:underline transition-all"
                                            onClick={() => reply.author?.id && handleOpenProfile(reply.author.id)}
                                        >
                                            {getUserDisplayName(reply.author)}
                                        </span>
                                        <span className="text-xs text-gray-500">{timeAgo}</span>
                                        {reply.is_edited && (
                                            <span className="text-xs text-gray-400 italic">
                                                ({SOMALI_UI_TEXT.edited})
                                            </span>
                                        )}
                                        {isPending && (
                                            <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                                        )}
                                        {isOwnReply && !isPending && (
                                            <button
                                                onClick={() => handleDelete(reply.id)}
                                                className="ml-auto text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/10"
                                                title={SOMALI_UI_TEXT.delete}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs dark:text-gray-200 whitespace-pre-wrap">
                                        {reply.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <UserProfileModal
                userId={selectedUserId}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
}
