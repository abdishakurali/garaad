import AuthService from "./auth";
import MonitoringService from "./monitoring";

export interface ActivityData {
  success: boolean;
  message: string;
  user: {
    last_active: string;
    last_login: string;
  };
  streak: {
    current_streak: number;
    max_streak: number;
    last_activity_date: string;
  };
  activity: {
    date: string;
    status: "complete" | "partial" | "none";
    problems_solved: number;
    lesson_ids: string[];
  };
  activity_date: string;
}

export class ActivityService {
  private static instance: ActivityService;
  private updateTimer: NodeJS.Timeout | null = null;
  private lastUpdateTime = 0;
  private readonly MIN_UPDATE_INTERVAL = 60000; // 1 minute
  private readonly PERIODIC_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

  private constructor() { }

  public static getInstance(): ActivityService {
    if (!ActivityService.instance) {
      ActivityService.instance = new ActivityService();
    }
    return ActivityService.instance;
  }

  /**
   * Update user activity
   */
  public async updateActivity(): Promise<ActivityData> {
    const startTime = Date.now();
    let success = false;

    try {
      const token = await AuthService.getInstance().ensureValidToken();

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`/api/activity/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed");
        }
        throw new Error(`Activity update failed: ${response.status}`);
      }

      const data = await response.json();
      success = true;

      // Record metrics
      const responseTime = Date.now() - startTime;
      MonitoringService.getInstance().recordActivityUpdate(
        success,
        responseTime
      );

      return data as ActivityData;
    } catch (error) {
      console.error("Activity update error:", error);

      // Record metrics even for failed requests
      const responseTime = Date.now() - startTime;
      MonitoringService.getInstance().recordActivityUpdate(
        success,
        responseTime
      );

      throw error;
    }
  }

  /**
   * Start periodic activity tracking
   */
  public startPeriodicTracking(): void {
    this.stopPeriodicTracking();

    this.updateTimer = setInterval(async () => {
      try {
        await this.updateActivity();
      } catch (error) {
        console.warn("Periodic activity update failed:", error);
      }
    }, this.PERIODIC_UPDATE_INTERVAL);
  }

  /**
   * Stop periodic activity tracking
   */
  public stopPeriodicTracking(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  /**
   * Update activity on user interaction (debounced)
   */
  public async updateActivityOnInteraction(): Promise<void> {
    const now = Date.now();
    if (now - this.lastUpdateTime > this.MIN_UPDATE_INTERVAL) {
      try {
        await this.updateActivity();
        this.lastUpdateTime = now;
      } catch (error) {
        // Use warn instead of error to avoid cluttering console with background update failures
        console.warn("Interaction activity update failed:", error);
      }
    }
  }

  /**
   * Setup activity tracking for user interactions
   */
  public setupInteractionTracking(): void {
    if (typeof window === "undefined") return;

    const updateOnInteraction = () => {
      this.updateActivityOnInteraction();
    };

    // Track various user interactions
    document.addEventListener("click", updateOnInteraction);
    document.addEventListener("scroll", updateOnInteraction);
    document.addEventListener("keypress", updateOnInteraction);

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        updateOnInteraction();
      }
    });

    // Track focus/blur events
    window.addEventListener("focus", updateOnInteraction);
    window.addEventListener("blur", updateOnInteraction);
  }

  /**
   * Cleanup interaction tracking
   */
  public cleanupInteractionTracking(): void {
    if (typeof window === "undefined") return;

    const updateOnInteraction = () => {
      this.updateActivityOnInteraction();
    };

    document.removeEventListener("click", updateOnInteraction);
    document.removeEventListener("scroll", updateOnInteraction);
    document.removeEventListener("keypress", updateOnInteraction);
    document.removeEventListener("visibilitychange", updateOnInteraction);
    window.removeEventListener("focus", updateOnInteraction);
    window.removeEventListener("blur", updateOnInteraction);
  }

  /**
   * Initialize activity tracking for authenticated user
   */
  public initializeTracking(): void {
    const authService = AuthService.getInstance();

    if (authService.isAuthenticated()) {
      this.startPeriodicTracking();
      this.setupInteractionTracking();
    }
  }

  /**
   * Cleanup activity tracking
   */
  public cleanup(): void {
    this.stopPeriodicTracking();
    this.cleanupInteractionTracking();
  }
}

export default ActivityService;
