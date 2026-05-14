"use client";
import { useTrack, useEnrollments, useUserProgress } from "@/hooks/useApi";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";
import { CheckCircle, Lock, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackDashboardClientProps {
  trackSlug: string;
}

export default function TrackDashboardClient({ trackSlug }: TrackDashboardClientProps) {
  const { track, isLoading } = useTrack(trackSlug);
  const { user } = useAuthStore();
  const { enrollments } = useEnrollments();
  const { progress } = useUserProgress();
  const posthog = usePostHog();

  if (isLoading || !track) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const enrollmentMap = new Map(
    (enrollments ?? []).map((e: any) => [e.course, e])
  );

  const weeks: any[] = (track as any).courses ?? [];

  // Compute overall progress
  const completedWeeks = weeks.filter((w: any) => {
    const enroll = enrollmentMap.get(w.id);
    return enroll?.progress_percent === 100;
  }).length;
  const overallPercent = weeks.length > 0 ? Math.round((completedWeeks / weeks.length) * 100) : 0;

  const getWeekState = (week: any, index: number): 'completed' | 'active' | 'locked' | 'available' => {
    const enroll = enrollmentMap.get(week.id);
    if (enroll?.progress_percent === 100) return 'completed';
    if (enroll && enroll.progress_percent > 0) return 'active';
    if (index === 0) return 'available';
    const prevWeek = weeks[index - 1];
    const prevEnroll = enrollmentMap.get(prevWeek?.id);
    if (prevEnroll?.progress_percent === 100) return 'available';
    return 'locked';
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {(track as any).path_type}
        </p>
        <h1 className="mb-2 text-2xl font-bold text-foreground">{(track as any).title}</h1>
        {(track as any).goal_description && (
          <p className="text-sm text-muted-foreground">{(track as any).goal_description}</p>
        )}
        {/* Progress bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>{completedWeeks} / {weeks.length} usbuuc</span>
            <span>{overallPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week list */}
      <div className="space-y-3">
        {weeks.map((week: any, i: number) => {
          const state = getWeekState(week, i);
          const enroll = enrollmentMap.get(week.id);
          const isLocked = state === 'locked';
          const href = `/courses/${week.category ?? 'track'}/${week.slug}`;

          return (
            <div
              key={week.id}
              className={cn(
                "rounded-2xl border p-5 transition-all",
                state === 'completed' && "border-green-500/30 bg-green-50/5",
                state === 'active' && "border-violet-500/50 bg-violet-50/5",
                state === 'available' && "border-border bg-card hover:border-violet-400/50",
                state === 'locked' && "border-border bg-muted/30 opacity-60"
              )}
            >
              <div className="flex items-start gap-4">
                {/* State icon */}
                <div className="mt-0.5 shrink-0">
                  {state === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {state === 'active' && <Circle className="h-5 w-5 text-violet-500" />}
                  {state === 'locked' && <Lock className="h-4 w-4 text-muted-foreground" />}
                  {state === 'available' && <Circle className="h-5 w-5 text-muted-foreground" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Usbuuc {week.week_number || i + 1}
                    </span>
                    {state === 'active' && enroll && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                        Socda
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-foreground">{week.title}</p>
                  {week.income_milestone && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium text-green-600 dark:text-green-400">Outcome:</span> {week.income_milestone}
                    </p>
                  )}
                  {state === 'active' && enroll && (
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: `${enroll.progress_percent}%` }}
                      />
                    </div>
                  )}
                </div>

                {!isLocked && (
                  <Link
                    href={href}
                    onClick={() => posthog?.capture(state === 'available' && i === 0 ? 'track_started' : 'week_resumed', { week_number: week.week_number || i + 1 })}
                    className="shrink-0 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500"
                  >
                    {state === 'completed' ? 'Dib u fiiri' : state === 'active' ? 'Sii wad' : 'Bilow'}
                    <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mentorship upsell if not premium */}
      {user && !(user as any).is_premium && (
        <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center">
          <p className="mb-1 font-semibold text-foreground">Mentor ayaad u baahan tahay?</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Ku biir Mentorship-ka si aad uga hesho hagid toos ah iyo koox taageera kuu ah.
          </p>
          <Link
            href="/subscribe"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-black hover:bg-gold/90"
          >
            Ku biir Mentorship-ka →
          </Link>
        </div>
      )}
    </div>
  );
}
