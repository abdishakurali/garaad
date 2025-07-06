import { useEffect, useState, useCallback, useRef } from "react";
import ActivityService, { ActivityData } from "@/services/activity";
import AuthService from "@/services/auth";

export interface UseActivityTrackingReturn {
  activityData: ActivityData | null;
  isLoading: boolean;
  error: string | null;
  updateActivity: () => Promise<void>;
  isTracking: boolean;
}

export function useActivityTracking(): UseActivityTrackingReturn {
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const activityService = useRef(ActivityService.getInstance());
  const authService = useRef(AuthService.getInstance());

  const updateActivity = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await activityService.current.updateActivity();
      setActivityData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Activity update failed";
      setError(errorMessage);
      console.error("Activity update error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startTracking = useCallback(() => {
    if (authService.current.isAuthenticated()) {
      activityService.current.initializeTracking();
      setIsTracking(true);

      // Initial activity update
      updateActivity();
    }
  }, [updateActivity]);

  const stopTracking = useCallback(() => {
    activityService.current.cleanup();
    setIsTracking(false);
  }, []);

  // Initialize tracking when component mounts
  useEffect(() => {
    if (authService.current.isAuthenticated()) {
      startTracking();
    }

    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  // Listen for authentication state changes
  useEffect(() => {
    const checkAuthAndUpdateTracking = () => {
      if (authService.current.isAuthenticated()) {
        if (!isTracking) {
          startTracking();
        }
      } else {
        if (isTracking) {
          stopTracking();
        }
      }
    };

    // Check on mount
    checkAuthAndUpdateTracking();

    // Set up periodic auth check (every 30 seconds)
    const authCheckInterval = setInterval(checkAuthAndUpdateTracking, 30000);

    return () => {
      clearInterval(authCheckInterval);
    };
  }, [isTracking, startTracking, stopTracking]);

  return {
    activityData,
    isLoading,
    error,
    updateActivity,
    isTracking,
  };
}
