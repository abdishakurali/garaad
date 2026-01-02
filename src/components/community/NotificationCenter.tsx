"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Notification, NOTIFICATION_ICONS } from '@/types/community';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Clock,
    Filter,
    X,
    Heart,
    MessageCircle,
    AtSign,
    Users,
    Star,
    AlertCircle
} from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';

interface NotificationCenterProps {
    notifications: Notification[];
    unreadCount: number;
    onMarkAsRead: (notificationId: string) => void;
    onMarkAllAsRead: () => void;
    onDelete?: (notificationId: string) => void;
    onNotificationClick?: (notification: Notification) => void;
    loading?: boolean;
    showTabs?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    notifications,
    unreadCount,
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete,
    onNotificationClick,
    loading = false,
    showTabs = true
}) => {
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'mentions'>('all');

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'hadda';
        if (diffInMinutes < 60) return `${diffInMinutes} daqiiqo ka hor`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} saacadood ka hor`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} maalmood ka hor`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks} usbuuc kahor`;

        return date.toLocaleDateString('so-SO');
    };

    const getNotificationIcon = (type: string) => {
        const iconEmoji = NOTIFICATION_ICONS[type] || '🔔';

        switch (type) {
            case 'post_like':
                return <Heart className="h-4 w-4 text-red-500" />;
            case 'comment_like':
                return <Heart className="h-4 w-4 text-red-500" />;
            case 'post_comment':
                return <MessageCircle className="h-4 w-4 text-blue-500" />;
            case 'comment_reply':
                return <MessageCircle className="h-4 w-4 text-blue-500" />;
            case 'mention':
                return <AtSign className="h-4 w-4 text-purple-500" />;
            case 'new_campus_member':
                return <Users className="h-4 w-4 text-green-500" />;
            default:
                return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    const filterNotifications = (notifications: Notification[]) => {
        switch (activeTab) {
            case 'unread':
                return notifications.filter(n => !n.is_read);
            case 'mentions':
                return notifications.filter(n => n.notification_type === 'mention');
            default:
                return notifications;
        }
    };

    const filteredNotifications = filterNotifications(notifications);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            onMarkAsRead(notification.id);
        }
        if (onNotificationClick) {
            onNotificationClick(notification);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                        <Bell className="h-5 w-5 mr-2 text-blue-600" />
                        Ogeysiisyada
                        {unreadCount > 0 && (
                            <Badge className="ml-2 bg-red-500 text-white">
                                {unreadCount}
                            </Badge>
                        )}
                    </CardTitle>

                    <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onMarkAllAsRead}
                                disabled={loading}
                            >
                                <CheckCheck className="h-4 w-4 mr-2" />
                                Dhamma akhriy
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {showTabs && (
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">
                                Dhammaan ({notifications.length})
                            </TabsTrigger>
                            <TabsTrigger value="unread">
                                Aan akhriyin ({notifications.filter(n => !n.is_read).length})
                            </TabsTrigger>
                            <TabsTrigger value="mentions">
                                Magacyada (@) ({notifications.filter(n => n.notification_type === 'mention').length})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 animate-pulse">
                                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="w-1/2 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                </div>
                                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredNotifications.length > 0 ? (
                    <div className="space-y-2">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex space-x-3 p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${notification.is_read
                                    ? 'bg-gray-50 dark:bg-gray-800'
                                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                    }`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                {/* Notification Icon */}
                                <div className="flex-shrink-0">
                                    {notification.sender ? (
                                        <AuthenticatedAvatar
                                            src={getMediaUrl(notification.sender.profile_picture, 'profile_pics')}
                                            alt={notification.sender.username}
                                            fallback={notification.sender.username[0].toUpperCase()}
                                            size="lg"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                                            {getNotificationIcon(notification.notification_type)}
                                        </div>
                                    )}
                                </div>

                                {/* Notification Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className={`text-sm font-medium ${notification.is_read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                                                }`}>
                                                {notification.title}
                                            </h4>
                                            <p className={`text-sm mt-1 ${notification.is_read ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                {notification.message}
                                            </p>

                                            {/* Context Information */}
                                            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{formatTimeAgo(notification.created_at)}</span>
                                                </span>

                                                {notification.campus_name && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {notification.campus_name}
                                                    </Badge>
                                                )}

                                                <Badge variant="secondary" className="text-xs">
                                                    {notification.notification_type_display}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Notification Actions */}
                                        <div className="flex items-center space-x-1 ml-2">
                                            {!notification.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onMarkAsRead(notification.id);
                                                    }}
                                                    title="Ku calaamadee akhrisay"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}

                                            {onDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(notification.id);
                                                    }}
                                                    title="Tirtir"
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Unread Indicator */}
                                {!notification.is_read && (
                                    <div className="flex-shrink-0">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Ma jiraan ogeysiis
                        </h3>
                        <p className="text-gray-500">
                            {activeTab === 'unread'
                                ? 'Dhammaan ogeysiisyadaadu waa la akhriyay.'
                                : activeTab === 'mentions'
                                    ? 'Ma jiraan magacyo lay sheegay.'
                                    : 'Weli ma heshid ogeysiis.'}
                        </p>
                    </div>
                )}

                {/* Load More */}
                {filteredNotifications.length >= 20 && (
                    <div className="mt-4 text-center">
                        <Button variant="outline">
                            Soo raray ogeysiisyo dheeraad ah
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Mini notification dropdown for navbar
export const NotificationDropdown: React.FC<{
    notifications: Notification[];
    unreadCount: number;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onNotificationClick?: (notification: Notification) => void;
    maxDisplay?: number;
}> = ({
    notifications,
    unreadCount,
    onMarkAsRead,
    onMarkAllAsRead,
    onNotificationClick,
    maxDisplay = 5
}) => {
        const recentNotifications = notifications.slice(0, maxDisplay);

        return (
            <div className="w-80 max-h-96 overflow-hidden">
                {/* Header */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Ogeysiisyada
                        </h3>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                                <CheckCheck className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-64 overflow-y-auto">
                    {recentNotifications.length > 0 ? (
                        <div>
                            {recentNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}
                                    onClick={() => {
                                        if (!notification.is_read) {
                                            onMarkAsRead(notification.id);
                                        }
                                        if (onNotificationClick) {
                                            onNotificationClick(notification);
                                        }
                                    }}
                                >
                                    <div className="flex space-x-2">
                                        <div className="flex-shrink-0">
                                            {notification.sender ? (
                                                <AuthenticatedAvatar
                                                    src={getMediaUrl(notification.sender.profile_picture, 'profile_pics')}
                                                    alt={notification.sender.username}
                                                    fallback={notification.sender.username[0].toUpperCase()}
                                                    size="sm"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                                                    <span className="text-xs">
                                                        {NOTIFICATION_ICONS[notification.notification_type] || '🔔'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatTimeAgo(notification.created_at)}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Ma jiraan ogeysiis</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > maxDisplay && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="ghost" size="sm" className="w-full">
                            Arag dhammaan ogeysiisyada ({notifications.length})
                        </Button>
                    </div>
                )}
            </div>
        );

        function formatTimeAgo(dateString: string): string {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

            if (diffInMinutes < 1) return 'hadda';
            if (diffInMinutes < 60) return `${diffInMinutes} Daqiiqo`;

            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) return `${diffInHours} Saacad`;

            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} Maalmood`;
        }
    }; 