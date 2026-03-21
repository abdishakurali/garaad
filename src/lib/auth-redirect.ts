/**
 * Same-origin path-only redirects (middleware + login/signup return URLs).
 */
export function isAllowedRedirect(redirect: string | null): redirect is string {
  if (!redirect || typeof redirect !== "string") return false;
  const path = redirect.startsWith("/") ? redirect : `/${redirect}`;
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}

const LESSON_REDIRECT_PATH = /^\/courses\/[^/]+\/[^/]+\/lessons\/(\d+)\/?$/;

/** Numeric lesson id from a protected lesson URL, or null. */
export function parseLessonIdFromRedirectPath(redirect: string | null): string | null {
  if (!redirect) return null;
  const path = redirect.startsWith("/") ? redirect : `/${redirect}`;
  const m = path.match(LESSON_REDIRECT_PATH);
  return m?.[1] ?? null;
}
