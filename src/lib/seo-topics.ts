/**
 * Programmatic SEO topic definitions.
 * Each entry becomes a statically rendered page at /learn/[slug].
 * These pages are answer-first, entity-rich, AI-search-optimized, and conversion-driven.
 */

export interface SeoTopic {
  slug: string;
  /** H1 on the page */
  headline: string;
  /** <title> tag */
  title: string;
  /** <meta description> — 150-155 chars */
  description: string;
  /** Keywords for this page */
  keywords: string[];
  /** Short answer paragraph shown above the fold (AI Overview bait) */
  answer: string;
  /** Bullet points: what the user will learn / achieve */
  outcomes: string[];
  /** FAQ items for this topic */
  faq: Array<{ question: string; answer: string }>;
  /** CTA target path */
  ctaPath: string;
  /** CTA label */
  ctaLabel: string;
  /** Related topic slugs */
  related: string[];
  /** JSON-LD entity type — used for schema */
  entityType?: "Course" | "Article" | "HowTo" | "FAQPage";
}

export const SEO_TOPICS: SeoTopic[] = [
  {
    slug: "sida-loo-bilaabo-freelancing-soomaali",
    headline: "Sida Loo Bilaabo Freelancing — Hagaha Buuxa Af-Soomaali",
    title: "Sida Loo Bilaabo Freelancing Af-Soomaali | Garaad",
    description:
      "Bilow freelancing online oo Af-Soomaali ah. Xirfad dooro, profile dhis, macmiil raadi, lacag qaado. Hagaha buuxa ee bilaabayaasha — bilaash.",
    keywords: [
      "sida loo bilaabo freelancing Soomaali",
      "freelancing bilaabayaasha Soomaali",
      "lacag online Soomaali",
      "shaqo online Soomaali",
      "how to start freelancing Somalia",
      "freelancing for beginners Somali",
      "Upwork Soomaali",
      "Fiverr Soomaali",
    ],
    answer:
      "Freelancing waa shaqo online ah oo aad ugu shaqeyso macaamiil dunida oo dhan adigoon xafiis u baahnayn. Si aad u bilaabato: 1) Xirfad dooro (qorista, naqshadeynta, coding, ama tarjumada), 2) Profile ku dhis Upwork ama Fiverr, 3) Shaqooyin yar ku bilow si aad u dhisto sumcadaad, 4) Macmiil hel, lacag qaado. Garaad waxay kaa caawisaa marxaladda kasta.",
    outcomes: [
      "Xirfad online oo lacag leh dooranayso",
      "Profile xirfadeed oo soo jiita macaamiil dhis",
      "Proposal winning-ka ah qor",
      "Macmiilaashaada koowaad hel",
      "$100-kii ugu horreeya online gaar",
    ],
    faq: [
      {
        question: "Freelancing waa maxay Af-Soomaali?",
        answer:
          "Freelancing waa nooc shaqo oo aad u shaqeyso macaamiil kala duwan ayadoon shirkad joogto ah loo lahayn. Waxaad lacag ka samaysaa xirfadahaaga — qorista, naqshadeynta, coding, ama wixii kale.",
      },
      {
        question: "Intee lacag ayaan ka samayn karaa freelancing?",
        answer:
          "Bilaabayaashu waxay badanaa bilaabaan $5–$25 saacadda. Khibradda kor u kacda, lacagta ayaa kordheysa. Ardaydeena qaar waxay gaareen $500–$2000 bishaaba.",
      },
      {
        question: "Waa maxay ugu habboon Upwork mise Fiverr?",
        answer:
          "Upwork waxaa ugu habboon shaqooyin waaweyn oo hourly ah. Fiverr waxaa ugu habboon adeegyada yar-yar oo fixed-price ah. Bilaabayaashu way ka faa'iideysan karaan labadaba.",
      },
      {
        question: "Ma u baahanahay aqoon hore?",
        answer:
          "Maya. Waxaad bilaabi kartaa xirfad bilaa aqoon hore. Garaad waxay kaa baraysaa xirfadda iyo sida aad lacag uga sameyso.",
      },
    ],
    ctaPath: "/courses/freelancing",
    ctaLabel: "Bilow Koorso Bilaashka ah",
    related: [
      "upwork-soomaali",
      "fiverr-soomaali",
      "xirfadaha-lacagta-leh-online",
      "lacag-online-soomaali",
    ],
    entityType: "HowTo",
  },
  {
    slug: "upwork-soomaali",
    headline: "Upwork Soomaali — Sida Loo Isticmaalo & Lacag Looga Sameeyo",
    title: "Upwork Soomaali — Hagaha Buuxa Af-Soomaali | Garaad",
    description:
      "Sida Upwork loo isticmaalo Af-Soomaali. Account fur, profile dhis, shaqo codso, lacag qaado. Hagaha bilaabayaasha — Garaad.",
    keywords: [
      "Upwork Soomaali",
      "Upwork Somalia",
      "sida Upwork loo isticmaalo Soomaali",
      "Upwork account Soomaali",
      "Upwork profile Soomaali",
      "how to use Upwork Somalia",
      "Upwork for beginners Somali",
      "earn money Upwork Somalia",
    ],
    answer:
      "Upwork waa goobtii ugu weyn dunida ee shaqada freelancing-ka. Si aad u bilaabato Upwork: fur account bilaash ah, dhis profile xirfadeed oo buuxa, ka codso shaqooyin aad u habboon, labo-ama-saddex shaqo yar ku bilow si aad u hesho dib-u-eegisyo, ka dibna kor u qaad sicirkaaga.",
    outcomes: [
      "Account Upwork oo la ansixiyay fur",
      "Profile 100% buuxa dhis",
      "Shaqooyin laguu codsan karo hel",
      "Proposal la aqbali doono qor",
      "Lacagta Upwork ee Somalia ku qaado",
    ],
    faq: [
      {
        question: "Ma Upwork ku shaqeyn karaa Somalia?",
        answer:
          "Haa. Upwork waxaa isticmaali kara dad Somalia ka imaanaya. Lacagta waxaa loo wareejin karaa Payoneer, kaas oo ka shaqeeya Somalia.",
      },
      {
        question: "Upwork bilaash miyuu yahay?",
        answer:
          "Account-ka Upwork waa bilaash. Upwork 10% ayay ka qaadataa dakhligaaga — taas oo ka dhacda markii lacagta lagu bixiyo.",
      },
      {
        question: "Connects waa maxay Upwork?",
        answer:
          "Connects waa lacag-yar oo aad u isticmaasho si aad u codsato shaqooyin. Bilaabayaashu waxay helaan connects bilaash ah bishii.",
      },
    ],
    ctaPath: "/courses/freelancing",
    ctaLabel: "Baro Upwork Af-Soomaali",
    related: [
      "sida-loo-bilaabo-freelancing-soomaali",
      "fiverr-soomaali",
      "lacag-online-soomaali",
    ],
    entityType: "HowTo",
  },
  {
    slug: "fiverr-soomaali",
    headline: "Fiverr Soomaali — Sida Loo Iibsado Adeegyo Online",
    title: "Fiverr Soomaali — Hagaha Buuxa Af-Soomaali | Garaad",
    description:
      "Baro sida Fiverr loo isticmaalo Af-Soomaali. Gig dhis, macmiil hel, lacag qaado. Hagaha bilaabayaasha ee Fiverr — Garaad.",
    keywords: [
      "Fiverr Soomaali",
      "Fiverr Somalia",
      "sida Fiverr loo isticmaalo Soomaali",
      "Fiverr gig Soomaali",
      "how to use Fiverr Somalia",
      "sell services Fiverr Somalia",
      "Fiverr for beginners Somali",
    ],
    answer:
      "Fiverr waa suuq online ah oo aad ku iibiso adeegyadaada bilaabaya $5. Si aad u bilaabato: account fur, gig (adeeg) dhis oo sawirro iyo sharaxaad buuxda leh, sicir caddee, macaamiil sug. Marka macmiil uu soo xidho, shaqada samee, lacag qaado.",
    outcomes: [
      "Account Fiverr seller ah fur",
      "Gig oo sawirro xirfadeed leh dhis",
      "Fiverr algorithm si sax ah uga faa'ideyso",
      "Reviews koowaad hel",
      "Dakhli joogto ah Fiverr ka samee",
    ],
    faq: [
      {
        question: "Fiverr bilaash miyuu yahay?",
        answer:
          "Account-ka Fiverr waa bilaash. Fiverr 20% ayay ka qaadataa kasta oo aad iibiso.",
      },
      {
        question: "Waa maxay gig Fiverr?",
        answer:
          "Gig waa adeeg aad ku dalbanayso Fiverr. Tusaale ahaan: 'Waxaan kuu qori doonaa maqaallo 500 eray ah $10'.",
      },
      {
        question: "Lacagta Fiverr Somalia ku qaadi kartaa?",
        answer:
          "Haa, adigoo isticmaalaya Payoneer. Payoneer waxay ku shaqeysaa Somalia oo lacagta bankiga ku wareejiso.",
      },
    ],
    ctaPath: "/courses/freelancing",
    ctaLabel: "Baro Fiverr Af-Soomaali",
    related: [
      "sida-loo-bilaabo-freelancing-soomaali",
      "upwork-soomaali",
      "xirfadaha-lacagta-leh-online",
    ],
    entityType: "HowTo",
  },
  {
    slug: "lacag-online-soomaali",
    headline: "Lacag Online Soomaali — 10 Jid oo Xaqiqi ah",
    title: "Lacag Online Soomaali — Sida Lacag Looga Sameeyo Internet | Garaad",
    description:
      "10 jid oo xaqiqi ah oo aad lacag uga sameyso internet Af-Soomaali. Freelancing, copywriting, design, coding, iyo wax badan. Bilaash bilow.",
    keywords: [
      "lacag online Soomaali",
      "sida lacag looga sameeyo internet Soomaali",
      "online income Somalia",
      "earn money online Somalia",
      "shaqo online Soomaali",
      "side hustle Somalia",
      "work from home Somalia",
      "make money internet Somalia",
    ],
    answer:
      "Lacag online ah waxaa looga samayn karaa Somalia adiga oo isticmaalaya: freelancing (Upwork/Fiverr), copywriting, graphic design, coding, tarjumada, YouTube, ama waxbarasho online. Jidka ugu dhaqsaha badan waa freelancing — maalin la bilaabi kartaa, toddobaad gudaheed macmiil la heli karo.",
    outcomes: [
      "10 jid oo xaqiqi ah baaro",
      "Jidka kuu habboon dooro",
      "Bilowga u samee qorshaha",
      "Lacagta $100-ta ugu horreeya hel",
      "Dakhli joogto ah dhis",
    ],
    faq: [
      {
        question: "Waa maxay jidka ugu fudud ee lacag online ah?",
        answer:
          "Freelancing waa jidka ugu dhaqsaha badan. Xirfad yar oo aad leedahay (qorista, tarjumada, social media) ayaad ku bilaabi kartaa.",
      },
      {
        question: "Ma loo baahan yahay lacag bilowga?",
        answer:
          "Maya. Upwork iyo Fiverr account-koodu waa bilaash. Xirfadahaagay tahay asalka.",
      },
      {
        question: "Intee la qaadaa in lacag la helo?",
        answer:
          "Haddaad dedejiso, toddobaad gudaheed shaqadaadii ugu horeysay ayaad heli kartaa. Qaar bilaabiyo waa ka sarreysa.",
      },
    ],
    ctaPath: "/courses/freelancing",
    ctaLabel: "Bilow Maanta",
    related: [
      "sida-loo-bilaabo-freelancing-soomaali",
      "upwork-soomaali",
      "xirfadaha-lacagta-leh-online",
    ],
    entityType: "Article",
  },
  {
    slug: "xirfadaha-lacagta-leh-online",
    headline: "Xirfadaha Ugu Lacagta Badan ee Online — Soomaali 2025",
    title: "Xirfadaha Lacagta Leh Online Soomaali 2025 | Garaad",
    description:
      "Xirfadaha ugu lacagta badan ee online 2025: coding, copywriting, graphic design, AI, iyo wax badan. Koorsooyinka Af-Soomaali ah — Garaad.",
    keywords: [
      "xirfadaha lacagta leh online Soomaali",
      "best skills to learn Somalia",
      "xirfadaha dijital Soomaali",
      "digital skills Somalia 2025",
      "high income skills Somalia",
      "tech skills Soomaali",
      "skills for freelancing Somalia",
      "AI jobs Somalia",
    ],
    answer:
      "Xirfadaha ugu lacagta badan ee online 2025: 1) Copywriting ($20–$100/saacad), 2) Web Development ($30–$150/saacad), 3) Graphic Design ($15–$80/saacad), 4) AI Prompting & Automation ($25–$100/saacad), 5) Video Editing ($20–$75/saacad), 6) Social Media Management ($10–$50/saacad). Garaad waxay kaaga caawisaa inaad mid ka barto xirfadahan Af-Soomaali.",
    outcomes: [
      "6 xirfad oo lacagta badan baaro",
      "Kuu habboon dooro",
      "Jidka barashada bilow",
      "Portfolio dhis",
      "Macmiil koowaad hel",
    ],
    faq: [
      {
        question: "Waa maxay xirfadda ugu sahlanaanta leh ee la barto?",
        answer:
          "Copywriting iyo social media management waa xirfadaha ugu sahlanaanta. Labo toddobaad gudaheed waxaad bilaabi kartaa inaad macmiil hesho.",
      },
      {
        question: "AI xirfado miyay lacag badan leedahay?",
        answer:
          "Haa. AI prompting, automation, iyo chatbot-building waxay hadda yihiin xirfado aad u baahan yihiin. Garaad waxay leedahay koorso AI ah.",
      },
      {
        question: "Intee baa qaadaneysa in la barto xirfad?",
        answer:
          "Boqolkiiba 80 ardaydeena waxay bilaabaan macmiil raadinta 30 maalmood gudahooda markay bilaabaan.",
      },
    ],
    ctaPath: "/courses/freelancing",
    ctaLabel: "Baro Xirfad Bilaash",
    related: [
      "sida-loo-bilaabo-freelancing-soomaali",
      "copywriting-soomaali",
      "graphic-design-soomaali",
      "lacag-online-soomaali",
    ],
    entityType: "Article",
  },
  {
    slug: "copywriting-soomaali",
    headline: "Copywriting Soomaali — Xirfadda Qoraalka Iibsiga Af-Soomaali",
    title: "Copywriting Soomaali — Baro Xirfadda Qoraalka | Garaad",
    description:
      "Baro copywriting Af-Soomaali. Qoraalka iibsiga, email marketing, social media content. Xirfad online ah oo lacag badan leh — bilaash bilow.",
    keywords: [
      "copywriting Soomaali",
      "baro copywriting Soomaali",
      "copywriting Somalia",
      "qoraalka iibsiga Soomaali",
      "content writing Somalia",
      "freelance writing Somalia",
      "earn money writing Somali",
      "copywriter Somalia",
    ],
    answer:
      "Copywriting waa farshaxanka qorista qoraalka iibsiga — xayaysiisyada, email-yada, bogaga website-ka, iyo social media. Copywriter-ka waa mid ka mid ah xirfadaha ugu lacagta badan online-ka. Bilaabayaashu waxay qaadaan $10–$30 qoraal, khibraduhu waxay qaadaan $100+.",
    outcomes: [
      "Aasaasiga copywriting baro",
      "Noocyada copywriting garos",
      "Qoraal iibsi ah qor",
      "Portfolio copywriting dhis",
      "Macmiil koowaad Upwork/Fiverr ka hel",
    ],
    faq: [
      {
        question: "Copywriting waa xirfad adag miyaa?",
        answer:
          "Maya. Haddaad qori karto Af-Soomaali ama Ingiriisi, waxaad bilaabi kartaa. Qaab iyo xirfad waa la baran karaa.",
      },
      {
        question: "Copywriting Af-Soomaali miyaa lacag leh?",
        answer:
          "Haa. Shirkadaha Soomaali badan ayaa u baahan copywriter Af-Soomaali — gaar ahaan social media iyo xayaysiisyada.",
      },
    ],
    ctaPath: "/courses/freelancing",
    ctaLabel: "Baro Copywriting",
    related: [
      "xirfadaha-lacagta-leh-online",
      "sida-loo-bilaabo-freelancing-soomaali",
      "graphic-design-soomaali",
    ],
    entityType: "Article",
  },
  {
    slug: "graphic-design-soomaali",
    headline: "Graphic Design Soomaali — Baro Naqshadeynta Dijital Af-Soomaali",
    title: "Graphic Design Soomaali — Baro Naqshadeynta | Garaad",
    description:
      "Baro graphic design Af-Soomaali. Canva, Adobe, logo design, social media graphics. Xirfad online oo lacag leh — Garaad.",
    keywords: [
      "graphic design Soomaali",
      "baro graphic design Soomaali",
      "graphic design Somalia",
      "naqshadeynta dijital Soomaali",
      "Canva Soomaali",
      "logo design Somalia",
      "design freelancer Somalia",
      "learn design Somali",
    ],
    answer:
      "Graphic design waa xirfadda abuurida sawirro, logo-yo, iyo naqshado dijital. Canva oo bilaash ah ayaa laga bilaabi karaa. Naqshadeyaasha freelance-ga ah waxay qaadaan $15–$80 saacaddii. Garaad waxay kaa baraysa graphic design Af-Soomaali.",
    outcomes: [
      "Canva si xirfadeed u isticmaal",
      "Logo iyo brand identity samee",
      "Social media graphics dhis",
      "Portfolio naqshadeyn ah samee",
      "Macmiil design Upwork ka hel",
    ],
    faq: [
      {
        question: "Graphic design laptop kasta miyaa lagu baran karaa?",
        answer: "Haa. Canva waxaa lagu isticmaali karaa browser kasta oo laptop kasta. Ma baahna laptop awood badan.",
      },
      {
        question: "Graphic design intee lagu baran karaa?",
        answer: "Aasaasiga 2–4 toddobaad gudaheed. Portfolio bilaabid 1–2 bilood. Macmiil koowaad 2–3 bilood.",
      },
    ],
    ctaPath: "/courses/freelancing",
    ctaLabel: "Baro Design Bilaash",
    related: [
      "xirfadaha-lacagta-leh-online",
      "copywriting-soomaali",
      "sida-loo-bilaabo-freelancing-soomaali",
    ],
    entityType: "Article",
  },
  {
    slug: "shaqo-remote-soomaali",
    headline: "Shaqo Remote Soomaali — Sida Loo Helo Shaqo Online",
    title: "Shaqo Remote Soomaali — Hagaha Buuxa | Garaad",
    description:
      "Sida loo helo shaqo remote online Af-Soomaali. Remote jobs, work from home, LinkedIn, iyo goobaha shaqada. Garaad.",
    keywords: [
      "shaqo remote Soomaali",
      "remote jobs Somalia",
      "work from home Somalia",
      "online jobs Somalia",
      "shaqo online Soomaali",
      "remote work Somalia",
      "find remote job Somali",
      "LinkedIn Somalia jobs",
    ],
    answer:
      "Shaqo remote waa shaqo aad ka qabato gurigaaga — internet ayaa keliya loo baahan yahay. Goobaha ugu waaweyn: LinkedIn, Remote.co, We Work Remotely, iyo Upwork. Xirfadaha ugu waaweyn: coding, customer support, data entry, iyo design.",
    outcomes: [
      "Goobaha shaqada remote baaro",
      "CV remote-friendly ah qor",
      "LinkedIn profile xirfadeed dhis",
      "Interview preparation samee",
      "Shaqo remote hel",
    ],
    faq: [
      {
        question: "Remote jobs Somalia miyay jiraan?",
        answer:
          "Haa. Shirkadaha caalamiga ah badan ayaa u shaqeeyinaya Soomaalida xirfadda leh. Coding, design, iyo customer support ayaa ugu baahan.",
      },
      {
        question: "Remote job iyo freelancing waa maxay farqiga?",
        answer:
          "Remote job waxaa kaaga bixisa shirkad mid ah oo mushaharo joogto ah. Freelancing waxaad u shaqeysaa macaamiil badan oo project by project ah.",
      },
    ],
    ctaPath: "/courses/freelancing",
    ctaLabel: "Bilow Jidka Remote",
    related: [
      "sida-loo-bilaabo-freelancing-soomaali",
      "xirfadaha-lacagta-leh-online",
      "lacag-online-soomaali",
    ],
    entityType: "Article",
  },
];

export function getTopicBySlug(slug: string): SeoTopic | undefined {
  return SEO_TOPICS.find((t) => t.slug === slug);
}

export function getAllTopicSlugs(): string[] {
  return SEO_TOPICS.map((t) => t.slug);
}
