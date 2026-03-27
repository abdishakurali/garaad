"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { X, Rocket, Sparkles } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";
import {
  formatSocialProofDisplayName,
  splitSocialProofPools,
  type SocialProofUserRaw,
} from "@/lib/social-proof";

const SESSION_KEY = "garaad_sp_count";
const MAX_PER_SESSION = 12;
const INITIAL_DELAY_MS = 3_000;
const MIN_INTERVAL_MS = 14_000;
const MAX_INTERVAL_MS = 20_000;
const VISIBLE_DURATION_MS = 11_000;
const FETCH_TIMEOUT_MS = 8_000;

interface Toast {
  name: string;
  flag?: string;
  kind: "challenge" | "general";
}

function pickNextToast(
  pools: { challenge: SocialProofUserRaw[]; general: SocialProofUserRaw[] },
  idx: { c: number; g: number; seq: number }
): Toast | null {
  const { challenge, general } = pools;
  let item: SocialProofUserRaw;
  let kind: "challenge" | "general";

  if (challenge.length > 0 && general.length > 0) {
    const useGeneral = idx.seq % 3 === 2;
    idx.seq += 1;
    if (useGeneral) {
      item = general[idx.g % general.length];
      idx.g += 1;
      kind = "general";
    } else {
      item = challenge[idx.c % challenge.length];
      idx.c += 1;
      kind = "challenge";
    }
  } else if (challenge.length > 0) {
    item = challenge[idx.c % challenge.length];
    idx.c += 1;
    kind = "challenge";
  } else if (general.length > 0) {
    item = general[idx.g % general.length];
    idx.g += 1;
    kind = "general";
  } else {
    return null;
  }

  return {
    name: formatSocialProofDisplayName(item),
    flag: item.country_flag,
    kind,
  };
}

export function SocialProof() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [toast, setToast] = useState<Toast | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  const poolsRef = useRef({ challenge: [] as SocialProofUserRaw[], general: [] as SocialProofUserRaw[] });
  const idxRef = useRef({ c: 0, g: 0, seq: 0 });
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedPath = pathname?.replace(/\/$/, "") || "/";
  const isAllowedPage = normalizedPath === "" || normalizedPath === "/" || normalizedPath === "/welcome";
  const shouldShow = !user && isAllowedPage;

  useEffect(() => {
    if (!shouldShow) return;

    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);

    fetch(`${API_BASE_URL}/api/public/social-proof/`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        poolsRef.current = splitSocialProofPools(data);
      })
      .catch(() => {
        poolsRef.current = { challenge: [], general: [] };
      })
      .finally(() => {
        clearTimeout(t);
        setReady(true);
      });

    return () => {
      ac.abort();
      clearTimeout(t);
    };
  }, [shouldShow]);

  const showToast = useCallback(() => {
    const count = parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
    if (count >= MAX_PER_SESSION) return;

    const next = pickNextToast(poolsRef.current, idxRef.current);
    if (!next) return;

    setToast(next);
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, (count + 1).toString());

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setVisible(false), VISIBLE_DURATION_MS);
  }, []);

  useEffect(() => {
    if (!shouldShow || !ready || dismissed) return;

    const { challenge, general } = poolsRef.current;
    if (challenge.length === 0 && general.length === 0) return;

    let stopped = false;

    const schedule = (delay: number) => {
      scheduleTimerRef.current = setTimeout(() => {
        if (stopped) return;
        showToast();
        const interval = MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
        schedule(VISIBLE_DURATION_MS + interval);
      }, delay);
    };

    schedule(INITIAL_DELAY_MS);

    return () => {
      stopped = true;
      if (scheduleTimerRef.current) clearTimeout(scheduleTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [shouldShow, ready, dismissed, showToast]);

  if (!shouldShow || !toast || dismissed) return null;

  const Icon = toast.kind === "challenge" ? Rocket : Sparkles;

  return (
    <div
      className={cn(
        "fixed bottom-8 left-4 z-[60] max-w-[min(100vw-2rem,440px)] will-change-transform sm:left-8 sm:max-w-[440px]",
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        visible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-8 scale-[0.96] opacity-0"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-start gap-4 rounded-2xl border border-border bg-card/98 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/10 backdrop-blur-xl dark:bg-zinc-900/98 sm:p-6">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 shadow-md sm:h-14 sm:w-14",
            toast.kind === "challenge"
              ? "border-primary/25 bg-primary/10 text-primary"
              : "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1 pr-6">
          <p className="text-base font-black leading-snug text-foreground sm:text-lg">
            <span className="text-primary">{toast.name}</span>
            {toast.flag ? (
              <span className="ml-1 text-base" title="Calanka">
                {toast.flag}
              </span>
            ) : null}{" "}
            {toast.kind === "challenge" ? (
              <>ayaa ku biiray Challenge-ka!</>
            ) : (
              <>ayaa dhawaan ku biiray Garaad!</>
            )}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wide text-primary">Garaad</span>
            <span className="text-[10px] text-muted-foreground">
              {toast.kind === "challenge" ? "Kooxda Challenge" : "Diiwaan & bilow barashada"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setDismissed(true);
          }}
          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-muted-foreground"
          aria-label="Xir"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {visible ? (
          <div className="absolute -right-1 -top-1 h-3 w-3">
            <span
              className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:animate-none"
              aria-hidden
            />
            <span className="absolute inset-0 rounded-full bg-emerald-500" aria-hidden />
          </div>
        ) : null}
      </div>
    </div>
  );
}
