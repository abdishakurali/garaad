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
import { CreatePostInput } from '@/components/community/CreatePostInput';
import { CreatePostDialog } from '@/components/community/CreatePostDialog';
import { AlertCircle, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SOMALI_UI_TEXT } from '@/types/community';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const wsRef = useRef<CommunityWebSocket | null>(null);

    // Initialize data (fetch once)
    useEffect(() => {
        if (!isAuthenticated) return;

        dispatch(fetchCategories());
        dispatch(fetchUserProfile());
    }, [dispatch, isAuthenticated]);

    // Select first category by default when categories load
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            dispatch(setSelectedCategory(categories[0]));
        }
    }, [categories, selectedCategory, dispatch]);

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

    const categoryList = (
        <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
                dispatch(setSelectedCategory(cat));
                setIsMobileMenuOpen(false);
            }}
            loading={loading.categories}
        />
    );

    return (
        <div className="flex h-screen bg-white dark:bg-[#313338] overflow-hidden">
            {/* Sidebar: Category List (Campuses) - Desktop Only */}
            <div className="hidden lg:flex w-80 border-r border-[#E3E5E8] dark:border-[#1E1F22] flex-col">
                <div className="h-14 px-4 flex items-center justify-between border-b border-black/10 dark:border-white/10">
                    <h1 className="text-lg font-black dark:text-white uppercase tracking-tight">
                        {SOMALI_UI_TEXT.community}
                    </h1>
                </div>
                {categoryList}
            </div>

            {/* Main: Post List */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden h-14 px-4 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#313338] z-10">
                    <div className="flex items-center gap-3">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80 bg-white dark:bg-[#2B2D31] border-none">
                                <SheetHeader className="p-4 border-b border-black/10 dark:border-white/10">
                                    <SheetTitle className="text-lg font-black uppercase tracking-tight text-left">
                                        {SOMALI_UI_TEXT.community}
                                    </SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Dooro qaybta aad rabto inaad ku biirto.
                                    </SheetDescription>
                                </SheetHeader>
                                {categoryList}
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-lg font-black dark:text-white uppercase tracking-tight">
                            {SOMALI_UI_TEXT.community}
                        </h1>
                    </div>
                </div>

                {selectedCategory ? (
                    <>
                        {/* Header */}
                        <div className="h-14 px-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#313338]">
                            <div className="min-w-0">
                                <h2 className="text-base font-black dark:text-white uppercase tracking-tight truncate">{selectedCategory.title}</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{selectedCategory.posts_count} {SOMALI_UI_TEXT.posts}</p>
                            </div>
                        </div>

                        {/* Posts */}
                        <div className="flex-1 overflow-y-auto">
                            <CreatePostInput categoryId={selectedCategory.id} />

                            <PostList
                                posts={posts}
                                loading={loading.posts}
                                error={errors.posts}
                                userProfile={userProfile}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-6 text-center">
                        <div className="max-w-md">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-black mb-2 dark:text-white uppercase tracking-tight">Dooro Qaybta</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Dooro mid ka mid ah qaybaha si aad u aragto qoraallada bulshada.
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