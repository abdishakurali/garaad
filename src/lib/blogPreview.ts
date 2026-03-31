/** Strip HTML to plain text for search, cards, and meta fallbacks. */
export function plainTextFromHtml(html: string | null | undefined): string {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Plain text from body, truncated for list/card snippets. */
export function blogBodyPreviewPlain(html: string | null | undefined, maxLength = 220): string {
  const t = plainTextFromHtml(html);
  if (!t) return "";
  if (t.length <= maxLength) return t;
  return `${t.slice(0, maxLength).trim()}…`;
}
