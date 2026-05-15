/**
 * Garaad — Standardised Somali Terminology Glossary
 *
 * Single reference for platform-wide term choices.
 * All developers must use these forms consistently.
 *
 * Rules:
 *  1. Prefer simple, spoken Somali over formal/literary forms
 *  2. Keep English loan-words users already know (Mentorship, AI, Upwork, Fiverr, portfolio)
 *  3. Never mix English + Somali mid-sentence in UI copy unless both are well-established
 *  4. Plural forms are listed where they differ from singular
 *  5. AUDIT column: KEEP = current usage correct | IMPROVE = needs small fix | REWRITE = replace entirely
 */

export const TERMINOLOGY = {

  // ─── Learning objects ────────────────────────────────────────────────────

  lesson: {
    so_singular: "cashar",
    so_plural: "casharro",
    notes: "Never use 'lesson' in Somali UI copy. 'cashar' is correct and widely understood.",
    audit: "KEEP",
    examples: {
      bad:  ["lesson", "lessons", "dars", "darsyo"],
      good: ["cashar", "casharro", "casharradan"],
    },
  },

  course: {
    so_singular: "koorso",
    so_plural: "koorsooyinka",
    notes: "Use 'koorso' consistently. Avoid 'koorse', 'course', or 'curriuclum'.",
    audit: "KEEP",
    examples: {
      bad:  ["course", "koorse", "barnaamij-barashada"],
      good: ["koorso", "koorsooyinka", "koorsadaas"],
    },
  },

  week: {
    so_singular: "toddobaad",
    so_plural: "toddobaadyo",
    notes: "Correct plural is 'toddobaadyo', not 'toddobaadyada' (that is definite).",
    audit: "KEEP",
    examples: {
      bad:  ["week", "usbuuc", "usbuucyo"],
      good: ["toddobaad", "toddobaadyo", "Toddobaadka 1-aad"],
    },
  },

  module: {
    so_singular: "qaybta",
    so_plural: "qaybaha",
    notes: "Use 'qaybta' for a named section/module within a course.",
    audit: "KEEP",
  },

  track: {
    so: "waddo",
    alt: "jid",
    notes: "Use 'waddo' for learning track/path. 'jid' is also acceptable.",
    audit: "KEEP",
    examples: {
      bad:  ["track", "Track"],
      good: ["waddada barashada", "jidkaaga", "Dhammaan waddooyinka"],
    },
  },

  curriculum: {
    so: "manhajka",
    notes: "'manhajka' is understood in Somali education context.",
    audit: "KEEP",
  },

  quiz: {
    so: "imtixaan",
    alt: "su'aalo",
    notes: "Keep 'quiz' in admin UI since instructors are familiar. Use 'imtixaan' or 'su'aalo' in learner UI.",
    audit: "IMPROVE",
  },

  certificate: {
    so: "shahaado",
    notes: "Always use 'shahaado', never 'certificate' in learner UI.",
    audit: "IMPROVE — 'shahaadada' found in code is correct",
    examples: {
      bad:  ["certificate", "Certificate"],
      good: ["shahaado", "shahaadada soo deji"],
    },
  },

  // ─── User / account ──────────────────────────────────────────────────────

  login: {
    so: "soo gal",
    notes: "Two words as a phrase ('Soo gal'). As a noun: 'galitaan'.",
    audit: "KEEP",
    examples: {
      bad:  ["login", "log in", "Log In", "galey"],
      good: ["Soo gal", "soo galitaan"],
    },
  },

  signup: {
    so_short: "samee akoon",
    so_formal: "is-diiwaan-geli",
    notes: "'Samee akoon' is shorter and more conversational — prefer it for CTAs. Use 'is-diiwaan-geli' in formal contexts.",
    audit: "KEEP — both forms exist in codebase and are acceptable",
    examples: {
      bad:  ["sign up", "register", "diiwaangeli"],
      good: ["Samee akoon bilaash", "Is-diiwaan-geli"],
    },
  },

  logout: {
    so: "ka bax",
    notes: "'Ka bax' is correct and natural.",
    audit: "KEEP",
  },

  profile: {
    so: "xogtagaaga",
    alt: "profile-kaaga",
    notes: "Use 'xogtagaaga' in headings. 'profile-kaaga' acceptable in nav/dropdowns.",
    audit: "IMPROVE — standardise to 'xogtagaaga' in headings",
  },

  settings: {
    so: "dejinta",
    notes: "'Dejinta' is correct.",
    audit: "KEEP",
  },

  password: {
    so: "furaha sirta",
    notes: "Two-word phrase, always lowercase unless starting sentence.",
    audit: "KEEP",
  },

  email: {
    so: "email",
    notes: "Keep 'email' — it is a universally understood loan word in Somali.",
    audit: "KEEP",
  },

  verify: {
    so: "xaqiiji",
    notes: "'Xaqiiji' covers both 'verify' and 'confirm'.",
    audit: "KEEP",
  },

  // ─── Payments / premium ──────────────────────────────────────────────────

  premium: {
    so: "Mentorship",
    alt: "xubinnimo buuxda",
    notes: "The product is called 'Mentorship'. Use 'xubinnimo buuxda' only as a generic descriptor. NEVER use 'Premium' in isolation as it means nothing to Somali users.",
    audit: "REWRITE — 'Premium Content' in PremiumGuard needs replacing",
    examples: {
      bad:  ["Premium", "Premium Content", "premium"],
      good: ["Mentorship", "Xubinnimo Buuxda", "Casharrada Xidhan"],
    },
  },

  unlock: {
    so: "fur",
    notes: "'Fur' means open/unlock. Use 'Fur casharrada' not 'Unlock lessons'.",
    audit: "REWRITE — 'Unlock all lessons' in InlinePremiumGate must change",
    examples: {
      bad:  ["Unlock", "unlock all", "Xidhan fur"],
      good: ["Fur casharrada", "Casharrada fur", "si aad u furto"],
    },
  },

  payment: {
    so: "lacag-bixin",
    alt: "bixi",
    notes: "Use 'lacag-bixin' as a noun. 'bixi' as a verb ('lacagta bixi' = pay the money).",
    audit: "KEEP",
  },

  free: {
    so: "bilaash",
    notes: "'Bilaash' is universally understood. Never use 'lacag la'aaan' in CTAs.",
    audit: "KEEP",
  },

  subscription: {
    so: "xubinnimo",
    notes: "'Xubinnimo' (membership) is the best Somali equivalent.",
    audit: "KEEP",
  },

  refund: {
    so: "lacag-celin",
    notes: "Two-word compound.",
    audit: "KEEP",
  },

  // ─── Platform / features ─────────────────────────────────────────────────

  mentorship: {
    so: "Mentorship",
    notes: "Keep as English proper noun — it is the product name and Somali users know it.",
    audit: "KEEP",
  },

  mentor: {
    so: "macallin",
    alt: "mentor",
    notes: "Use 'macallin' in Somali copy. 'mentor' acceptable in product name contexts.",
    audit: "IMPROVE",
    examples: {
      bad:  ["tutor", "trainer"],
      good: ["macallinkaaga", "macallin shakhsiyeed"],
    },
  },

  community: {
    so: "bulshada",
    alt: "Bulshadda",
    notes: "'Bulshada' (the community). Capitalise as 'Bulshadda' in headings.",
    audit: "KEEP",
  },

  dashboard: {
    so: "guriga",
    alt: "xarunta",
    notes: "'Guriga' (home) is the right metaphor for the learner dashboard. Avoid 'dashboard' in learner UI.",
    audit: "KEEP",
  },

  freelancing: {
    so: "shaqo madax-bannaan",
    alt: "freelancing",
    notes: "Use 'shaqo madax-bannaan' in educational context. Keep 'freelancing' in product names (track titles).",
    audit: "KEEP",
    examples: {
      good: ["Bilow Shaqo Madax-bannaan", "freelancing track", "Freelancing Koorso"],
    },
  },

  client: {
    so: "macmiil",
    so_plural: "macaamiil",
    notes: "'Macmiil' is the standard Somali business term for client/customer.",
    audit: "KEEP",
  },

  income: {
    so: "dakhli",
    alt: "lacag",
    notes: "Use 'dakhli' for income/earnings as a concept. Use 'lacag' for money specifically.",
    audit: "KEEP",
  },

  online_income: {
    so: "lacag online",
    alt: "dakhli online",
    notes: "Keep 'online' as loan word — universally known.",
    audit: "KEEP",
  },

  skills: {
    so: "xirfado",
    so_singular: "xirfad",
    notes: "'Xirfad' (skill), 'xirfado' (skills).",
    audit: "KEEP",
  },

  portfolio: {
    so: "portfolio",
    alt: "faylka shaqada",
    notes: "Keep 'portfolio' in product contexts — well known. Use 'faylka shaqada' in explanatory copy.",
    audit: "KEEP",
  },

  // ─── UI actions ──────────────────────────────────────────────────────────

  continue: {
    so: "sii wad",
    notes: "Two-word phrase. Correct for 'continue learning'.",
    audit: "KEEP",
  },

  start: {
    so: "bilow",
    notes: "Simple imperative. Use for CTAs.",
    audit: "KEEP",
  },

  retry: {
    so: "mar kale isku day",
    short: "isku day",
    audit: "KEEP",
  },

  dismiss: {
    so: "xir",
    alt: "ka dhaaf",
    notes: "'Xir' for closing UI elements. 'Maanta kama jiro' for 'not now' CTAs.",
    audit: "REWRITE — 'Xoog dambe' in PremiumGuard is awkward, replace with 'Maanta kama jiro'",
  },

  // ─── Emotional/conversion copy ────────────────────────────────────────────

  congratulations: {
    so: "Hambalyo",
    notes: "Single word, always capitalised at start of sentence.",
    audit: "KEEP",
  },

  welcome: {
    so: "Ku soo dhawoow",
    notes: "Standard Somali welcome phrase.",
    audit: "KEEP",
  },

  urgent: {
    so_phrase: "Boosaaska way xaddidan yihiin",
    notes: "Use sparingly. Avoid manufactured urgency — only use when genuinely true.",
    audit: "IMPROVE",
  },

} as const;

