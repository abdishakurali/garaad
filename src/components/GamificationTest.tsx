"use client";

import { useState } from "react";
import { useGamificationStatus, useNotification, useStreak } from "@/services/gamification";

interface TestResults {
    status?: unknown;
    notifications?: unknown;
    streak?: unknown;
    energy?: unknown;
    error?: string;
}

export function GamificationTest() {
    const [testResults, setTestResults] = useState<TestResults>({});
    const [isTesting, setIsTesting] = useState(false);

    const { gamificationStatus, isLoading: statusLoading } = useGamificationStatus();
    const { notification, isLoading: notificationLoading } = useNotification();
    const { streak, isLoading: streakLoading } = useStreak();

    const runTests = async () => {
        setIsTesting(true);
        const results: TestResults = {};

        try {
            // Test 1: Gamification Status
            console.log("Testing gamification status...");
            results.status = gamificationStatus;
            console.log("✅ Gamification Status:", gamificationStatus);

            // Test 2: Notifications
            console.log("Testing notifications...");
            results.notifications = notification;
            console.log("✅ Notifications:", notification);

            // Test 3: Streak Data
            console.log("Testing streak data...");
            results.streak = streak;
            console.log("✅ Streak Data:", streak);

            // Test 4: Energy Usage - We'll test this separately since it's a mutation
            console.log("Testing energy usage...");
            try {
                const response = await fetch("/api/gamification/use_energy/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const energyResult = await response.json();
                    results.energy = energyResult;
                    console.log("✅ Energy Usage:", energyResult);
                } else {
                    results.energy = { error: "Failed to use energy" };
                    console.log("❌ Energy Usage Error: Failed to use energy");
                }
            } catch (error) {
                results.energy = { error: error instanceof Error ? error.message : "Unknown error" };
                console.log("❌ Energy Usage Error:", error);
            }

            setTestResults(results);
        } catch (error) {
            console.error("Test error:", error);
            setTestResults({ error: error instanceof Error ? error.message : "Unknown error" });
        } finally {
            setIsTesting(false);
        }
    };

    const isLoading = statusLoading || notificationLoading || streakLoading;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Gamification System Test</h2>

            <div className="mb-4">
                <button
                    onClick={runTests}
                    disabled={isLoading || isTesting}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isTesting ? "Testing..." : "Run Tests"}
                </button>
            </div>

            {isLoading && (
                <div className="mb-4 p-4 bg-blue-50 rounded">
                    <p className="text-blue-800">Loading gamification data...</p>
                </div>
            )}

            {Object.keys(testResults).length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Test Results:</h3>

                    {testResults.error ? (
                        <div className="p-4 bg-red-50 rounded">
                            <p className="text-red-800">❌ Test Error: {testResults.error}</p>
                        </div>
                    ) : (
                        <>
                            {testResults.status && (
                                <div className="p-4 bg-green-50 rounded">
                                    <h4 className="font-semibold text-green-800">✅ Gamification Status</h4>
                                    <pre className="text-sm text-green-700 mt-2 overflow-auto">
                                        {JSON.stringify(testResults.status, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {testResults.notifications && (
                                <div className="p-4 bg-green-50 rounded">
                                    <h4 className="font-semibold text-green-800">✅ Notifications</h4>
                                    <pre className="text-sm text-green-700 mt-2 overflow-auto">
                                        {JSON.stringify(testResults.notifications, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {testResults.streak && (
                                <div className="p-4 bg-green-50 rounded">
                                    <h4 className="font-semibold text-green-800">✅ Streak Data</h4>
                                    <pre className="text-sm text-green-700 mt-2 overflow-auto">
                                        {JSON.stringify(testResults.streak, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {testResults.energy && (
                                <div className="p-4 bg-green-50 rounded">
                                    <h4 className="font-semibold text-green-800">✅ Energy Usage</h4>
                                    <pre className="text-sm text-green-700 mt-2 overflow-auto">
                                        {JSON.stringify(testResults.energy, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
} 