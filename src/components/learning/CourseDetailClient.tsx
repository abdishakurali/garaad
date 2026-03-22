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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Lock, PlayCircle, Reply } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/useAuthStore";
import { useCourse, useEnrollments, useUserProgress } from "@/hooks/useApi";
import { useGamificationData } from "@/hooks/useGamificationData";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { cn, getCourseThumbnailUrl } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { EXPLORER_IS_FREE, userHasExplorerContentAccess } from "@/config/featureFlags";
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
}: {
    courseImageSrc: string;
    title: string;
    unoptimized: boolean;
}) {
    const [courseImageError, setCourseImageError] = useState(false);
    const imageSrcToShow = courseImageError ? defaultCourseImage : courseImageSrc;
    return (
        <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md">
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
    const isPremiumUser = useAuthStore((s) => userHasExplorerContentAccess(s.user));

    const {
        enrollments,
        isLoading: isEnrollmentsLoading,
    } = useEnrollments();

    const {
        progress,
        isLoading: isProgressLoading,
    } = useUserProgress();

    const { progress: gamificationStatus } = useGamificationData();
    const xp = (gamificationStatus as { xp?: number } | undefined)?.xp ?? 0;

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
    }, [categoryId, courseSlug]);

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
        if (!isAuthenticated || ctaLessonId == null || firstLessonIdOfCourse == null) {
            return false;
        }
        if (isPremiumUser) return false;
        return Number(ctaLessonId) !== Number(firstLessonIdOfCourse);
    }, [
        isAuthenticated,
        isPremiumUser,
        ctaLessonId,
        firstLessonIdOfCourse,
    ]);

    const lessonPath = useCallback(
        (lessonId: number, review?: boolean) =>
            `/courses/${categoryId}/${courseSlug}/lessons/${lessonId}${review ? "?review=true" : ""}`,
        [categoryId, courseSlug]
    );

    const navigateToLesson = useCallback(
        (lessonId: number, opts?: { review?: boolean }) => {
            if (!lessonId) return;
            if (!isAuthenticated) {
                router.push(
                    `/login?redirect=${encodeURIComponent(lessonPath(lessonId, opts?.review))}`
                );
                return;
            }
            const isFirst =
                firstLessonIdOfCourse != null &&
                Number(lessonId) === Number(firstLessonIdOfCourse);
            if (!isPremiumUser && !isFirst) {
                router.push("/subscribe");
                return;
            }
            router.push(lessonPath(lessonId, opts?.review));
        },
        [isAuthenticated, isPremiumUser, firstLessonIdOfCourse, router, lessonPath]
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
                    <aside className="max-w-sm md:max-w-lg h-fit border-2 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border-gray-200 dark:border-slate-800 md:sticky md:top-32">
                        <div className="flex mb-6 border-border dark:border-slate-800 border-2 px-4 py-2 rounded-md w-fit bg-slate-50 dark:bg-black">
                            <CourseThumbnailImage
                                key={`${String(categoryId)}-${String(courseSlug)}`}
                                courseImageSrc={courseImageSrc}
                                title={currentCourse.title}
                                unoptimized={thumbUnoptimized}
                            />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {currentCourse.title}
                        </h1>

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
                            <Alert className="max-w-2xl mx-auto rounded-2xl border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500/30">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <AlertTitle className="text-emerald-900 dark:text-emerald-100">
                                    Waad ku dhameysatay casharka ugu dambeeya ee taxanahan!
                                </AlertTitle>
                                <AlertDescription className="text-emerald-800/90 dark:text-emerald-200/90">
                                    Horumar wanaagsan. Waxaad ka dooran kartaa cashar kale ama dib u eegi kartaa kuwa aad horey u dhameysay.
                                </AlertDescription>
                            </Alert>
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
                                    xp={xp}
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
                                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                                        <div className="min-w-0 flex-1 text-center">
                                            <p className="line-clamp-4 text-lg font-bold leading-tight text-gray-900 dark:text-white sm:text-xl">
                                                {ctaLessonTitle ?? "Cashar"}
                                            </p>
                                        </div>
                                        <div className="mt-auto flex w-full shrink-0 flex-col gap-2">
                                            {ctaLocked ? (
                                                <Button
                                                    type="button"
                                                    size="lg"
                                                    className="h-14 w-full rounded-xl text-base font-bold shadow-md bg-amber-600 hover:bg-amber-700 text-white"
                                                    onClick={() =>
                                                        router.push(
                                                            EXPLORER_IS_FREE
                                                                ? "/signup?ref=course_detail_cta"
                                                                : "/subscribe?plan=explorer&ref=course_detail_cta"
                                                        )
                                                    }
                                                >
                                                    <Lock
                                                        className="size-5 shrink-0"
                                                        aria-hidden
                                                    />
                                                    {EXPLORER_IS_FREE ? "Samee akoon" : "Ku biir"}
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
                                            Xisaab u fur bilaash ah
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
