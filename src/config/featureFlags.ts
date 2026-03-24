import type { User } from "@/types/auth";

/**
 * Explorer content (lessons beyond L1, community posting) for signed-in users.
 * Default: free (unset env). Set NEXT_PUBLIC_EXPLORER_IS_FREE=false to restore paid Explorer.
 */
export const EXPLORER_IS_FREE =
  process.env.NEXT_PUBLIC_EXPLORER_IS_FREE !== "false" &&
  process.env.NEXT_PUBLIC_EXPLORER_IS_FREE !== "0";

/**
 * When true, signed-in users can open every course lesson without Challenge/premium.
 * Unset or any value except "false"/"0" enables (default: all lessons free).
 */
export const ALL_LESSONS_FREE =
  process.env.NEXT_PUBLIC_ALL_LESSONS_FREE !== "false" &&
  process.env.NEXT_PUBLIC_ALL_LESSONS_FREE !== "0";

/** Lesson/community access: paid subscriber or free Explorer when flag is on. */
export function userHasExplorerContentAccess(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.is_premium) return true;
  return EXPLORER_IS_FREE;
}
