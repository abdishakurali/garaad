interface PerformanceMetrics {
  apiResponseTime: number;
  memoryUsage: number;
  eventListeners: number;
  updateInterval: number;
  errorRate: number;
  lastUpdate: string;
}

interface UserEngagementMetrics {
  sessionDuration: number;
  interactionsPerMinute: number;
  activityUpdatesToday: number;
  streakMaintained: boolean;
  dailyGoalCompleted: boolean;
  lastActivity: string;
}

export interface MonitoringData {
  performance: PerformanceMetrics;
  engagement: UserEngagementMetrics;
  timestamp: string;
}

interface WindowWithPerformance extends Window {
  performance: Performance & {
    memory?: {
      usedJSHeapSize: number;
    };
  };
}

export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: MonitoringData[] = [];
  private sessionStartTime: number = Date.now();
  private interactionCount: number = 0;
  private lastInteractionTime: number = Date.now();
  private activityUpdateCount: number = 0;
  private errorCount: number = 0;
  private totalRequests: number = 0;

  private constructor() {
    this.initializeMonitoring();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private initializeMonitoring() {
    // Track user interactions
    if (typeof window !== "undefined") {
      const trackInteraction = () => {
        this.interactionCount++;
        this.lastInteractionTime = Date.now();
      };

      document.addEventListener("click", trackInteraction);
      document.addEventListener("scroll", trackInteraction);
      document.addEventListener("keypress", trackInteraction);

      // Track page visibility
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          trackInteraction();
        }
      });
    }
  }

  public recordActivityUpdate(success: boolean, responseTime: number) {
    this.totalRequests++;
    this.activityUpdateCount++;

    if (!success) {
      this.errorCount++;
    }

    const metrics: MonitoringData = {
      performance: {
        apiResponseTime: responseTime,
        memoryUsage: this.getMemoryUsage(),
        eventListeners: this.getEventListenersCount(),
        updateInterval: 5 * 60 * 1000, // 5 minutes
        errorRate: (this.errorCount / this.totalRequests) * 100,
        lastUpdate: new Date().toISOString(),
      },
      engagement: {
        sessionDuration: Date.now() - this.sessionStartTime,
        interactionsPerMinute: this.calculateInteractionsPerMinute(),
        activityUpdatesToday: this.activityUpdateCount,
        streakMaintained: true, // This would be updated based on actual data
        dailyGoalCompleted: false, // This would be updated based on actual data
        lastActivity: new Date(this.lastInteractionTime).toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.metrics.push(metrics);

    // Keep only last 100 metrics to prevent memory issues
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  public getCurrentMetrics(): MonitoringData | null {
    if (this.metrics.length === 0) return null;
    return this.metrics[this.metrics.length - 1];
  }

  public getMetricsHistory(): MonitoringData[] {
    return [...this.metrics];
  }

  public getPerformanceMetrics(): PerformanceMetrics | null {
    const current = this.getCurrentMetrics();
    return current ? current.performance : null;
  }

  public getUserEngagementMetrics(): UserEngagementMetrics | null {
    const current = this.getCurrentMetrics();
    return current ? current.engagement : null;
  }

  private getMemoryUsage(): number {
    if (
      typeof window !== "undefined" &&
      (window as WindowWithPerformance).performance &&
      (window as WindowWithPerformance).performance.memory
    ) {
      const memory = (window as WindowWithPerformance).performance.memory!;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // Convert to MB
    }
    return 0;
  }

  private getEventListenersCount(): number {
    // This is a rough estimate - in a real app you'd track this more precisely
    return 6; // We have 6 event listeners for activity tracking
  }

  private calculateInteractionsPerMinute(): number {
    const sessionDuration = Date.now() - this.sessionStartTime;
    const minutes = sessionDuration / (1000 * 60);
    return Math.round(this.interactionCount / minutes);
  }

  public resetMetrics(): void {
    this.metrics = [];
    this.sessionStartTime = Date.now();
    this.interactionCount = 0;
    this.lastInteractionTime = Date.now();
    this.activityUpdateCount = 0;
    this.errorCount = 0;
    this.totalRequests = 0;
  }

  public exportMetrics(): string {
    return JSON.stringify(
      {
        metrics: this.metrics,
        summary: {
          totalSessions: this.metrics.length,
          averageResponseTime: this.calculateAverageResponseTime(),
          averageErrorRate: this.calculateAverageErrorRate(),
          totalInteractions: this.interactionCount,
          sessionDuration: Date.now() - this.sessionStartTime,
        },
      },
      null,
      2
    );
  }

  private calculateAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce(
      (sum, metric) => sum + metric.performance.apiResponseTime,
      0
    );
    return Math.round(total / this.metrics.length);
  }

  private calculateAverageErrorRate(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce(
      (sum, metric) => sum + metric.performance.errorRate,
      0
    );
    return Math.round(total / this.metrics.length);
  }
}

export default MonitoringService;
