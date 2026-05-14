"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/types/lms";
import { UserProgress } from "@/services/progress";
import { PlayCircle, ReplyIcon, CheckCircle, LogIn, Lock, Sparkles } from "lucide-react";
import AuthService from "@/services/auth";
import { cn } from "@/lib/utils";
import { pricingTranslations as t } from "@/config/translations/pricing";

interface PathZigzagProps {
    lessons: Lesson[];
    progress: UserProgress[];
    onLessonClick: (lessonId: number) => void;
    /** Fired when user taps a lesson row (selection only); used to sync external lesson CTAs. */
    onLessonSelect?: (lessonId: number) => void;
    activeLessonId?: number;
    /** First lesson of the week by order. */
    firstLessonIdOfCourse?: number | null;
    /** First N lessons (by course order) unlocked without premium. */
    freeLessonIdSet?: ReadonlySet<number>;
    /** Premium / paid: all lessons unlocked. */
    hasFullLessonAccess?: boolean;
    /** Course URL segments — used to open locked lessons in-place instead of /subscribe. */
    categoryId: string;
    courseSlug: string;
    /** When true, hide the fixed bottom CTA bar. */
    suppressBottomCta?: boolean;
}

export default function PathZigzag({
    lessons,
    progress,
    onLessonClick,
    onLessonSelect,
    activeLessonId,
    firstLessonIdOfCourse = null,
    freeLessonIdSet = new Set<number>(),
    hasFullLessonAccess = false,
    categoryId,
    courseSlug,
    suppressBottomCta = false,
}: PathZigzagProps) {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const authService = AuthService.getInstance();

    const uniqueLessons = useMemo(() => {
        const seenIds = new Set<number | string>();
        return lessons.filter(lesson => {
            if (seenIds.has(lesson.id)) {
                return false;
            } else {
                seenIds.add(lesson.id);
                return true;
            }
        });
    }, [lessons]);

    const sortedLessons = useMemo(() => {
        return [...uniqueLessons].sort(
            (a, b) => (a.lesson_number ?? 0) - (b.lesson_number ?? 0)
        );
    }, [uniqueLessons]);

    const isLessonCompleted = useCallback(
        (lessonTitle: string) => {
            return progress.some(
                (p) => p.lesson_title === lessonTitle && p.status === "completed"
            );
        },
        [progress]
    );

    const hasLessonProgress = useCallback(
        (lessonId: number | string) => {
            return progress.some(p => String(p.lesson) === String(lessonId) && p.status === 'in_progress');
        },
        [progress]
    );

    const handleLessonClick = (lesson: Lesson) => {
        onLessonSelect?.(Number(lesson.id));
        setSelectedLesson(lesson);
    };

    const selectedLessonUnlocked =
        selectedLesson != null &&
        (hasFullLessonAccess || freeLessonIdSet.has(Number(selectedLesson.id)));

    const handleButtonClick = () => {
        const user = authService.getCurrentUser();
        const isAuthenticated = !!user;

        if (!isAuthenticated) {
            if (
                selectedLesson &&
                freeLessonIdSet.has(Number(selectedLesson.id))
            ) {
                router.push(
                    `/courses/${categoryId}/${courseSlug}/lessons/${selectedLesson.id}`
                );
                return;
            }
            router.push("/login");
            return;
        }

        if (!hasFullLessonAccess && !selectedLessonUnlocked && selectedLesson != null) {
            router.push(
                `/courses/${categoryId}/${courseSlug}/lessons/${selectedLesson.id}`
            );
            return;
        }

        if (selectedLesson) {
            setIsLoading(true);
            try {
                onLessonClick(Number(selectedLesson.id));
                setTimeout(() => setIsLoading(false), 1000);
            } catch (error) {
                console.error("Error starting lesson:", error);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (activeLessonId) {
            const activeLesson = sortedLessons.find(l => Number(l.id) === activeLessonId);
            if (activeLesson) {
                setSelectedLesson(activeLesson);
            }
        }
    }, [activeLessonId, sortedLessons]);

    useEffect(() => {
        if (!selectedLesson && sortedLessons.length > 0) {
            setSelectedLesson(sortedLessons[0]);
        }
    }, [sortedLessons, selectedLesson]);

    const selectedLessonProgress = selectedLesson ? hasLessonProgress(selectedLesson.id) : false;
    const selectedLessonCompleted = selectedLesson ? isLessonCompleted(selectedLesson.title) : false;

    const user = authService.getCurrentUser();
    const isAuthenticated = !!user;
    const canStartLesson = isAuthenticated && selectedLessonUnlocked;
    const opensUpgradeFromLesson =
        !hasFullLessonAccess && !selectedLessonUnlocked && !!selectedLesson;
    const needsLoginForFreeFirst =
        !isAuthenticated &&
        !!selectedLesson &&
        freeLessonIdSet.has(Number(selectedLesson.id));

    const completedCount = useMemo(
        () => progress.filter((p) => p.status === "completed" && sortedLessons.some((l) => l.title === p.lesson_title)).length,
        [progress, sortedLessons]
    );
    const totalCount = sortedLessons.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const isLessonLocked = useCallback(
        (lessonId: number | string) => {
            if (hasFullLessonAccess) return false;
            return !freeLessonIdSet.has(Number(lessonId));
        },
        [hasFullLessonAccess, freeLessonIdSet]
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
            </div>

            {/* Lessons — Zigzag Pattern */}
            <ul className="list-none p-0 m-0">
                {sortedLessons.map((lesson, index) => {
                    const isCompleted = isLessonCompleted(lesson.title);
                    const isActive = activeLessonId === Number(lesson.id);
                    const isSelected = selectedLesson?.id === lesson.id;
                    const isLocked = isLessonLocked(lesson.id);
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
                            key={lesson.id}
                            className={cn(
                                "flex items-center mb-12 cursor-pointer transition-all duration-200",
                                isRightAligned ? "justify-end mr-4" : "ml-4",
                                isLocked && "opacity-90"
                            )}
                            onClick={() => handleLessonClick(lesson)}
                        >
                            {isRightAligned ? (
                                <>
                                    <div className="text-right">
                                        <h3 className={cn(
                                            "text-base font-medium transition-colors duration-300",
                                            (isActive || isSelected) ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-700"
                                        )}>
                                            {lesson.title.split(' ').slice(0, -1).join(' ')}
                                        </h3>
                                        <h4 className={cn(
                                            "text-base font-medium transition-colors duration-300",
                                            (isActive || isSelected) ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-700"
                                        )}>
                                            {lesson.title.split(' ').slice(-1).join(' ')}
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
                                            {lesson.title.split(' ').slice(0, -1).join(' ')}
                                        </h3>
                                        <h4 className={cn(
                                            "text-base font-medium transition-colors duration-300",
                                            (isActive || isSelected) ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-700"
                                        )}>
                                            {lesson.title.split(' ').slice(-1).join(' ')}
                                        </h4>
                                    </div>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* Fixed Bottom Action Bar */}
            {sortedLessons.length > 0 && !suppressBottomCta && (
                <div className="fixed bottom-0 md:w-96 left-4 right-4 md:left-auto md:right-1/3 md:transform md:translate-x-1/2 bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-lg border-t border-gray-100 dark:border-slate-800 z-50" style={{ maxWidth: '40rem' }}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
                        {selectedLesson?.title || sortedLessons[0]?.title || 'Cashar dooro'}
                    </h2>

                    {isLoading ? (
                        <div className={`w-full rounded-2xl p-4 shadow-lg ${!canStartLesson
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                            : selectedLessonCompleted
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                                : selectedLessonProgress
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
                            disabled={!selectedLesson}
                            className={`w-full font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 text-base ${!selectedLesson
                                ? 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-slate-600 cursor-not-allowed'
                                : !canStartLesson
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                    : selectedLessonCompleted
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                                        : selectedLessonProgress
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                            : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                                }`}
                        >
                            {!selectedLesson ? (
                                <>
                                    <PlayCircle className="inline w-4 h-4 mr-2" />
                                    Billow
                                </>
                            ) : opensUpgradeFromLesson ? (
                                <>
                                    <Sparkles className="inline w-4 h-4 mr-2" />
                                    {t.challenge_cta_compact}
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
                            ) : selectedLessonCompleted ? (
                                <>
                                    <ReplyIcon className="inline w-4 h-4 mr-2" />
                                    Muraajacee
                                </>
                            ) : selectedLessonProgress ? (
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
