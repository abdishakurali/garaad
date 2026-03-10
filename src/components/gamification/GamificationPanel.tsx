"use client";

import { useMemo } from "react";
import { useGamificationData } from "@/hooks/useGamificationData";
import { useAuthReady } from "@/hooks/useAuthReady";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const LEAGUE_EMOJI: Record<string, string> = {
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
};

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse",
        className
      )}
    >
      <div className="h-5 w-24 bg-white/10 rounded mb-3" />
      <div className="h-8 w-32 bg-white/10 rounded" />
    </div>
  );
}

export function GamificationPanel() {
  const isReady = useAuthReady();
  const {
    progress: gamificationStatus,
    streak,
    league,
    leaderboard,
    isLoading,
  } = useGamificationData();

  const xp = (gamificationStatus ?? streak) as { xp?: number; next_level_xp?: number } | undefined;
  const currentXp = xp?.xp ?? 0;
  const nextLevelXp = xp?.next_level_xp ?? 100;
  const levelName = (gamificationStatus ?? streak) as { rank?: string } | undefined;
  const levelLabel = levelName?.rank ?? "Bilowga";
  const currentStreak = (streak as { current_streak?: number } | undefined)?.current_streak ?? 0;
  const isActiveToday = (streak as { is_active_today?: boolean } | undefined)?.is_active_today ?? false;
  const weeklyProgress = (gamificationStatus as { weekly_progress?: { day?: string; lessons_completed?: number }[] } | undefined)?.weekly_progress ?? [];
  const leagueName = (league as { name?: string } | undefined)?.name ?? "Bronze";
  const leaguePosition = (league as { position?: number } | undefined)?.position ?? 0;
  const topUsers = (leaderboard as { top_users?: { rank?: number; user?: { username?: string }; points?: number }[] } | undefined)?.top_users ?? [];

  const xpPercent = useMemo(
    () => (nextLevelXp > 0 ? Math.min(100, (currentXp / nextLevelXp) * 100) : 0),
    [currentXp, nextLevelXp]
  );

  const weekBars = useMemo(() => {
    const dayToCount: Record<string, number> = {};
    DAYS.forEach((d) => (dayToCount[d] = 0));
    weeklyProgress.forEach((w: { day?: string; lessons_completed?: number }) => {
      const day = w?.day ?? "";
      if (day && dayToCount[day] !== undefined) dayToCount[day] = w?.lessons_completed ?? 0;
    });
    return DAYS.map((day) => ({ day, count: dayToCount[day] ?? 0 }));
  }, [weeklyProgress]);

  const maxBar = useMemo(
    () => Math.max(1, ...weekBars.map((b) => b.count)),
    [weekBars]
  );

  if (!isReady) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard className="md:col-span-2" />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard className="md:col-span-2" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 rounded-xl bg-white/10 animate-pulse border border-white/10" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 rounded-xl bg-white/10 animate-pulse border border-white/10" />
          <div className="h-28 rounded-xl bg-white/10 animate-pulse border border-white/10" />
        </div>
        <div className="h-24 rounded-xl bg-white/10 animate-pulse border border-white/10" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. XP + LEVEL CARD */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p
          className="text-2xl font-extrabold text-white mb-3 motion-safe:animate-in fade-in duration-300"
          style={{ fontFamily: "var(--font-display), Inter, sans-serif" }}
        >
          {levelLabel}
        </p>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-600 transition-[width] duration-600 ease-out motion-safe:animate-in"
            style={{
              width: `${xpPercent}%`,
              backgroundColor: "#7c3aed",
              boxShadow: "0 0 8px #7c3aed",
            }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {currentXp} / {nextLevelXp} XP
        </p>
      </div>

      {/* 2. STREAK CARD */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🔥</span>
          <span className="text-2xl font-bold text-white">{currentStreak}</span>
        </div>
        <div className="flex justify-between gap-1 mb-2">
          {DAYS.map((day, i) => {
            const todayIndex = (() => {
              const d = new Date().getDay();
              return d === 0 ? 6 : d - 1;
            })();
            const isToday = i === todayIndex;
            return (
              <div
                key={day}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-medium",
                  isToday
                    ? "border-purple-500 bg-purple-500/20 text-purple-400"
                    : currentStreak > 0
                      ? "border-white/20 bg-white/5 text-gray-400"
                      : "border-gray-700 bg-gray-800/50 text-gray-500"
                )}
              >
                {day.slice(0, 1)}
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-400">
          {currentStreak === 0 ? "Maanta ka bilow!" : "Sii wad!"}
        </p>
      </div>

      {/* 3. WEEKLY PROGRESS CARD */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-medium text-gray-300 mb-4">
          Toddobaadkan horumarinta
        </p>
        <div className="flex items-end justify-between gap-2 h-24">
          {weekBars.map(({ day, count }, i) => {
            const barHeight = count > 0 ? Math.max(8, (count / maxBar) * 80) : 4;
            return (
              <div
                key={day}
                className="flex-1 flex flex-col items-center gap-1 motion-safe:animate-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className={cn(
                    "w-full rounded-t-lg transition-all duration-600 ease-out",
                    count > 0
                      ? "bg-purple-600"
                      : "border border-dashed border-gray-600 bg-transparent"
                  )}
                  style={{
                    height: barHeight,
                    backgroundColor: count > 0 ? "#7c3aed" : undefined,
                  }}
                />
                <span className="text-[10px] text-gray-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. LEAGUE + RANK CARD */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{LEAGUE_EMOJI[leagueName] ?? "🥉"}</span>
          <span className="font-bold text-white">{leagueName}</span>
        </div>
        <p className="text-sm text-gray-400">
          Toddobaadka dambe degree-ka kor u qaad
        </p>
      </div>

      {/* 5. LEADERBOARD PREVIEW */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-medium text-gray-300 mb-3">Leaderboard</p>
        {topUsers.length > 0 ? (
          <ul className="space-y-2">
            {topUsers.slice(0, 3).map((u: { rank?: number; user?: { username?: string }; points?: number }) => (
              <li
                key={u.rank ?? 0}
                className="flex items-center gap-3 text-sm"
              >
                <span className="text-gray-500 w-6">#{u.rank ?? 0}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-purple-400">
                  {(u.user?.username ?? "?")[0].toUpperCase()}
                </div>
                <span className="text-white flex-1">{u.user?.username ?? "—"}</span>
                <span className="text-purple-400 font-medium">{u.points ?? 0} XP</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 animate-pulse"
              >
                <div className="h-4 w-6 bg-white/10 rounded" />
                <div className="h-8 w-8 rounded-full bg-white/10" />
                <div className="h-4 flex-1 max-w-[120px] bg-white/10 rounded" />
                <div className="h-4 w-10 bg-white/10 rounded" />
              </div>
            ))}
            <p className="text-sm text-gray-400 mt-3">
              Adigu noqo kii ugu horeeya!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
