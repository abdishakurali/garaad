"use client";

import React from "react";
import { useActivityTracking } from "@/hooks/useActivityTracking";
import ActivityService from "@/services/activity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, CheckCircle, Clock } from "lucide-react";

// Example 1: Simple Activity Display
export function SimpleActivityDisplay() {
    const { activityData, isLoading, error } = useActivityTracking();

    if (isLoading) return <div>Loading activity...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!activityData) return <div>No activity data</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Simple Activity Display
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span>Current Streak:</span>
                        <span className="font-bold">{activityData.streak.current_streak} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Today&apos;s Status:</span>
                        <Badge variant="outline">{activityData.activity.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Problems Solved:</span>
                        <span>{activityData.activity.problems_solved}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Example 2: Manual Activity Update
export function ManualActivityUpdate() {
    const { updateActivity, isLoading, error } = useActivityTracking();

    const handleManualUpdate = async () => {
        try {
            await updateActivity();
            console.log("Activity updated manually");
        } catch (error) {
            console.error("Manual update failed:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manual Activity Update</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Click the button below to manually update your activity status.
                    </p>
                    <Button
                        onClick={handleManualUpdate}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Updating..." : "Update Activity"}
                    </Button>
                    {error && (
                        <div className="text-sm text-red-600">
                            Error: {error}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Example 3: Activity Service Direct Usage
export function ActivityServiceExample() {
    const [lastUpdate, setLastUpdate] = React.useState<string>("");
    const [isUpdating, setIsUpdating] = React.useState(false);

    const handleServiceUpdate = async () => {
        setIsUpdating(true);
        try {
            const activityService = ActivityService.getInstance();
            const result = await activityService.updateActivity();
            setLastUpdate(new Date().toLocaleTimeString());
            console.log("Activity service update result:", result);
        } catch (error) {
            console.error("Activity service update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Service Direct Usage</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        This example shows how to use the ActivityService directly.
                    </p>
                    <Button
                        onClick={handleServiceUpdate}
                        disabled={isUpdating}
                        className="w-full"
                    >
                        {isUpdating ? "Updating..." : "Update via Service"}
                    </Button>
                    {lastUpdate && (
                        <div className="text-sm text-gray-600">
                            Last updated: {lastUpdate}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Example 4: Activity Status Indicator
export function ActivityStatusIndicator() {
    const { activityData, isTracking } = useActivityTracking();

    if (!activityData) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "complete":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "partial":
                return <Target className="w-4 h-4 text-yellow-500" />;
            case "none":
                return <Clock className="w-4 h-4 text-gray-400" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "complete":
                return "Daily goal completed!";
            case "partial":
                return "Making progress...";
            case "none":
                return "No activity today";
            default:
                return "Unknown status";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Activity Status
                    {isTracking && (
                        <Badge variant="secondary" className="text-xs">
                            Live
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                    {getStatusIcon(activityData.activity.status)}
                    <div>
                        <div className="font-medium">
                            {getStatusText(activityData.activity.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                            {activityData.activity.problems_solved} problems solved today
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Example 5: Streak Celebration
export function StreakCelebration() {
    const { activityData } = useActivityTracking();

    if (!activityData || activityData.streak.current_streak === 0) {
        return null;
    }

    const isNewStreak = activityData.activity.status === "complete" &&
        activityData.streak.current_streak > 0;

    return (
        <Card className={isNewStreak ? "border-yellow-300 bg-yellow-50" : ""}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Streak Celebration
                    {isNewStreak && (
                        <Badge className="bg-yellow-500 text-white">
                            New!
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600">
                            {activityData.streak.current_streak}
                        </div>
                        <div className="text-sm text-gray-600">
                            day{activityData.streak.current_streak !== 1 ? "s" : ""} streak
                        </div>
                    </div>

                    {activityData.streak.max_streak > activityData.streak.current_streak && (
                        <div className="text-center text-sm text-gray-600">
                            Best streak: {activityData.streak.max_streak} days
                        </div>
                    )}

                    {isNewStreak && (
                        <div className="text-center text-sm text-yellow-700 font-medium">
                            🎉 Congratulations on maintaining your streak!
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Example 6: Activity Tracking Dashboard
export function ActivityTrackingDashboard() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SimpleActivityDisplay />
            <ManualActivityUpdate />
            <ActivityServiceExample />
            <ActivityStatusIndicator />
            <StreakCelebration />
        </div>
    );
} 