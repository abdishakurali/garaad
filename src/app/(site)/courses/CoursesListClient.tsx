"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories, useEnrollments } from "@/hooks/useApi";
import { Category, Course } from "@/types/lms";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn, getAbsoluteImageUrl, getCourseThumbnailUrl } from "@/lib/utils";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { CoursesChallengeBanner } from "@/components/challenge/CoursesChallengeBanner";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { API_BASE_URL } from "@/lib/constants";

const defaultCategoryImage = "/images/placeholder-category.svg";
const defaultCourseImage = "/images/placeholder-category.svg";

function safeImageSrc(src: string | null | undefined, fallback: string): string {
    const resolved = getAbsoluteImageUrl(src, fallback);
    const optimized = optimizeCloudinaryUrl(resolved);
    return optimized || fallback;
}

function safeCourseImageSrc(src: string | null | undefined, fallback: string): string {
    const resolved = getCourseThumbnailUrl(src, fallback);
    const optimized = optimizeCloudinaryUrl(resolved);
    return optimized || fallback;
}

const CategoryImage = ({ src, alt }: { src?: string; alt: string }) => {
    const imageSrc = safeImageSrc(src, defaultCategoryImage);
    return (
        <div className="relative w-20 h-20 shrink-0">
            <Image
                src={imageSrc}
                alt={alt}
                fill
                className="object-contain"
                unoptimized
                sizes="80px"
            />
        </div>
    );
};

