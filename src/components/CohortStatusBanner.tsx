"use client";

import React from "react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Zap } from "lucide-react";

export function CohortStatusBanner() {
  const { data, loading } = useChallengeStatus();

  if (loading || !data) return null;

  const { spots_remaining, is_waitlist_only } = data;

  if (is_waitlist_only) {
    return (
      <div className="max-w-4xl mx-auto w-full mb-6 px-4">
        <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 animate-pulse">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-bold text-center">
            Cohort-ka waa buuxsamay — liiska sugitaanka ku biir si aad u hesho fursadda xigta
          </span>
        </div>
      </div>
    );
  }

  if (spots_remaining <= 2 && spots_remaining > 0) {
    return (
      <div className="max-w-4xl mx-auto w-full mb-6 px-4">
        <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 animate-pulse">
          <Zap className="h-5 w-5 shrink-0" />
          <span className="text-sm font-bold text-center">
            Degdeg! Kaliya {spots_remaining} boos ayaa hadhay — ha moogaanin!
          </span>
        </div>
      </div>
    );
  }

  if (spots_remaining > 2) {
    return null; // Hidden - don't show spots remaining
  }

  return null;
}
