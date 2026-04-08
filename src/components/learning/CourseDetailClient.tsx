"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
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
const ModuleZigzag = dynamic(
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

const defaultCourseImage = "/images/placeholder-course.svg";

function CourseThumbnailImage({
    courseImageSrc,
    title,
    unoptimized,
    progressPercent = 0,
}: {
    courseImageSrc: string;
    title: string;
    unoptimized: boolean;
    progressPercent?: number;
}) {
    const [courseImageError, setCourseImageError] = useState(false);
    const imageSrcToShow = courseImageError ? defaultCourseImage : courseImageSrc;
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
                    onError={() => setCourseImageError(true)}
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

export function CourseDetailClient() {
    const router = useRouter();
    const { categoryId, courseSlug } = useParams();
    const searchParams = useSearchParams();
    const {
        course: currentCourse,
        isLoading: isCourseLoading,
        error: courseError,
    } = useCourse(String(categoryId), String(courseSlug));

    const { isAuthenticated } = useAuthStore();
    const authHydrated = useAuthStore((s) => s._hasHydrated);
    const hasFullLessonAccess = useAuthStore((s) => userHasFullLessonAccess(s.user));
    const { data: challengeStatus } = useChallengeStatus();

    const {
        enrollments,
        isLoading: isEnrollmentsLoading,
    } = useEnrollments();

    const {
        progress,
        isLoading: isProgressLoading,
    } = useUserProgress();

    const isLoading = isCourseLoading || isEnrollmentsLoading || isProgressLoading;
    const error = courseError;

    const enrollmentProgress = useMemo(() => {
        if (!enrollments) return 0;
        return (
            enrollments.find((e: any) => e.course === currentCourse?.id)
                ?.progress_percent || 0
        );
    }, [enrollments, currentCourse]);

    const trackJustCompleted = searchParams.get("completed") === "true";

    useEffect(() => {
        if (!trackJustCompleted || typeof window === "undefined") return;
        const t = window.setTimeout(() => {
            const el = document.getElementById("course-celebration-burst");
            if (el) el.classList.add("opacity-0");
        }, 2200);
        return () => window.clearTimeout(t);
    }, [trackJustCompleted]);

    const hasMounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    const [zigzagSelectedLessonId, setZigzagSelectedLessonId] = useState<
        number | null
    >(null);

    /* eslint-disable react-hooks/set-state-in-effect -- reset selection on course change */
    useEffect(() => {
        setZigzagSelectedLessonId(null);
    }, [categoryId, courseSlug]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // First lesson of course by lesson_number to match backend (Lesson has no order field)
    const firstLessonIdOfCourse = useMemo(() => {
        const modules = currentCourse?.modules ?? [];
        const lessons = modules.flatMap((m: any) => m.lessons ?? []);
        if (lessons.length === 0) return null;
        const sorted = [...lessons].sort(
            (a, b) => (a.lesson_number ?? 0) - (b.lesson_number ?? 0)
        );
        return sorted[0]?.id ?? null;
    }, [currentCourse]);

    const sortedLessonIds = useMemo(() => {
        const modules = currentCourse?.modules ?? [];
        const pairs = modules
            .map((m: any) => m.lessons?.[0])
            .filter(Boolean)
            .sort(
                (a: any, b: any) =>
                    (a.lesson_number ?? 0) - (b.lesson_number ?? 0)
            );
        return pairs.map((l: any) => Number(l.id));
    }, [currentCourse]);

    const allLessonsFlat = useMemo(() => {
        const modules = currentCourse?.modules ?? [];
        return modules.flatMap((m: any) => m.lessons ?? []);
    }, [currentCourse]);

    const freeLessonIdSet = useMemo(
        () => freeTierLessonIdSet(allLessonsFlat),
        [allLessonsFlat]
    );

    const completedLessonsInCourse = useMemo(() => {
        if (!progress?.length || sortedLessonIds.length === 0) return 0;
        const idSet = new Set(sortedLessonIds);
        return progress.filter(
            (p: any) => idSet.has(Number(p.lesson)) && p.status === "completed"
        ).length;
    }, [progress, sortedLessonIds]);

    const courseCompletionPercent = useMemo(() => {
        const t = sortedLessonIds.length;
        if (t <= 0) return 0;
        return Math.round((completedLessonsInCourse / t) * 100);
    }, [sortedLessonIds.length, completedLessonsInCourse]);

    const courseProgressEntries = useMemo(() => {
        if (!progress?.length || sortedLessonIds.length === 0) return [];
        const idSet = new Set(sortedLessonIds);
        return progress.filter((p: any) => idSet.has(Number(p.lesson)));
    }, [progress, sortedLessonIds]);

    const resumeLessonId = useMemo(() => {
        if (sortedLessonIds.length === 0 || firstLessonIdOfCourse == null) return null;
        for (const lid of sortedLessonIds) {
            const p = courseProgressEntries.find(
                (e: any) => Number(e.lesson) === Number(lid)
            );
            if (!p || p.status !== "completed") return lid;
        }
        return sortedLessonIds[sortedLessonIds.length - 1] ?? null;
    }, [sortedLessonIds, courseProgressEntries, firstLessonIdOfCourse]);

    // Zigzag highlight: URL nextLessonId, user’s tapped module, or resume lesson
    const activeModuleId = useMemo(() => {
        if (!currentCourse?.modules?.length) return undefined;

        const nextLessonId = searchParams.get("nextLessonId");
        const fromParam =
            nextLessonId &&
            currentCourse.modules.find((m) =>
                m.lessons?.some((l) => String(l.id) === String(nextLessonId))
            );
        if (fromParam) return fromParam.id;

        const lessonIdForZigzag =
            zigzagSelectedLessonId ?? resumeLessonId;
        if (lessonIdForZigzag != null) {
            const fromLesson = currentCourse.modules.find((m) =>
                m.lessons?.some((l) => String(l.id) === String(lessonIdForZigzag))
            );
            if (fromLesson) return fromLesson.id;
        }
        return undefined;
    }, [searchParams, currentCourse, resumeLessonId, zigzagSelectedLessonId]);

    const showContinueCta = useMemo(() => {
        if (!isAuthenticated || sortedLessonIds.length === 0) return false;
        if (enrollmentProgress > 0) return true;
        return courseProgressEntries.some(
            (e: any) => e.status === "completed" || e.status === "in_progress"
        );
    }, [
        isAuthenticated,
        sortedLessonIds.length,
        courseProgressEntries,
        enrollmentProgress,
    ]);

    const primaryCtaLessonId = useMemo(() => {
        if (isAuthenticated && showContinueCta && resumeLessonId != null) {
            return resumeLessonId;
        }
        return firstLessonIdOfCourse;
    }, [isAuthenticated, showContinueCta, resumeLessonId, firstLessonIdOfCourse]);

    const primaryCtaLabel = useMemo(() => {
        if (isAuthenticated && showContinueCta) return "Sii wad";
        return "Bilow";
    }, [isAuthenticated, showContinueCta]);

    const ctaLessonId =
        zigzagSelectedLessonId !== null
            ? zigzagSelectedLessonId
            : primaryCtaLessonId;

    const ctaLessonTitle = useMemo(() => {
        if (ctaLessonId == null || !currentCourse?.modules?.length) return null;
        for (const m of currentCourse.modules as any[]) {
            const lessons = m.lessons ?? [];
            const lesson = lessons.find(
                (l: { id?: number }) => Number(l.id) === Number(ctaLessonId)
            );
            if (lesson) {
                return (lesson.title as string) ?? null;
            }
        }
        return null;
    }, [currentCourse, ctaLessonId]);

    const ctaLessonCompleted = useMemo(() => {
        if (ctaLessonId == null) return false;
        return courseProgressEntries.some(
            (e: any) =>
                Number(e.lesson) === Number(ctaLessonId) &&
                e.status === "completed"
        );
    }, [courseProgressEntries, ctaLessonId]);

    const ctaLocked = useMemo(() => {
        if (!isAuthenticated || ctaLessonId == null) return false;
        if (hasFullLessonAccess) return false;
        return !freeLessonIdSet.has(Number(ctaLessonId));
    }, [isAuthenticated, hasFullLessonAccess, ctaLessonId, freeLessonIdSet]);

    const lessonPath = useCallback(
        (lessonId: number, review?: boolean) =>
            `/courses/${categoryId}/${courseSlug}/lessons/${lessonId}${review ? "?review=true" : ""}`,
        [categoryId, courseSlug]
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
        const courseModule = (currentCourse?.modules as any[])?.find(
            (m) => m.id === moduleId
        );
        const firstLessonId = courseModule?.lessons?.[0]?.id;

        if (!firstLessonId) {
            console.error("No lessons found in module:", moduleId);
            return;
        }

        const isModuleCompleted =
            courseModule &&
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
        const cat = String(categoryId);
        const slug = String(courseSlug);
        const path = `/courses/${cat}/${slug}/lessons/${nextLessonIdNum}`;
        if (!isAuthenticated) {
            try {
                sessionStorage.setItem("post_login_redirect", path);
            } catch {
                /* ignore quota / private mode */
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
        categoryId,
        courseSlug,
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

    if (isLoading || !currentCourse) {
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
        currentCourse.modules?.flatMap((m) => m.lessons).length || 0;

    const courseImageSrc =
        optimizeCloudinaryUrl(
            getCourseThumbnailUrl(currentCourse.thumbnail ?? null, defaultCourseImage)
        ) || defaultCourseImage;

    const thumbUnoptimized =
        courseImageSrc.startsWith(API_BASE_URL.replace(/\/$/, "")) ||
        courseImageSrc.includes("/api/media/courses/");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-500">
            <div className="max-w-7xl mx-auto p-8 pb-48 sm:pb-52">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Course Info */}
                    <aside
                        id="free-lessons"
                        className="max-w-sm md:max-w-lg h-fit border-2 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border-gray-200 dark:border-slate-800 md:sticky md:top-32 scroll-mt-28"
                    >
                        <div className="flex mb-6 border-border dark:border-slate-800 border-2 px-4 py-2 rounded-md w-fit bg-slate-50 dark:bg-black">
                            <CourseThumbnailImage
                                key={`${String(categoryId)}-${String(courseSlug)}`}
                                courseImageSrc={courseImageSrc}
                                title={currentCourse.title}
                                unoptimized={thumbUnoptimized}
                                progressPercent={courseCompletionPercent}
                            />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {currentCourse.title}
                        </h1>
                        <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-2">
                            Dhamaystir {completedLessonsInCourse} ka mid ah {sortedLessonIds.length} cashar
                        </p>

                        {enrollmentProgress > 0 && (
                            <CourseProgress progress={enrollmentProgress} />
                        )}

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">
                            {currentCourse.description}
                        </p>

                        <div className="flex justify-start gap-6 text-sm text-gray-700 dark:text-gray-300 font-bold">
                            <div className="flex items-center gap-1">
                                <span>📘</span>
                                <span>{totalLessons} casharo</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>🧩</span>
                                <span>
                                    {currentCourse?.modules
                                        ?.flatMap(mod => mod.lessons || [])
                                        .filter(lesson =>
                                            lesson.content_blocks?.some(block => block.block_type === 'problem')
                                        ).length || 0}{" "}
                                    waydiimo
                                </span>
                            </div>
                        </div>
                    </aside>

                    {/* Learning Path */}
                    <section className="relative space-y-12">
                        {trackJustCompleted && (
                            <>
                                <div
                                    id="course-celebration-burst"
                                    className="pointer-events-none fixed inset-0 z-[60] flex items-start justify-center pt-32 transition-opacity duration-500"
                                    aria-hidden
                                >
                                    <span className="text-6xl animate-bounce">🎉</span>
                                </div>
                                <Alert className="max-w-2xl mx-auto rounded-2xl border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500/30 animate-pulse">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    <AlertTitle className="text-emerald-900 dark:text-emerald-100">
                                        Hambalyo! Cashar baa la dhammaystay!
                                    </AlertTitle>
                                    <AlertDescription className="text-emerald-800/90 dark:text-emerald-200/90">
                                        Horumar wanaagsan. Waxaad ka dooran kartaa cashar kale ama dib u eegi kartaa kuwa aad horey u dhameysay.
                                    </AlertDescription>
                                </Alert>
                            </>
                        )}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4 dark:text-white">Naqshada Barashada</h2>
                            {enrollmentProgress === 0 && (
                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    Waxaad arki kartaa naqshada barashada. Si aad u bilowdo casharada, fadlan isdiiwaangeli.
                                </p>
                            )}
                        </div>

                        <div className="relative flex flex-col items-center gap-12 mt-10">
                            {currentCourse.modules && (
                                <ModuleZigzag
                                    modules={currentCourse.modules as any}
                                    onModuleClick={handleModuleClick}
                                    onModuleSelect={(_moduleId, firstLessonId) => {
                                        setZigzagSelectedLessonId(firstLessonId);
                                    }}
                                    progress={progress ?? []}
                                    activeModuleId={activeModuleId}
                                    firstLessonIdOfCourse={firstLessonIdOfCourse}
                                    freeLessonIdSet={freeLessonIdSet}
                                    hasFullLessonAccess={hasFullLessonAccess}
                                    categoryId={String(categoryId)}
                                    courseSlug={String(courseSlug)}
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
                                                {challengeStatus.spots_remaining} boos ayaa haray
                                            </p>
                                            <Link
                                                href="/subscribe?plan=challenge"
                                                className="mt-1.5 inline-flex text-sm font-black text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
                                            >
                                                {t.challenge_cta} →
                                            </Link>
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
                                                        🔓 Casharkaan wuxuu u baahan yahay Challenge
                                                    </p>
                                                    <p className="text-xs text-violet-200/90">
                                                        {challengeStatus
                                                            ? `${challengeStatus.spots_remaining} boos ayaa ka haray Kooxdan`
                                                            : "Boosyo xaddidan — ku biir Challenge"}
                                                    </p>
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
