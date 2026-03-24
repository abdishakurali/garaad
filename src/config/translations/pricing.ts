export const pricingTranslations = {
  // Page header
  pricing_title: "Challenge-ka — hal go'aan, 3 bilood",
  pricing_subtitle: "Qiimo cad. Hal mar bixi. 3 bilood oo buuxda.",

  plan_label_explorer: "Halkaan ka bilow",
  plan_label_challenge: "Halkan ayuu horumarka ka yimaadaa",
  subscribe_below_cards_note:
    "Bilaash ku bilow marka hore — haddii aad diyaar u tahay Challenge-ka, waa kuu furan yahay goor kasta.",

  // Bilaash (free tier; was Explorer)
  explorer_name: "Bilaash — Weligeed",
  explorer_popular_badge: "",
  explorer_tagline: "Ku baro xawaarahaaga — Ingiriis looma baahna.",
  explorer_per_month: "/bishii",
  /** Shown under monthly price on plan card (yearly option). */
  explorer_yearly_hint: "",
  explorer_cta: "Bilow Bilaash",
  explorer_free_price_display: "$0",
  explorer_free_per: "Bilaash",
  explorer_free_cta_signup: "Bilow Bilaash",
  explorer_free_cta_logged_in: "Tag dashboard-ka",
  explorer_feature_1: "Dhammaan 54-ta cashar ee la daabacay",
  explorer_feature_2:
    "6 koorso oo isugu jira tech, xisaab, iyo Baro Sida AI Loogu Shaqaysto",
  explorer_feature_3: "Dabagalka horumarka casharrada",
  explorer_feature_4: "Helitaanka bulshada",
  explorer_feature_5: "Ku baro xawaarahaaga",

  // Challenge card
  challenge_name: "Challenge",
  challenge_badge: "⭐ Lagu taliyay",
  challenge_tagline:
    "3 bilood: ka bilow eber ilaa shaqo tech ama startup-kaaga",
  challenge_per_one_time: " hal mar",
  challenge_cta: "Challenge-ka hadda gal",
  /** Short label for narrow buttons (lesson UI, hero). */
  challenge_cta_compact: "Ku biir Challenge-ka",
  challenge_cta_waitlist: "Gali Liiska Sugitaanka Hadda",
  challenge_feature_1: "Wax kasta oo ku jira Bilaash",
  challenge_feature_2:
    "Su'aalo jawaab toos ah — maalin kasta (wicitaan toddobaadle)",
  challenge_feature_3:
    "Koodhkaaga la eeg si aan khalad loo shaqo qaadin (dib-u-eegis)",
  challenge_feature_4: "Shahaado aad LinkedIn ku dhejin karto (MERN)",
  challenge_feature_5: "Saaxiibo tech ah oo adiga kaa horumarsan (koox 10 qof)",
  challenge_feature_6:
    "Qof kuu jawaabaya marka aad xanaaqdid (WhatsApp + mentor)",
  /** Live cohort capacity (from /api/challenge/status). */
  challenge_spots_remaining: "{n} boos oo hadhay kooxdan",
  challenge_waitlist_only:
    "Kooxdan way buuxdaa. Ha seegin fursada xigta — geli liiska sugitaanka si aad u hesho kooxda xigta.",
  challenge_next_cohort: "Kooxda xigta waxay bilaabmi doontaa {date}.",

  // Payment modal
  modal_title: "Dhammaystir is-diiwaangelintaada",
  modal_plan_label: "Qorshaha",
  modal_price_label: "Qiimaha",
  modal_pay_with: "Ku bixi",
  modal_waafi_label: "Waafi (Lacagta moobaylka)",
  modal_card_label: "Kaarka Bangiga (Stripe)",
  modal_phone_placeholder: "Lambarka telefoonka tusaale: 252615000000",
  modal_phone_label: "Lambarka telefoonka Waafi",
  modal_pay_explorer: "Bilaash",
  modal_pay_challenge: "Bixi $149",
  modal_processing: "Waa lagu guda jiraa...",

  // Success banners
  success_explorer:
    "Ku soo dhawoow Bilaash! Hadda waxaad geli kartaa dhammaan casharrada. Bilow waxbarashada →",
  success_challenge:
    "Ku soo dhawoow Challenge-ka! Hubi WhatsApp-kaaga — kooxda Garaad ayaa kula soo xiriiri doonta 24 saac gudahood.",

  // Dashboard nav
  nav_upgrade: "Challenge",
  nav_badge_explorer: "Bilaash",
  nav_badge_challenge: "Challenge",

  // FAQ
  faq_title: "Su'aalaha Inta Badan La Iska Weydiiyo",
  faq_1_q: "Miyaan joojin karaa xilli kasta?",
  faq_1_a:
    "Haa. Ma jiraan qandaraasyo ama ballanqaadyo khasab ah. Ka jooji meesha laga maamulo akoonkaaga xilli kasta.",
  faq_2_q: "Waa maxay hababka lacag bixinta ee la aqbalo?",
  faq_2_a: "Lacagta moobaylka ee Waafi iyo Stripe (kaarka deynta ama kaarka bangiga).",
  faq_3_q: "Maxaa dhacaya haddii aanan ku qanacsanayn?",
  faq_3_a:
    "7 maalmood gudahood haddii aadan ku qanacsanayn, WhatsApp noogu soo dir — lacagtaada oo buuxda dib u qaado, su'aalna lagu weydiin maayo.",
  faq_4_q: "Sidee u shaqaysaa kooxda Challenge-ka?",
  faq_4_a:
    "Waxaad ku biiraysaa cohort ka kooban 10 arday. Wadajir ayaad u raacaysaan isla jadwalka — usbuuc walbana mentor xirfadle ah ayaa idinla jooga.",
  faq_5_q: "Goorma ayaa la bixiyaa shahaadada MERN?",
  faq_5_a:
    "Markaad dhammaystirto dhammaan casharrada wadada Full Stack MERN oo aad u soo gudbiso mashruucaaga ugu dambeeya dib-u-eegis.",

  // Errors
  error_phone_required: "Lambarka telefoonka ayaa loo baahan yahay bixinta Waafi",
  error_payment_failed:
    "Lacag bixintu way fashilantay. Fadlan isku day markale ama nala soo xiriir.",
  error_login_required: "Fadlan soo gal si aad isku diiwaangeliso",
  already_subscribed: "Hadda ayaad leedahay is-diiwaangelin firfircoon",

  // Subscribe comparison (Free vs Explorer vs Challenge)
  compare_title: "Isbar dhig (kooban)",
  compare_col_features: "Astaamaha",
  compare_row_courses: "Koorsaska",
  compare_row_support: "Taageero",
  compare_free_courses: "Dhammaan koorsaska (casharro xaddidan bilaash)",
  compare_explorer_courses: "Dhammaan casharrada",
  compare_challenge_courses: "Dhammaan + koox & wicitaan",
  compare_free_support: "Bulshada (bilaash)",
  compare_explorer_support: "XP, streaks, bulshada",
  compare_challenge_support: "WhatsApp + wicitaan toddobaadle",

  compare_row_price: "Qiimaha",
  compare_row_certificate: "Shahaadada",
  compare_bilaash_certificate: "✗",
  compare_challenge_certificate: "✓ Shahaado",
  compare_free_price: "Bilaash",
  compare_explorer_price: "$0 · Bilaash",
  compare_explorer_price_free: "Bilaash",
  compare_challenge_price: "$149 hal mar",

  subscribe_social_month:
    "Ku biir {n}+ Developer oo hadda baranaya — waxaad ku jirtaa kooxda",
} as const;
