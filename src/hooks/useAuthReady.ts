import { useAuthStore } from "@/store/useAuthStore";

/**
 * Returns true when the auth store has rehydrated from persistence (e.g. localStorage).
 * Use to avoid hydration mismatch and to show auth-dependent UI only after mount.
 */
export function useAuthReady(): boolean {
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);
  return _hasHydrated;
}
