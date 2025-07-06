"use client";

import React, { useState } from "react";
import { useActivityTracking } from "@/hooks/useActivityTracking";
import ActivityService from "@/services/activity";
import ActivityTracker from "@/components/ActivityTracker";
import { ActivityTrackingDashboard } from "@/components/ActivityTrackingExamples";
import MonitoringDashboard from "@/components/MonitoringDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Zap,
    Activity,
    TestTube,
    Settings,
    CheckCircle,
    AlertCircle
} from "lucide-react";

export default function TestActivityPage() {
    const { activityData, isLoading, error, updateActivity, isTracking } = useActivityTracking();
    const [testResults, setTestResults] = useState<any[]>([]);
    const [isRunningTests, setIsRunningTests] = useState(false);

    const addTestResult = (testName: string, success: boolean, message: string, data?: any) => {
        setTestResults(prev => [...prev, {
            id: Date.now(),
            name: testName,
            success,
            message,
            data,
            timestamp: new Date().toISOString()
        }]);
    };

    const runIntegrationTests = async () => {
        setIsRunningTests(true);
        setTestResults([]);

        try {
            // Test 1: Check if ActivityService is available
            try {
                const activityService = ActivityService.getInstance();
                addTestResult("ActivityService Instance", true, "ActivityService singleton created successfully");
            } catch (error) {
                addTestResult("ActivityService Instance", false, `Failed to create ActivityService: ${error}`);
            }

            // Test 2: Check authentication
            try {
                const authService = (await import("@/services/auth")).default.getInstance();
                const isAuthenticated = authService.isAuthenticated();
                addTestResult("Authentication Check", isAuthenticated,
                    isAuthenticated ? "User is authenticated" : "User is not authenticated");
            } catch (error) {
                addTestResult("Authentication Check", false, `Authentication check failed: ${error}`);
            }

            // Test 3: Test activity update
            try {
                const activityService = ActivityService.getInstance();
                const result = await activityService.updateActivity();
                addTestResult("Activity Update", true, "Activity updated successfully", result);
            } catch (error) {
                addTestResult("Activity Update", false, `Activity update failed: ${error}`);
            }

            // Test 4: Check hook functionality
            if (activityData) {
                addTestResult("Hook Data", true, "Activity data available from hook", activityData);
            } else {
                addTestResult("Hook Data", false, "No activity data available from hook");
            }

            // Test 5: Check tracking status
            addTestResult("Tracking Status", isTracking,
                isTracking ? "Activity tracking is active" : "Activity tracking is not active");

            // Test 6: Check for errors
            if (error) {
                addTestResult("Error Handling", false, `Hook has error: ${error}`);
            } else {
                addTestResult("Error Handling", true, "No errors detected");
            }

        } catch (error) {
            addTestResult("Test Suite", false, `Test suite failed: ${error}`);
        } finally {
            setIsRunningTests(false);
        }
    };

    const clearTestResults = () => {
        setTestResults([]);
    };

    const getStatusIcon = (success: boolean) => {
        return success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Activity Tracking Test Page</h1>
                <p className="text-gray-600">Test and monitor the activity tracking integration</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="testing">Testing</TabsTrigger>
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* System Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5" />
                                    System Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span>Tracking Active:</span>
                                    <Badge variant={isTracking ? "default" : "secondary"}>
                                        {isTracking ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Loading:</span>
                                    <Badge variant={isLoading ? "default" : "secondary"}>
                                        {isLoading ? "Loading" : "Ready"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Error:</span>
                                    <Badge variant={error ? "destructive" : "secondary"}>
                                        {error ? "Error" : "None"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Current Activity Data */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Current Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activityData ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span>Streak:</span>
                                            <span className="font-bold">{activityData.streak.current_streak}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Status:</span>
                                            <Badge variant="outline">{activityData.activity.status}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Problems:</span>
                                            <span>{activityData.activity.problems_solved}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500">No activity data available</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={updateActivity}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    {isLoading ? "Updating..." : "Update Activity"}
                                </Button>
                                <Button
                                    onClick={runIntegrationTests}
                                    disabled={isRunningTests}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {isRunningTests ? "Running Tests..." : "Run Tests"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="testing" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TestTube className="w-5 h-5" />
                                Integration Tests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Button onClick={runIntegrationTests} disabled={isRunningTests}>
                                        {isRunningTests ? "Running..." : "Run All Tests"}
                                    </Button>
                                    <Button onClick={clearTestResults} variant="outline">
                                        Clear Results
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {testResults.map((result) => (
                                        <div key={result.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                            {getStatusIcon(result.success)}
                                            <div className="flex-1">
                                                <div className="font-medium">{result.name}</div>
                                                <div className="text-sm text-gray-600">{result.message}</div>
                                                {result.data && (
                                                    <details className="mt-2">
                                                        <summary className="cursor-pointer text-sm text-blue-600">
                                                            View Data
                                                        </summary>
                                                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                                            {JSON.stringify(result.data, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(result.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="components" className="space-y-6">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>ActivityTracker Component</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActivityTracker showDetails={true} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Example Components Dashboard</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActivityTrackingDashboard />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="monitoring" className="space-y-6">
                    <MonitoringDashboard />
                </TabsContent>
            </Tabs>
        </div>
    );
} 