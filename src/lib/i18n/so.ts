/**
 * Garaad — Somali UI Translation Constants
 *
 * Single source of truth for all user-facing Somali strings.
 * Import the relevant namespace into your component.
 *
 * Terminology rules:
 *  - cashar  = lesson (sing.)    casharro = lessons (pl.)
 *  - koorso  = course (sing.)    koorsooyinka = the courses
 *  - toddobaad = week (sing.)    toddobaadyo = weeks (pl.)
 *  - macmiil  = client
 *  - Mentorship = Mentorship (keep English, recognised term)
 *  - lacag    = money / payment
 *  - bilaash  = free
 *  - xubinnimo = membership
 *  - soo gal  = log in
 *  - is-diiwaan-geli = sign up  (shortened: samee akoon)
 *  - xaqiiji  = verify
 *  - dejinta  = settings
 *  - guriga   = home / dashboard
 */

// ─── common ──────────────────────────────────────────────────────────────────

export const common = {
  back: "Dib u laabo",
  continue: "Sii wad",
  close: "Xir",
  cancel: "Jooji",
  confirm: "Xaqiiji",
  save: "Kaydi",
  loading: "Waa la soo raraa…",
  error_generic: "Wax khalad ah ayaa dhacay. Fadlan mar kale isku day.",
  error_retry: "Isku day mar kale",
  skip: "Ka gudub",
  next: "Xiga →",
  previous: "← Hore",
  done: "La dhammaystay",
  or: "ama",
  yes: "Haa",
  no: "Maya",
  see_all: "Dhamaantooda eeg",
  home: "Guriga",
  settings: "Dejinta",
  profile: "Xogtagaaga",
} as const;

// ─── auth ─────────────────────────────────────────────────────────────────────

export const auth = {
  // login
  login_heading: "Soo gal",
  login_subtitle: "Geli emailkaaga iyo furaha sirta si aad akoonkaaga ugu laabato.",
  login_email_label: "Emailkaaga",
  login_email_placeholder: "magac@tusaale.com",
  login_password_label: "Furaha sirta",
  login_password_placeholder: "Furaha sirta geli",
  login_submit: "Soo gal",
  login_submitting: "Waa la galeyaa…",
  login_no_account: "Akoon ma lihid?",
  login_signup_link: "Samee akoon bilaash",
  login_forgot_password: "Furaha sirta ma illawday?",
  login_back: "← Dib u laabo",

  // signup / welcome
  signup_heading: "Samee akoonkaaga",
  signup_subtitle: "Bilaash. Kaar ma loo baahna.",
  signup_name_label: "Magacaaga",
  signup_name_placeholder: "Magacaaga ku geli",
  signup_email_label: "Emailkaaga",
  signup_email_placeholder: "magac@tusaale.com",
  signup_password_label: "Furaha sirta",
  signup_password_placeholder: "Ugu yaraan 8 xaraf",
  signup_submit: "Bilow bilaash →",
  signup_submitting: "Waa la abuuraa…",
  signup_has_account: "Akoon horey u leedahay?",
  signup_login_link: "Soo gal",
  signup_terms: "Adigoo is-diiwaan-gelinaya waxaad ogolaanaysaa xeerarka iyo qawaaniinta Garaad.",
  signup_age_confirm: "Waxaan xaqiijinayaa in aan 13+ jir ahay.",

  // email verification
  verify_heading: "Xaqiiji emailkaaga",
  verify_subtitle: "Kood 6-xaraf ah ayaan kuu dirnay {email}. Hubi sanduuqaaga.",
  verify_code_label: "Koodka xaqiijinta",
  verify_submit: "Xaqiiji",
  verify_submitting: "Waa la xaqiijiyaa…",
  verify_resend: "Kood cusub dir",
  verify_resending: "Waa la diraa…",
  verify_success: "Email-kaaga waa la xaqiijiyay! ✓",
  verify_error_length: "Fadlan geli koodka 6-xarafka ah.",
  verify_error_paste: "Koodka waa 6 tirood — mar kale isku day.",
  verify_banner_title: "Xaqiiji emailkaaga si aad u badbaadiso horumarka",
  verify_banner_subtitle: "— Hubi sanduuqaaga",
  verify_banner_resend: "Kood cusub dir",
  verify_banner_action: "Xaqiiji",

  // errors
  error_invalid_credentials: "Emailka ama furaha sirtu ma saxna. Mar kale isku day.",
  error_email_taken: "Email-kan waa la isticmaalay. Soo gal ama isticmaal email kale.",
  error_email_required: "Emailkaaga geli.",
  error_password_short: "Furaha sirtu waa inuu ka badan yahay 8 xaraf.",
  error_login_required: "Fadlan soo gal si aad lacag u bixiso.",
  error_email_not_verified: "Fadlan xaqiiji emailkaaga ka hor intaadan lacag bixin.",
  error_email_missing: "Email-ka lama helin. Fadlan dib ugu laabo oo isku day.",

  // logout
  logout: "Ka bax",

  // profile dropdown
  dropdown_manage: "Maaree akoonkaaga",
  dropdown_profile: "Xogtagaaga",
  dropdown_settings: "Dejinta",
} as const;

