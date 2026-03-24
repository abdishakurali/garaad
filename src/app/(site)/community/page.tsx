"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useCommunityStore } from '@/store/useCommunityStore';
import { useAuthStore } from '@/store/useAuthStore';
import communityService from '@/services/community';
import CommunityWebSocket from '@/services/communityWebSocket';
import { CategoryList } from '@/components/community/CategoryList';
import { PostList } from '@/components/community/PostList';
import { InlinePostInput } from '@/components/community/InlinePostInput';
import { UserProfileModal } from '@/components/community/UserProfileModal';
import { NotificationDropdown } from '@/components/community/NotificationCenter';
import { AlertCircle, Menu, Bell, GraduationCap, Settings2, BellRing } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
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
import Link from 'next/link';
import { useAuthReady } from '@/hooks/useAuthReady';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import ReferralModal from '@/components/referrals/ReferralModal';
import PushNotificationSettings from '@/components/PushNotificationSettings';
import { CommunityChallengeBanner } from '@/components/challenge/CommunityChallengeBanner';
import { pricingTranslations as pt } from '@/config/translations/pricing';
export default function CommunityPage() {
    const {
        posts,
        selectedCategory,
        userProfile,
        notifications,
        setSelectedCategory,
        setPosts,
        setUserProfile,
        setNotifications,
        markNotificationRead: markNotificationReadLocal,
        markAllNotificationsRead: markAllNotificationsReadLocal
    } = useCommunityStore();

    const [allCategories, setAllCategories] = useState<any[]>([]);

    // Sort categories logic
    const categories = useMemo(() => {
        return [...allCategories].sort((a, b) => (b.order || 0) - (a.order || 0));
    }, [allCategories]);

    const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);
    const { user, isAuthenticated, hydrate: hydrateAuthFromCookies } = useAuthStore();
    const authReady = useAuthReady();
    /** Full community (post, WS, clear UI) is Challenge-only; others see a blurred preview + CTA. */
    const hasCommunityAccess = useMemo(() => {
        if (!user) return false;
        if (user.is_staff || user.is_superuser) return true;
        return (user.subscription_type ?? "").toLowerCase() === "challenge";
    }, [user]);
    const [loading, setLoading] = useState({ categories: false, posts: false, profile: false });
    const [errors, setErrors] = useState({ posts: null });
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [pendingScrollPostId, setPendingScrollPostId] = useState<string | null>(null);
    const [pendingScrollReplyId, setPendingScrollReplyId] = useState<string | null>(null);
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const [isPushSettingsOpen, setIsPushSettingsOpen] = useState(false);

    // Logic for handling notification click
    const handleNotificationClick = async (notification: any) => {
        // 1. Mark as read
        if (!notification.is_read) {
            try {
                await communityService.notification.markNotificationRead(notification.id);
                markNotificationReadLocal(notification.id);
            } catch (err) {
                console.error("Failed to mark read:", err);
            }
        }

        // 2. Navigate to category and post
        if (notification.category_id) {
            const category = allCategories.find(c => c.id === notification.category_id);
            if (category) {
                setSelectedCategory(category);
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

    // Sync cookie session into zustand immediately; do not wait for authReady (persist callback
    // can lag behind a valid cookie session — WS then works while this page stayed on loading).
    useEffect(() => {
        hydrateAuthFromCookies();
    }, [hydrateAuthFromCookies]);

    useEffect(() => {
        if (!authReady) return;
        // Read store after hydrate() (same tick) — hook closure can still be false briefly.
        if (!useAuthStore.getState().isAuthenticated) {
            router.push('/login?redirect=' + encodeURIComponent('/community'));
        }
    }, [authReady, isAuthenticated, router]);


    // Proactively ensure token is valid on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated) {
                // api.ts handles refresh automatically, so we just do a dummy call if we want to trigger refresh
                // but usually it's not needed here.
            }
        };
        checkAuth();
    }, [isAuthenticated]);

    // Initialize data (fetch once) once we know the user is logged in (cookie + store).
    useEffect(() => {
        if (!isAuthenticated) return;

        const initData = async () => {
            try {
                setLoading(prev => ({ ...prev, categories: true, profile: true }));
                const results = await Promise.allSettled([
                    communityService.category.getCategories(),
                    communityService.profile.getUserProfile(),
                    communityService.notification.getNotifications(),
                ]);
                const cats = results[0].status === "fulfilled" ? results[0].value : null;
                const profile = results[1].status === "fulfilled" ? results[1].value : null;
                const notifs = results[2].status === "fulfilled" ? results[2].value : null;
                if (results[0].status === "rejected") {
                    console.error("Failed to load community categories:", results[0].reason);
                }
                if (results[1].status === "rejected") {
                    console.error("Failed to load community profile:", results[1].reason);
                }
                if (results[2].status === "rejected") {
                    console.error("Failed to load community notifications:", results[2].reason);
                }
                if (cats) {
                    setAllCategories(((cats as any).results || cats) as any[]);
                }
                if (profile) {
                    setUserProfile(profile as any);
                }
                if (notifs) {
                    setNotifications(((notifs as any).results || notifs) as any[]);
                }
            } catch (err) {
                console.error("Failed to init community data:", err);
            } finally {
                setLoading(prev => ({ ...prev, categories: false, profile: false }));
            }
        };

        initData();
    }, [isAuthenticated]);

    // Select first category by default when categories load
    useEffect(() => {
        if (allCategories.length > 0 && !selectedCategory) {
            const firstCategory = allCategories[0];
            setSelectedCategory(firstCategory);
            // Fetch posts for first category
            fetchPostsForCategory(firstCategory.id);
        }
    }, [allCategories, selectedCategory]);

    const fetchPostsForCategory = async (categoryId: string) => {
        try {
            setLoading(prev => ({ ...prev, posts: true }));
            const postsData = await communityService.post.getPosts(categoryId) as any;
            setPosts(postsData.results || postsData);
        } catch (err: any) {
            console.error("Failed to fetch posts:", err);
            setErrors(prev => ({ ...prev, posts: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, posts: false }));
        }
    };

    // Manage WebSocket connection for active category (Challenge / staff only)
    useEffect(() => {
        if (!isAuthenticated || !hasCommunityAccess) return;

        const connectToCategory = () => {
            const roomId = selectedCategory ? selectedCategory.id : 'global';
            CommunityWebSocket.getInstance().connect(roomId);
        };

        connectToCategory();
    }, [selectedCategory, isAuthenticated, hasCommunityAccess]);

    useEffect(() => {
        return () => {
            CommunityWebSocket.getInstance().disconnect();
        };
    }, []);

    // Fetch posts when category changes
    useEffect(() => {
        if (!selectedCategory) return;
        fetchPostsForCategory(selectedCategory.id);
    }, [selectedCategory]);

    if (!authReady || loading.categories || loading.profile) {
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
                    categories={allCategories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => {
                        setSelectedCategory(cat);
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
                            src={getMediaUrl(userProfile.profile_picture, 'profile_pics')}
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
                        onMarkAsRead={async (id) => {
                            try {
                                await communityService.notification.markNotificationRead(id);
                                markNotificationReadLocal(id);
                            } catch (err) {
                                console.error("Failed to mark read:", err);
                            }
                        }}
                        onMarkAllAsRead={async () => {
                            try {
                                await communityService.notification.markAllNotificationsRead();
                                markAllNotificationsReadLocal();
                            } catch (err) {
                                console.error("Failed to mark all read:", err);
                            }
                        }}
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
                className="flex-shrink-0 rounded-full w-8 h-8 lg:w-10 lg:h-10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-primary dark:text-primary animate-pulse shadow-[0_0_8px_rgba(255,165,0,0.4)]"
                title="Habaynta Ogeysiisyada"
            >
                <BellRing className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
        </div>
    );

    const challengeLockOverlay = !hasCommunityAccess ? (
        <div
            className="absolute inset-0 z-[60] flex items-center justify-center bg-gradient-to-b from-white/40 via-white/70 to-white/85 dark:from-black/30 dark:via-black/65 dark:to-black/85 backdrop-blur-[2px] px-4 pointer-events-none"
            aria-hidden={false}
        >
            <div
                className="pointer-events-auto text-center max-w-md px-6 py-8 bg-white/95 dark:bg-gray-950/95 rounded-2xl shadow-2xl border border-violet-200/80 dark:border-violet-500/30 ring-1 ring-violet-500/10"
                role="dialog"
                aria-labelledby="community-challenge-title"
                aria-describedby="community-challenge-desc"
            >
                <div className="text-4xl mb-3" aria-hidden>
                    👥
                </div>
                <h2
                    id="community-challenge-title"
                    className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight"
                >
                    Bulshada Challenge-ka
                </h2>
                <p
                    id="community-challenge-desc"
                    className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed"
                >
                    Astaamahan waxay u furan yihiin Challenge ardayda.
                </p>
                <Link
                    href="/challenge"
                    className="block w-full bg-violet-600 hover:bg-violet-500 text-white py-3.5 rounded-xl font-bold text-sm text-center shadow-lg shadow-violet-600/25 transition-colors"
                >
                    {pt.challenge_cta} →
                </Link>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    Bilaash wali waxaad ku bilow kartaa /courses
                </p>
            </div>
        </div>
    ) : null;

    return (
        <div className="relative flex h-screen bg-background overflow-hidden">
            <div
                className={
                    !hasCommunityAccess
                        ? "flex flex-1 min-h-0 min-w-0 h-full w-full overflow-hidden blur-[3px] sm:blur-[5px] pointer-events-none select-none opacity-[0.72] scale-[0.99]"
                        : "flex flex-1 min-h-0 min-w-0 h-full w-full overflow-hidden"
                }
            >
            <div className="hidden lg:flex w-80 border-r border-gray-100 dark:border-white/5 flex-col bg-white dark:bg-black">
                <div className="h-20 ml-0 pl-0 px-8 flex items-center justify-center">
                    <div className="relative w-32 h-12 pl-0 px-8  overflow-hidden flex-shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Garaad"
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
                                        Fadlan dooro golaha aad xiisaynayso.
                                    </SheetDescription>
                                </SheetHeader>
                                {categoryList}
                            </SheetContent>
                        </Sheet>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-bold dark:text-white truncate">
                                {selectedCategory ? selectedCategory.title : SOMALI_UI_TEXT.community}
                            </h1>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        {actionIcons}
                    </div>
                </div>

                {selectedCategory ? (
                    <>
                        <CommunityChallengeBanner />

                        {/* Header */}
                        <div className="hidden lg:flex h-20 px-8 items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 sticky top-0">
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
                                isRefreshing={false}
                                error={errors.posts}
                                userProfile={userProfile}
                                categoryId={selectedCategory.id}
                                showInlineInput={hasCommunityAccess}
                                readOnly={!hasCommunityAccess}
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
                                <h3 className="text-xl font-bold mb-2 dark:text-white">Doorashada Golaha</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Fadlan dooro mid ka mid ah golayaasha si aad u akhrisato doodaha ugu dambeeyay.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
            </div>
            {challengeLockOverlay}
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
                        <DialogTitle>Ogeysiisyada Mobilka</DialogTitle>
                        <DialogDescription>
                            Habayso qaabka aad u helayso ogeysiisyada tooska ah.
                        </DialogDescription>
                    </DialogHeader>
                    <PushNotificationSettings />
                </DialogContent>
            </Dialog>
        </div>
    );
}