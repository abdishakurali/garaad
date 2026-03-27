import type { User } from "@/types/auth";

/** First N lessons (by `lesson_number`) for guests / login redirect hints. Signed-in users always see every lesson. */
export const FREE_TIER_LESSON_COUNT = 3;

/** Every signed-in learner can open all course lessons; Challenge is optional for cohort & mentorship. */
export function userHasFullLessonAccess(user: User | null | undefined): boolean {
  return Boolean(user);
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
