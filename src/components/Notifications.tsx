"use client";

import { useNotifcation } from "@/services/gamification";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NotificationPanel() {
  const { notification, mutate } = useNotifcation();
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visibleNotifications =
    notification?.filter((n: any) => !dismissed.includes(n.id)) || [];

  const handleOpen = async () => {
    await mutate(); // refetch notifications
  };

  return (
    <div className="">
      <Popover onOpenChange={(open) => open && handleOpen()}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Bell />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[90vw] max-w-sm p-4 space-y-4"
          side="top"
          align="end"
        >
          <h3 className="text-lg font-semibold">Notifications</h3>

          {visibleNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No new notifications.
            </p>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {visibleNotifications.map((notif: any) => (
                <div
                  key={notif.id}
                  className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 shadow"
                >
                  <button
                    onClick={() => setDismissed((prev) => [...prev, notif.id])}
                    className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                  >
                    <X size={16} />
                  </button>
                  <h4 className="font-medium text-zinc-900 dark:text-white">
                    {notif.title}
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
