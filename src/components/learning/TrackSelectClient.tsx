"use client";
import { useTracks } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const PATH_LABELS: Record<string, string> = {
  freelancer: "Freelancer",
  worker: "Shaqo Raadinta",
  builder: "Builder",
  general: "Guud",
};

const PATH_COLORS: Record<string, string> = {
  freelancer: "border-gold bg-gold/5 hover:bg-gold/10",
  worker: "border-violet-500 bg-violet-50/5 hover:bg-violet-50/10 dark:border-violet-400",
  builder: "border-blue-500 bg-blue-50/5 hover:bg-blue-50/10",
  general: "border-border bg-card hover:bg-muted/50",
};

export default function TrackSelectClient() {
  const { tracks, isLoading } = useTracks();
  const router = useRouter();
  const posthog = usePostHog();

  const handleSelect = (track: any) => {
    posthog?.capture("track_path_selected", { path_type: track.path_type, track_slug: track.slug });
    router.push(`/path/${track.slug}`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">Dooro Wadaadkaaga</h1>
        <p className="text-base text-muted-foreground">
          Wadaad kastaa wuxuu kuu dhisaa xirfad gaar ah. Dooro midka kugu haboon.
        </p>
      </div>

      <div className="space-y-4">
        {tracks.map((track: any) => (
          <button
            key={track.slug}
            type="button"
            onClick={() => handleSelect(track)}
            className={cn(
              "w-full rounded-2xl border-2 p-6 text-left transition-all",
              PATH_COLORS[track.path_type] ?? PATH_COLORS.general
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {PATH_LABELS[track.path_type] ?? track.path_type}
                  </span>
                </div>
                <h2 className="mb-2 text-xl font-bold text-foreground">{track.title}</h2>
                {track.goal_description && (
                  <p className="mb-3 text-sm text-muted-foreground">{track.goal_description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {track.income_target && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                      {track.income_target}
                    </span>
                  )}
                  {track.week_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {track.week_count} usbuuc
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
