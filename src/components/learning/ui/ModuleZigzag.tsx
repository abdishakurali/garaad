"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Module } from "@/types/learning";
import { UserProgress } from "@/services/progress";
import { PlayCircle, ReplyIcon, CheckCircle, LogIn, Lock, Sparkles } from "lucide-react";
import AuthService from "@/services/auth";
import { cn } from "@/lib/utils";

interface ModuleZigzagProps {
    modules: Module[];
    progress: UserProgress[];
    onModuleClick: (moduleId: number) => void;
    /** Fired when user taps a module row (selection only); used to sync external lesson CTAs. */
    onModuleSelect?: (moduleId: number, firstLessonId: number) => void;
    activeModuleId?: number;
    /** First lesson of the course by order (same as LessonDetailClient). */
    firstLessonIdOfCourse?: number | null;
    /** First N lessons (by course order) unlocked without premium. */
    freeLessonIdSet?: ReadonlySet<number>;
    /** Premium / paid: all lessons unlocked. */
    hasFullLessonAccess?: boolean;
    /** Total XP from gamification (optional). Shown in progress summary. */
    xp?: number;
    /** Course URL segments — used to open locked lessons in-place (upgrade modal) instead of /subscribe. */
    categoryId: string;
    courseSlug: string;
    /** When true, hide the fixed bottom CTA bar (course overview uses a single primary CTA above). */
    suppressBottomCta?: boolean;
}

