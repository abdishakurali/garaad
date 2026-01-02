"use client";

import { useNotification } from "@/services/gamification";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  X,
  Flame,
  Trophy,
  Target,
  Zap,
  Heart,
  Clock,
  Award,
  Users,
  Star,
  BellOff,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import communityService from "@/services/community";
import { UserProfile, Notification as CommunityNotification } from "@/types/community";
import AuthenticatedAvatar from "./ui/authenticated-avatar";
import { getMediaUrl } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { markNotificationRead, markAllNotificationsAsRead, selectUnreadNotificationCount, fetchNotifications } from "@/store/features/communitySlice";
import { useRouter } from "next/navigation";

interface Notification {
  id: number;
  type:
  | "streak"
  | "league"
  | "milestone"
  | "energy"
  | "welcome"
  | "reminder"
  | "achievement"
  | "competition"
  | "social";
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

const getNotificationIcon = (type: Notification["type"]) => {
  const iconMap = {
    streak: Flame,
    league: Trophy,
    milestone: Target,
    energy: Zap,
    welcome: Heart,
    reminder: Clock,
    achievement: Award,
    competition: Users,
    social: Star,
  };
  return iconMap[type] || Bell;
};

const getNotificationColor = (type: Notification["type"]) => {
  const colorMap = {
    streak: "text-orange-500 bg-orange-50 dark:bg-orange-950",
    league: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950",
    milestone: "text-blue-500 bg-blue-50 dark:bg-blue-950",
    energy: "text-green-500 bg-green-50 dark:bg-green-950",
    welcome: "text-pink-500 bg-pink-50 dark:bg-pink-950",
    reminder: "text-purple-500 bg-purple-50 dark:bg-purple-950",
    achievement: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950",
    competition: "text-red-500 bg-red-50 dark:bg-red-950",
    social: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950",
  };
  return colorMap[type];
};

const getTypeLabel = (type: Notification["type"]) => {
  const labelMap = {
    streak: "Silsilad",
    league: "Horyaal",
    milestone: "Yool",
    energy: "Tamar",
    welcome: "Soo dhawayn",
    reminder: "Xasuusin",
    achievement: "Guul",
    competition: "Tartanka",
    social: "Bulshada",
  };
  return labelMap[type];
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Hadda";
  if (diffInMinutes < 60) return `${diffInMinutes} daqiiqo ka hor`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} saacadood ka hor`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} maalmood ka hor`;

  return date.toLocaleDateString("so-SO");
};

