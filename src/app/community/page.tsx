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
import { InlinePostInput } from '@/components/community/InlinePostInput';
import { AlertCircle, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SOMALI_UI_TEXT } from '@/types/community';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import Image from 'next/image';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const wsRef = useRef<CommunityWebSocket | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize theme based on document class
    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

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
        <div className="flex flex-col h-full bg-gray-50/50 dark:bg-black/50">
            <div className="flex-1 overflow-y-auto py-2">
                <CategoryList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => {
                        dispatch(setSelectedCategory(cat));
                        setIsMobileMenuOpen(false);
                    }}
                    loading={loading.categories}
                />
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-white dark:bg-black overflow-hidden">
            {/* Sidebar: Category List (Campuses) - Desktop Only */}
            <div className="hidden lg:flex w-80 border-r border-gray-100 dark:border-white/5 flex-col bg-white dark:bg-black">
                <div className="h-20 px-8 flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg shadow-primary/10 border border-gray-100 dark:border-white/5">
                        <Image
                            src="/logo.png"
                            alt="Garaad Logo"
                            fill
                            sizes="40px"
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-black dark:text-white tracking-tight leading-none">
                            {SOMALI_UI_TEXT.community}
                        </h1>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Platform</p>
                    </div>
                </div>
                {categoryList}
            </div>

            {/* Main: Post List */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black">
                {/* Mobile Header */}
                <div className="lg:hidden h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden -ml-2">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="p-0 w-[280px] sm:w-[350px] bg-white dark:bg-black border-r border-gray-100 dark:border-white/5 transition-transform duration-500 ease-in-out"
                            >
                                <SheetHeader className="p-8 border-b border-gray-100 dark:border-white/5">
                                    <SheetTitle className="text-xl font-bold text-left">
                                        {SOMALI_UI_TEXT.community}
                                    </SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Dooro qaybta aad rabto inaad ku biirto.
                                    </SheetDescription>
                                </SheetHeader>
                                {categoryList}
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-lg font-bold dark:text-white">
                            {SOMALI_UI_TEXT.community}
                        </h1>
                    </div>
                </div>

                {selectedCategory ? (
                    <>
                        {/* Header */}
                        <div className="h-20 px-8 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 sticky top-0">
                            <div className="min-w-0">
                                <h2 className="text-xl font-black dark:text-white truncate tracking-tight">{selectedCategory.title}</h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                        {selectedCategory.posts_count} {SOMALI_UI_TEXT.posts}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleTheme}
                                    className="rounded-full w-10 h-10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-90"
                                    title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                >
                                    {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-500" />}
                                </Button>
                            </div>
                        </div>

                        {/* Posts */}
                        <div className="flex-1 overflow-hidden">
                            <PostList
                                posts={posts}
                                loading={loading.posts}
                                error={errors.posts}
                                userProfile={userProfile}
                                categoryId={selectedCategory.id}
                                showInlineInput={true}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-6 text-center">
                        <div className="max-w-md">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                                <AlertCircle className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 dark:text-white">Dooro Qaybta</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Dooro mid ka mid ah qaybaha si aad u aragto qoraallada bulshada.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}