import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RootState, AppDispatch } from '@/store/store';
import {
    fetchCampuses,
    fetchPosts,
    fetchUserProfile,
    fetchNotifications,
    fetchLeaderboard,
    togglePostLike,
    joinCampus,
    leaveCampus
} from '@/store/features/communitySlice';

export default function CommunityTest() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        campuses,
        posts,
        userProfile,
        leaderboard,
        loading,
        errors
    } = useSelector((state: RootState) => state.community);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [testResults, setTestResults] = useState<string[]>([]);

    const addTestResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testAPIEndpoints = async () => {
        setTestResults([]);
        addTestResult('Starting API tests...');

        try {
            // Test 1: Fetch campuses
            addTestResult('Testing fetchCampuses...');
            const campusesResult = await dispatch(fetchCampuses({}));
            if (fetchCampuses.fulfilled.match(campusesResult)) {
                addTestResult(`✅ Campuses fetched: ${campuses.length} campuses`);
            } else {
                addTestResult(`❌ Campuses failed: ${campusesResult.payload}`);
            }

            // Test 2: Fetch posts
            addTestResult('Testing fetchPosts...');
            const postsResult = await dispatch(fetchPosts({ reset: true }));
            if (fetchPosts.fulfilled.match(postsResult)) {
                addTestResult(`✅ Posts fetched: ${posts.length} posts`);
            } else {
                addTestResult(`❌ Posts failed: ${postsResult.payload}`);
            }

            // Test 3: Fetch user profile
            addTestResult('Testing fetchUserProfile...');
            const profileResult = await dispatch(fetchUserProfile());
            if (fetchUserProfile.fulfilled.match(profileResult)) {
                addTestResult(`✅ User profile fetched: ${userProfile?.user.first_name} ${userProfile?.user.last_name}`);
            } else {
                addTestResult(`❌ User profile failed: ${profileResult.payload}`);
            }

            // Test 4: Fetch leaderboard
            addTestResult('Testing fetchLeaderboard...');
            const leaderboardResult = await dispatch(fetchLeaderboard());
            if (fetchLeaderboard.fulfilled.match(leaderboardResult)) {
                addTestResult(`✅ Leaderboard fetched: ${leaderboard.length} entries`);
            } else {
                addTestResult(`❌ Leaderboard failed: ${leaderboardResult.payload}`);
            }

            // Test 5: Fetch notifications
            addTestResult('Testing fetchNotifications...');
            const notificationsResult = await dispatch(fetchNotifications({ reset: true }));
            if (fetchNotifications.fulfilled.match(notificationsResult)) {
                addTestResult(`✅ Notifications fetched successfully`);
            } else {
                addTestResult(`❌ Notifications failed: ${notificationsResult.payload}`);
            }

            addTestResult('🎉 All API tests completed!');

        } catch (error) {
            addTestResult(`❌ Test error: ${error}`);
        }
    };

    const testCampusActions = async () => {
        if (campuses.length === 0) {
            addTestResult('❌ No campuses available for testing');
            return;
        }

        const testCampus = campuses[0];
        addTestResult(`Testing campus actions with: ${testCampus.name_somali}`);

        try {
            // Test join campus
            const joinResult = await dispatch(joinCampus(testCampus.slug));
            if (joinCampus.fulfilled.match(joinResult)) {
                addTestResult(`✅ Joined campus: ${testCampus.name_somali}`);
            } else {
                addTestResult(`❌ Join campus failed: ${joinResult.payload}`);
            }

            // Test leave campus
            const leaveResult = await dispatch(leaveCampus(testCampus.slug));
            if (leaveCampus.fulfilled.match(leaveResult)) {
                addTestResult(`✅ Left campus: ${testCampus.name_somali}`);
            } else {
                addTestResult(`❌ Leave campus failed: ${leaveResult.payload}`);
            }

        } catch (error) {
            addTestResult(`❌ Campus action error: ${error}`);
        }
    };

    const testPostActions = async () => {
        if (posts.length === 0) {
            addTestResult('❌ No posts available for testing');
            return;
        }

        const testPost = posts[0];
        addTestResult(`Testing post actions with: ${testPost.title}`);

        try {
            // Test like/unlike post
            const likeResult = await dispatch(togglePostLike(testPost.id));
            if (togglePostLike.fulfilled.match(likeResult)) {
                addTestResult(`✅ Toggled post like: ${testPost.title}`);
            } else {
                addTestResult(`❌ Post like failed: ${likeResult.payload}`);
            }

        } catch (error) {
            addTestResult(`❌ Post action error: ${error}`);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Community API Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-500">Please log in to test the community API</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Community API Integration Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Button onClick={testAPIEndpoints} disabled={Object.values(loading).some(Boolean)}>
                            Test API Endpoints
                        </Button>
                        <Button onClick={testCampusActions} disabled={Object.values(loading).some(Boolean)}>
                            Test Campus Actions
                        </Button>
                        <Button onClick={testPostActions} disabled={Object.values(loading).some(Boolean)}>
                            Test Post Actions
                        </Button>
                    </div>

                    {/* Loading States */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-2">Loading States:</h4>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant={loading.campuses ? "default" : "secondary"}>
                                        {loading.campuses ? "Loading" : "Idle"}
                                    </Badge>
                                    <span>Campus Loading</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={loading.posts ? "default" : "secondary"}>
                                        {loading.posts ? "Loading" : "Idle"}
                                    </Badge>
                                    <span>Posts Loading</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={loading.profile ? "default" : "secondary"}>
                                        {loading.profile ? "Loading" : "Idle"}
                                    </Badge>
                                    <span>Profile Loading</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={loading.notifications ? "default" : "secondary"}>
                                        {loading.notifications ? "Loading" : "Idle"}
                                    </Badge>
                                    <span>Notifications Loading</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Data Counts:</h4>
                            <div className="space-y-1">
                                <div>Campuses: {campuses.length}</div>
                                <div>Posts: {posts.length}</div>
                                <div>Leaderboard: {leaderboard.length}</div>
                                <div>User Profile: {userProfile ? "Loaded" : "Not loaded"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Errors */}
                    {Object.values(errors).some(error => error) && (
                        <div>
                            <h4 className="font-semibold mb-2 text-red-500">Errors:</h4>
                            <div className="space-y-1">
                                {errors.campuses && <div className="text-red-500">Campuses: {errors.campuses}</div>}
                                {errors.posts && <div className="text-red-500">Posts: {errors.posts}</div>}
                                {errors.profile && <div className="text-red-500">Profile: {errors.profile}</div>}
                                {errors.notifications && <div className="text-red-500">Notifications: {errors.notifications}</div>}
                            </div>
                        </div>
                    )}

                    {/* Test Results */}
                    {testResults.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Test Results:</h4>
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
                                {testResults.map((result, index) => (
                                    <div key={index} className="text-sm font-mono">
                                        {result}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Sample Data Display */}
            {campuses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sample Campus Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {campuses.slice(0, 3).map((campus) => (
                                <div key={campus.id} className="p-3 border rounded">
                                    <div className="font-semibold">{campus.name_somali}</div>
                                    <div className="text-sm text-gray-500">{campus.description_somali}</div>
                                    <div className="text-xs text-gray-400">
                                        Members: {campus.member_count} | Posts: {campus.post_count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {posts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sample Post Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {posts.slice(0, 3).map((post) => (
                                <div key={post.id} className="p-3 border rounded">
                                    <div className="font-semibold">{post.title}</div>
                                    <div className="text-sm text-gray-500">{post.content.substring(0, 100)}...</div>
                                    <div className="text-xs text-gray-400">
                                        By: {post.user.first_name} {post.user.last_name} |
                                        Likes: {post.likes_count} | Comments: {post.comments_count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 