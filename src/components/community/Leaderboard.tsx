"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeaderboardEntry, Campus, BADGE_LEVELS } from '@/types/community';
import { Trophy, Medal, Crown, Star, Users, MessageCircle, Heart, TrendingUp } from 'lucide-react';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import { getMediaUrl } from '@/lib/utils';
import { UserProfileModal } from './UserProfileModal';

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    campuses?: Campus[];
    selectedCampus?: string | null;
    onCampusChange?: (campusSlug: string | null) => void;
    loading?: boolean;
    showStats?: boolean;
    maxEntries?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
    entries,
    campuses = [],
    selectedCampus = null,
    onCampusChange,
    loading = false,
    showStats = true,
    maxEntries = 10
}) => {
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleOpenProfile = (userId: string) => {
        setSelectedUserId(userId);
        setIsProfileModalOpen(true);
    };

    const getRankIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Crown className="h-6 w-6 text-yellow-500" />;
            case 2:
                return <Medal className="h-6 w-6 text-gray-400" />;
            case 3:
                return <Medal className="h-6 w-6 text-amber-600" />;
            default:
                return (
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {position}
                        </span>
                    </div>
                );
        }
    };

    const getBadgeInfo = (level: string) => {
        return BADGE_LEVELS[level] || BADGE_LEVELS.dhalinyaro;
    };

    const displayedEntries = entries.slice(0, maxEntries);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                        Tartanka Bulshada
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                            Top {maxEntries}
                        </Badge>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {/* Campus Filter */}
                    {campuses.length > 0 && onCampusChange && (
                        <Select
                            value={selectedCampus || 'all'}
                            onValueChange={(value) => onCampusChange(value === 'all' ? null : value)}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Dhammaan Campusyada</SelectItem>
                                {campuses.map((campus) => (
                                    <SelectItem key={campus.slug} value={campus.slug}>
                                        <div className="flex items-center space-x-2">
                                            <span>{campus.icon}</span>
                                            <span>{campus.name_somali}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Timeframe Filter */}
                    <Select
                        value={timeframe}
                        onValueChange={(value) => setTimeframe(value as 'week' | 'month' | 'all')}
                    >
                        <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Usbuucan</SelectItem>
                            <SelectItem value="month">Bilkan</SelectItem>
                            <SelectItem value="all">Dhammaan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 animate-pulse">
                                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                </div>
                                <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : displayedEntries.length > 0 ? (
                    <div className="space-y-2">
                        {displayedEntries.map((entry, index) => {
                            const position = (entry.position || index + 1);
                            const badge = getBadgeInfo(entry.badge_level);

                            return (
                                <div
                                    key={entry.user.id}
                                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${position <= 3
                                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800'
                                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className="flex-shrink-0">
                                        {getRankIcon(position)}
                                    </div>

                                    {/* User Avatar */}
                                    <div
                                        className="flex items-center space-x-3 cursor-pointer transition-transform hover:scale-110"
                                        onClick={() => handleOpenProfile(entry.user.id)}
                                    >
                                        <AuthenticatedAvatar
                                            src={getMediaUrl(entry.user.profile_picture, 'profile_pics')}
                                            alt={entry.user.username}
                                            fallback={entry.user.username[0].toUpperCase()}
                                            size="lg"
                                        />
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <h4
                                                className="font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:underline"
                                                onClick={() => handleOpenProfile(entry.user.id)}
                                            >
                                                {entry.user.username}
                                            </h4>
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                                style={{ backgroundColor: badge.color + '40' }}
                                                title={entry.badge_level_display}
                                            >
                                                {badge.emoji}
                                            </div>
                                            {position <= 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {position === 1 && 'Kaalinta 1aad'}
                                                    {position === 2 && 'Kaalinta 2aad'}
                                                    {position === 3 && 'Kaalinta 3aad'}
                                                </Badge>
                                            )}
                                        </div>

                                        {showStats && (
                                            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                                <div className="flex items-center space-x-1">
                                                    <MessageCircle className="h-3 w-3" />
                                                    <span>{entry.total_posts} qoraal</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Users className="h-3 w-3" />
                                                    <span>{entry.total_comments} jawaab</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Points */}
                                    <div className="text-right">
                                        <div className="flex items-center space-x-1">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="font-bold text-lg" style={{ color: badge.color }}>
                                                {entry.community_points.toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">dhibco</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Ma jiraan xubnood tartanka
                        </h3>
                        <p className="text-gray-500">
                            Weli ma jiraan dad ku jira tartanka bulshada.
                        </p>
                    </div>
                )}

                {/* Load More / View All */}
                {entries.length > maxEntries && (
                    <div className="mt-4 text-center">
                        <Button variant="outline" className="w-full">
                            Arag tartanka dhamma ({entries.length} xubnood)
                        </Button>
                    </div>
                )}

                {/* Leaderboard Stats */}
                {!loading && entries.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    {entries.length}
                                </div>
                                <div className="text-xs text-gray-500">Tartamayaal</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    {entries.reduce((sum, entry) => sum + entry.community_points, 0).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">Dhibco Guud</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    {Math.round(entries.reduce((sum, entry) => sum + entry.community_points, 0) / entries.length).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">Celceliska</div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <UserProfileModal
                userId={selectedUserId}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </Card>
    );
};

// Mini leaderboard for sidebars
export const MiniLeaderboard = ({
    entries,
    title = "Tartanka",
    maxEntries = 5,
    onOpenProfile
}: {
    entries: any[];
    title?: string;
    maxEntries?: number;
    onOpenProfile?: (userId: string) => void;
}) => {
    const getBadgeInfo = (level: string) => {
        return BADGE_LEVELS[level] || BADGE_LEVELS.dhalinyaro;
    };

    return (
        <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                {title}
            </h3>
            <div className="space-y-2">
                {entries.slice(0, maxEntries).map((entry, index) => {
                    const badge = getBadgeInfo(entry.badge_level);

                    return (
                        <div key={entry.user.id} className="flex items-center space-x-2">
                            <div className="flex-shrink-0 w-6 text-center">
                                {index === 0 && <span className="text-lg">🥇</span>}
                                {index === 1 && <span className="text-lg">🥈</span>}
                                {index === 2 && <span className="text-lg">🥉</span>}
                                {index > 2 && (
                                    <span className="text-sm font-medium text-gray-500">
                                        {index + 1}
                                    </span>
                                )}
                            </div>

                            <div
                                className="flex items-center space-x-3 cursor-pointer transition-transform hover:scale-110"
                                onClick={() => onOpenProfile?.(entry.user.id)}
                            >
                                <AuthenticatedAvatar
                                    src={getMediaUrl(entry.user.profile_picture, 'profile_pics')}
                                    alt={entry.user.username}
                                    fallback={entry.user.username[0].toUpperCase()}
                                    size="md"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                    <span
                                        className="text-sm font-medium truncate cursor-pointer hover:underline"
                                        onClick={() => onOpenProfile?.(entry.user.id)}
                                    >
                                        {entry.user.username}
                                    </span>
                                    <span className="text-xs">{badge.emoji}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-sm font-bold" style={{ color: badge.color }}>
                                    {entry.community_points.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}; 