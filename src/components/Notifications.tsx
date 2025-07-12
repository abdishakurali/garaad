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
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const { notification, mutate } = useNotification();
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visibleNotifications: Notification[] =
    notification?.filter((n: Notification) => !dismissed.includes(n.id)) || [];

  const unreadCount = visibleNotifications.filter((n) => !n.is_read).length;

  const handleOpen = async () => {
    await mutate(); // refetch notifications
  };

  const handleDismiss = (id: number) => {
    setDismissed((prev) => [...prev, id]);
  };

  return (
    <div className="relative">
      <Popover onOpenChange={(open) => open && handleOpen()}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute text-gray-200 text-md  -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
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
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ogeysiisyo</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} cusub
                </Badge>
              )}
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {visibleNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Ogeysiis cusub ma jiro
                </p>
              </div>
            ) : (
              <div className="p-2">
                {visibleNotifications.map((notif: Notification) => {
                  const IconComponent = getNotificationIcon(notif.type);
                  const colorClass = getNotificationColor(notif.type);

                  // Safety check to ensure IconComponent is defined
                  if (!IconComponent) {
                    console.warn(`No icon found for notification type: ${notif.type}`);
                  }

                  return (
                    <div
                      key={notif.id}
                      className={`relative group mb-2 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${!notif.is_read
                        ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                        : "bg-background hover:bg-muted/50"
                        }`}
                    >
                      <button
                        onClick={() => handleDismiss(notif.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>

                      <div className="flex gap-3">
                        <div
                          className={`flex-shrink-0 p-2 rounded-full ${colorClass}`}
                        >
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(notif.type)}
                            </Badge>
                            {!notif.is_read && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>

                          <h4 className="font-medium text-sm leading-tight mb-1">
                            {notif.title}
                          </h4>

                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                            {notif.message}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(notif.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {visibleNotifications.length > 0 && (
            <div className="p-3 border-t bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() =>
                  setDismissed(visibleNotifications.map((n) => n.id))
                }
              >
                Dhammaan ka saar
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
