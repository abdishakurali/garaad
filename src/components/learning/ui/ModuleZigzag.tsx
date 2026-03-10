"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Module } from "@/types/learning";
import { UserProgress } from "@/services/progress";
import { PlayCircle, ReplyIcon, CheckCircle, UserPlus, Lock } from "lucide-react";
import AuthService from "@/services/auth";
import { cn } from "@/lib/utils";

interface ModuleZigzagProps {
    modules: Module[];
    progress: UserProgress[];
    onModuleClick: (moduleId: number) => void;
    activeModuleId?: number;
    /** First lesson of the course by order (same as LessonDetailClient). Free tier can only start this lesson. */
    firstLessonIdOfCourse?: number | null;
    /** Total XP from gamification (optional). Shown in progress summary. */
    xp?: number;
}

export default function ModuleZigzag({
    modules,
    progress,
    onModuleClick,
    activeModuleId,
    firstLessonIdOfCourse = null,
    xp,
}: ModuleZigzagProps) {
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const authService = AuthService.getInstance();

    const uniqueModules = useMemo(() => {
        const seenIds = new Set<number>();
        return modules.filter(module => {
            if (seenIds.has(module.id)) {
                return false;
            } else {
                seenIds.add(module.id);
                return true;
            }
        });
    }, [modules]);

    const isModuleCompleted = useCallback(
        (lessonTitle: string) => {
            return progress.some(
                (p) => p.lesson_title === lessonTitle && p.status === "completed"
            );
        },
        [progress]
    );

    const hasModuleProgress = useCallback(
        (moduleId: number) => {
            return progress.some(p => p.module_id === moduleId && p.status === 'in_progress');
        },
        [progress]
    );

    // Handle module box click
    const handleModuleClick = (module: Module) => {
        setSelectedModule(module);
        // Don't call onModuleClick here - only select for viewing
    };

    // Free tier: first lesson of course by lesson_number to match backend (Lesson has no order field)
    const selectedModuleFirstLessonId = useMemo(() => {
        const lessons = selectedModule?.lessons ?? [];
        if (lessons.length === 0) return null;
        const sorted = [...lessons].sort(
            (a, b) => ((a as any).lesson_number ?? 0) - ((b as any).lesson_number ?? 0)
        );
        return sorted[0]?.id ?? null;
    }, [selectedModule]);
    const isFirstLessonOfCourse =
        firstLessonIdOfCourse != null &&
        selectedModuleFirstLessonId != null &&
        Number(selectedModuleFirstLessonId) === Number(firstLessonIdOfCourse);

    // Handle button click based on authentication and premium status
    const handleButtonClick = () => {
        const user = authService.getCurrentUser();
        const isAuthenticated = !!user;
        const isPremium = authService.isPremium();

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        // Free users can only start the first lesson of the course; others → subscribe
        if (!isPremium && !isFirstLessonOfCourse) {
            router.push("/subscribe");
            return;
        }

        if (selectedModule) {
            setIsLoading(true);
            try {
                onModuleClick(selectedModule.id);
                setTimeout(() => setIsLoading(false), 1000);
            } catch (error) {
                console.error("Error starting lesson:", error);
                setIsLoading(false);
            }
        }
    };


    // Update selected module when activeModuleId changes
    useEffect(() => {
        if (activeModuleId) {
            const activeModule = uniqueModules.find(m => m.id === activeModuleId);
            if (activeModule) {
                setSelectedModule(activeModule);
            }
        }
    }, [activeModuleId, uniqueModules]);

    // Get the first module as default selected
    useEffect(() => {
        if (!selectedModule && uniqueModules.length > 0) {
            setSelectedModule(uniqueModules[0]);
        }
    }, [uniqueModules, selectedModule]);

    const selectedModuleProgress = selectedModule ? hasModuleProgress(selectedModule.id) : false;
    const selectedModuleCompleted = selectedModule ? isModuleCompleted(selectedModule.title) : false;

    const user = authService.getCurrentUser();
    const isAuthenticated = !!user;
    const isPremium = authService.isPremium();
    const canStartLesson = isAuthenticated && (isPremium || isFirstLessonOfCourse);

    const completedCount = useMemo(
        () => progress.filter((p) => p.status === "completed" && uniqueModules.some((m) => m.title === p.lesson_title)).length,
        [progress, uniqueModules]
    );
    const totalCount = uniqueModules.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const isModuleLocked = useCallback(
        (moduleId: number) => {
            if (!isAuthenticated || isPremium) return false;
            const firstLessonId = uniqueModules.find((m) => m.id === moduleId)?.lessons?.[0]?.id;
            return firstLessonId != null && firstLessonIdOfCourse != null && Number(firstLessonId) !== Number(firstLessonIdOfCourse);
        },
        [isAuthenticated, isPremium, uniqueModules, firstLessonIdOfCourse]
    );

    return (
        <div className="max-w-md mx-auto p-4 pb-32">
            {/* Progress summary at top */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{completedCount}/{totalCount}</span>
                        <svg className="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray={`${progressPercent * 1.68} 168`} strokeLinecap="round" className="transition-all duration-600 ease-out" />
                        </svg>
                    </div>
                    <span className="text-sm text-gray-400">{totalCount} casharro</span>
                </div>
                {xp !== undefined && (
                    <span className="rounded-full bg-purple-600/20 text-purple-400 px-3 py-1 text-sm font-medium border border-purple-500/30">
                        {xp} XP
                    </span>
                )}
            </div>

            {/* Course Modules - Zigzag Pattern */}
            <ul className="list-none p-0 m-0">
                {uniqueModules.map((module, index) => {
                    const isCompleted = isModuleCompleted(module.title);
                    const isActive = activeModuleId === module.id;
                    const isSelected = selectedModule?.id === module.id;
                    const isLocked = isModuleLocked(module.id);
                    const isRightAligned = index % 2 === 1;
                    const titleParts = module.title.split(' ');
                    const titleFirst = titleParts.slice(0, -1).join(' ');
                    const titleLast = titleParts.slice(-1).join(' ');

                    const circleContent = (
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
                            {isCompleted && (
                                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
                                </div>
                            )}
                            {!isCompleted && (isActive || isSelected) && (
                                <div className="w-12 h-12 rounded-full border-2 border-purple-500 flex items-center justify-center bg-transparent">
                                    <span className="w-2 h-2 rounded-full bg-purple-400 motion-safe:animate-pulse" />
                                </div>
                            )}
                            {!isCompleted && !(isActive || isSelected) && isLocked && (
                                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-gray-500" />
                                </div>
                            )}
                            {!isCompleted && !(isActive || isSelected) && !isLocked && (
                                <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                                    <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
                                </div>
                            )}
                        </div>
                    );

                    return (
                        <li
                            key={module.id}
                            className={cn(
                                "flex items-center mb-10 cursor-pointer transition-all duration-200 group",
                                isRightAligned ? "justify-end mr-4" : "ml-4",
                                isLocked && "cursor-not-allowed opacity-80"
                            )}
                            onClick={() => !isLocked && handleModuleClick(module)}
                        >
                            {isRightAligned ? (
                                <>
                                    <div className="text-right flex-1">
                                        <div className="flex items-center justify-end gap-2 flex-wrap">
                                            <h3 className={cn(
                                                "text-base transition-colors duration-300",
                                                isCompleted && "font-normal text-gray-300 dark:text-slate-400",
                                                (isActive || isSelected) && "font-bold text-white",
                                                isLocked && "text-gray-500",
                                                !isCompleted && !(isActive || isSelected) && !isLocked && "font-medium text-gray-300"
                                            )}>{titleFirst} {titleLast}</h3>
                                            {isCompleted && <span className="text-xs text-emerald-500/80">completed</span>}
                                        </div>
                                    </div>
                                    <div className="ml-4">{circleContent}</div>
                                </>
                            ) : (
                                <>
                                    <div className="mr-4">{circleContent}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className={cn(
                                                "text-base transition-colors duration-300",
                                                isCompleted && "font-normal text-gray-300 dark:text-slate-400",
                                                (isActive || isSelected) && "font-bold text-white",
                                                isLocked && "text-gray-500",
                                                !isCompleted && !(isActive || isSelected) && !isLocked && "font-medium text-gray-300"
                                            )}>{titleFirst} {titleLast}</h3>
                                            {isCompleted && <span className="text-xs text-emerald-500/80">completed</span>}
                                        </div>
                                    </div>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* Fixed Bottom Action Bar */}
            {uniqueModules.length > 0 && (
                <div className="fixed bottom-0 md:w-96 left-4 right-4 md:left-auto md:right-1/3 md:transform md:translate-x-1/2 bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-lg border-t border-gray-100 dark:border-slate-800 z-50" style={{ maxWidth: '40rem' }}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
                        {selectedModule?.title || uniqueModules[0]?.title || 'Select a module'}
                    </h2>

                    {isLoading ? (
                        <div className={`w-full rounded-2xl p-4 shadow-lg ${!canStartLesson
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                            : selectedModuleCompleted
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                                : selectedModuleProgress
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                    : 'bg-gradient-to-r from-purple-500 to-purple-600'
                            }`}>
                            <div className="flex items-center justify-center space-x-3">
                                <div className="relative">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                                <div className="text-white font-medium">
                                    <div className="text-sm">La soo rarayo...</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleButtonClick}
                            disabled={!selectedModule}
                            className={`w-full font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 text-base ${!selectedModule
                                ? 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-slate-600 cursor-not-allowed'
                                : !canStartLesson
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                    : selectedModuleCompleted
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                                        : selectedModuleProgress
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                            : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                                }`}
                        >
                            {!selectedModule ? (
                                <>
                                    <PlayCircle className="inline w-4 h-4 mr-2" />
                                    Billow
                                </>
                            ) : !canStartLesson ? (
                                <>
                                    <UserPlus className="inline w-4 h-4 mr-2" />
                                    KU SOO BIIR
                                </>
                            ) : selectedModuleCompleted ? (
                                <>
                                    <ReplyIcon className="inline w-4 h-4 mr-2" />
                                    Muraajacee
                                </>
                            ) : selectedModuleProgress ? (
                                <>
                                    <PlayCircle className="inline w-4 h-4 mr-2" />
                                    Sii Wado
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="inline w-4 h-4 mr-2" />
                                    Billow
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}