export default function NotificationPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { notification, mutate } = useNotification();
  const isLoading = useSelector((state: RootState) => state.community.loading.notifications);
  const communityNotifications = useSelector((state: RootState) => state.community.notifications);
  const communityUnreadCount = useSelector(selectUnreadNotificationCount);

  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'users'>('notifications');
  const [enabledUsers, setEnabledUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchEnabledUsers = async () => {
    try {
      setLoadingUsers(true);
      const users = await communityService.profile.getNotificationEnabledUsers();
      setEnabledUsers(users);
    } catch (error) {
      console.error("Failed to fetch notification enabled users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch data on mount for badge accuracy
  useEffect(() => {
    dispatch(fetchNotifications({ reset: true }));
    fetchEnabledUsers();
  }, [dispatch]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Refresh data when opening to ensure latest
      mutate(); // gamification
      dispatch(fetchNotifications({ reset: true }));
      fetchEnabledUsers();
    }
  };

  const visibleGamificationNotifications: Notification[] =
    notification?.filter((n: Notification) => !dismissed.includes(n.id)) || [];

  const gamificationUnreadCount = visibleGamificationNotifications.filter((n) => !n.is_read).length;
  const communityUnreadCountValue = communityUnreadCount;
  const totalUnreadCount = gamificationUnreadCount + communityUnreadCountValue;

  // Combine and sort notifications
  const allNotifications = useMemo(() => {
    const combined = [
      ...visibleGamificationNotifications.map(n => ({ ...n, source: 'gamification' as const })),
      ...communityNotifications.map(n => ({
        id: n.id,
        type: 'social' as const,
        title: n.title,
        message: n.message,
        is_read: n.is_read,
        created_at: n.created_at,
        source: 'community' as const,
        raw: n
      }))
    ];

    return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [visibleGamificationNotifications, communityNotifications]);

  const handleDismiss = (id: number) => {
    setDismissed((prev) => [...prev, id]);
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {totalUnreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute text-white -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
              >
                {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[90vw] max-w-md p-0 -mr-10 sm:mr-0"
          side="bottom"
          align="end"
          sideOffset={8}
        >
          <div className="flex flex-col h-[480px]">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ogeysiisyo</h3>
                {totalUnreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {totalUnreadCount} cusub
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                Ogeysiisyada
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                Xubnaha
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'notifications' ? (
                <ScrollArea className="h-full">
                  {allNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <BellOff className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-sm text-muted-foreground">Ogeysiis cusub ma jiro</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                      {allNotifications.map((notif) => {
                        const isCommunity = 'source' in notif && notif.source === 'community';
                        const IconComponent = getNotificationIcon(notif.type);
                        const colorClass = getNotificationColor(notif.type);

                        return (
                          <div
                            key={notif.id}
                            className={`p-4 transition-colors hover:bg-muted/50 cursor-pointer relative group ${!notif.is_read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                              }`}
                            onClick={() => {
                              if (isCommunity && notif.source === 'community') {
                                if (!notif.is_read) dispatch(markNotificationRead(notif.id));
                                setOpen(false);
                                router.push(`/community?post=${notif.raw.post_id}`);
                              }
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCommunity && notif.source === 'community') {
                                  dispatch(markNotificationRead(notif.id));
                                } else {
                                  handleDismiss(Number(notif.id));
                                }
                              }}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted"
                            >
                              <X className="h-3 w-3 text-muted-foreground" />
                            </button>

                            <div className="flex gap-3">
                              {isCommunity && notif.source === 'community' && notif.raw.sender ? (
                                <AuthenticatedAvatar
                                  src={getMediaUrl(notif.raw.sender.profile_picture, 'profile_pics')}
                                  alt={notif.raw.sender.username}
                                  fallback={notif.raw.sender.username[0]}
                                  size="sm"
                                  className="flex-shrink-0"
                                />
                              ) : (
                                <div className={`flex-shrink-0 p-2 rounded-full h-fit ${colorClass}`}>
                                  <IconComponent className="h-4 w-4" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-[10px] h-4">
                                    {isCommunity && notif.source === 'community' ? notif.raw.notification_type_display : getTypeLabel(notif.type)}
                                  </Badge>
                                </div>
                                <h4 className="font-medium text-sm leading-tight mb-1">
                                  {notif.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-muted-foreground mt-2 block">
                                  {formatTimeAgo(notif.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-2">
                    {loadingUsers ? (
                      <div className="space-y-2 p-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 animate-pulse p-2">
                            <div className="w-10 h-10 rounded-full bg-muted" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-24 bg-muted rounded" />
                              <div className="h-3 w-16 bg-muted rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : enabledUsers.length > 0 ? (
                      <div className="space-y-1">
                        {enabledUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-muted"
                          >
                            <div className="flex items-center gap-3">
                              <AuthenticatedAvatar
                                src={getMediaUrl(user.profile_picture, 'profile_pics')}
                                alt={user.username}
                                fallback={user.username[0].toUpperCase()}
                                size="md"
                              />
                              <div>
                                <p className="text-sm font-semibold">{user.username}</p>
                                <p className="text-[10px] text-green-600 flex items-center gap-1 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                  Ogeysiisyada u furan
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pr-1">
                              <button className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shadow-sm">
                                Farriin
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                        <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-sm text-muted-foreground font-medium">Ma jiraan xubno ogeysiis leh</p>
                        <p className="text-xs text-muted-foreground mt-2">Xubnaha ogeysiisyada u furan halkan ayay ka soo muuqan doonaan.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>

            {allNotifications.length > 0 && activeTab === 'notifications' && (
              <div className="p-3 border-t bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs font-medium"
                  onClick={() => {
                    setDismissed(visibleGamificationNotifications.map((n) => n.id));
                    dispatch(markAllNotificationsAsRead());
                  }}
                >
                  Dhammaan ka saar / Akhri
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
