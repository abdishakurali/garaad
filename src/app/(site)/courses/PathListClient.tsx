"use client";

import Link from "next/link";
import { useEnrollments, useTracks } from "@/hooks/useApi";
import { AlertCircle, CheckCircle2, Lock, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { CoursesChallengeBanner } from "@/components/challenge/CoursesChallengeBanner";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";

type PathTab = "All" | "Freelancer" | "Worker" | "Builder";

const TAB_TO_PATH_TYPE: Record<PathTab, string | null> = {
    All: null,
    Freelancer: "freelancer",
    Worker: "worker",
    Builder: "builder",
};

function getWeekState(
    weekId: number,
    weekNumber: number,
    index: number,
    enrollmentMap: Map<number, any>
): "completed" | "active" | "locked" | "available" {
    const enroll = enrollmentMap.get(weekId);
    if (enroll?.progress_percent === 100) return "completed";
    if (enroll && enroll.progress_percent > 0) return "active";
    if (index === 0) return "available";
    return "locked";
}

function StateBadge({ state }: { state: "completed" | "active" | "locked" | "available" }) {
    if (state === "completed") {
        return (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-500/20 dark:text-green-300">
                <CheckCircle2 className="h-3 w-3" /> Dhammaaday
            </span>
        );
    }
    if (state === "active") {
        return (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                Socda
            </span>
        );
    }
    if (state === "locked") {
        return (
            <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                <Lock className="h-3 w-3" /> Xidhan
            </span>
        );
    }
    return null;
}

export function PathListClient() {
    const [activePath, setActivePath] = useState<PathTab>("All");
    const pathType = TAB_TO_PATH_TYPE[activePath];
    const { tracks, isLoading, isError } = useTracks(pathType ?? undefined);
    const { enrollments } = useEnrollments();
    const posthog = usePostHog();
    const searchParams = useSearchParams();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const { data: challengeStatus } = useChallengeStatus();
    const isWaitlistOnly = challengeStatus?.is_waitlist_only;
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

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

    const enrollmentMap = new Map(
        (enrollments ?? []).map((e: any) => [e.course, e])
    );

    const handleTabClick = (tab: PathTab) => {
        setActivePath(tab);
        posthog?.capture("track_path_selected", { path_type: TAB_TO_PATH_TYPE[tab] ?? "all" });
    };

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
                        {(["All", "Freelancer", "Worker", "Builder"] as PathTab[]).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => handleTabClick(tab)}
                                className={`px-4 py-2 rounded-[8px] text-sm font-semibold border transition-colors ${
                                    activePath === tab
                                        ? "bg-gold text-black border-gold"
                                        : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
                <CoursesChallengeBanner />

                <div className="pt-10 space-y-10">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="rounded-2xl border border-border bg-card p-5">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24 rounded" />
                                        <Skeleton className="h-5 w-3/4 rounded" />
                                        <Skeleton className="h-4 w-full rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : tracks.length === 0 ? (
                        <div className="rounded-[16px] border border-border bg-card px-6 py-8 text-center text-sm text-muted-foreground">
                            No paths available yet. Check back soon.
                        </div>
                    ) : (
                        tracks.map((track: any) => {
                            const weeks: any[] = track.courses ?? [];
                            const enrollCount = weeks.filter((w: any) => enrollmentMap.has(w.id)).length;

                            return (
                                <div key={track.id ?? track.slug} className="rounded-2xl border border-border bg-card overflow-hidden">
                                    {/* Track header */}
                                    <div className="px-5 pt-5 pb-4 border-b border-border">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                                    {track.path_type ?? "Path"}
                                                </p>
                                                <h2 className="text-lg font-semibold text-foreground">{track.title}</h2>
                                                {track.goal_description && (
                                                    <p className="text-sm text-muted-foreground mt-1">{track.goal_description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Week list */}
                                    <div className="divide-y divide-border">
                                        {weeks.map((week: any, index: number) => {
                                            const state = getWeekState(week.id, week.week_number ?? index + 1, index, enrollmentMap);
                                            const enroll = enrollmentMap.get(week.id);
                                            const isLocked = state === "locked";
                                            const href = `/courses/${week.category ?? track.id}/${week.slug}`;
                                            const isFirst = index === 0;

                                            return (
                                                <div
                                                    key={week.id}
                                                    className={cn(
                                                        "flex items-center gap-4 px-5 py-4 transition-colors",
                                                        isLocked ? "opacity-60" : "hover:bg-muted/30"
                                                    )}
                                                >
                                                    {/* Week number circle */}
                                                    <div className={cn(
                                                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                                                        state === "completed" ? "bg-green-500/20 text-green-600 dark:text-green-400" :
                                                        state === "active" ? "bg-violet-500/20 text-violet-600 dark:text-violet-400" :
                                                        state === "locked" ? "bg-muted text-muted-foreground" :
                                                        "bg-muted text-foreground"
                                                    )}>
                                                        {state === "completed" ? <CheckCircle2 className="h-4 w-4" /> :
                                                         state === "locked" ? <Lock className="h-3.5 w-3.5" /> :
                                                         (week.week_number ?? index + 1)}
                                                    </div>

                                                    {/* Week info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                            <span className="text-xs font-semibold text-muted-foreground">
                                                                Usbuuc {week.week_number ?? index + 1}
                                                            </span>
                                                            <StateBadge state={state} />
                                                        </div>
                                                        <p className="font-medium text-foreground text-sm truncate">{week.title}</p>
                                                        {week.income_milestone && (
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                <span className="font-medium text-green-600 dark:text-green-400">Outcome:</span>{" "}
                                                                {week.income_milestone}
                                                            </p>
                                                        )}
                                                        {state === "active" && enroll && (
                                                            <div className="mt-1.5 h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-muted">
                                                                <div
                                                                    className="h-full rounded-full bg-violet-500"
                                                                    style={{ width: `${enroll.progress_percent}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* CTA */}
                                                    {!isLocked && (
                                                        <Link
                                                            href={href}
                                                            onClick={() => {
                                                                if (isFirst && enrollCount === 0) {
                                                                    posthog?.capture("track_started", {
                                                                        track_slug: track.slug,
                                                                        path_type: track.path_type,
                                                                    });
                                                                }
                                                            }}
                                                            className="shrink-0 rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500"
                                                        >
                                                            {state === "completed" ? "Dib u fiiri" : state === "active" ? "Sii wad" : "Bilow"} →
                                                        </Link>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

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
            </main>
        </div>
    );
}
