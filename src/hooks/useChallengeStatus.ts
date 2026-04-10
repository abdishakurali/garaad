"use client";

import { useCallback, useEffect, useState } from "react";

type ChallengeStatusData = {
  spots_remaining: number;
  next_cohort_start_date: string | null;
  is_waitlist_only: boolean;
  active_cohort_name: string | null;
  active_cohort_id?: string | null;
  enrolled_count?: number;
  max_students?: number;
  cohort_start_date?: string | null;
};

type ApiShape = {
  success?: boolean;
  data?: ChallengeStatusData;
};

const CACHE_MS = 60_000;

type CacheEntry = {
  at: number;
  data: ChallengeStatusData | null;
  error: Error | null;
};

let memoryCache: CacheEntry | null = null;
let sharedFetch: Promise<void> | null = null;

/** Slightly above route upstream timeout so we get a JSON error body, not a hung request. */
const CLIENT_FETCH_TIMEOUT_MS = 6_000;

async function refreshCache(): Promise<void> {
  try {
    const res = await fetch("/api/challenge/status", {
      cache: "no-store",
      signal: AbortSignal.timeout(CLIENT_FETCH_TIMEOUT_MS),
    });
    const body = (await res.json()) as ApiShape;
    if (!res.ok || !body?.success || !body.data) {
      memoryCache = {
        at: Date.now(),
        data: null,
        error: new Error("challenge_status_invalid"),
      };
    } else {
      memoryCache = { at: Date.now(), data: body.data, error: null };
    }
  } catch {
    memoryCache = {
      at: Date.now(),
      data: null,
      error: new Error("challenge_status_network"),
    };
  }
}

function ensureCached(): Promise<void> {
  const now = Date.now();
  if (memoryCache && now - memoryCache.at < CACHE_MS) {
    return Promise.resolve();
  }
  if (!sharedFetch) {
    sharedFetch = refreshCache().finally(() => {
      sharedFetch = null;
    });
  }
  return sharedFetch;
}

/**
 * Fetches GET /api/cohorts/challenge-status/ via Next proxy with a 60s in-memory cache
 * shared across the whole app (deduped in-flight request).
 */
export function useChallengeStatus(): {
  data: ChallengeStatusData | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
} {
  const now = Date.now();
  const initiallyFresh =
    memoryCache !== null && now - memoryCache.at < CACHE_MS;
  const [loading, setLoading] = useState(!initiallyFresh);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      await ensureCached();
      if (!alive) return;
      setLoading(false);
      setTick((t) => t + 1);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const refresh = useCallback(() => {
    memoryCache = null;
    sharedFetch = null;
    setLoading(true);
    void ensureCached().then(() => {
      setLoading(false);
      setTick((t) => t + 1);
    });
  }, []);

  void tick;

  const snap = memoryCache;
  return {
    data: snap?.data ?? null,
    error: snap?.error ?? null,
    loading,
    refresh,
  };
}
