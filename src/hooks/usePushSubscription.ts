"use client";

import { useCallback, useEffect, useState } from "react";
import pushNotificationService from "@/services/pushNotifications";

export function usePushSubscription(enabled: boolean) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const supported = pushNotificationService.isPushSupported();
    setIsSupported(supported);
    if (!supported) return;

    setPermission(pushNotificationService.getNotificationPermission());
    pushNotificationService.isSubscribedToPush().then(setIsSubscribed);
  }, [enabled]);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await pushNotificationService.subscribeToPushNotifications();
      if (!success) {
        setError("Waxaa dhacday cillad. Fadlan dib u day.");
        setIsSubscribed(false);
        return false;
      }
      setIsSubscribed(true);
      setPermission("granted");
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await pushNotificationService.unsubscribeFromPushNotifications();
      if (!success) {
        setError("Waxaa dhacday cillad. Fadlan dib u day.");
        return false;
      }
      setIsSubscribed(false);
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggle = useCallback(
    async (enabledValue: boolean) => {
      return enabledValue ? subscribe() : unsubscribe();
    },
    [subscribe, unsubscribe]
  );

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    toggle,
  };
}
