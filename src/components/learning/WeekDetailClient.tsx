"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    useMemo,
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, LogIn, PlayCircle, Reply } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/useAuthStore";
import { useCourse, useEnrollments, useUserProgress } from "@/hooks/useApi";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { cn, getCourseThumbnailUrl } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { freeTierLessonIdSet, userHasFullLessonAccess } from "@/lib/lessonTierAccess";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { pricingTranslations as t } from "@/config/translations/pricing";
import { usePostHog } from "posthog-js/react";

// PathZigzag if it exists, otherwise fall back to ModuleZigzag
let ZigzagComponent: any;
try {
    ZigzagComponent = dynamic(
        () =>
            import("@/components/learning/ui/PathZigzag").then((m) => ({
                default: m.default,
            })).catch(() =>
                import("@/components/learning/ui/ModuleZigzag").then((m) => ({
                    default: m.default,
                }))
            ),
        {
            loading: () => (
                <Skeleton className="h-64 w-full max-w-2xl mx-auto rounded-2xl" />
            ),
            ssr: false,
        }
    );
} catch {
    ZigzagComponent = dynamic(
        () =>
            import("@/components/learning/ui/ModuleZigzag").then((m) => ({
                default: m.default,
            })),
        {
            loading: () => (
                <Skeleton className="h-64 w-full max-w-2xl mx-auto rounded-2xl" />
            ),
            ssr: false,
        }
    );
}

const CourseProgress = dynamic(
    () =>
        import("@/components/learning/CourseProgress").then((mod) => ({
            default: mod.CourseProgress,
        })),
    {
        loading: () => <Skeleton className="h-3 w-[90%] rounded-full" />,
        ssr: false,
    }
);

const defaultWeekImage = "/images/placeholder-course.svg";

