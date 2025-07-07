"use client";

import React, { useState, useEffect } from "react";
import MonitoringService from "@/services/monitoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Activity,
    Zap,
    TrendingUp,
    Download,
    RefreshCw
} from "lucide-react";

interface MonitoringDashboardProps {
    className?: string;
}

export default function MonitoringDashboard({ className = "" }: MonitoringDashboardProps) {
    const [metrics, setMetrics] = useState<import("@/services/monitoring").MonitoringData | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshMetrics = () => {
        setIsRefreshing(true);
        const monitoringService = MonitoringService.getInstance();
        const currentMetrics = monitoringService.getCurrentMetrics();
        setMetrics(currentMetrics);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refreshMetrics();

        // Refresh metrics every 30 seconds
        const interval = setInterval(refreshMetrics, 30000);

        return () => clearInterval(interval);
    }, []);

    const exportMetrics = () => {
        const monitoringService = MonitoringService.getInstance();
        const data = monitoringService.exportMetrics();

        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `activity-metrics-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetMetrics = () => {
        const monitoringService = MonitoringService.getInstance();
        monitoringService.resetMetrics();
        refreshMetrics();
    };

    if (!metrics) {
        return (
            <Card className={className}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Qiyaasyo la heli karo ma jiraan</p>
                            <Button onClick={refreshMetrics} variant="outline" className="mt-2">
                                Cusbonaynta Qiyaasyada
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const formatFileSize = (bytes: number) => {
        return `${bytes} MB`;
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">La-socodka Dhaqdhaqaaqa</h2>
                    <p className="text-gray-600">Qiyaasyo waqti-dhabta ah ee waxqabadka iyo isdhexgalka</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={refreshMetrics}
                        disabled={isRefreshing}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                        Cusbonaynta
                    </Button>
                    <Button onClick={exportMetrics} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Soo saarka
                    </Button>
                    <Button onClick={resetMetrics} variant="outline" size="sm">
                        Dib u dejinta
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Performance Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Waxqabadka
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Waqtiga Jawaabta API</span>
                                <span className="font-mono text-sm">{metrics.performance.apiResponseTime}ms</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Isticmaalka Xusuusta</span>
                                <span className="font-mono text-sm">{formatFileSize(metrics.performance.memoryUsage)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Dhegeystayaasha Dhacdada</span>
                                <span className="font-mono text-sm">{metrics.performance.eventListeners}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Heerka Khaladka</span>
                                <span className="font-mono text-sm">{metrics.performance.errorRate.toFixed(1)}%</span>
                            </div>
                        </div>

                        {/* Error Rate Progress */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>Heerka Khaladka</span>
                                <span>{metrics.performance.errorRate.toFixed(1)}%</span>
                            </div>
                            <Progress
                                value={metrics.performance.errorRate}
                                className="h-2"
                                style={{
                                    backgroundColor: metrics.performance.errorRate > 5 ? "#fef2f2" : "#f0f9ff",
                                    color: metrics.performance.errorRate > 5 ? "#dc2626" : "#3b82f6"
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* User Engagement */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Isdhexgalka Isticmaalaha
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Muddada Fadhiga</span>
                                <span className="font-mono text-sm">{formatDuration(metrics.engagement.sessionDuration)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Isdhexgalka/daqiiqo</span>
                                <span className="font-mono text-sm">{metrics.engagement.interactionsPerMinute}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Cusboonaysiinta Dhaqdhaqaaqa</span>
                                <span className="font-mono text-sm">{metrics.engagement.activityUpdatesToday}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Streak-ga la Ilaaliyay</span>
                                <Badge variant={metrics.engagement.streakMaintained ? "default" : "secondary"}>
                                    {metrics.engagement.streakMaintained ? "Haa" : "Maya"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Xaalada Nidaamka
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Cusboonaysiinta Dambe</span>
                                <span className="font-mono text-sm">
                                    {new Date(metrics.performance.lastUpdate).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Muddo dhexdhexaad ah</span>
                                <span className="font-mono text-sm">5 daqiiqo</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Hadafka Maalinlaha</span>
                                <Badge variant={metrics.engagement.dailyGoalCompleted ? "default" : "secondary"}>
                                    {metrics.engagement.dailyGoalCompleted ? "Dhammaaday" : "Waa la socodaa"}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Dhaqdhaqaaqa Dambe</span>
                                <span className="font-mono text-sm">
                                    {new Date(metrics.engagement.lastActivity).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Metrics History */}
            <Card>
                <CardHeader>
                    <CardTitle>Taariikhda Qiyaasyada</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Waqtiga</span>
                            <span>Waqtiga Jawaabta</span>
                            <span>Heerka Khaladka</span>
                            <span>Isdhexgalka</span>
                        </div>
                        {MonitoringService.getInstance().getMetricsHistory().slice(-5).reverse().map((metric, index) => (
                            <div key={index} className="flex justify-between text-sm border-b pb-2">
                                <span className="font-mono">
                                    {new Date(metric.timestamp).toLocaleTimeString()}
                                </span>
                                <span className="font-mono">{metric.performance.apiResponseTime}ms</span>
                                <span className="font-mono">{metric.performance.errorRate.toFixed(1)}%</span>
                                <span className="font-mono">{metric.engagement.interactionsPerMinute}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 