"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
    fetchCategories,
    fetchUserProfile,
    fetchCategoryPosts,
    setSelectedCategory,
    selectSortedCategories,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsAsRead,
    selectUnreadNotificationCount,
} from '@/store/features/communitySlice';
import CommunityWebSocket from '@/services/communityWebSocket';
import { CategoryList } from '@/components/community/CategoryList';
import { PostList } from '@/components/community/PostList';
import { InlinePostInput } from '@/components/community/InlinePostInput';
import { UserProfileModal } from '@/components/community/UserProfileModal';
import { NotificationDropdown } from '@/components/community/NotificationCenter';
import { AlertCircle, Menu, Bell, GraduationCap, Settings2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SOMALI_UI_TEXT, getUserDisplayName } from '@/types/community';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import ReferralModal from '@/components/referrals/ReferralModal';
import PushNotificationSettings from '@/components/PushNotificationSettings';
import { AuthService } from '@/services/auth';

export default function CommunityPage() {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector(selectSortedCategories);
    const {
        posts,
        selectedCategory,
        userProfile,
        loading,
        errors,
        notifications,
    } = useSelector((state: RootState) => state.community);

    const unreadCount = useSelector(selectUnreadNotificationCount);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [pendingScrollPostId, setPendingScrollPostId] = useState<string | null>(null);
    const [pendingScrollReplyId, setPendingScrollReplyId] = useState<string | null>(null);
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const [isPushSettingsOpen, setIsPushSettingsOpen] = useState(false);

    // Logic for handling notification click
    const handleNotificationClick = (notification: any) => {
        // 1. Mark as read
        if (!notification.is_read) {
            dispatch(markNotificationRead(notification.id));
        }

        // 2. Navigate to category and post
        if (notification.category_id) {
            const category = categories.find(c => c.id === notification.category_id);
            if (category) {
                dispatch(setSelectedCategory(category));
                if (notification.post_id) {
                    setPendingScrollPostId(notification.post_id);
                }
                if (notification.reply_id) {
                    setPendingScrollReplyId(notification.reply_id);
                }
            }
        } else if (notification.post_id && selectedCategory) {
            // Already in category or category unknown, just scroll
            const element = document.getElementById(`post-${notification.post_id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                if (notification.reply_id) {
                    setPendingScrollReplyId(notification.reply_id);
                }
            }
        }
    };

    // Scroll to post/reply when posts are loaded/updated
    useEffect(() => {
        if (pendingScrollPostId && posts.length > 0) {
            const element = document.getElementById(`post-${pendingScrollPostId}`);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // If we have a reply, the PostCard will handle its own scrolling once expanded,
                    // but we need to keep the IDs for a bit.
                    setTimeout(() => {
                        setPendingScrollPostId(null);
                        setPendingScrollReplyId(null);
                    }, 1000);
                }, 500); // Wait for render
            }
        }
    }, [posts, pendingScrollPostId]);

    // Redirect to home if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);


    // Proactively ensure token is valid on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated) {
                const authService = AuthService.getInstance();
                await authService.ensureValidToken();
            }
        };
        checkAuth();
    }, [isAuthenticated]);

    // Initialize data (fetch once)
    useEffect(() => {
        if (!isAuthenticated) return;

        dispatch(fetchCategories());
        dispatch(fetchUserProfile());
        dispatch(fetchNotifications({ reset: true }));
    }, [dispatch, isAuthenticated]);

    // Select first category by default when categories load
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            const firstCategory = categories[0];
            dispatch(setSelectedCategory(firstCategory));
            // Pre-fetch immediately for better UX
            dispatch(fetchCategoryPosts({ categoryId: firstCategory.id }));
        }
    }, [categories, selectedCategory, dispatch]);

    // Manage WebSocket connection for active category
    useEffect(() => {
        if (!isAuthenticated) return;

        const connectToCategory = async () => {
            const { default: CommunityWebSocket } = await import('@/services/communityWebSocket');
            // Backend broadcasts to "community_<categoryId>" so we connect to "categoryId"
            // The consumer adds "community_" prefix to the group name automatically
            const roomId = selectedCategory ? selectedCategory.id : 'global';
            CommunityWebSocket.getInstance().connect(roomId, dispatch);
        };

        connectToCategory();
    }, [dispatch, selectedCategory, isAuthenticated]);

    // Revert to global channel when leaving community page
    useEffect(() => {
        return () => {
            const revertToGlobal = async () => {
                const { default: CommunityWebSocket } = await import('@/services/communityWebSocket');
                CommunityWebSocket.getInstance().connect('global', dispatch);
            };
            revertToGlobal();
        };
    }, [dispatch]);

    // Fetch posts when category changes
    useEffect(() => {
        if (!selectedCategory) return;
        dispatch(fetchCategoryPosts({ categoryId: selectedCategory.id }));
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

    if (!isAuthenticated) return null;

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

            {/* User Profile Footer */}
            {isAuthenticated && userProfile && (
                <div className="border-t border-gray-100 dark:border-white/5 bg-white dark:bg-black">
                    <div
                        className="flex items-center gap-3 p-6 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                        onClick={() => {
                            setSelectedUserId(userProfile.id);
                            setIsProfileModalOpen(true);
                        }}
                    >
                        <AuthenticatedAvatar
                            src={userProfile.profile_picture}
                            alt={userProfile.username}
                            fallback={userProfile.username[0]}
                            className="w-10 h-10 ring-2 ring-gray-100 dark:ring-white/10 group-hover:ring-primary/20 transition-all"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate dark:text-white">
                                {getUserDisplayName(userProfile)}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {SOMALI_UI_TEXT.profile}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    const actionIcons = (
        <div className="flex items-center gap-2">
            {/* Referral Icon */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsReferralModalOpen(true)}
                className="rounded-full w-8 h-8 lg:w-10 lg:h-10 hover:bg-primary/10 dark:hover:bg-primary/10 transition-all active:scale-90"
                title="Share the Opportunity"
            >
                <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
            </Button>

            {/* Notification Bell */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative rounded-full w-8 h-8 lg:w-10 lg:h-10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                    >
                        <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500 dark:text-gray-400" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] lg:text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center font-bold">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                    <NotificationDropdown
                        notifications={notifications}
                        unreadCount={unreadCount}
                        onMarkAsRead={(id) => dispatch(markNotificationRead(id))}
                        onMarkAllAsRead={() => dispatch(markAllNotificationsAsRead())}
                        onNotificationClick={handleNotificationClick}
                    />
                </PopoverContent>
            </Popover>

            <ThemeToggle />

            {/* Push Notification Settings */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPushSettingsOpen(true)}
                className="rounded-full w-8 h-8 lg:w-10 lg:h-10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                title="Ogeysiisyada Push"
            >
                <Settings2 className="h-4 w-4 lg:h-5 lg:w-5 text-gray-500 dark:text-gray-400" />
            </Button>
        </div>
    );

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <div className="hidden lg:flex w-80 border-r border-gray-100 dark:border-white/5 flex-col bg-white dark:bg-black">
                <div className="h-20 ml-0 pl-0 px-8 flex items-center justify-center">
                    <div className="relative w-32 h-12 pl-0 px-8  overflow-hidden flex-shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Astaanta Garaad"
                            fill
                            sizes="128px"
                            className="object-contain"
                        />
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
                                className="p-0 w-[280px] sm:w-[350px] bg-background border-r border-border transition-transform duration-500 ease-in-out"
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
                    {actionIcons}
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
                            {actionIcons}
                        </div>

                        {/* Posts */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <PostList
                                posts={posts}
                                loading={loading.posts}
                                isRefreshing={loading.refreshingPosts}
                                error={errors.posts}
                                userProfile={userProfile}
                                categoryId={selectedCategory.id}
                                showInlineInput={true}
                                expandedReplyId={pendingScrollReplyId}
                                onScrollComplete={() => {
                                    setPendingScrollPostId(null);
                                    setPendingScrollReplyId(null);
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Header for No Category Selected */}
                        <div className="hidden lg:flex h-20 px-8 items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 sticky top-0">
                            <h2 className="text-xl font-black dark:text-white truncate tracking-tight">{SOMALI_UI_TEXT.community}</h2>
                            {actionIcons}
                        </div>
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
                <UserProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    userId={selectedUserId}
                />
                <ReferralModal
                    isOpen={isReferralModalOpen}
                    onClose={() => setIsReferralModalOpen(false)}
                />
                <Dialog open={isPushSettingsOpen} onOpenChange={setIsPushSettingsOpen}>
                    <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Ogeysiisyada Push</DialogTitle>
                            <DialogDescription>
                                Halkaan kaga bixi ama ku xir ogeysiisyada push.
                            </DialogDescription>
                        </DialogHeader>
                        <PushNotificationSettings />
                    </DialogContent>
                </Dialog>
            </div>
            );
}