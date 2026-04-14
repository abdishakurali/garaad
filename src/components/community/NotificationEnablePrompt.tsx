"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { usePushSubscription } from "@/hooks/usePushSubscription";

const PROMPT_SNOOZE_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const PROMPT_STORAGE_KEY = "community_push_prompt_next_at";

export function NotificationEnablePrompt() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const { isSupported, isSubscribed, permission, isLoading, toggle } = usePushSubscription(isAuthenticated);
  const [isVisible, setIsVisible] = useState(false);

  const shouldPrompt = useMemo(() => {
    return isAuthenticated && isSupported && !isSubscribed && permission === "default";
  }, [isAuthenticated, isSupported, isSubscribed, permission]);

  useEffect(() => {
    if (!shouldPrompt) {
      setIsVisible(false);
      return;
    }
    try {
      const nextAtRaw = localStorage.getItem(PROMPT_STORAGE_KEY);
      const nextAt = nextAtRaw ? Number(nextAtRaw) : 0;
      if (!nextAt || Date.now() >= nextAt) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } catch {
      setIsVisible(true);
    }
  }, [shouldPrompt]);

  const dismissForNow = () => {
    try {
      localStorage.setItem(PROMPT_STORAGE_KEY, String(Date.now() + PROMPT_SNOOZE_MS));
    } catch {
      // Ignore localStorage failures.
    }
    setIsVisible(false);
  };

  const handleEnable = async () => {
    const ok = await toggle(true);
    if (ok) {
      setIsVisible(false);
      try {
        localStorage.removeItem(PROMPT_STORAGE_KEY);
      } catch {
        // Ignore localStorage failures.
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mx-4 mt-3 rounded-xl border border-primary/25 bg-primary/10 p-3 sm:mx-6 sm:mt-4 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/20 p-2 text-primary">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Fur ogeysiisyada mobilka</p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Hel ogeysiis marka qof kuugu jawaabo ama ku xuso, xitaa marka app-ka xiran yahay.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={handleEnable} disabled={isLoading}>
                {isLoading ? "Waa la furayaa..." : "Enable notifications"}
              </Button>
              <Button size="sm" variant="outline" onClick={dismissForNow}>
                Not now
              </Button>
            </div>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-muted-foreground"
          onClick={dismissForNow}
          aria-label="Close notifications prompt"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