export default function ModuleZigzag({
    modules,
    progress,
    onModuleClick,
    onModuleSelect,
    activeModuleId,
    firstLessonIdOfCourse = null,
    freeLessonIdSet = new Set<number>(),
    hasFullLessonAccess = false,
    xp,
    categoryId,
    courseSlug,
    suppressBottomCta = false,
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
        const lessons = module.lessons ?? [];
        if (lessons.length > 0) {
            const sorted = [...lessons].sort(
                (a, b) =>
                    ((a as { lesson_number?: number }).lesson_number ?? 0) -
                    ((b as { lesson_number?: number }).lesson_number ?? 0)
            );
            const firstId = sorted[0]?.id;
            if (firstId != null) {
                onModuleSelect?.(module.id, Number(firstId));
            }
        }
        setSelectedModule(module);
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
    const selectedLessonUnlocked =
        selectedModuleFirstLessonId != null &&
        (hasFullLessonAccess || freeLessonIdSet.has(Number(selectedModuleFirstLessonId)));

    // Handle button click based on authentication and premium status
    const handleButtonClick = () => {
        const user = authService.getCurrentUser();
        const isAuthenticated = !!user;

        if (!isAuthenticated) {
            if (
                selectedModule &&
                selectedModuleFirstLessonId != null &&
                freeLessonIdSet.has(Number(selectedModuleFirstLessonId))
            ) {
                router.push(
                    `/courses/${categoryId}/${courseSlug}/lessons/${selectedModuleFirstLessonId}`
                );
                return;
            }
            router.push("/login");
            return;
        }

        if (!hasFullLessonAccess && !selectedLessonUnlocked && selectedModuleFirstLessonId != null) {
            router.push(
                `/courses/${categoryId}/${courseSlug}/lessons/${selectedModuleFirstLessonId}`
            );
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
    /* eslint-disable react-hooks/set-state-in-effect -- sync selection with URL/props; no external store */
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
    /* eslint-enable react-hooks/set-state-in-effect */

    const selectedModuleProgress = selectedModule ? hasModuleProgress(selectedModule.id) : false;
    const selectedModuleCompleted = selectedModule ? isModuleCompleted(selectedModule.title) : false;

    const user = authService.getCurrentUser();
    const isAuthenticated = !!user;
    const canStartLesson = isAuthenticated && selectedLessonUnlocked;
    const opensUpgradeFromLesson =
        !hasFullLessonAccess && !selectedLessonUnlocked && !!selectedModule;
    const needsLoginForFreeFirst =
        !isAuthenticated &&
        !!selectedModule &&
        selectedModuleFirstLessonId != null &&
        freeLessonIdSet.has(Number(selectedModuleFirstLessonId));

    const completedCount = useMemo(
        () => progress.filter((p) => p.status === "completed" && uniqueModules.some((m) => m.title === p.lesson_title)).length,
        [progress, uniqueModules]
    );
    const totalCount = uniqueModules.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const isModuleLocked = useCallback(
        (moduleId: number) => {
            if (hasFullLessonAccess) return false;
            const mod = uniqueModules.find((m) => m.id === moduleId);
            const lessons = mod?.lessons ?? [];
            if (lessons.length === 0) return false;
            const sorted = [...lessons].sort(
                (a, b) => ((a as any).lesson_number ?? 0) - ((b as any).lesson_number ?? 0)
            );
            const firstLessonId = sorted[0]?.id;
            return (
                firstLessonId != null && !freeLessonIdSet.has(Number(firstLessonId))
            );
        },
        [hasFullLessonAccess, uniqueModules, freeLessonIdSet]
    );

    return (
        <div
            className={cn(
                "max-w-md mx-auto p-4",
                suppressBottomCta ? "pb-4" : "pb-32"
            )}
        >
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
                {isAuthenticated && xp !== undefined && (
                    <span className="rounded-full bg-purple-600/20 text-purple-400 px-3 py-1 text-sm font-medium border border-purple-500/30">
                        {xp} XP
                    </span>
                )}
            </div>

            {/* Course Modules - Zigzag Pattern (original gradient ring style) */}
            <ul className="list-none p-0 m-0">
                {uniqueModules.map((module, index) => {
                    const isCompleted = isModuleCompleted(module.title);
                    const isActive = activeModuleId === module.id;
                    const isSelected = selectedModule?.id === module.id;
                    const isLocked = isModuleLocked(module.id);
                    const isRightAligned = index % 2 === 1;

                    const ringClasses = cn(
                        "w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ease-in-out transform",
                        isCompleted && "bg-gradient-to-br from-purple-400 to-purple-600 scale-100",
                        (isActive || isSelected) && !isCompleted && "bg-gradient-to-br from-purple-400 to-purple-600 scale-105",
                        !(isActive || isSelected) && !isCompleted && "bg-gradient-to-br from-gray-300 to-gray-400 scale-100"
                    );
                    const innerClasses = cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out",
                        (isCompleted || (isActive || isSelected)) && "bg-gradient-to-br from-purple-400 to-purple-600",
                        !isCompleted && !(isActive || isSelected) && "bg-gradient-to-br from-gray-300 to-gray-400"
                    );

                    const circleContent = (
                        <div className="relative">
                            <div className={ringClasses}>
                                <div className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center transition-all duration-500">
                                    <div className={innerClasses}>
                                        <div className="w-8 h-8 bg-white dark:bg-black rounded-full flex items-center justify-center transition-all duration-300 shadow-inner">
                                            {isCompleted && <CheckCircle className="w-4 h-4 text-purple-600 transition-all duration-300" />}
                                            {!isCompleted && isLocked && <Lock className="w-4 h-4 text-gray-500 transition-all duration-300" />}
                                            {!isCompleted && !isLocked && <PlayCircle className="w-4 h-4 text-purple-600 transition-all duration-300" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );

                    return (
                        <li
                            key={module.id}
                            className={cn(
                                "flex items-center mb-12 cursor-pointer transition-all duration-200",
                                isRightAligned ? "justify-end mr-4" : "ml-4",
                                isLocked && "opacity-90"
                            )}
                            onClick={() => handleModuleClick(module)}
                        >
                            {isRightAligned ? (
                                <>
                                    <div className="text-right">
                                        <h3 className={cn(
                                            "text-base font-medium transition-colors duration-300",
                                            (isActive || isSelected) ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-700"
                                        )}>
                                            {module.title.split(' ').slice(0, -1).join(' ')}
                                        </h3>
                                        <h4 className={cn(
                                            "text-base font-medium transition-colors duration-300",
                                            (isActive || isSelected) ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-700"
                                        )}>
                                            {module.title.split(' ').slice(-1).join(' ')}
                                        </h4>
                                    </div>
                                    <div className="ml-6">{circleContent}</div>
                                </>
                            ) : (
                                <>
                                    <div className="mr-6">{circleContent}</div>
                                    <div>
                                        <h3 className={cn(
                                            "text-base font-medium transition-colors duration-300",
                                            (isActive || isSelected) ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-700"
                                        )}>
                                            {module.title.split(' ').slice(0, -1).join(' ')}
                                        </h3>
                                        <h4 className={cn(
                                            "text-base font-medium transition-colors duration-300",
                                            (isActive || isSelected) ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-700"
                                        )}>
                                            {module.title.split(' ').slice(-1).join(' ')}
                                        </h4>
                                    </div>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* Fixed Bottom Action Bar */}
            {uniqueModules.length > 0 && !suppressBottomCta && (
                <div className="fixed bottom-0 md:w-96 left-4 right-4 md:left-auto md:right-1/3 md:transform md:translate-x-1/2 bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-lg border-t border-gray-100 dark:border-slate-800 z-50" style={{ maxWidth: '40rem' }}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
                        {selectedModule?.title || uniqueModules[0]?.title || 'Qayb dooro'}
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
                            ) : opensUpgradeFromLesson ? (
                                <>
                                    <Sparkles className="inline w-4 h-4 mr-2" />
                                    Ku biir Challenge-ka
                                </>
                            ) : needsLoginForFreeFirst ? (
                                <>
                                    <LogIn className="inline w-4 h-4 mr-2" />
                                    Soo gal
                                </>
                            ) : !canStartLesson ? (
                                <>
                                    <LogIn className="inline w-4 h-4 mr-2" />
                                    Soo gal
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