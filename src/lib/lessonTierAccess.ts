import type { User } from "@/types/auth";

/** First N lessons (by `lesson_number`) are free for signed-in non-premium users. */
export const FREE_TIER_LESSON_COUNT = 3;

export function userHasFullLessonAccess(user: User | null | undefined): boolean {
  return Boolean(user?.is_premium);
}

/** Lesson ids allowed without premium (global course order by lesson_number). */
export function freeTierLessonIdSet(
  lessons: { id: number | string; lesson_number?: number | null }[]
): Set<number> {
  const sorted = [...lessons].sort(
    (a, b) => (a.lesson_number ?? 0) - (b.lesson_number ?? 0)
  );
  return new Set(
    sorted.slice(0, FREE_TIER_LESSON_COUNT).map((l) => Number(l.id))
  );
}

export function isLessonIdUnlocked(
  user: User | null | undefined,
  courseLessons: { id: number | string; lesson_number?: number | null }[],
  lessonId: number | string
): boolean {
  if (userHasFullLessonAccess(user)) return true;
  const free = freeTierLessonIdSet(courseLessons);
  return free.has(Number(lessonId));
}

export function isGuestLessonUnlocked(
  courseLessons: { id: number | string; lesson_number?: number | null }[],
  lessonId: number | string
): boolean {
  const free = freeTierLessonIdSet(courseLessons);
  return free.has(Number(lessonId));
}
