"use client";

import { useMemo } from "react";
import { CheckCircle2, Lock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Module } from "@/types/learning";
import type { UserProgress } from "@/services/progress";

export function formatLessonDuration(lesson: { estimated_time?: string }): string {
    const t = lesson.estimated_time && String(lesson.estimated_time).trim();
    if (t) return t;
    return "~5 daqiiqo";
}

interface TrackLessonListProps {
    modules: Module[];
    progress: UserProgress[];
    firstLessonIdOfCourse: number | null;
    resumeLessonId: number | null;
    isPremium: boolean;
    isAuthenticated: boolean;
    onLessonClick: (lessonId: number) => void;
}

export function TrackLessonList({
    modules,
    progress,
    firstLessonIdOfCourse,
    resumeLessonId,
    isPremium,
    isAuthenticated,
    onLessonClick,
}: TrackLessonListProps) {
    const rows = useMemo(() => {
        const withLesson = modules
            .map((m) => {
                const lesson = m.lessons?.[0] as
                    | { id: number; title?: string; lesson_number?: number; estimated_time?: string }
                    | undefined;
                if (!lesson?.id) return null;
                return { module: m, lesson };
            })
            .filter(Boolean) as Array<{
            module: Module;
            lesson: { id: number; title?: string; lesson_number?: number; estimated_time?: string };
        }>;

        return [...withLesson].sort(
            (a, b) => (a.lesson.lesson_number ?? 0) - (b.lesson.lesson_number ?? 0)
        );
    }, [modules]);

    const progressByLesson = useMemo(() => {
        const map = new Map<number, UserProgress["status"]>();
        for (const p of progress) {
            map.set(p.lesson, p.status);
        }
        return map;
    }, [progress]);

    if (rows.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400 mb-3 px-1">
                Casharrada
            </h3>
            <ol className="list-none m-0 p-0 divide-y divide-gray-200 dark:divide-slate-800 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 shadow-sm">
                {rows.map(({ lesson }, index) => {
                    const id = Number(lesson.id);
                    const isFirst =
                        firstLessonIdOfCourse != null &&
                        id === Number(firstLessonIdOfCourse);
                    const locked = isAuthenticated && !isPremium && !isFirst;
                    const status = progressByLesson.get(id);
                    const completed = status === "completed";
                    const isResume = resumeLessonId != null && id === Number(resumeLessonId);

                    return (
                        <li key={id}>
                            <button
                                type="button"
                                disabled={locked}
                                onClick={() => !locked && onLessonClick(id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors",
                                    "hover:bg-slate-50 dark:hover:bg-slate-800/60",
                                    locked && "opacity-60 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent",
                                    isResume &&
                                        "bg-violet-50/80 dark:bg-violet-950/25 border-l-4 border-l-violet-600 pl-3"
                                )}
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {index + 1}
                                </span>
                                <span className="flex-1 min-w-0">
                                    <span className="block font-semibold text-gray-900 dark:text-white truncate">
                                        {lesson.title ?? `Cashar ${index + 1}`}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                        {formatLessonDuration(lesson)}
                                    </span>
                                </span>
                                <span className="shrink-0 flex items-center gap-1">
                                    {locked ? (
                                        <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
                                    ) : completed ? (
                                        <CheckCircle2
                                            className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                                            aria-hidden
                                        />
                                    ) : isResume ? (
                                        <Circle className="h-5 w-5 text-violet-600 dark:text-violet-400 fill-violet-600/20" aria-hidden />
                                    ) : (
                                        <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" aria-hidden />
                                    )}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
