import { useState } from "react";
import { LinkifiedText } from "@/components/ui/linkified-text";
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
import { Send, Loader2, Trash2, Paperclip, File, X, Video, Play, Download, Film } from "lucide-react";
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
    const [videoUrl, setVideoUrl] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);

    const handleOpenProfile = (userId: string) => {
        setSelectedUserId(userId);
        setIsProfileModalOpen(true);
    };

    const handleSubmit = async () => {
        if ((!replyContent.trim() && !videoUrl.trim() && attachments.length === 0) || !userProfile) return;

        const requestId = `req_rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const tempId = `temp-${Date.now()}`;
        const optimisticReply: CommunityReply = {
            id: tempId as any,
            author: userProfile as any,
            content: replyContent,
            video_url: videoUrl || undefined,
            created_at: new Date().toISOString(),
            is_edited: false,
            request_id: requestId,
        };

        // 1. Immediately add to UI
        dispatch(addOptimisticReply({ postId, reply: optimisticReply }));

        const currentContent = replyContent;
        const currentVideoUrl = videoUrl;
        const currentAttachments = attachments;

        setReplyContent("");
        setVideoUrl("");
        setAttachments([]);
        setIsSubmitting(true);

        // 2. Send to server
        try {
            await dispatch(createReply({
                postId,
                replyData: {
                    content: currentContent,
                    video_url: currentVideoUrl || undefined,
                    attachments: currentAttachments,
                    requestId
                },
                tempId,
            })).unwrap();
        } catch (error) {
            console.error("Failed to create reply:", error);
            // On failure, we could restore the content or just let it be
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB for replies
        const validFiles: File[] = [];
        for (const file of files) {
            if (file.size > MAX_SIZE) {
                alert(`Faylka "${file.name}" aad buu u weyn yahay (Max 5MB).`);
                continue;
            }
            validFiles.push(file);
        }
        setAttachments(prev => [...prev, ...validFiles]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
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
                    <div className="flex-1">
                        <div className="flex gap-2">
                            <Textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={SOMALI_UI_TEXT.addReply}
                                className="min-h-[60px] text-sm"
                                disabled={isSubmitting}
                            />
                            <Button
                                onClick={handleSubmit}
                                disabled={(!replyContent.trim() && !videoUrl.trim() && attachments.length === 0) || isSubmitting}
                                size="icon"
                                className="h-[60px] w-12 shrink-0"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[10px]"
                                onClick={() => document.getElementById(`reply-file-${postId}`)?.click()}
                                disabled={isSubmitting}
                            >
                                <Paperclip className="h-3 w-3 mr-1 text-blue-600" />
                                Fayl
                            </Button>
                            <input
                                id={`reply-file-${postId}`}
                                type="file"
                                multiple
                                onChange={handleFileAttach}
                                className="hidden"
                            />
                            <div className="relative flex-1">
                                <Video className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Link video (YouTube...)"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-md py-1 pl-7 pr-2 text-[10px] outline-none"
                                />
                            </div>
                        </div>

                        {/* Attachments Preview */}
                        {attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-1.5 rounded-md text-[10px]">
                                        <div className="flex items-center gap-1 overflow-hidden">
                                            <File className="h-3 w-3 shrink-0 text-blue-500" />
                                            <span className="truncate">{file.name}</span>
                                        </div>
                                        <button onClick={() => removeAttachment(idx)} className="text-red-500">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                    <div className="text-xs dark:text-gray-200 whitespace-pre-wrap">
                                        <LinkifiedText text={reply.content} />
                                    </div>

                                    {/* Reply Video */}
                                    {reply.video_url && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-white/5">
                                            {reply.video_url.includes('youtube.com') || reply.video_url.includes('youtu.be') ? (
                                                <div className="relative aspect-video">
                                                    <iframe
                                                        src={reply.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                                        className="absolute inset-0 w-full h-full"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            ) : (
                                                <div className="bg-white dark:bg-black/20 p-2 flex items-center gap-2">
                                                    <Play className="h-3 w-3 text-primary" />
                                                    <a href={reply.video_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline truncate">
                                                        {reply.video_url}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Reply Attachments */}
                                    {reply.attachments && reply.attachments.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {reply.attachments.map((file) => (
                                                <div key={file.id} className="flex items-center justify-between bg-white dark:bg-black/20 p-2 rounded-lg border border-gray-200 dark:border-white/5 group">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        {file.file_type.includes('video') ? (
                                                            <Film className="h-3.5 w-3.5 text-purple-500" />
                                                        ) : (
                                                            <File className="h-3.5 w-3.5 text-blue-500" />
                                                        )}
                                                        <span className="text-[10px] font-medium truncate">{file.name}</span>
                                                    </div>
                                                    <a href={getMediaUrl(file.file, 'community_attachments')} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                                        <Download className="h-3.5 w-3.5" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