// ─── courses ─────────────────────────────────────────────────────────────────

export const courses = {
  // navigation
  back_to_courses: "← Korsooyinka",
  back_to_track: "← Wadada",
  all_tracks: "Dhammaan waddooyinka",

  // course card / header
  lessons_count: "{n} cashar",
  weeks_count: "{n} toddobaadyo",
  week_label: "Toddobaadka {n}",
  week_complete: "Toddobaadka la dhammaystay",
  overall_progress: "Horumarka guud",
  weeks_completed: "{n} / {total} toddobaadyo la dhammaystay",
  start_course: "Bilow koosorada →",
  continue_course: "Sii wad barashada →",
  view_course: "Korsooda eeg",

  // lesson status
  lesson_free: "Bilaash",
  lesson_locked: "Xidhan",
  lesson_completed: "La dhammaystay ✓",
  lesson_in_progress: "Ku jira",
  lesson_start: "Bilow casharka →",
  lesson_continue: "Sii wad →",

  // premium gate (inline)
  gate_locked_one: "1 cashar oo Mentorship ardayda loogu talagalay",
  gate_locked_many: "{n} casharro oo Mentorship ardayda loogu talagalay",
  gate_waitlist: "Kooxda way buuxdaa. Geli liiska si aad u hesho kooxda xigta.",
  gate_join_prompt: "Ku soo biir Mentorship-ka si aad u hesho dhammaan casharrada iyo macallin shakhsiyeed.",
  gate_unlock_cta: "Fur dhammaan casharrada →",

  // lesson complete modal
  lesson_complete_title: "Hambalyo! Casharka waa dhammaatay 🎉",
  lesson_complete_score: "Natiijada",
  lesson_complete_progress: "Horumarinta koorsada",
  lesson_complete_count: "{done} / {total} casharro",
  lesson_complete_next: "Casharka xiga →",
  lesson_complete_finish: "Koorsada dhamee ✓",
  lesson_complete_back_course: "← Koorsada ku laabo",
  lesson_complete_review: "Dib u eeg",
  lesson_complete_home: "Guriga",
  lesson_complete_other: "Koorsooyinka kale",
  lesson_complete_certificate_preview: "Shahaadada (hordhac)",
  lesson_complete_download_cert: "Shahaadada soo deji",
  course_complete_title: "Koorsooyinki oo dhan waa dhammaatay! 🏆",

  // week complete modal
  week_complete_title: "Hambalyo! 🎉",
  week_complete_subtitle: "Toddobaadka {n} waa dhammaatay — {title}",
  week_complete_milestone_label: "Waxaad hadda samayn kartaa",
  week_complete_work_submit: "📎 Shaqadaada u dir macallinkaaga — dhawaan ayaa la furayaa",
  week_complete_next_week: "Bilow Toddobaadka {n} — {title}",
  week_complete_track_done: "🏆 Wadada oo dhan waa dhammaatay!",
  week_complete_back: "Dib ugu laabo casharrada",

  // empty / loading states
  loading_course: "Koorsada waa la soo raraa…",
  loading_lesson: "Casharka waa la soo raraa…",
  error_course_not_found: "Koorso lama helin.",
  error_lesson_not_found: "Cashar lama helin.",
  enroll_cta: "Ku biir koorsada",
  not_enrolled: "Koorsodan laguma diiwaangalin.",
} as const;

// ─── payments ────────────────────────────────────────────────────────────────

export const payments = {
  // modal header
  modal_title: "Dhammaystir is-diiwaangelintaada",
  modal_plan_label: "Qorshaha",
  modal_price_label: "Qiimaha",

  // payment method
  pay_with: "Ku bixi",
  method_waafi: "Waafi (Lacagta moobaylka)",
  method_card: "Kaarka Bangiga (Stripe)",

  // phone
  phone_label: "Lambarka telefoonka Waafi",
  phone_placeholder: "Tusaale: 252615000000",
  phone_required: "Fadlan geli lambarka telefoonkaaga.",

  // actions
  pay_free: "Samee akoon bilaash",
  pay_challenge: "Bixi $149",
  paying: "Waa la bixiyaa…",

  // verify step (inside payment)
  verify_step_title: "Xaqiiji emailkaaga",
  verify_step_subtitle: "Kood ayaan kuu dirnay. Hubi sanduuqaaga ka dibna geli halkan.",
  verify_code_error: "Fadlan geli koodka 6-tirood ah.",
  verify_submit: "Xaqiiji lacagta bixi →",
  verify_resend: "Kood cusub dir",
  verify_resending: "Waa la diraa…",
  verify_success: "Email-kaaga waa la xaqiijiyay! ✓",

  // errors
  error_generic: "Lacag-bixintu waxay la kulmay dhibaato. Fadlan mar kale isku day.",
  error_login: "Fadlan soo gal si aad lacag u bixiso.",
  error_email_unverified: "Fadlan xaqiiji emailkaaga ka hor intaadan lacag bixin.",
  error_email_missing: "Email-ka lama helin. Fadlan dib ugu laabo.",

  // success
  success_free: "Ku soo dhawoow! Hadda waxaad geli kartaa dhammaan casharrada. Bilow barashada →",
  success_mentorship: "Ku soo dhawoow Mentorship-ka! Hubi WhatsApp-kaaga — kooxda Garaad ayaa kula soo xiriiri doonta 24 saac gudahood.",

  // waitlist
  waitlist_full: "Kooxda way buuxdaa.",
  waitlist_next: "Geli liiska si aad u hesho kooxda xigta.",
  waitlist_contact: "Nala soo xiriir si aad ugu biirto kooxda xigta.",
} as const;

