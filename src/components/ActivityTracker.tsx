"use client";

import React from "react";
import { useActivityTracking } from "@/hooks/useActivityTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Clock, Target, CheckCircle } from "lucide-react";

interface ActivityTrackerProps {
    showDetails?: boolean;
    className?: string;
}

export default function ActivityTracker({
    showDetails = false,
    className = ""
}: ActivityTrackerProps) {
    const { activityData, isLoading, error, isTracking } = useActivityTracking();

    if (isLoading) {
        return (
            <Card className={`animate-pulse ${className}`}>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={`border-red-200 ${className}`}>
                <CardContent className="p-4">
                    <div className="text-sm text-red-600">
                        Activity tracking error: {error}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!activityData) {
        return null;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "complete":
                return "bg-green-100 text-green-800 border-green-200";
            case "partial":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "none":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "complete":
                return <CheckCircle className="w-4 h-4" />;
            case "partial":
                return <Target className="w-4 h-4" />;
            case "none":
                return <Clock className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("so-SO", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("so-SO", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className={`w-5 h-5 ${isTracking ? "text-yellow-500" : "text-gray-400"}`} />
                    Activity Status
                    {isTracking && (
                        <Badge variant="secondary" className="text-xs">
                            Tracking
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Streak Information */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{activityData.streak.current_streak}</span>
                        <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Max Streak</div>
                        <div className="font-semibold">{activityData.streak.max_streak}</div>
                    </div>
                </div>

                {/* Today's Activity Status */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Today&apos;s Activity</span>
                        <Badge className={getStatusColor(activityData.activity.status)}>
                            <div className="flex items-center gap-1">
                                {getStatusIcon(activityData.activity.status)}
                                {activityData.activity.status}
                            </div>
                        </Badge>
                    </div>

                    {activityData.activity.problems_solved > 0 && (
                        <div className="text-sm text-gray-600">
                            Problems solved: {activityData.activity.problems_solved}
                        </div>
                    )}
                </div>

                {/* Show details if requested */}
                {showDetails && (
                    <div className="space-y-3 pt-3 border-t">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Last Active</span>
                                <span className="font-medium">
                                    {formatTime(activityData.user.last_active)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Last Login</span>
                                <span className="font-medium">
                                    {formatDate(activityData.user.last_login)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Activity Date</span>
                                <span className="font-medium">
                                    {formatDate(activityData.activity_date)}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar for Daily Activity */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Daily Progress</span>
                                <span className="font-medium">
                                    {activityData.activity.problems_solved} problems
                                </span>
                            </div>
                            <Progress
                                value={activityData.activity.status === "complete" ? 100 :
                                    activityData.activity.status === "partial" ? 50 : 0}
                                className="h-2"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 