/**
 * Quick-access flat map for common substitutions.
 * Use this in components to avoid hardcoded strings.
 *
 * Example:
 *   import { T } from "@/lib/i18n/somaliTerminologyMap";
 *   <span>{T.lesson_plural}</span>  // → "casharro"
 */
export const T = {
  lesson:          TERMINOLOGY.lesson.so_singular,
  lessons:         TERMINOLOGY.lesson.so_plural,
  course:          TERMINOLOGY.course.so_singular,
  courses:         TERMINOLOGY.course.so_plural,
  week:            TERMINOLOGY.week.so_singular,
  weeks:           TERMINOLOGY.week.so_plural,
  track:           TERMINOLOGY.track.so,
  login:           TERMINOLOGY.login.so,
  logout:          TERMINOLOGY.logout.so,
  signup:          TERMINOLOGY.signup.so_short,
  signup_formal:   TERMINOLOGY.signup.so_formal,
  profile:         TERMINOLOGY.profile.so,
  settings:        TERMINOLOGY.settings.so,
  free:            TERMINOLOGY.free.so,
  unlock:          TERMINOLOGY.unlock.so,
  continue:        TERMINOLOGY.continue.so,
  start:           TERMINOLOGY.start.so,
  community:       TERMINOLOGY.community.so,
  mentor:          TERMINOLOGY.mentor.so,
  client:          TERMINOLOGY.client.so,
  clients:         TERMINOLOGY.client.so_plural,
  skills:          TERMINOLOGY.skills.so,
  skill:           TERMINOLOGY.skills.so_singular,
  congratulations: TERMINOLOGY.congratulations.so,
  welcome:         TERMINOLOGY.welcome.so,
  dismiss_not_now: "Maanta kama jiro",
  premium_title:   "Xubinnimo Buuxda",
  score:           "Natiijada",
  certificate:     "shahaado",
} as const;
