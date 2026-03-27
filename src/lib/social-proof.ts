/**
 * Shared helpers for `/api/public/social-proof/`.
 * When the API includes `is_challenge: true` or `subscription_type: "challenge"`,
 * those users are treated as Challenge enrollees for copy and ordering.
 */

export interface SocialProofUserRaw {
  first_name?: string;
  last_name?: string;
  date_joined?: string;
  profile_picture_url?: string | null;
  country_flag?: string;
  is_challenge?: boolean;
  subscription_type?: string;
}

export function isChallengeSocialProofUser(u: SocialProofUserRaw): boolean {
  if (u.is_challenge === true) return true;
  const st = (u.subscription_type || "").toLowerCase();
  return st === "challenge";
}

export function formatSocialProofDisplayName(u: SocialProofUserRaw): string {
  const fn = (u.first_name || "").trim();
  const ln = (u.last_name || "").trim();
  return `${fn} ${ln ? `${ln[0]}.` : ""}`.trim();
}

function dedupeSortNewestFirst(list: SocialProofUserRaw[]): SocialProofUserRaw[] {
  const sorted = [...list].sort((a, b) => {
    const ta = Date.parse(a.date_joined || "") || 0;
    const tb = Date.parse(b.date_joined || "") || 0;
    return tb - ta;
  });
  const seen = new Set<string>();
  const out: SocialProofUserRaw[] = [];
  for (const u of sorted) {
    const fn = (u.first_name || "").trim().toLowerCase();
    const ln = (u.last_name || "").trim().toLowerCase();
    const key = fn || ln ? `${fn}|${ln}` : `|${u.date_joined || ""}|${u.profile_picture_url || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(u);
  }
  return out;
}

/** Challenge members first (newest within each group), then other signups. */
export function orderSocialProofForDisplay(raw: unknown): SocialProofUserRaw[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const list = raw.filter((x): x is SocialProofUserRaw => Boolean(x) && typeof x === "object");
  const deduped = dedupeSortNewestFirst(list);
  const challenge = deduped.filter(isChallengeSocialProofUser);
  const general = deduped.filter((u) => !isChallengeSocialProofUser(u));
  return [...challenge, ...general];
}

export function splitSocialProofPools(raw: unknown): {
  challenge: SocialProofUserRaw[];
  general: SocialProofUserRaw[];
} {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { challenge: [], general: [] };
  }
  const list = raw.filter((x): x is SocialProofUserRaw => Boolean(x) && typeof x === "object");
  const deduped = dedupeSortNewestFirst(list);
  return {
    challenge: deduped.filter(isChallengeSocialProofUser),
    general: deduped.filter((u) => !isChallengeSocialProofUser(u)),
  };
}
