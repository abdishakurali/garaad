"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Returns true when the auth store has rehydrated from persistence (e.g. localStorage).
 * Use to avoid hydration mismatch and to show auth-dependent UI only after mount.
 */
export function useAuthReady(): boolean {
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      useAuthStore.getState().setHasHydrated(true);
    }
    return useAuthStore.persist.onFinishHydration(() => {
      useAuthStore.getState().setHasHydrated(true);
    });
  }, []);

  return _hasHydrated;
}
