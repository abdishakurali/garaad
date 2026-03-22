import type { BlogPost } from "@/types/blog";

/**
 * Prefer full name from API; else split camelCase username; else fallback.
 */
export function getBlogAuthorDisplayName(post: BlogPost): string {
  const a = post.author;
  if (a?.first_name?.trim() && a?.last_name?.trim()) {
    return `${a.first_name.trim()} ${a.last_name.trim()}`;
  }
  const u = a?.username?.trim() || post.author_name?.trim();
  if (u) {
    return u.replace(/([a-z])([A-Z])/g, "$1 $2");
  }
  return "Garaad";
}
