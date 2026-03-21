import type { UserProgress } from "@/services/progress";

/**
 * Pick where to send a returning learner: most recently touched incomplete lesson,
 * else most recent row, else course catalog.
 */
export function getResumeLessonPath(progressList: UserProgress[]): string {
  if (!progressList.length) return "/courses";

  const incomplete = progressList.filter((p) => p.status !== "completed");
  const pool = incomplete.length > 0 ? incomplete : progressList;

  const sorted = [...pool].sort(
    (a, b) =>
      new Date(b.last_visited_at).getTime() - new Date(a.last_visited_at).getTime()
  );

  for (const p of sorted) {
    const cat = p.category_id;
    const slug = p.course_slug;
    if (cat != null && slug && p.lesson != null) {
      return `/courses/${cat}/${slug}/lessons/${p.lesson}/`;
    }
  }

  return "/courses";
}
