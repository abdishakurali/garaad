"use client";

import React, { useEffect } from "react";
import ActivityService from "@/services/activity";
import AuthService from "@/services/auth";

interface ActivityProviderProps {
    children: React.ReactNode;
}

export default function ActivityProvider({ children }: ActivityProviderProps) {
    useEffect(() => {
        const authService = AuthService.getInstance();
        const activityService = ActivityService.getInstance();

        // Initialize activity tracking if user is authenticated
        if (authService.isAuthenticated()) {
            activityService.initializeTracking();
        }

        // Cleanup on unmount
        return () => {
            activityService.cleanup();
        };
    }, []);

    return <>{children}</>;
} 