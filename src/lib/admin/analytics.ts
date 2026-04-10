import { adminApi as api } from "@/lib/admin-api";

export interface OnboardingStats {
    goals: Record<string, number>;
    tracks: Record<string, number>;
    levels: Record<string, number>;
    time_per_day: Record<string, number>;
    completion_rate: number;
    total_with_onboarding?: number;
    completed_count?: number;
    /** Users with no UserOnboarding record (signed up before onboarding existed). */
    no_onboarding_data?: number;
}

export interface UserListItem {
    id: number;
    email: string;
    username: string;
    goal: string;
    track: string;
    level: string;
    time_per_day: string;
    date_joined: string | null;
}

export interface UserAnalytics {
    total: number;
    change: number;
    newUsers: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    activeUsers: {
        dau: number;
        dauChange: number;
        wau: number;
        wauChange: number;
        mau: number;
        mauChange: number;
    };
    retention: {
        day1: number;
        day7: number;
        day30: number;
    };
    churnRate: number;
    trends: {
        labels: string[];
        newUsers: number[];
        activeUsers: number[];
    };
    onboardingStats?: OnboardingStats | null;
    userList?: UserListItem[];
}

export interface RevenueAnalytics {
    total: number;
    change: number;
    collected_total?: number;
    attempted_total?: number;
    failed_payment_count?: number;
    failed_payment_total?: number;
    payment_attempt_users_count?: number;
    arpu: number;
    arpuChange: number;
    conversionRate: number;
    conversionChange: number;
    revenueByCourse: {
        name: string;
        revenue: number;
        percentage: number;
    }[];
    trends: {
        labels: string[];
        revenue: number[];
    };
}

export interface LessonDropOffRow {
    lessonId: number;
    lessonTitle: string;
    lessonNumber: number;
    courseId: number;
    courseTitle: string;
    learnersReached: number;
    learnersCompleted: number;
    completionRate: number;
    dropOffRate: number;
}

export interface CourseAnalytics {
    topCourses: {
        id: number;
        title: string;
        enrollments: number;
        completionRate: number;
        avgRating: number;
        revenue: number;
        trend: "up" | "down" | "neutral";
    }[];
    dropOffPoints: {
        lessonTitle: string;
        courseTitle: string;
        dropOffRate: number;
    }[];
    /** Per-lesson reach vs complete (sorted by drop-off). */
    lessonDropOff?: LessonDropOffRow[];
}

export interface RecentActivity {
    signups: {
        userName: string;
        timestamp: string;
        avatar: string;
    }[];
    purchases: {
        userName: string;
        course: string;
        amount: number;
        timestamp: string;
    }[];
    enrollments: {
        userName: string;
        course: string;
        timestamp: string;
    }[];
}

/** Admin users list (paginated) — for Users tab with onboarding + recommended_courses */
export interface AdminUserOnboarding {
    goal: string;
    goal_label: string;
    topic: string;
    time_per_day: string;
}

export interface AdminUserRow {
    id: number;
    name: string;
    email: string;
    date_joined: string | null;
    last_login: string | null;
    is_premium: boolean;
    is_email_verified?: boolean;
    onboarding: AdminUserOnboarding | null;
    recommended_courses: string[];
    completions: number;
    last_active: string | null;
    has_failed_payment?: boolean;
    /** Saved profile WhatsApp (E.164); empty if none */
    whatsapp_number?: string;
    /** Present only when user saved a profile WhatsApp number */
    whatsapp_href?: string | null;
}

export interface AdminUsersResponse {
    count: number;
    next: number | null;
    previous: number | null;
    results: AdminUserRow[];
    summary?: {
        total_users: number;
        premium: number;
        with_onboarding: number;
        no_onboarding: number;
        verified: number;
    };
}

export const analyticsService = {
    getUsers: async (): Promise<UserAnalytics> => {
        const response = await api.get("/lms/analytics/users/");
        return response.data;
    },
    getAdminUsers: async (
        page: number = 1,
        search?: string,
        filters?: {
            goal?: string;
            track?: string;
            is_premium?: "true" | "false" | "";
            is_email_verified?: "true" | "false" | "";
            user_filter?: string;
        }
    ): Promise<AdminUsersResponse> => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        if (search && search.trim()) params.set("search", search.trim());
        if (filters?.goal && filters.goal !== "All") params.set("goal", filters.goal);
        if (filters?.track && filters.track !== "All") params.set("track", filters.track);
        if (filters?.is_premium === "true") params.set("is_premium", "true");
        if (filters?.is_premium === "false") params.set("is_premium", "false");
        if (filters?.is_email_verified === "true") params.set("is_email_verified", "true");
        if (filters?.is_email_verified === "false") params.set("is_email_verified", "false");
        if (filters?.user_filter) params.set("user_filter", filters.user_filter);
        const response = await api.get(`/admin/users/?${params.toString()}`);
        return response.data;
    },
    getCohortEnrollments: async (): Promise<{
        success: boolean;
        data: {
            cohort: {
                id: string;
                name: string;
                start_date: string;
                end_date: string;
                max_students: number;
            } | null;
            enrollments: {
                id: string;
                user_id: number;
                name: string;
                email: string;
                enrolled_at: string | null;
                weekly_calls_attended_count: number;
                code_reviews_completed: number;
                certificate_issued: boolean;
            }[];
        };
    }> => {
        const response = await api.get("/cohorts/enrollments/");
        return response.data;
    },
    patchCohortEnrollment: async (
        enrollmentId: string,
        action: "mark_call_attended" | "issue_certificate"
    ): Promise<unknown> => {
        const response = await api.patch(`/cohorts/enrollments/${enrollmentId}/`, { action });
        return response.data;
    },
    getRevenue: async (): Promise<RevenueAnalytics> => {
        const response = await api.get("/lms/analytics/revenue/");
        return response.data;
    },
    getCourses: async (): Promise<CourseAnalytics> => {
        const response = await api.get("/lms/analytics/courses/");
        return response.data;
    },
    getActivity: async (): Promise<RecentActivity> => {
        const response = await api.get("/lms/analytics/activity/");
        return response.data;
    },
};
