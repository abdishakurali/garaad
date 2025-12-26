import AuthService from "./auth";
import MonitoringService from "./monitoring";
import { ActivityUpdatePayload, ActivityUpdateResponse } from "@/types/gamification";
import { API_BASE_URL } from "@/lib/constants";

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
   * Update user activity (V2 Single Mutation Path)
   */
  public async updateActivity(actionType: string = "online", payload?: Record<string, any>): Promise<ActivityUpdateResponse> {
    const startTime = Date.now();
    let success = false;
    const requestId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : this.generateFallbackUUID();

    try {
      const token = await AuthService.getInstance().ensureValidToken();

      if (!token) {
        throw new Error("Authentication required");
      }

      const body: any = {
        action_type: actionType,
        activity_type: actionType, // Mirror for backward compatibility
      };

      if (payload?.problems_solved !== undefined) body.problems_solved = payload.problems_solved;
      if (payload?.energy_spent !== undefined) body.energy_spent = payload.energy_spent;
      if (payload?.lesson_ids !== undefined) body.lesson_ids = payload.lesson_ids;
      // Mirror keys that might be expected in different versions
      if (payload?.problem_id !== undefined) body.problem_id = payload.problem_id;
      if (payload?.answer !== undefined) body.answer = payload.answer;
      if (payload?.attempt_number !== undefined) body.attempt_number = payload.attempt_number;

      // Omit request_id temporarily to see if it fixes the 400
      // body.request_id = requestId;

      const response = await fetch(`${API_BASE_URL}/api/activity/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorData = {};
        try {
          const responseText = await response.text();
          try {
            errorData = JSON.parse(responseText);
          } catch (e) {
            errorData = { raw: responseText };
          }
        } catch (e) {
          errorData = { error: "Could not read response body" };
        }

        console.error(`Activity update failed [${response.status}] ${API_BASE_URL}/api/activity/update/:`, JSON.stringify(errorData, null, 2));

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

      return data as ActivityUpdateResponse;
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

  private generateFallbackUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
