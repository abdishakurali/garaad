"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CampusDetails as CampusDetailsType, CampusRoom, PostSummary } from '@/types/community';
import {
    Users,
    MessageCircle,
    Star,
    Clock,
    TrendingUp,
    Shield,
    Hash,
    Calendar,
    MapPin,
    Crown,
    BookOpen,
    Activity,
    BarChart3,
    AlertCircle,
    Bell,
    Heart
} from 'lucide-react';
import communityService from '@/services/community';

interface CampusDetailsProps {
    campusSlug: string;
    onJoinLeave: (slug: string) => void;
    onPostSelect?: (postId: string) => void;
    loading?: boolean;
}

export const CampusDetails: React.FC<CampusDetailsProps> = ({
    campusSlug,
    onJoinLeave,
    onPostSelect,
    loading = false
}) => {
    const [campusDetails, setCampusDetails] = useState<CampusDetailsType | null>(null);
    const [rooms, setRooms] = useState<CampusRoom[]>([]);
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCampusData = async () => {
            try {
                setDetailsLoading(true);
                setError(null);

                const [details, roomsData] = await Promise.all([
                    communityService.campus.getCampusDetails(campusSlug),
                    communityService.campus.getCampusRooms(campusSlug)
                ]);

                setCampusDetails(details);
                setRooms(roomsData);
            } catch (error: any) {
                setError('Cillad ayaa dhacday campus-ka soo rarida. Fadlan dib u day.');
                console.error('Failed to fetch campus details:', error);
            } finally {
                setDetailsLoading(false);
            }
        };

        if (campusSlug) {
            fetchCampusData();
        }
    }, [campusSlug]);

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

    if (detailsLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Waa la soo raraya campus-ka...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !campusDetails) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error || 'Campus-ka lama helin'}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Campus Header */}
            <Card
                className="overflow-hidden"
                style={{
                    borderTopColor: campusDetails.color_code,
                    borderTopWidth: '4px'
                }}
            >
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div
                                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                                style={{ backgroundColor: `${campusDetails.color_code}20` }}
                            >
                                {campusDetails.icon}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {campusDetails.name_somali}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {campusDetails.description_somali}
                                </p>
                                <div className="flex items-center space-x-3 mt-2">
                                    <Badge
                                        variant="outline"
                                        style={{
                                            borderColor: campusDetails.color_code,
                                            color: campusDetails.color_code
                                        }}
                                    >
                                        {campusDetails.subject_display_somali}
                                    </Badge>
                                    {campusDetails.user_membership.is_member && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            ✓ Xubin
                                        </Badge>
                                    )}
                                    {campusDetails.user_membership.is_moderator && (
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                            <Shield className="h-3 w-3 mr-1" />
                                            Maamule
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Button
                                variant={campusDetails.user_membership.is_member ? "outline" : "default"}
                                onClick={() => onJoinLeave(campusDetails.slug)}
                                disabled={loading}
                                className={`${campusDetails.user_membership.is_member
                                    ? 'border-red-300 text-red-600 hover:bg-red-50'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                ) : (
                                    campusDetails.user_membership.is_member ? 'Ka bax' : 'Ku biir'
                                )}
                            </Button>

                            {campusDetails.user_membership.is_member && (
                                <Button variant="outline" size="sm">
                                    <Bell className="h-4 w-4 mr-2" />
                                    Notifications
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Campus Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <div className="text-lg font-semibold">{campusDetails.member_count.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Xubnood</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <MessageCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <div className="text-lg font-semibold">{campusDetails.post_count.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Qoraal</div>
                        </div>
                        {campusDetails.user_membership.is_member && (
                            <>
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                    <div className="text-lg font-semibold">{campusDetails.user_membership.posts_count}</div>
                                    <div className="text-sm text-gray-500">Qoraallada</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                                    <div className="text-lg font-semibold">{campusDetails.user_membership.reputation_score}</div>
                                    <div className="text-sm text-gray-500">Sumcad</div>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Campus Content */}
            <Tabs defaultValue="posts" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="posts">Qoraalada Dhowaan</TabsTrigger>
                    <TabsTrigger value="rooms">Qolalka</TabsTrigger>
                    <TabsTrigger value="members">Xubnaha</TabsTrigger>
                </TabsList>

                {/* Recent Posts */}
                <TabsContent value="posts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                                Qoraalada Dhowaan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {campusDetails.recent_posts.length > 0 ? (
                                <div className="space-y-3">
                                    {campusDetails.recent_posts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                            onClick={() => onPostSelect && onPostSelect(post.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <span>Qoray {post.user}</span>
                                                        <span>•</span>
                                                        <span>{post.room}</span>
                                                        <span>•</span>
                                                        <span>{formatTimeAgo(post.created_at)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 text-sm text-gray-500">
                                                    <div className="flex items-center space-x-1">
                                                        <Heart className="h-4 w-4" />
                                                        <span>{post.likes_count}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <MessageCircle className="h-4 w-4" />
                                                        <span>{post.comments_count}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Ma jiraan qoraal
                                    </h3>
                                    <p className="text-gray-500">
                                        Campus-kan weli ma laha qoraal. Noqo kan ugu horeya!
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Campus Rooms */}
                <TabsContent value="rooms" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Hash className="h-5 w-5 mr-2 text-blue-600" />
                                Qolalka Campus-ka
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {room.name_somali}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {room.description_somali}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {room.room_type_display}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{room.member_count}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MessageCircle className="h-4 w-4" />
                                                    <span>{room.post_count}</span>
                                                </div>
                                            </div>
                                            {room.is_private && (
                                                <Badge variant="secondary" className="text-xs">
                                                    🔒 Gaar
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Campus Members */}
                <TabsContent value="members" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                                <Users className="h-5 w-5 mr-2 text-blue-600" />
                                Xubnaha Campus-ka
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Liiska xubnaha
                                </h3>
                                <p className="text-gray-500">
                                    Waxaa campus-kan ku jira {campusDetails.member_count} xubnood.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 