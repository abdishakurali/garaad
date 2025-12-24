"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
    fetchCategories,
    fetchUserProfile,
    fetchCategoryPosts,
    setSelectedCategory,
} from '@/store/features/communitySlice';
import CommunityWebSocket from '@/services/communityWebSocket';
import { CategoryList } from '@/components/community/CategoryList';
import { PostList } from '@/components/community/PostList';
import { CreatePostDialog } from '@/components/community/CreatePostDialog';
import { AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SOMALI_UI_TEXT } from '@/types/community';

export default function CommunityPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        categories,
        posts,
        selectedCategory,
        userProfile,
        loading,
        errors,
    } = useSelector((state: RootState) => state.community);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const wsRef = useRef<CommunityWebSocket | null>(null);

    // Initialize data (fetch once)
    useEffect(() => {
        if (!isAuthenticated) return;

        dispatch(fetchCategories());
        dispatch(fetchUserProfile());
    }, [dispatch, isAuthenticated]);

    // Fetch posts and join WebSocket when category changes
    useEffect(() => {
        if (!selectedCategory) return;

        // Fetch posts ONLY on initial load
        dispatch(fetchCategoryPosts({ categoryId: selectedCategory.id }));

        // Join WebSocket room for real-time sync
        if (!wsRef.current) {
            wsRef.current = new CommunityWebSocket();
        }
        wsRef.current.connect(selectedCategory.id, dispatch);

        // Cleanup: disconnect WebSocket when leaving category
        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
                wsRef.current = null;
            }
        };
    }, [dispatch, selectedCategory]);

    if (loading.categories || loading.profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#1E1F22]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">{SOMALI_UI_TEXT.loading}</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-4">
                <div className="text-center max-w-sm bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-4 dark:text-white">Ma leha galid</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium italic">{SOMALI_UI_TEXT.authError}</p>
                    <Button onClick={() => window.location.href = '/login'} className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Tag bogga galidda</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white dark:bg-[#313338] overflow-hidden">
            {/* Sidebar: Category List (Campuses) */}
            <div className="w-80 border-r border-[#E3E5E8] dark:border-[#1E1F22] flex flex-col">
                <div className="h-14 px-4 flex items-center justify-between border-b border-black/10 dark:border-white/10">
                    <h1 className="text-lg font-black dark:text-white uppercase tracking-tight">
                        {SOMALI_UI_TEXT.community}
                    </h1>
                </div>
                <CategoryList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => dispatch(setSelectedCategory(cat))}
                    loading={loading.categories}
                />
            </div>

            {/* Main: Post List */}
            <div className="flex-1 flex flex-col">
                {selectedCategory ? (
                    <>
                        {/* Header */}
                        <div className="h-14 px-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#313338]">
                            <div>
                                <h2 className="text-base font-black dark:text-white">{selectedCategory.title}</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedCategory.posts_count} {SOMALI_UI_TEXT.posts}</p>
                            </div>
                            <Button
                                onClick={() => setIsCreatePostOpen(true)}
                                className="rounded-xl font-bold"
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                {SOMALI_UI_TEXT.createPost}
                            </Button>
                        </div>

                        {/* Posts */}
                        <PostList
                            posts={posts}
                            loading={loading.posts}
                            error={errors.posts}
                            userProfile={userProfile}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center max-w-md px-4">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-black mb-2 dark:text-white">Dooro Qaybta</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Dooro mid ka mid ah qaybaha bidixda si aad u aragto qoraallada
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Post Dialog */}
            {selectedCategory && (
                <CreatePostDialog
                    isOpen={isCreatePostOpen}
                    onClose={() => setIsCreatePostOpen(false)}
                    categoryId={selectedCategory.id}
                />
            )}
        </div>
    );
}