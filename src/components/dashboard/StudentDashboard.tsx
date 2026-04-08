"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { progressService } from "@/services/progress";
import type { UserProgress } from "@/services/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Trophy, Clock, Zap, Target, Star, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function StudentDashboard() {
    const { user } = useAuthStore();
    const [progress, setProgress] = useState<UserProgress[]>([]);
    const [gamification, setGamification] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const progressData = await progressService.getUserProgress();
                setProgress(progressData);
                setGamification(null);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const activeCoursesCount = useMemo(() => {
        if (!Array.isArray(progress)) return 0;
        const uniqueCourses = new Set(progress.map(p => p.course_title));
        return uniqueCourses.size;
    }, [progress]);

    const completedLessonsCount = useMemo(() => {
        if (!Array.isArray(progress)) return 0;
        return progress.filter(p => p.status === "completed").length;
    }, [progress]);

    if (isLoading) {
        return (
            <div className="flex items-center max-w-7xl mx-auto justify-center min-h-[400px] bg-background dark:bg-[#09090b] transition-colors duration-300">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 pt-6 px-4 sm:px-6 animate-in fade-in duration-500 max-w-7xl mx-auto min-h-screen bg-background dark:bg-[#09090b] transition-colors duration-300">
            {/* Hero Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/80 dark:from-primary dark:via-primary/90 dark:to-primary/80 p-8 md:p-12 text-white shadow-2xl shadow-primary/20 dark:shadow-primary/25 dark:ring-1 dark:ring-white/10">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
                        Ku soo dhawaaw, {user?.name || "Arday"}! 👋
                    </h1>
                    <p className="text-white/90 text-lg mb-8 leading-relaxed">
                        Maanta waa maalin cusub oo aad wax badan ku baran karto.
                        Halkaan ka eeg horumarkaaga iyo dhibcaha aad heshay.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/courses">
                            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Sii wad barashada
                            </Button>
                        </Link>
                        {gamification?.next_action && (
                            <Link href="/courses">
                                <Button variant="secondary" size="lg" className="bg-primary/20 hover:bg-primary/30 text-white border-primary/30 backdrop-blur-sm">
                                    <Target className="w-4 h-4 mr-2" />
                                    {gamification.next_action.title}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
                <Star className="absolute top-12 right-12 w-8 h-8 text-white/20 animate-pulse" />
            </div>

            {/* Gamification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Trophy className="w-6 h-6 text-yellow-500" />}
                    title="Horumarkaaga"
                    value={completedLessonsCount.toString()}
                    description="Casharro la dhammaystiray"
                    progress={gamification?.progress_percent}
                    color="yellow"
                />
                <StatCard
                    icon={<Zap className="w-6 h-6 text-orange-500" />}
                    title="Maalmo Xiriir ah"
                    value={gamification?.current_streak?.toString() || "0"}
                    description={`Longest: ${gamification?.max_streak || 0}`}
                    color="orange"
                />
                <StatCard
                    icon={<GraduationCap className="w-6 h-6 text-blue-500" />}
                    title="Koorsooyinka"
                    value={activeCoursesCount.toString()}
                    description="Koorsooyin aad bilowday"
                    color="blue"
                />
                <StatCard
                    icon={<Clock className="w-6 h-6 text-indigo-500" />}
                    title="Casharrada"
                    value={completedLessonsCount.toString()}
                    description="Casharro la dhammaystiray"
                    color="indigo"
                />
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Progress hierarchy */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                            <Activity className="w-6 h-6 text-primary" />
                            Horumarkaaga
                        </h2>
                    </div>
                    <ProgressCard progress={progress} />
                </div>

                {/* Right Column: Recent Activity & Rewards */}
                <div className="space-y-8">
                    {/* Level Progress */}
                    {gamification && (
                        <Card className="overflow-hidden border border-border dark:border-slate-800 shadow-xl dark:shadow-none bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-950/80">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    Heerkaaga hadda
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <span className="text-4xl font-black text-primary">Lvl {gamification.level}</span>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Sii wad horumarkaaga</span>
                                </div>
                                <Progress value={gamification.progress_percent} className="h-3 bg-slate-200 dark:bg-slate-800" />
                                <div className="p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold text-primary">{gamification.league?.name || "Beginner"} League</p>
                                        <p className="text-slate-500 dark:text-slate-400">Rank #{gamification.league?.rank || 1} toddobaadkan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Activity Feed */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Dhaq-dhaqaaqii dhowaa
                        </h2>
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {Array.isArray(progress) && progress.slice(0, 5).map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${item.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {item.status === 'completed' ? <Star className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                                    {item.lesson_title}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">{item.course_title}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                        </div>
                                    ))}
                                    {(!Array.isArray(progress) || progress.length === 0) && (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                                                <Activity className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">Ma jiraan dhaqdhaqaaqyo</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
    progress?: number;
    color: 'yellow' | 'orange' | 'blue' | 'indigo';
}

function StatCard({ icon, title, value, description, progress, color }: StatCardProps) {
    const colorClasses = {
        yellow: 'from-yellow-50 to-white dark:from-yellow-900/10 border-yellow-100 dark:border-yellow-900/20',
        orange: 'from-orange-50 to-white dark:from-orange-900/10 border-orange-100 dark:border-orange-900/20',
        blue: 'from-blue-50 to-white dark:from-blue-900/10 border-blue-100 dark:border-blue-900/20',
        indigo: 'from-indigo-50 to-white dark:from-indigo-900/10 border-indigo-100 dark:border-indigo-900/20'
    };

    return (
        <Card className={`overflow-hidden border border-border dark:border-slate-800 shadow-md bg-gradient-to-br ${colorClasses[color]} hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                        {icon}
                    </div>
                    {progress !== undefined && (
                        <div className="w-12 h-12 relative flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    className="text-slate-100 dark:text-slate-800"
                                    strokeWidth="3"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="18"
                                    cx="24"
                                    cy="24"
                                />
                                <circle
                                    className="text-primary transition-all duration-1000"
                                    strokeWidth="3"
                                    strokeDasharray={113}
                                    strokeDashoffset={113 - (113 * progress) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="18"
                                    cx="24"
                                    cy="24"
                                />
                            </svg>
                            <span className="absolute text-[10px] font-bold">{progress}%</span>
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tight text-foreground">{value}</span>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{description}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