// ─── paywall / premium guard ──────────────────────────────────────────────────

export const paywall = {
  // community gate
  title_community: "Bulshadda",
  title_mentorship: "Mentorship",
  title_cohorts: "Kooxaha",
  title_default: "Xubinnimo Buuxda",

  subtitle: "Ku biir Mentorship-ka si aad u hesho fursadahan:",

  benefit_1: "Macallin shakhsiyeed oo kuu qaabilsan",
  benefit_2: "Helitaanka bulshadda khabiirada ah",
  benefit_3: "Mashaariic dhab ah oo portfolio loogu isticmaalo",

  price_display: "$49",
  price_unit: "bilkiiba",
  urgency: "⚠️ Boosaaska macalinka waa xaddidan yihiin",

  cta_upgrade: "Bilow Mentorship-ka →",
  cta_dismiss: "Maanta kama jiro",
} as const;

// ─── errors ──────────────────────────────────────────────────────────────────

export const errors = {
  not_found_title: "Boggan lama helin",
  not_found_subtitle: "Boggu ma jiro ama waa la wareejiyay.",
  not_found_cta: "← Guriga ku laabo",

  boundary_title: "Wax khalad ah ayaa dhacay",
  boundary_subtitle: "Fadlan dib u cusbooneysii bogga.",
  boundary_refresh: "Dib u cusbooneysii",
  boundary_home: "← Guriga",

  error_404: "404 — Boggan lama helin",
  error_500: "500 — Khalad gudaha",
} as const;

// ─── notifications / banners ─────────────────────────────────────────────────

export const notifications = {
  new_version_title: "Cusbooneysiis cusub ayaa diyaar ah",
  new_version_action: "Dib u soo rar",

  push_title: "Ogeysiisyada fur",
  push_subtitle: "Ogayso marka cashar cusub la daabaco.",
  push_enable: "Fur ogeysiisyada",
  push_enabled: "Ogeysiisyada waa furan yihiin ✓",
  push_denied: "Ogeysiisyada la diidey. Browser-kaaga dejinta ka hubi.",
} as const;

// ─── navigation ──────────────────────────────────────────────────────────────

export const nav = {
  courses: "Korsooyinka",
  blog: "Maqaalada",
  about: "Nagu saabsan",
  mentorship: "Mentorship",
  community: "Bulshada",
  login: "Soo gal",
  signup: "Bilow bilaash",
  upgrade: "Mentorship",
} as const;

// ─── footer ──────────────────────────────────────────────────────────────────

export const footer = {
  tagline: "Garaad — Koorsooyinka dijitaalka ah ee Soomaali",
  links_learn: "Baro",
  links_courses: "Korsooyinka",
  links_blog: "Maqaalada",
  links_about: "Nagu saabsan",
  links_company: "Shirkadda",
  links_privacy: "Xeerka Asturnaanta",
  links_terms: "Shuruudaha",
  links_feedback: "Fikradaada",
  copyright: "© {year} Garaad. Xuquuqda oo dhan way dhowrsanyihiin.",
} as const;

// ─── quiz / practice ─────────────────────────────────────────────────────────

export const quiz = {
  check_answer: "Jawaabta hubin",
  correct: "Sax! ✓",
  incorrect: "Khalad. Mar kale isku day.",
  hint: "Tilmaame",
  next_question: "Su'aasha xiga →",
  submit: "Dir",
  score: "Natiijada",
  perfect: "Qiimo buuxa! 🎉",
  try_again: "Mar kale isku day",
  explanation: "Sharaxaad",
} as const;

// ─── profile / settings ──────────────────────────────────────────────────────

export const profileSettings = {
  heading: "Xogtagaaga",
  name_label: "Magacaaga",
  email_label: "Emailkaaga",
  password_label: "Furaha sirta cusub",
  save_changes: "Isbeddelada kaydi",
  saving: "Waa la kaydiyaa…",
  saved: "La kaydiyay ✓",
  danger_zone: "Goobta khatar ah",
  delete_account: "Akoonka tirtir",
  delete_confirm: "Ma hubtaa? Ficilkan lama soo celin karo.",
} as const;

// ─── re-export all namespaces ────────────────────────────────────────────────

export const so = {
  common,
  auth,
  courses,
  payments,
  paywall,
  errors,
  notifications,
  nav,
  footer,
  quiz,
  profileSettings,
} as const;

export type SoTranslations = typeof so;
