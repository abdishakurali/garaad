"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import {
    Heart,
    MessageSquare,
    Share2,
    MoreHorizontal,
    Bookmark,
    Flag,
    Edit,
    Trash2,
    Image as ImageIcon,
    Smile,
    BarChart3,
    Calendar,
    MapPin
} from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';

interface Post {
    id: string;
    title: string;
    content: string;
    image?: string;
    video_url?: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    shares_count: number;
    user_has_liked: boolean;
    user_has_bookmarked: boolean;
    post_type: string;
    post_type_display: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        username: string;
        profile_picture?: string;
    };
    room: {
        name_somali: string;
        campus: {
            name_somali: string;
            color_code: string;
        };
    };
}

interface TwitterLikePostProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
    onShare: (postId: string) => void;
    onBookmark: (postId: string) => void;
    onEdit?: (postId: string) => void;
    onDelete?: (postId: string) => void;
    onReport?: (postId: string) => void;
    currentUserId?: string;
}

export const TwitterLikePost: React.FC<TwitterLikePostProps> = ({
    post,
    onLike,
    onComment,
    onShare,
    onBookmark,
    onEdit,
    onDelete,
    onReport,
    currentUserId
}) => {
    const [isLiked, setIsLiked] = useState(post.user_has_liked);
    const [isBookmarked, setIsBookmarked] = useState(post.user_has_bookmarked);
    const [likeCount, setLikeCount] = useState(post.likes_count);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'hadda';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks}w`;

        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths}mo`;
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        onLike(post.id);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        onBookmark(post.id);
    };

    const isOwnPost = currentUserId === post.user.id;

    return (
        <article className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="p-4">
                <div className="flex space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <AuthenticatedAvatar
                            src={getMediaUrl(post.user.profile_picture, 'profile_pics')}
                            alt={`${post.user.first_name} ${post.user.last_name}`}
                            fallback={`${post.user.first_name?.[0] || ''}${post.user.last_name?.[0] || ''}`}
                            size="md"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {post.user.first_name} {post.user.last_name}
                                </span>
                                <span className="text-gray-500">@{post.user.username}</span>
                                <span className="text-gray-500">·</span>
                                <span className="text-gray-500">{formatTimeAgo(post.created_at)}</span>
                                <Badge
                                    variant="outline"
                                    className="text-xs"
                                    style={{
                                        borderColor: post.room.campus.color_code,
                                        color: post.room.campus.color_code
                                    }}
                                >
                                    {post.room.campus.name_somali}
                                </Badge>
                            </div>

                            {/* More Options */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {isOwnPost ? (
                                        <>
                                            <DropdownMenuItem onClick={() => onEdit?.(post.id)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Wax ka beddel
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDelete?.(post.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Tirtir
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem onClick={() => onReport?.(post.id)}>
                                            <Flag className="h-4 w-4 mr-2" />
                                            Sheeg
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Post Content */}
                        <div className="mb-3">
                            {post.title && (
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {post.title}
                                </h3>
                            )}
                            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                {post.content}
                            </p>
                        </div>

                        {/* Media */}
                        {post.image && (
                            <div className="mb-3">
                                <img
                                    src={post.image}
                                    alt="Post image"
                                    className="w-full rounded-2xl object-cover max-h-96"
                                />
                            </div>
                        )}

                        {post.video_url && (
                            <div className="mb-3">
                                <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
                                    <div className="aspect-video">
                                        <iframe
                                            src={post.video_url}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allowFullScreen
                                            title="Post video"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between text-gray-500">
                            <div className="flex items-center space-x-8">
                                {/* Comment */}
                                <button
                                    className="flex items-center space-x-2 hover:text-blue-500 transition-colors group"
                                    onClick={() => onComment(post.id)}
                                >
                                    <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm">{post.comments_count}</span>
                                </button>

                                {/* Like */}
                                <button
                                    className="flex items-center space-x-2 hover:text-red-500 transition-colors group"
                                    onClick={handleLike}
                                >
                                    <div className={`p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 ${isLiked ? 'bg-red-50 dark:bg-red-900/20' : ''
                                        }`}>
                                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                    </div>
                                    <span className="text-sm">{likeCount}</span>
                                </button>

                                {/* Share */}
                                <button
                                    className="flex items-center space-x-2 hover:text-green-500 transition-colors group"
                                    onClick={() => onShare(post.id)}
                                >
                                    <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                                        <Share2 className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm">{post.shares_count}</span>
                                </button>

                                {/* Bookmark */}
                                <button
                                    className="flex items-center space-x-2 hover:text-blue-500 transition-colors group"
                                    onClick={handleBookmark}
                                >
                                    <div className={`p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 ${isBookmarked ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}>
                                        <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}; 