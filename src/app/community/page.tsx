"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
    AlertCircle,
    Users,
    MessageSquare,
    Heart,
    Share2,
    Plus,
    TrendingUp,
    Trophy,
    Bell,
    Home,
    Search,
    Bookmark,
    User,
    Settings,
    MoreHorizontal
} from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import {
    fetchCampuses,
    fetchPosts,
    fetchUserProfile,
    fetchNotifications,
    fetchTrendingTags,
    fetchLeaderboard,
    createPost,
    togglePostLike,
    joinCampus,
    leaveCampus
} from '@/store/features/communitySlice';
import { SOMALI_UI_TEXT } from '@/types/community';
import { CommunityWebSocket } from '@/services/community';
import { getMediaUrl } from '@/lib/utils';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';

export default function CommunityPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        campuses,
        posts,
        userProfile,
        leaderboard,
        loading
    } = useSelector((state: RootState) => state.community);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Local state
    const [wsConnection, setWsConnection] = useState<CommunityWebSocket | null>(null);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [postForm, setPostForm] = useState({
        title: '',
        content: '',
        room_id: 1,
        language: 'so' as 'so' | 'en',
        post_type: 'discussion' as 'question' | 'discussion' | 'announcement' | 'poll'
    });

    // Initialize data and WebSocket connection
    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const initializeData = async () => {
            try {
                console.log('Starting to fetch community data...');

                const results = await Promise.all([
                    dispatch(fetchCampuses({})),
                    dispatch(fetchPosts({ reset: true })),
                    dispatch(fetchUserProfile()),
                    dispatch(fetchNotifications({ reset: true })),
                    dispatch(fetchTrendingTags("week")),
                    dispatch(fetchLeaderboard())
                ]);

                console.log('Community data fetched successfully:', results);

                const ws = new CommunityWebSocket();
                ws.connect((data) => {
                    console.log('WebSocket message received:', data);
                });
                setWsConnection(ws);
            } catch (error) {
                console.error('Failed to initialize community data:', error);
            }
        };

        initializeData();

        return () => {
            if (wsConnection) {
                wsConnection.disconnect();
            }
        };
    }, [dispatch, isAuthenticated]);

    const handleCreatePost = async () => {
        try {
            await dispatch(createPost(postForm));
            setShowCreatePost(false);
            setPostForm({
                title: '',
                content: '',
                room_id: 1,
                language: 'so',
                post_type: 'discussion'
            });
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const handleCampusAction = async (slug: string, action: 'join' | 'leave') => {
        try {
            if (action === 'join') {
                await dispatch(joinCampus(slug));
            } else {
                await dispatch(leaveCampus(slug));
            }
        } catch (error) {
            console.error(`Failed to ${action} campus:`, error);
        }
    };

    if (isAuthenticated && (loading.campuses || loading.posts || loading.profile)) {
        return (
            <div className="min-h-screen bg-white dark:bg-black">
                <Header />
                <div className="flex items-center justify-center pt-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">{SOMALI_UI_TEXT.loading}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white dark:bg-black">
                <Header />
                <div className="flex items-center justify-center pt-20">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Waa inaad galato si aad u isticmaasho adeeggan</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Header />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-0">
                    {/* Left Sidebar - Navigation */}
                    <div className="col-span-3 border-r border-gray-200 dark:border-gray-800 min-h-screen">
                        <div className="sticky top-0 p-4">
                            {/* Navigation Menu */}
                            <nav className="space-y-2 mb-8">
                                <Button variant="ghost" className="w-full justify-start text-lg font-semibold">
                                    <Home className="h-6 w-6 mr-3" />
                                    Guriga
                                </Button>
                                <Button variant="ghost" className="w-full justify-start">
                                    <Search className="h-5 w-5 mr-3" />
                                    Raadi
                                </Button>
                                <Button variant="ghost" className="w-full justify-start">
                                    <Bell className="h-5 w-5 mr-3" />
                                    Ogeysiisyada
                                </Button>
                                <Button variant="ghost" className="w-full justify-start">
                                    <Bookmark className="h-5 w-5 mr-3" />
                                    Kaydinta
                                </Button>
                                <Button variant="ghost" className="w-full justify-start">
                                    <User className="h-5 w-5 mr-3" />
                                    Profile-ka
                                </Button>
                                <Button variant="ghost" className="w-full justify-start">
                                    <Settings className="h-5 w-5 mr-3" />
                                    Habaynta
                                </Button>
                            </nav>

                            {/* Create Post Button */}
                            <Button
                                onClick={() => setShowCreatePost(true)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 text-lg font-semibold mb-6"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Qoraal cusub
                            </Button>

                            {/* User Profile */}
                            {userProfile && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <AuthenticatedAvatar
                                            src={getMediaUrl(userProfile.user.profile_picture, 'profile_pics')}
                                            alt={`${userProfile.user.first_name} ${userProfile.user.last_name}`}
                                            fallback={`${userProfile.user.first_name?.[0] || ''}${userProfile.user.last_name?.[0] || ''}`}
                                            size="lg"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{userProfile.user.first_name} {userProfile.user.last_name}</h3>
                                            <p className="text-sm text-gray-500">{userProfile.badge_level_display}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Xisaabta</p>
                                            <p className="font-semibold">{userProfile.community_points}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Qoraallada</p>
                                            <p className="font-semibold">{userProfile.total_posts}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content - Feed */}
                    <div className="col-span-6 border-r border-gray-200 dark:border-gray-800">
                        {/* Feed Header */}
                        <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4">
                            <h1 className="text-xl font-bold">Bulshada Garaad</h1>
                            <p className="text-sm text-gray-500">Ku biir kooxaha waxbarashada</p>
                        </div>

                        {/* Posts Feed */}
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {posts && posts.length > 0 ? posts.map((post) => (
                                <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                    <div className="flex space-x-3">
                                        <AuthenticatedAvatar
                                            src={getMediaUrl(post.user.profile_picture, 'profile_pics')}
                                            alt={`${post.user.first_name} ${post.user.last_name}`}
                                            fallback={`${post.user.first_name?.[0] || ''}${post.user.last_name?.[0] || ''}`}
                                            size="md"
                                        />

                                        <div className="flex-1 min-w-0">
                                            {/* Post Header */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold">{post.user.first_name} {post.user.last_name}</span>
                                                    <span className="text-gray-500">•</span>
                                                    <span className="text-gray-500 text-sm">2h</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {post.post_type_display}
                                                    </Badge>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Post Content */}
                                            <div className="mb-3">
                                                <h3 className="font-semibold mb-2">{post.title}</h3>
                                                <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                                            </div>

                                            {/* Post Media */}
                                            {post.image && (
                                                <div className="mb-3">
                                                    <img
                                                        src={post.image}
                                                        alt="Post image"
                                                        className="w-full rounded-xl object-cover max-h-96"
                                                    />
                                                </div>
                                            )}

                                            {/* Post Actions */}
                                            <div className="flex items-center justify-between text-gray-500">
                                                <div className="flex items-center space-x-8">
                                                    <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                                                        <MessageSquare className="h-5 w-5" />
                                                        <span className="text-sm">{post.comments_count}</span>
                                                    </button>
                                                    <button
                                                        className="flex items-center space-x-2 hover:text-green-500 transition-colors"
                                                        onClick={() => dispatch(togglePostLike(post.id))}
                                                    >
                                                        <Heart className={`h-5 w-5 ${post.user_has_liked ? 'fill-red-500 text-red-500' : ''}`} />
                                                        <span className="text-sm">{post.likes_count}</span>
                                                    </button>
                                                    <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                                                        <Share2 className="h-5 w-5" />
                                                        <span className="text-sm">La wadaag</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">Wali ma jiraan qoraallo</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Trending & Communities */}
                    <div className="col-span-3 p-4">
                        <div className="sticky top-0 space-y-6">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Raadi bulshada..."
                                    className="pl-10 bg-gray-100 dark:bg-gray-800 border-0 rounded-full"
                                />
                            </div>

                            {/* Trending Topics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Waxyaabaha caanka ah
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500">#Xisaabta</p>
                                            <p className="font-semibold">1,234 qoraal</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500">#Joometri</p>
                                            <p className="font-semibold">567 qoraal</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500">#Programming</p>
                                            <p className="font-semibold">890 qoraal</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Communities */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Kooxaha
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {campuses && campuses.length > 0 ? campuses.slice(0, 5).map((campus) => (
                                            <div key={campus.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: campus.color_code }}
                                                    />
                                                    <div>
                                                        <h3 className="font-medium text-sm">{campus.name_somali}</h3>
                                                        <p className="text-xs text-gray-500">{campus.member_count} xubno</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant={campus.user_is_member ? "outline" : "default"}
                                                    onClick={() => handleCampusAction(campus.slug, campus.user_is_member ? 'leave' : 'join')}
                                                >
                                                    {campus.user_is_member ? "Ka bax" : "Ku biir"}
                                                </Button>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center">
                                                <p className="text-gray-500 dark:text-gray-400">Wali ma jiraan kooxo</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Leaderboard */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5" />
                                        Horyaal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {leaderboard && leaderboard.length > 0 ? leaderboard.slice(0, 5).map((entry, index) => (
                                            <div key={entry.user.id} className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                                                    {index + 1}
                                                </div>
                                                <AuthenticatedAvatar
                                                    src={getMediaUrl(entry.user.profile_picture, 'profile_pics')}
                                                    alt={`${entry.user.first_name} ${entry.user.last_name}`}
                                                    fallback={`${entry.user.first_name?.[0] || ''}${entry.user.last_name?.[0] || ''}`}
                                                    size="sm"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{entry.user.first_name} {entry.user.last_name}</p>
                                                    <p className="text-xs text-gray-500">{entry.community_points} xisaabta</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-4 text-center">
                                                <p className="text-gray-500 dark:text-gray-400">Wali ma jiraan horyaal</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Post Dialog */}
            <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Qoraal cusub</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Cinwaanka</Label>
                            <Input
                                id="title"
                                value={postForm.title}
                                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                placeholder="Geli cinwaanka qoraalka"
                            />
                        </div>
                        <div>
                            <Label htmlFor="content">Qoraalka</Label>
                            <Textarea
                                id="content"
                                value={postForm.content}
                                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                                placeholder="Maxaad ka fikireysaa?"
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="language">Luuqadda</Label>
                                <Select
                                    value={postForm.language}
                                    onValueChange={(value: 'so' | 'en') => setPostForm({ ...postForm, language: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="so">Soomaali</SelectItem>
                                        <SelectItem value="en">English</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="post_type">Nooca qoraalka</Label>
                                <Select
                                    value={postForm.post_type}
                                    onValueChange={(value: 'question' | 'discussion' | 'announcement' | 'poll') => setPostForm({ ...postForm, post_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="question">Su'aal</SelectItem>
                                        <SelectItem value="discussion">Dood</SelectItem>
                                        <SelectItem value="announcement">Ogeysiis</SelectItem>
                                        <SelectItem value="poll">Codbixin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                                Jooji
                            </Button>
                            <Button onClick={handleCreatePost}>
                                Samee qoraal
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 