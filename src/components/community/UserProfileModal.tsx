"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Trophy,
    Flame,
    Star,
    MessageSquare,
    Activity,
    Loader2,
    Camera
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import communityService from "@/services/community";
import { UserProfile, BADGE_LEVELS, getUserDisplayName } from "@/types/community";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { getMediaUrl } from "@/lib/utils";

interface UserProfileModalProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function UserProfileModal({ userId, isOpen, onClose }: UserProfileModalProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && userId) {
            fetchProfile();
        } else {
            // Reset state when closed
            if (!isOpen) {
                setProfile(null);
                setError(null);
            }
        }
    }, [isOpen, userId]);

    const fetchProfile = async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await communityService.profile.getOtherUserProfile(userId);
            setProfile(data);
        } catch (err: any) {
            console.error("Failed to fetch user profile:", err);
            setError("Ma suuroobin in la soo raro xogta adeegsadahan.");
        } finally {
            setLoading(false);
        }
    };

    // Check if viewing own profile
    const { userProfile: currentUser } = useSelector((state: RootState) => state.community);
    const isCurrentUser = profile && currentUser && (profile.id === currentUser.id);

    const [uploadingImage, setUploadingImage] = useState(false);
    const dispatch = useDispatch();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            await communityService.profile.updateProfile({ profile_picture: file });
            // Refresh profile data
            await fetchProfile();
            // Also refresh global user profile state if it's the current user
            if (isCurrentUser) {
                // We might need to dispatch an action to refresh the global profile, 
                // but since we don't have that handy, assume the page checks on mount or we just rely on local state for now.
                // Or better, re-fetch for the app:
                // dispatch(fetchUserProfile()); -- Assuming this action is available
            }
            toast.success("Sawirka waa la beddelay!");
        } catch (err) {
            console.error("Upload failed", err);
            toast.error("Khalad ayaa dhacay markii la rarayay sawirka.");
        } finally {
            setUploadingImage(false);
        }
    };

    if (!userId && !isOpen) return null;

    const badge = profile ? BADGE_LEVELS[profile.badge_level] || BADGE_LEVELS.dhalinyaro : null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white dark:bg-[#1E1F22] border-none shadow-2xl rounded-[2rem]">
                <DialogHeader className="sr-only">
                    <DialogTitle>Profile-ka Adeegsadaha</DialogTitle>
                    <DialogDescription>
                        Faahfaahinta dhibcaha, heerka iyo waxqabadka bulshada ee adeegsadahan.
                    </DialogDescription>
                </DialogHeader>
                {/* Header/Cover Area */}
                <div className="h-28 bg-gradient-to-br from-primary via-primary/80 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                </div>

                <div className="px-6 pb-8 -mt-14 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4 group">
                            <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                            <div className="relative">
                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                />

                                <AuthenticatedAvatar
                                    src={profile ? getMediaUrl(profile.profile_picture, 'profile_pics') : undefined}
                                    alt={profile?.username || "User"}
                                    size="xl"
                                    fallback={profile?.first_name?.[0] || profile?.username?.[0] || "?"}
                                    className="border-[6px] border-white dark:border-[#1E1F22] w-28 h-28 text-3xl shadow-xl bg-white"
                                />

                                {/* Edit Overlay for Current User */}
                                {isCurrentUser && (
                                    <label
                                        htmlFor="avatar-upload"
                                        className={cn(
                                            "absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
                                            uploadingImage && "opacity-100 bg-black/60 pointer-events-none"
                                        )}
                                    >
                                        {uploadingImage ? (
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        ) : (
                                            <Camera className="w-8 h-8 text-white drop-shadow-md" />
                                        )}
                                    </label>
                                )}

                                {profile && (
                                    <div className="absolute bottom-1 right-1 bg-white dark:bg-[#1E1F22] p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 z-20">
                                        <span className="text-2xl leading-none" title={profile.badge_level_display}>
                                            {badge?.emoji}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-12 flex flex-col items-center gap-3">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Soo raraya...</p>
                            </div>
                        ) : error ? (
                            <div className="py-12 text-center">
                                <p className="text-sm text-red-500 font-bold mb-4">{error}</p>
                                <button
                                    onClick={fetchProfile}
                                    className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
                                >
                                    Isku day mar kale
                                </button>
                            </div>
                        ) : profile ? (
                            <>
                                <h2 className="text-2xl font-black dark:text-white mb-1 tracking-tight">
                                    {getUserDisplayName(profile)}
                                </h2>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 italic">
                                    @{profile.username || "user"}
                                </p>

                                <div
                                    className="mb-8 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-sm"
                                    style={{ backgroundColor: `${badge?.color}15`, border: `1px solid ${badge?.color}30` }}
                                >
                                    <span className="text-sm">{badge?.emoji}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: badge?.color }}>
                                        {badge?.display_name}
                                    </span>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3 w-full mb-8">
                                    <div className="bg-gray-50/50 dark:bg-white/5 p-4 rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-sm transition-transform hover:scale-[1.02]">
                                        <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1.5" />
                                        <div className="text-lg font-black dark:text-white leading-tight">{profile.community_points}</div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dhibco</div>
                                    </div>
                                    <div className="bg-gray-50/50 dark:bg-white/5 p-4 rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-sm transition-transform hover:scale-[1.02]">
                                        <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1.5" />
                                        <div className="text-lg font-black dark:text-white leading-tight">{profile.streak_days}</div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">MAALIN</div>
                                    </div>
                                    <div className="bg-gray-50/50 dark:bg-white/5 p-4 rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-sm transition-transform hover:scale-[1.02]">
                                        <Trophy className="w-6 h-6 text-primary mx-auto mb-1.5" />
                                        <div className="text-lg font-black dark:text-white leading-tight">{profile.level}</div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">League</div>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="w-full text-left space-y-2.5 mb-8 px-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Heerka {profile.level}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary font-bold">{profile.xp_to_next_level} XP left</span>
                                    </div>
                                    <div className="relative h-3 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden shadow-inner p-0.5">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 ease-out rounded-full shadow-lg"
                                            style={{ width: `${profile.level_progress_percentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Activity Summary */}
                                <div className="w-full grid grid-cols-2 gap-4 px-2">
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-black dark:text-white leading-tight">{profile.total_posts}</div>
                                            <div className="text-[9px] font-bold text-gray-400 uppercase">Qoraal</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-black dark:text-white leading-tight">{profile.joined_campuses_count}</div>
                                            <div className="text-[9px] font-bold text-gray-400 uppercase">Campuses</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
