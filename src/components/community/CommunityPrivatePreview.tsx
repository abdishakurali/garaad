"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function FakeCommunityLayout() {
  const categories = ["Waxbarasho", "Hormarka", "Mashruucyada", "Guulaha", "Su'aalaha"];

  return (
    <div className="flex h-full min-h-[min(520px,calc(100dvh-8rem))] w-full overflow-hidden bg-white dark:bg-black">
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-slate-200 dark:border-white/10 sm:flex lg:w-80">
        <div className="flex h-16 items-center border-b border-slate-200 px-4 dark:border-white/10 lg:h-20 lg:justify-center">
          <div className="relative h-8 w-28 opacity-50 grayscale">
            <Image src="/logo.png" alt="" fill className="object-contain" sizes="112px" />
          </div>
        </div>
        <div className="flex-1 space-y-1 overflow-hidden p-3">
          {categories.map((c, i) => (
            <div
              key={c}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-semibold",
                i === 0
                  ? "bg-violet-500/15 text-violet-800 dark:text-violet-200"
                  : "text-slate-500 dark:text-slate-500"
              )}
            >
              {c}
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 p-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-2.5 w-24 rounded bg-slate-200 dark:bg-white/15" />
              <div className="h-2 w-16 rounded bg-slate-100 dark:bg-white/5" />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-white/10 sm:h-[4.5rem] sm:px-6">
          <div className="min-w-0">
            <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-white/15 sm:h-5 sm:w-44" />
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <div className="h-2 w-20 rounded bg-slate-100 dark:bg-white/10" />
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-9 rounded-full bg-slate-100 dark:bg-white/10" />
            ))}
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-hidden p-4 sm:p-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/90 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-white/15" />
                <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                  <div className="h-3 w-32 max-w-[50%] rounded bg-slate-200 dark:bg-white/15" />
                  <div className="h-3 w-full max-w-lg rounded bg-slate-100 dark:bg-white/10" />
                  <div className="h-3 w-full max-w-md rounded bg-slate-100 dark:bg-white/10" />
                  {i % 2 === 0 ? (
                    <div className="mt-3 h-24 w-full max-w-xl rounded-xl bg-slate-200/60 dark:bg-white/5" />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type CommunityPrivatePreviewCTA = {
  href: string;
  label: string;
};

interface CommunityPrivatePreviewProps {
  /** Shown under the lock */
  title: string;
  description: string;
  primary: CommunityPrivatePreviewCTA;
  secondary?: CommunityPrivatePreviewCTA;
  footnote?: string;
}

/**
 * Full-bleed mock of the community chrome (sidebar + feed) with a centered lock overlay.
 */
export function CommunityPrivatePreview({
  title,
  description,
  primary,
  secondary,
  footnote,
}: CommunityPrivatePreviewProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-[#1e1e2e] dark:shadow-black/40">
      <div className="pointer-events-none select-none">
        <FakeCommunityLayout />
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center bg-white/45 backdrop-blur-[4px] dark:bg-black/45 dark:backdrop-blur-md"
        aria-hidden={false}
      >
        <div className="flex max-w-md flex-col items-center gap-5 px-6 py-10 text-center sm:px-8">
          <div
            className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-slate-300 bg-white shadow-lg dark:border-violet-500/40 dark:bg-zinc-950/95 dark:shadow-violet-950/40"
            aria-hidden
          >
            <Lock className="h-9 w-9 text-slate-700 dark:text-violet-300" strokeWidth={2.25} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#94a3b8] sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="h-12 rounded-xl bg-[#7c3aed] px-8 text-base font-bold text-white shadow-lg shadow-violet-600/25 hover:bg-[#6d28d9]"
            >
              <Link href={primary.href}>{primary.label}</Link>
            </Button>
            {secondary ? (
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-2 border-slate-300 bg-white/90 font-bold dark:border-white/20 dark:bg-transparent"
              >
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            ) : null}
          </div>

          {footnote ? (
            <p className="max-w-sm text-xs leading-snug text-slate-500 dark:text-slate-500">{footnote}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
