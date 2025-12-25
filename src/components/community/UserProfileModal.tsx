"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Trophy,
    Flame,
    Star,
    MessageSquare,
    Activity,
    Loader2
} from "lucide-react";
import communityService from "@/services/community";
import { UserProfile, BADGE_LEVELS } from "@/types/community";
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

    if (!userId && !isOpen) return null;

    const badge = profile ? BADGE_LEVELS[profile.badge_level] || BADGE_LEVELS.dhalinyaro : null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white dark:bg-[#1E1F22] border-none shadow-2xl rounded-[2rem]">
                {/* Header/Cover Area */}
                <div className="h-28 bg-gradient-to-br from-primary via-primary/80 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                </div>

                <div className="px-6 pb-8 -mt-14 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4 group">
                            <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                            <div className="relative">
                                <AuthenticatedAvatar
                                    src={profile ? getMediaUrl(profile.user.profile_picture, 'profile_pics') : undefined}
                                    alt={profile?.user.username || "User"}
                                    size="xl"
                                    fallback={profile?.user.first_name?.[0] || profile?.user.username[0] || "?"}
                                    className="border-[6px] border-white dark:border-[#1E1F22] w-28 h-28 text-3xl shadow-xl"
                                />
                                {profile && (
                                    <div className="absolute bottom-1 right-1 bg-white dark:bg-[#2B2D31] p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
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
                                    {profile.user.first_name ? `${profile.user.first_name} ${profile.user.last_name || ""}` : profile.user.username}
                                </h2>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 italic">
                                    @{profile.user.username}
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
                                    <div className="bg-gray-50 dark:bg-[#2B2D31] p-4 rounded-[1.5rem] border border-gray-100 dark:border-gray-800/50 shadow-sm transition-transform hover:scale-[1.02]">
                                        <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1.5" />
                                        <div className="text-lg font-black dark:text-white leading-tight">{profile.community_points}</div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dhibco</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-[#2B2D31] p-4 rounded-[1.5rem] border border-gray-100 dark:border-gray-800/50 shadow-sm transition-transform hover:scale-[1.02]">
                                        <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1.5" />
                                        <div className="text-lg font-black dark:text-white leading-tight">{profile.streak_days}</div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Maalmood</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-[#2B2D31] p-4 rounded-[1.5rem] border border-gray-100 dark:border-gray-800/50 shadow-sm transition-transform hover:scale-[1.02]">
                                        <Trophy className="w-6 h-6 text-primary mx-auto mb-1.5" />
                                        <div className="text-lg font-black dark:text-white leading-tight">{profile.level}</div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">League</div>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="w-full text-left space-y-2.5 mb-8 px-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Heerka {profile.level}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{profile.xp_to_next_level} XP left</span>
                                    </div>
                                    <div className="relative h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 ease-out rounded-full"
                                            style={{ width: `${profile.level_progress_percentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Activity Summary */}
                                <div className="w-full grid grid-cols-2 gap-4 px-2">
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-black dark:text-white leading-tight">{profile.total_posts}</div>
                                            <div className="text-[9px] font-bold text-gray-400 uppercase">Qoraal</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                                        <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
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