const CourseImage = ({ src, alt, priority = false }: { src?: string; alt: string; priority?: boolean }) => {
    const imageSrc = safeCourseImageSrc(src, defaultCourseImage);
    const [displaySrc, setDisplaySrc] = useState(() => imageSrc);
    const [errored, setErrored] = useState(false);

    /* eslint-disable react-hooks/set-state-in-effect -- sync with prop changes */
    useEffect(() => {
        setDisplaySrc(safeCourseImageSrc(src, defaultCourseImage));
        setErrored(false);
    }, [src]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleError = () => {
        setDisplaySrc(defaultCourseImage);
        setErrored(true);
    };

    const finalSrc = errored ? defaultCourseImage : displaySrc;

    return (
        <div className="relative w-full h-40 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <Image
                src={finalSrc}
                alt={alt}
                fill
                priority={priority}
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                unoptimized
                onError={handleError}
            />
        </div>
    );
};

export function CoursesListClient({ initialCategories = [] }: { initialCategories?: Category[] }) {
    const { categories, isLoading: isSWRLoading, isError } = useCategories();
    const { enrollments } = useEnrollments();
    const posthog = usePostHog();
    const searchParams = useSearchParams();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [activePath, setActivePath] = useState<"All" | "Freelancer" | "Worker" | "Builder">("All");
    const { isAuthenticated } = useAuthStore();
    const { data: challengeStatus } = useChallengeStatus();
    const isWaitlistOnly = challengeStatus?.is_waitlist_only;
    const [hasMounted, setHasMounted] = useState(false);
    const [resolvedCategories, setResolvedCategories] = useState<Category[]>(() =>
        Array.isArray(initialCategories) ? initialCategories : []
    );
    const getCourseProgress = (courseId: number) => {
        if (!enrollments || !Array.isArray(enrollments)) return undefined;
        const e = enrollments.find((x: { course: number }) => x.course === courseId);
        return (e as { progress_percent?: number } | undefined)?.progress_percent;
    };

    /* eslint-disable react-hooks/set-state-in-effect -- hydration check */
    useEffect(() => {
        setHasMounted(true);
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    const hasInitialCategories = Array.isArray(initialCategories) && initialCategories.length > 0;
    const isLoading = !hasInitialCategories && !resolvedCategories.length && isSWRLoading;

    /* eslint-disable react-hooks/set-state-in-effect -- URL-driven state */
    useEffect(() => {
        const success = searchParams.get("success");
        if (success === "payment_completed") {
            setShowSuccessMessage(true);
            posthog?.capture("checkout_completed", {
                source: "stripe_success_redirect",
                page: "courses",
            });
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [searchParams, posthog]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const safeCategories = useMemo(
        () =>
            Array.isArray(categories) && categories.length > 0
                ? categories
                : (Array.isArray(initialCategories) ? initialCategories : []),
        [categories, initialCategories]
    );

    useEffect(() => {
        let cancelled = false;

        async function hydrateCategoryCourses() {
            if (!Array.isArray(safeCategories) || safeCategories.length === 0) {
                if (!cancelled) setResolvedCategories([]);
                return;
            }

            const hasMissingCourses = safeCategories.some((cat) => !Array.isArray(cat?.courses));
            if (!hasMissingCourses) {
                if (!cancelled) setResolvedCategories(safeCategories);
                return;
            }

            try {
                const hydrated = await Promise.all(
                    safeCategories.map(async (cat) => {
                        if (Array.isArray(cat?.courses)) return cat;
                        const res = await fetch(`${API_BASE_URL}/api/lms/courses/?category=${cat.id}`);
                        if (!res.ok) return { ...cat, courses: [] };
                        const data = await res.json();
                        const courses = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
                        return { ...cat, courses };
                    })
                );
                if (!cancelled) setResolvedCategories(hydrated as Category[]);
            } catch {
                if (!cancelled) setResolvedCategories(safeCategories);
            }
        }

        void hydrateCategoryCourses();
        return () => {
            cancelled = true;
        };
    }, [safeCategories]);

    const categoriesForRender = useMemo(
        () => (resolvedCategories.length > 0 ? resolvedCategories : safeCategories),
        [resolvedCategories, safeCategories]
    );

    const visibleCategories = categoriesForRender
        .filter((cat) => cat?.courses && cat.courses.length > 0)
        .sort((a, b) => {
            const seqA = (a?.sequence !== undefined && a.sequence !== null) ? a.sequence : Number.MAX_SAFE_INTEGER;
            const seqB = (b?.sequence !== undefined && b.sequence !== null) ? b.sequence : Number.MAX_SAFE_INTEGER;
            return seqA - seqB;
        });

    if (hasMounted && isError) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                    <p className="font-semibold text-foreground mb-2">Could not load courses</p>
                    <p className="text-sm text-muted-foreground">Please refresh the page and try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* Page Header */}
            <section className="pt-28 pb-12 border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold mb-4">Your Plan</p>
                    <h1 className="text-display-md sm:text-display-lg font-serif mb-4">
                        Your 30-Day Plan
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">
                        Pick your path. Follow the plan. Make your first money.
                    </p>

                    {showSuccessMessage && (
                        <div className="mb-6 p-4 rounded-[10px] border border-border bg-card text-sm text-foreground">
                            <span className="font-semibold text-gold">Payment confirmed.</span>{" "}
                            You now have full access. Start with Lesson 1.
                        </div>
                    )}

                    {/* Path selector tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {(["All", "Freelancer", "Worker", "Builder"] as const).map((path) => (
                            <button
                                key={path}
                                type="button"
                                onClick={() => setActivePath(path)}
                                className={`px-4 py-2 rounded-[8px] text-sm font-semibold border transition-colors ${
                                    activePath === path
                                        ? "bg-gold text-black border-gold"
                                        : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                                }`}
                            >
                                {path}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
                <CoursesChallengeBanner />
                <div className="space-y-16 pt-10">
                    {(isLoading ? Array(3).fill(null) : visibleCategories).map(
                        (category: Category | null, idx) => {
                            const sortedCourses = isLoading
                                ? Array(4).fill(null)
                                : [...(category?.courses || [])].sort((a, b) => {
                                    const seqA = (a?.sequence !== undefined && a.sequence !== null) ? a.sequence : Number.MAX_SAFE_INTEGER;
                                    const seqB = (b?.sequence !== undefined && b.sequence !== null) ? b.sequence : Number.MAX_SAFE_INTEGER;
                                    if (seqA !== seqB) return seqA - seqB;
                                    const dateA = a?.created_at ? new Date(a.created_at).getTime() : 0;
                                    const dateB = b?.created_at ? new Date(b.created_at).getTime() : 0;
                                    return dateA - dateB;
                                });

                            return (
                                <div key={category?.id ?? idx}>
                                    {/* Category Header */}
                                    <div className="mb-6 pb-4 border-b border-border">
                                        {isLoading ? (
                                            <div className="space-y-2">
                                                <Skeleton className="w-48 h-5 rounded" />
                                                <Skeleton className="w-72 h-4 rounded" />
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-lg font-semibold text-foreground">{category?.title}</h2>
                                                {category?.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Courses Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {sortedCourses.map(
                                            (course: Course | null, index: number) => {
                                                const isLocked = !isLoading && !course?.is_published;

                                                if (isLoading || isLocked) {
                                                    return (
                                                        <div
                                                            key={course?.id ?? index}
                                                            className={cn(
                                                                "rounded-[16px] border border-border bg-card flex flex-col overflow-hidden",
                                                                isLocked ? "opacity-50" : ""
                                                            )}
                                                        >
                                                            {isLoading ? (
                                                                <div className="space-y-3 p-4">
                                                                    <Skeleton className="h-32 w-full rounded-[10px]" />
                                                                    <Skeleton className="h-5 w-3/4 rounded" />
                                                                    <Skeleton className="h-4 w-full rounded" />
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col flex-1">
                                                                    <div className="relative h-32 bg-card/50 flex items-center justify-center overflow-hidden rounded-t-[16px]">
                                                                        <CourseImage src={course?.thumbnail} alt={course?.title ?? ""} />
                                                                        <div className="absolute top-3 right-3 bg-foreground/10 text-muted-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                                                            Coming soon
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-4">
                                                                        <p className="font-semibold text-muted-foreground text-sm line-clamp-1">{course?.title}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                const courseProgress = getCourseProgress(course.id);
                                                const hasStarted = courseProgress !== undefined && courseProgress > 0;
                                                const isComplete = courseProgress === 100;
                                                const courseHref = `/courses/${category?.id}/${course.slug}`;

                                                return (
                                                    <div
                                                        key={course.id}
                                                        className="group rounded-[16px] border border-border bg-card flex flex-col overflow-hidden hover:border-gold/30 transition-colors"
                                                    >
                                                        <Link href={courseHref} className="relative block">
                                                            <div className="relative h-32 bg-card flex items-center justify-center overflow-hidden rounded-t-[16px]">
                                                                <CourseImage
                                                                    src={course?.thumbnail}
                                                                    alt={course?.title ?? ""}
                                                                    priority={idx === 0 && index < 3}
                                                                />
                                                                {isComplete && (
                                                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md text-foreground">
                                                                        <CheckCircle2 className="h-3 w-3 text-gold" /> Done
                                                                    </div>
                                                                )}
                                                                {course.is_new && !isComplete && (
                                                                    <div className="absolute top-3 right-3 bg-gold text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                                                                        New
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Link>

                                                        <div className="flex flex-col flex-1 p-4">
                                                            <Link href={courseHref}>
                                                                <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                                                                    {course?.title}
                                                                </h3>
                                                            </Link>

                                                            {course?.description && (
                                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                                                                    {course.description}
                                                                </p>
                                                            )}

                                                            <div className="mt-auto pt-3 border-t border-border space-y-2">
                                                                {((course?.lesson_count ?? 0) > 0 || (course?.estimatedHours ?? 0) > 0) && (
                                                                    <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                                        {(course?.lesson_count ?? 0) > 0 && (
                                                                            <span>{course.lesson_count} lessons</span>
                                                                        )}
                                                                        {(course?.estimatedHours ?? 0) > 0 && (
                                                                            <span>{course.estimatedHours}h</span>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {hasStarted && (
                                                                    <div className="space-y-1">
                                                                        <div className="h-1 overflow-hidden rounded-full bg-border">
                                                                            <div
                                                                                className="h-full rounded-full bg-gold transition-[width] duration-500 ease-out"
                                                                                style={{ width: `${courseProgress ?? 0}%` }}
                                                                            />
                                                                        </div>
                                                                        <p className="text-[10px] text-muted-foreground">{courseProgress}% complete</p>
                                                                    </div>
                                                                )}

                                                                <Link
                                                                    href={courseHref}
                                                                    className="flex items-center gap-1 text-[11px] font-semibold text-gold"
                                                                >
                                                                    {isComplete ? "Review" : hasStarted ? "Continue" : "Start"} →
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>

                {!isLoading && visibleCategories.length === 0 && (
                    <div className="mt-10 rounded-[16px] border border-border bg-card px-6 py-8 text-center text-sm text-muted-foreground">
                        No courses available yet. Check back soon.
                    </div>
                )}

                {!isAuthenticated && (
                    <div className="mt-12 p-6 rounded-[16px] border border-gold/30 bg-card text-center">
                        <p className="text-sm font-semibold text-foreground mb-1">Want the full 30-day plan?</p>
                        <p className="text-sm text-muted-foreground mb-4">Ku soo biir Mentorship-ka si aad u hesho personal access iyo income guarantee.</p>
                        <Link
                            href={isWaitlistOnly ? "#" : "/subscribe"}
                            className={cn(
                                "btn-gold inline-flex",
                                isWaitlistOnly && "pointer-events-none opacity-50"
                            )}
                            onClick={() => !isWaitlistOnly && posthog?.capture("challenge_cta_clicked", { source: "courses_page" })}
                        >
                            {isWaitlistOnly ? "Buuxsamay" : "Ku soo biir Mentorship-ka →"}
                        </Link>
                    </div>
                )}
            </main >
        </div >
    );
}