function WeekThumbnailImage({
    weekImageSrc,
    title,
    unoptimized,
    progressPercent = 0,
}: {
    weekImageSrc: string;
    title: string;
    unoptimized: boolean;
    progressPercent?: number;
}) {
    const [imageError, setImageError] = useState(false);
    const imageSrcToShow = imageError ? defaultWeekImage : weekImageSrc;
    const pct = Math.min(100, Math.max(0, progressPercent));
    const dash = (pct / 100) * 175;
    const complete = pct >= 100;
    return (
        <div className="relative w-[4.75rem] h-[4.75rem] shrink-0">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64" aria-hidden>
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-700" />
                <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} 175`}
                    className={complete ? "text-emerald-500 transition-all duration-500" : "text-violet-500 transition-all duration-500"}
                />
            </svg>
            <div className="absolute inset-[5px] overflow-hidden rounded-md">
                <Image
                    src={imageSrcToShow}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="64px"
                    priority
                    unoptimized={unoptimized}
                    onError={() => setImageError(true)}
                />
            </div>
            {complete ? (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2] rounded-full bg-black/35"
                    aria-hidden
                >
                    <CheckCircle2 className="w-9 h-9 text-emerald-400 drop-shadow-md" strokeWidth={2.2} />
                </div>
            ) : null}
        </div>
    );
}

interface WeekDetailClientProps {
    weekSlug: string;
    trackSlug?: string;
    // Legacy support
    categoryId?: string;
    courseSlug?: string;
}

export function WeekDetailClient({ weekSlug, trackSlug, categoryId, courseSlug }: WeekDetailClientProps) {
    const router = useRouter();
    // weekSlug is the course slug; categoryId is derived from trackSlug or passed directly
    const resolvedCategoryId = categoryId ?? trackSlug ?? "";
    const resolvedWeekSlug = courseSlug ?? weekSlug;

    const searchParams = useSearchParams();
    const posthog = usePostHog();

    const {
        course: currentWeek,
        isLoading: isWeekLoading,
        error: weekError,
    } = useCourse(resolvedCategoryId, resolvedWeekSlug);

    const { isAuthenticated } = useAuthStore();
    const authHydrated = useAuthStore((s) => s._hasHydrated);
    const hasFullLessonAccess = useAuthStore((s) => userHasFullLessonAccess(s.user));
    const { data: challengeStatus } = useChallengeStatus();
    const isWaitlistOnly = challengeStatus?.is_waitlist_only;

    const {
        enrollments,
        isLoading: isEnrollmentsLoading,
    } = useEnrollments();

    const {
        progress,
        isLoading: isProgressLoading,
    } = useUserProgress();

    const isLoading = isWeekLoading || isEnrollmentsLoading || isProgressLoading;
    const error = weekError;

    const enrollmentProgress = useMemo(() => {
        if (!enrollments) return 0;
        return (
            enrollments.find((e: any) => e.course === currentWeek?.id)
                ?.progress_percent || 0
        );
    }, [enrollments, currentWeek]);

    const trackJustCompleted = searchParams.get("completed") === "true";

    useEffect(() => {
        if (!trackJustCompleted || typeof window === "undefined") return;
        const timer = window.setTimeout(() => {
            const el = document.getElementById("week-celebration-burst");
            if (el) el.classList.add("opacity-0");
        }, 2200);
        // Fire PostHog week_completed event
        posthog?.capture("week_completed", {
            week_slug: resolvedWeekSlug,
            track_slug: trackSlug,
        });
        return () => window.clearTimeout(timer);
    }, [trackJustCompleted, posthog, resolvedWeekSlug, trackSlug]);

    const hasMounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    const [zigzagSelectedLessonId, setZigzagSelectedLessonId] = useState<
        number | null
    >(null);

    useEffect(() => {
        setZigzagSelectedLessonId(null);
    }, [resolvedCategoryId, resolvedWeekSlug]);

    const firstLessonIdOfWeek = useMemo(() => {
        const modules = currentWeek?.modules ?? [];
        const lessons = modules.flatMap((m: any) => m.lessons ?? []);
        if (lessons.length === 0) return null;
        const sorted = [...lessons].sort(
            (a, b) => (a.lesson_number ?? 0) - (b.lesson_number ?? 0)
        );
        return sorted[0]?.id ?? null;
    }, [currentWeek]);

    const sortedLessonIds = useMemo(() => {
        const modules = currentWeek?.modules ?? [];
        const pairs = modules
            .map((m: any) => m.lessons?.[0])
            .filter(Boolean)
            .sort(
                (a: any, b: any) =>
                    (a.lesson_number ?? 0) - (b.lesson_number ?? 0)
            );
        return pairs.map((l: any) => Number(l.id));
    }, [currentWeek]);

    const allLessonsFlat = useMemo(() => {
        const modules = currentWeek?.modules ?? [];
        return modules.flatMap((m: any) => m.lessons ?? []);
    }, [currentWeek]);

    const freeLessonIdSet = useMemo(
        () => freeTierLessonIdSet(allLessonsFlat),
        [allLessonsFlat]
    );

    const completedLessonsInWeek = useMemo(() => {
        if (!progress?.length || sortedLessonIds.length === 0) return 0;
        const idSet = new Set(sortedLessonIds);
        return progress.filter(
            (p: any) => idSet.has(Number(p.lesson)) && p.status === "completed"
        ).length;
    }, [progress, sortedLessonIds]);

    const weekCompletionPercent = useMemo(() => {
        const total = sortedLessonIds.length;
        if (total <= 0) return 0;
        return Math.round((completedLessonsInWeek / total) * 100);
    }, [sortedLessonIds.length, completedLessonsInWeek]);

    const weekProgressEntries = useMemo(() => {
        if (!progress?.length || sortedLessonIds.length === 0) return [];
        const idSet = new Set(sortedLessonIds);
        return progress.filter((p: any) => idSet.has(Number(p.lesson)));
    }, [progress, sortedLessonIds]);

    const resumeLessonId = useMemo(() => {
        if (sortedLessonIds.length === 0 || firstLessonIdOfWeek == null) return null;
        for (const lid of sortedLessonIds) {
            const p = weekProgressEntries.find(
                (e: any) => Number(e.lesson) === Number(lid)
            );
            if (!p || p.status !== "completed") return lid;
        }
        return sortedLessonIds[sortedLessonIds.length - 1] ?? null;
    }, [sortedLessonIds, weekProgressEntries, firstLessonIdOfWeek]);

    const activeModuleId = useMemo(() => {
        if (!currentWeek?.modules?.length) return undefined;

        const nextLessonId = searchParams.get("nextLessonId");
        const fromParam =
            nextLessonId &&
            currentWeek.modules.find((m) =>
                m.lessons?.some((l) => String(l.id) === String(nextLessonId))
            );
        if (fromParam) return fromParam.id;

        const lessonIdForZigzag = zigzagSelectedLessonId ?? resumeLessonId;
        if (lessonIdForZigzag != null) {
            const fromLesson = currentWeek.modules.find((m) =>
                m.lessons?.some((l) => String(l.id) === String(lessonIdForZigzag))
            );
            if (fromLesson) return fromLesson.id;
        }
        return undefined;
    }, [searchParams, currentWeek, resumeLessonId, zigzagSelectedLessonId]);

    const showContinueCta = useMemo(() => {
        if (!isAuthenticated || sortedLessonIds.length === 0) return false;
        if (enrollmentProgress > 0) return true;
        return weekProgressEntries.some(
            (e: any) => e.status === "completed" || e.status === "in_progress"
        );
    }, [
        isAuthenticated,
        sortedLessonIds.length,
        weekProgressEntries,
        enrollmentProgress,
    ]);

    const primaryCtaLessonId = useMemo(() => {
        if (isAuthenticated && showContinueCta && resumeLessonId != null) {
            return resumeLessonId;
        }
        return firstLessonIdOfWeek;
    }, [isAuthenticated, showContinueCta, resumeLessonId, firstLessonIdOfWeek]);

    const primaryCtaLabel = useMemo(() => {
        if (isAuthenticated && showContinueCta) return "Sii wad";
        return "Bilow";
    }, [isAuthenticated, showContinueCta]);

    const ctaLessonId =
        zigzagSelectedLessonId !== null
            ? zigzagSelectedLessonId
            : primaryCtaLessonId;

    const ctaLessonTitle = useMemo(() => {
        if (ctaLessonId == null || !currentWeek?.modules?.length) return null;
        for (const m of currentWeek.modules as any[]) {
            const lessons = m.lessons ?? [];
            const lesson = lessons.find(
                (l: { id?: number }) => Number(l.id) === Number(ctaLessonId)
            );
            if (lesson) {
                return (lesson.title as string) ?? null;
            }
        }
        return null;
    }, [currentWeek, ctaLessonId]);

    const ctaLessonCompleted = useMemo(() => {
        if (ctaLessonId == null) return false;
        return weekProgressEntries.some(
            (e: any) =>
                Number(e.lesson) === Number(ctaLessonId) &&
                e.status === "completed"
        );
    }, [weekProgressEntries, ctaLessonId]);

    const ctaLocked = useMemo(() => {
        if (!isAuthenticated || ctaLessonId == null) return false;
        if (hasFullLessonAccess) return false;
        return !freeLessonIdSet.has(Number(ctaLessonId));
    }, [isAuthenticated, hasFullLessonAccess, ctaLessonId, freeLessonIdSet]);

    const lessonPath = useCallback(
        (lessonId: number, review?: boolean) =>
            `/courses/${resolvedCategoryId}/${resolvedWeekSlug}/lessons/${lessonId}${review ? "?review=true" : ""}`,
        [resolvedCategoryId, resolvedWeekSlug]
    );

    const navigateToLesson = useCallback(
        (lessonId: number, opts?: { review?: boolean }) => {
            if (!lessonId) return;
            if (!isAuthenticated) {
                if (freeLessonIdSet.has(Number(lessonId))) {
                    router.push(lessonPath(lessonId, opts?.review));
                    return;
                }
                router.push(
                    `/login?redirect=${encodeURIComponent(lessonPath(lessonId, opts?.review))}`
                );
                return;
            }
            router.push(lessonPath(lessonId, opts?.review));
        },
        [isAuthenticated, freeLessonIdSet, router, lessonPath]
    );

    const handleModuleClick = (moduleId: number) => {
        const weekModule = (currentWeek?.modules as any[])?.find(
            (m) => m.id === moduleId
        );
        const firstLessonId = weekModule?.lessons?.[0]?.id;

        if (!firstLessonId) {
            console.error("No lessons found in module:", moduleId);
            return;
        }

        const isModuleCompleted =
            weekModule &&
            progress?.some(
                (p: any) => p.module_id === moduleId && p.status === "completed"
            );

        navigateToLesson(firstLessonId, { review: Boolean(isModuleCompleted) });
    };

    const nextLessonParam = searchParams.get("nextLessonId");
    const nextLessonIdNum = useMemo(() => {
        if (!nextLessonParam) return NaN;
        const n = Number(nextLessonParam);
        return Number.isFinite(n) && n > 0 ? n : NaN;
    }, [nextLessonParam]);
    const hasNextLessonRedirect = !Number.isNaN(nextLessonIdNum);

    useLayoutEffect(() => {
        if (!hasNextLessonRedirect || !hasMounted || !authHydrated) return;
        const path = `/courses/${resolvedCategoryId}/${resolvedWeekSlug}/lessons/${nextLessonIdNum}`;
        if (!isAuthenticated) {
            try {
                sessionStorage.setItem("post_login_redirect", path);
            } catch {
                /* ignore */
            }
            router.replace(
                `/login?reason=unauthenticated&redirect=${encodeURIComponent(path)}`
            );
            return;
        }
        router.replace(path);
    }, [
        hasNextLessonRedirect,
        nextLessonIdNum,
        resolvedCategoryId,
        resolvedWeekSlug,
        isAuthenticated,
        authHydrated,
        hasMounted,
        router,
    ]);

    if (!hasMounted) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black">
                <div className="max-w-7xl mx-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                        <div className="space-y-8">
                            <Skeleton className="h-20 w-3/4 rounded-2xl" />
                            <Skeleton className="h-40 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (hasNextLessonRedirect) {
        if (!authHydrated) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-black">
                    <div className="max-w-7xl mx-auto p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                            <div className="space-y-8">
                                <Skeleton className="h-20 w-3/4 rounded-2xl" />
                                <Skeleton className="h-40 w-full rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div
                className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500"
                aria-busy="true"
            />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500">
                <div className="max-w-7xl mx-auto p-8">
                    <Alert variant="destructive" className="rounded-3xl border-2">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="font-black">Khalad ayaa dhacay</AlertTitle>
                        <AlertDescription className="font-bold">{String(error)}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (isLoading || !currentWeek) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black">
                <div className="max-w-7xl mx-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                        <div className="space-y-8">
                            <Skeleton className="h-20 w-3/4 rounded-2xl" />
                            <Skeleton className="h-40 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalLessons =
        currentWeek.modules?.flatMap((m) => m.lessons).length || 0;

    const weekImageSrc =
        optimizeCloudinaryUrl(
            getCourseThumbnailUrl(currentWeek.thumbnail ?? null, defaultWeekImage)
        ) || defaultWeekImage;

    const thumbUnoptimized =
        weekImageSrc.startsWith(API_BASE_URL.replace(/\/$/, "")) ||
        weekImageSrc.includes("/api/media/courses/");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-500">
            <div className="max-w-7xl mx-auto p-8 pb-48 sm:pb-52">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Week Info */}
                    <aside
                        id="free-lessons"
                        className="max-w-sm md:max-w-lg h-fit border-2 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border-gray-200 dark:border-slate-800 md:sticky md:top-32 scroll-mt-28"
                    >
                        <div className="flex mb-6 border-border dark:border-slate-800 border-2 px-4 py-2 rounded-md w-fit bg-slate-50 dark:bg-black">
                            <WeekThumbnailImage
                                key={`${resolvedCategoryId}-${resolvedWeekSlug}`}
                                weekImageSrc={weekImageSrc}
                                title={currentWeek.title}
                                unoptimized={thumbUnoptimized}
                                progressPercent={weekCompletionPercent}
                            />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {currentWeek.title}
                        </h1>
                        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-2">
                            Dhamaystir {completedLessonsInWeek} ka mid ah {sortedLessonIds.length} casharo
                        </p>

                        {enrollmentProgress > 0 && (
                            <CourseProgress progress={enrollmentProgress} />
                        )}

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">
                            {currentWeek.description}
                        </p>

                        <div className="flex justify-start gap-6 text-sm text-gray-700 dark:text-gray-300 font-bold">
                            <div className="flex items-center gap-1">
                                <span>📘</span>
                                <span>{totalLessons} casharo</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>🧩</span>
                                <span>
                                    {currentWeek?.modules
                                        ?.flatMap(mod => mod.lessons || [])
                                        .filter(lesson =>
                                            lesson.content_blocks?.some((block: any) => block.block_type === 'problem')
                                        ).length || 0}{" "}
                                    waydiimo
                                </span>
                            </div>
                        </div>
                    </aside>

                    {/* Lessons Path */}
                    <section className="relative space-y-12">
                        {trackJustCompleted && (
                            <>
                                <div
                                    id="week-celebration-burst"
                                    className="pointer-events-none fixed inset-0 z-[60] flex items-start justify-center pt-32 transition-opacity duration-500"
                                    aria-hidden
                                >
                                    <span className="text-6xl animate-bounce">🎉</span>
                                </div>
                                <Alert className="max-w-2xl mx-auto rounded-2xl border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500/30 animate-pulse">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    <AlertTitle className="text-emerald-900 dark:text-emerald-100">
                                        Hambalyo! Usbuuca waa dhammaastay!
                                    </AlertTitle>
                                    <AlertDescription className="text-emerald-800/90 dark:text-emerald-200/90">
                                        Horumar wanaagsan. Waxaad ka dooran kartaa cashar kale ama dib u eegi kartaa kuwa aad horey u dhameysay.
                                    </AlertDescription>
                                </Alert>
                            </>
                        )}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4 dark:text-white">Casharka Usbuuca</h2>
                            {enrollmentProgress === 0 && (
                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    Waxaad arki kartaa naqshada barashada. Si aad u bilowdo casharada, fadlan isdiiwaangeli.
                                </p>
                            )}
                        </div>

                        <div className="relative flex flex-col items-center gap-12 mt-10">
                            {currentWeek.modules && (
                                <ZigzagComponent
                                    modules={currentWeek.modules as any}
                                    onModuleClick={handleModuleClick}
                                    onModuleSelect={(_moduleId: number, firstLessonId: number) => {
                                        setZigzagSelectedLessonId(firstLessonId);
                                    }}
                                    progress={progress ?? []}
                                    activeModuleId={activeModuleId}
                                    firstLessonIdOfCourse={firstLessonIdOfWeek}
                                    freeLessonIdSet={freeLessonIdSet}
                                    hasFullLessonAccess={hasFullLessonAccess}
                                    categoryId={resolvedCategoryId}
                                    courseSlug={resolvedWeekSlug}
                                    suppressBottomCta
                                />
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {ctaLessonId != null && (
                <div
                    className="pointer-events-none fixed inset-x-0 bottom-0 z-50"
                    style={{
                        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
                    }}
                    role="presentation"
                >
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-12">
                            <div className="hidden lg:block" aria-hidden />
                            <div className="flex justify-center">
                                <div
                                    className={cn(
                                        "pointer-events-auto flex min-h-[168px] w-full max-w-md flex-col justify-between gap-4 rounded-2xl border border-gray-200/90 bg-white px-5 py-5 shadow-lg ring-1 ring-black/5",
                                        "dark:border-slate-700 dark:bg-slate-900 dark:ring-white/10 dark:shadow-2xl"
                                    )}
                                    role="region"
                                    aria-label="Casharka la doorbiday"
                                >
                                    {challengeStatus ? (
                                        <div className="lg:hidden rounded-xl border border-violet-500/30 bg-violet-600/10 px-3 py-2.5 text-center">
                                            <p className="text-xs font-bold text-violet-800 dark:text-violet-200">
                                                {isWaitlistOnly ? "Buuxsamay" : `${challengeStatus.spots_remaining} boos ayaa haray`}
                                            </p>
                                            {!isWaitlistOnly && (
                                                <Link
                                                    href="/subscribe?plan=challenge"
                                                    className="mt-1.5 inline-flex text-sm font-black text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
                                                >
                                                    {t.challenge_cta} →
                                                </Link>
                                            )}
                                        </div>
                                    ) : null}
                                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                                        <div className="min-w-0 flex-1 text-center">
                                            <p className="line-clamp-4 text-lg font-bold leading-tight text-gray-900 dark:text-white sm:text-xl">
                                                {ctaLessonTitle ?? "Cashar"}
                                            </p>
                                        </div>
                                        <div className="mt-auto flex w-full shrink-0 flex-col gap-2">
                                            {ctaLocked ? (
                                                <div className="flex w-full flex-col gap-3 rounded-xl border border-violet-500/40 bg-violet-950/30 p-4 text-center">
                                                    <p className="text-sm font-bold text-white">
                                                        🔓 Casharkaan wuxuu u baahan yahay Mentorship
                                                    </p>
                                                    <p className="text-xs text-violet-200/90">
                                                        {isWaitlistOnly
                                                            ? "Kooxda way buuxdaa"
                                                            : challengeStatus
                                                                ? `${challengeStatus.spots_remaining} boos ayaa ka haray Kooxdan`
                                                                : "Boosyo xaddidan — ku biir Mentorship"}
                                                    </p>
                                                    {!isWaitlistOnly && (
                                                        <Button
                                                            type="button"
                                                            size="lg"
                                                            className="h-12 w-full rounded-xl text-base font-bold bg-violet-600 hover:bg-violet-500 text-white"
                                                            asChild
                                                        >
                                                            <Link href="/subscribe?plan=challenge&ref=course_locked">
                                                                {t.challenge_cta_compact} — lacag celin ah
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    <p className="text-[11px] text-muted-foreground">
                                                        Ama bilaash ku sii wad — casharrada 1-3 waa furanyihiin
                                                    </p>
                                                </div>
                                            ) : !isAuthenticated ? (
                                                <Button
                                                    type="button"
                                                    size="lg"
                                                    className="h-14 w-full rounded-xl text-base font-bold shadow-md bg-violet-600 hover:bg-violet-700 text-white"
                                                    onClick={() =>
                                                        navigateToLesson(ctaLessonId, {
                                                            review: false,
                                                        })
                                                    }
                                                >
                                                    <LogIn
                                                        className="size-5 shrink-0"
                                                        aria-hidden
                                                    />
                                                    Soo gal
                                                </Button>
                                            ) : ctaLessonCompleted ? (
                                                <Button
                                                    type="button"
                                                    size="lg"
                                                    className="h-14 w-full rounded-xl text-base font-bold shadow-md bg-violet-600 hover:bg-violet-700 text-white"
                                                    onClick={() =>
                                                        navigateToLesson(ctaLessonId, {
                                                            review: true,
                                                        })
                                                    }
                                                >
                                                    <Reply
                                                        className="size-5 shrink-0"
                                                        aria-hidden
                                                    />
                                                    Muraajacee
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="lg"
                                                    className="h-14 w-full rounded-xl text-base font-bold shadow-md bg-violet-600 hover:bg-violet-700 text-white"
                                                    onClick={() =>
                                                        navigateToLesson(ctaLessonId, {
                                                            review: false,
                                                        })
                                                    }
                                                >
                                                    <PlayCircle
                                                        className="size-5 shrink-0"
                                                        aria-hidden
                                                    />
                                                    {primaryCtaLabel}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {!isAuthenticated && (
                                        <p className="border-t border-gray-100 pt-3 text-center text-xs text-muted-foreground dark:border-slate-800">

                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
