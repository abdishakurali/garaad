import type { BlogPost } from "@/types/blog";

/** Known usernames → public display name (API may only send lowercase handle). */
const USERNAME_DISPLAY_OVERRIDES: Record<string, string> = {
  abdishakuuralimohamed: "Abdishakur Ally",
};

/**
 * 1) first_name and/or last_name from API (either field is enough)
 * 2) explicit override for known usernames (all-lowercase handles never match camelCase regex)
 * 3) camelCase boundary split (e.g. johnDoe → john Doe)
 * 4) raw username
 */
export function getBlogAuthorDisplayName(post: BlogPost): string {
  const a = post.author;
  const first = a?.first_name?.trim();
  const last = a?.last_name?.trim();
  if (first || last) {
    return [first, last].filter(Boolean).join(" ");
  }

  const raw = a?.username?.trim() || post.author_name?.trim();
  if (!raw) return "Garaad";

  const override = USERNAME_DISPLAY_OVERRIDES[raw.toLowerCase()];
  if (override) return override;

  const camelSplit = raw.replace(/([a-z])([A-Z])/g, "$1 $2");
  if (camelSplit !== raw) return camelSplit;

  return raw;
}
