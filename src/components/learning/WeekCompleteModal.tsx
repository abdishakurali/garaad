"use client";
import { useEffect } from "react";
import { CheckCircle, Star, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WeekCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  week: {
    title: string;
    week_number?: number;
    income_milestone?: string;
    slug: string;
    track?: { slug: string };
  };
  nextWeek?: {
    title: string;
    slug: string;
    week_number?: number;
    track?: { slug: string };
  } | null;
}

export default function WeekCompleteModal({
  isOpen,
  onClose,
  week,
  nextWeek,
}: WeekCompleteModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Celebration */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="mb-1 text-2xl font-bold text-foreground">
            Hambalyo! 🎉
          </h2>
          <p className="text-muted-foreground">
            Usbuuca <strong>{week.week_number}</strong> waa dhammaatay — <span className="font-medium">{week.title}</span>
          </p>
        </div>

        {/* Income milestone */}
        {week.income_milestone && (
          <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-50/10 p-4 text-center">
            <p className="mb-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
              <Star className="h-3.5 w-3.5" />
              Waxaad hadda samayn kartaa
            </p>
            <p className="text-sm font-medium text-foreground">{week.income_milestone}</p>
          </div>
        )}

        {/* Work submission placeholder */}
        <div className="mb-6 rounded-2xl border border-dashed border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            📎 <span className="font-medium">Shaqadaada u dir mentor-kaaga</span> — dhawaan ayaa la furayaa
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {nextWeek ? (
            <Link
              href={`/courses/track/${nextWeek.slug}`}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3.5 font-semibold text-white hover:bg-violet-500"
            >
              Bilow Usbuuca {nextWeek.week_number} — {nextWeek.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="rounded-2xl bg-gold/10 p-4 text-center text-sm font-medium text-gold">
              🏆 Wadaadka oo dhan waa dhammaatay!
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full rounded-2xl border border-border py-3 text-sm text-muted-foreground hover:text-foreground"
          >
            Dib ugu laabo casharrada
          </button>
        </div>
      </div>
    </div>
  );
}
