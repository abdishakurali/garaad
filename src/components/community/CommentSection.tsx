"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Comment, CreateCommentData } from '@/types/community';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import {
    Heart,
    Reply,
    MessageCircle,
    Send,
    ChevronDown,
    ChevronUp,
    MoreHorizontal,
    Flag,
    Edit,
    Trash2,
    Clock
} from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';

interface CommentSectionProps {
    comments: Comment[];
    postId: string;
    onAddComment: (commentData: CreateCommentData) => Promise<void>;
    onLikeComment: (commentId: string) => Promise<void>;
    onEditComment?: (commentId: string, content: string) => Promise<void>;
    onDeleteComment?: (commentId: string) => Promise<void>;
    onReportComment?: (commentId: string) => Promise<void>;
    currentUserId?: number;
    loading?: boolean;
    maxDepth?: number;
}

interface CommentItemProps {
    comment: Comment;
    postId: string;
    depth: number;
    maxDepth: number;
    onAddReply: (commentData: CreateCommentData) => Promise<void>;
    onLike: (commentId: string) => Promise<void>;
    onEdit?: (commentId: string, content: string) => Promise<void>;
    onDelete?: (commentId: string) => Promise<void>;
    onReport?: (commentId: string) => Promise<void>;
    currentUserId?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    postId,
    depth,
    maxDepth,
    onAddReply,
    onLike,
    onEdit,
    onDelete,
    onReport,
    currentUserId
}) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(depth < 2);
    const [submittingReply, setSubmittingReply] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'hadda';
        if (diffInMinutes < 60) return `${diffInMinutes} daqiiqad kahor`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} SAACood kahor`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} maalin kahor`;

        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths} bilood kahor`;
    };

    const handleReplySubmit = async () => {
        if (!replyText.trim() || submittingReply) return;

        try {
            setSubmittingReply(true);
            await onAddReply({
                content: replyText,
                post_id: postId,
                parent_comment_id: comment.id,
                language: 'so'
            });
            setReplyText('');
            setShowReplyInput(false);
            setShowReplies(true);
        } catch (error) {
            console.error('Failed to submit reply:', error);
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleEdit = async () => {
        if (!editText.trim() || !onEdit) return;

        try {
            await onEdit(comment.id, editText);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to edit comment:', error);
            setEditText(comment.content); // Reset on error
        }
    };

    const isOwnComment = currentUserId === comment.user.id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const canReply = depth < maxDepth;

    return (
        <div className={`${depth > 0 ? 'ml-8 border-l border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
            <div className="flex space-x-3">
                <div className="flex items-start space-x-3">
                    <AuthenticatedAvatar
                        src={getMediaUrl(comment.user.profile_picture, 'profile_pics')}
                        alt={comment.user.username}
                        fallback={comment.user.username[0].toUpperCase()}
                        size="md"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Comment Header */}
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                            {comment.user.username}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.created_at)}
                        </span>
                        {comment.language_display === 'English' && (
                            <Badge variant="outline" className="text-xs">EN</Badge>
                        )}
                    </div>

                    {/* Comment Content */}
                    <div className="mb-2">
                        {isEditing ? (
                            <div className="space-y-2">
                                <Textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="min-h-[60px] text-sm"
                                />
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditText(comment.content);
                                        }}
                                    >
                                        Jooji
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleEdit}
                                        disabled={!editText.trim()}
                                    >
                                        Kaydi
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Comment Actions */}
                    {!isEditing && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <button
                                onClick={() => onLike(comment.id)}
                                className={`flex items-center space-x-1 hover:text-red-600 transition-colors ${comment.user_has_liked ? 'text-red-600' : ''
                                    }`}
                            >
                                <Heart className={`h-3 w-3 ${comment.user_has_liked ? 'fill-current' : ''}`} />
                                <span>{comment.likes_count}</span>
                            </button>

                            {canReply && (
                                <button
                                    onClick={() => setShowReplyInput(!showReplyInput)}
                                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                                >
                                    <Reply className="h-3 w-3" />
                                    <span>Ku jawaab</span>
                                </button>
                            )}

                            {isOwnComment && onEdit && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                                >
                                    <Edit className="h-3 w-3" />
                                    <span>Wax ka beddel</span>
                                </button>
                            )}

                            {isOwnComment && onDelete && (
                                <button
                                    onClick={() => onDelete(comment.id)}
                                    className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    <span>Tirtir</span>
                                </button>
                            )}

                            {!isOwnComment && onReport && (
                                <button
                                    onClick={() => onReport(comment.id)}
                                    className="flex items-center space-x-1 hover:text-yellow-600 transition-colors"
                                >
                                    <Flag className="h-3 w-3" />
                                    <span>Soo sheeg</span>
                                </button>
                            )}

                            <button className="hover:text-gray-700 transition-colors">
                                <MoreHorizontal className="h-3 w-3" />
                            </button>
                        </div>
                    )}

                    {/* Reply Input */}
                    {showReplyInput && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex space-x-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="bg-gray-400 text-white text-xs">
                                        {currentUserId ? 'U' : '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Textarea
                                        placeholder="Qor jawaabta..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="min-h-[60px] text-sm resize-none"
                                    />
                                    <div className="flex justify-end space-x-2 mt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setShowReplyInput(false);
                                                setReplyText('');
                                            }}
                                        >
                                            Jooji
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleReplySubmit}
                                            disabled={!replyText.trim() || submittingReply}
                                        >
                                            {submittingReply ? (
                                                <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin mr-1"></div>
                                            ) : (
                                                <Send className="h-3 w-3 mr-1" />
                                            )}
                                            Soo dir
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show/Hide Replies Button */}
                    {hasReplies && (
                        <div className="mt-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                            >
                                {showReplies ? (
                                    <ChevronUp className="h-4 w-4 mr-1" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                )}
                                {comment.replies_count} jawaab
                            </Button>
                        </div>
                    )}

                    {/* Nested Replies */}
                    {showReplies && hasReplies && (
                        <div className="mt-4 space-y-4">
                            {comment.replies?.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    postId={postId}
                                    depth={depth + 1}
                                    maxDepth={maxDepth}
                                    onAddReply={onAddReply}
                                    onLike={onLike}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onReport={onReport}
                                    currentUserId={currentUserId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const CommentSection: React.FC<CommentSectionProps> = ({
    comments,
    postId,
    onAddComment,
    onLikeComment,
    onEditComment,
    onDeleteComment,
    onReportComment,
    currentUserId,
    loading = false,
    maxDepth = 3
}) => {
    const [newCommentText, setNewCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);

    const handleCommentSubmit = async () => {
        if (!newCommentText.trim() || submittingComment) return;

        try {
            setSubmittingComment(true);
            await onAddComment({
                content: newCommentText,
                post_id: postId,
                language: 'so'
            });
            setNewCommentText('');
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const displayedComments = showAllComments ? comments : comments.slice(0, 5);
    const hasMoreComments = comments.length > 5;

    return (
        <div className="space-y-4">
            {/* Comment Input */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {currentUserId ? 'U' : '?'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <Textarea
                            placeholder="Qor faallada..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="min-h-[80px] resize-none"
                            disabled={loading}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">
                                {newCommentText.length}/500 xaraf
                            </p>
                            <Button
                                onClick={handleCommentSubmit}
                                disabled={!newCommentText.trim() || submittingComment || loading}
                                size="sm"
                            >
                                {submittingComment ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                                        Waa la diraya...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Ka faallee
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
                <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5 text-gray-600" />
                        <h3 className="font-medium text-gray-900 dark:text-white">
                            {comments.length} faallooyinka
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {displayedComments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={postId}
                                depth={0}
                                maxDepth={maxDepth}
                                onAddReply={onAddComment}
                                onLike={onLikeComment}
                                onEdit={onEditComment}
                                onDelete={onDeleteComment}
                                onReport={onReportComment}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>

                    {/* Load More Comments */}
                    {hasMoreComments && !showAllComments && (
                        <div className="text-center">
                            <Button
                                variant="outline"
                                onClick={() => setShowAllComments(true)}
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                                Arag {comments.length - 5} faallooyinko kale
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Ma jiraan faallooyin
                    </h3>
                    <p className="text-gray-500">
                        Noqo kan ugu horeya oo ka faallooda qoraalkan.
                    </p>
                </div>
            )}
        </div>
    );
}; 