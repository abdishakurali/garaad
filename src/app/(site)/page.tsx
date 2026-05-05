import { Metadata } from "next";
import { HomeContent } from "../home-content";

const SITE_URL = "https://garaad.org";

export const metadata: Metadata = {
  title: "Garaad — Baro React, Next.js, Node.js & AI Af-Soomaaliga | #1 Coding Platform",
  description:
    "Somaliya ugu weyn platform-ka coding-ka. Baro React, Next.js, Node.js, MongoDB & AI Af-Soomaaliga. 30 maalmood. Dhismee mashaariic real. Bilow bilaash.",
  keywords: [
    // Somali keywords for local SEO
    "baro React Somali", "baro Next.js Somali", "baro JavaScript Somali",
    "baro Node.js Somali", "baro MongoDB Somali", "baro full-stack Somali",
    "baro AI Somali", "baro programming Somali", "baro coding Somali",
    "baro web development Somali", "baro MERN stack Somali",
    "Somali coding platform", "Somali programming", "Somali tech education",
    "coding Somalia", "programming Somalia", "web development Somalia",
    "software development Somalia", "become developer Somalia",
    "Garaad STEM", "Garaad Academy", "Somali developer", "Somali software engineer",
    "full-stack developer Somalia", "frontend developer Somalia", "backend developer Somalia",
    "Af-Soomaali programming", "technology education Somalia",
    "learn to code in Somali", "Somali online courses", "Somali e-learning",
    // English keywords for global SEO
    "learn React", "React tutorial", "React for beginners", "React 19",
    "learn Next.js", "Next.js tutorial", "Next.js 14", "Next.js 15", "full-stack Next.js",
    "learn Node.js", "Node.js tutorial", "Node.js backend", "Express.js tutorial",
    "learn MongoDB", "MongoDB tutorial", "MERN stack", "MERN tutorial",
    "learn JavaScript", "JavaScript tutorial", "JavaScript ES6", "modern JavaScript",
    "learn TypeScript", "TypeScript tutorial", "React TypeScript",
    "learn AI", "AI development", "ChatGPT integration", "machine learning basics",
    "learn full-stack", "full-stack development", "web development course",
    "learn web development", "coding for beginners", "coding bootcamp online",
    "learn programming", "programming basics", "computer science",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Garaad — Baro React, Next.js & AI Af-Soomaaliga | #1 Platform",
    description:
      "Somaliya ugu weyn coding platform-ka. Baro React, Next.js, Node.js, MongoDB & AI Af-Soomaaliga. Bilow bilaash.",
    images: [{ url: `${SITE_URL}/images/og-main.jpg`, width: 1200, height: 630, alt: "Garaad — Somalia's #1 Coding Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Garaad — Baro React, Next.js & AI Af-Soomaaliga",
    description:
      "Somaliya ugu weyn coding platform-ka. Baro full-stack development Af-Soomaaliga. Bilow bilaash.",
    images: [`${SITE_URL}/images/og-main.jpg`],
  },
};

const landingJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Maxuu Garaad yahay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Garaad waa platform-kii ugu horreeyay ee full-stack development Af-Soomaali. Baro React, Next.js, Node.js, MongoDB iyo AI — waxbarashada oo dhan Af-Soomaali.",
      },
    },
    {
      "@type": "Question",
      name: "Muxuu Garaad bilaash u yahay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haa, Garaad wuxuu bixinayaa geliddii bilaashka ah ee bilowga. Qiyaasuhu waxay furanayaan dhammaan casharrada iyo tartanka.",
      },
    },
    {
      "@type": "Question",
      name: "Waa maxay teknoolajiyada Garaad u baraa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Garaad wuxuu baraa React, Next.js, Node.js, MongoDB (MERN stack), iyo AI — teknoolajiyada oo dhan ee loo isticmaalo shirkadaha tignoolajiyada ugu sarreeya dunida.",
      },
    },
    {
      "@type": "Question",
      name: "Ma code-ka ku baran karaa Af-Soomaali?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haa. Garaad waa platform-ka kaliya ee aad ku baran kartid full-stack web development iyo AI oo dhan Af-Soomaali.",
      },
    },
    {
      "@type": "Question",
      name: "Yaa Garaad loogu TALGALAY?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Garaad waa kuwa Af-Soomaali ku hadla dunida oo dhan — horyaalka aan aqoon code-ka iyo horumariiyayaashii doonaya inay heystaan. Iyo, Sweden, UK, US diaspora oo dhan soo dhawayn.",
      },
    },
    {
      "@type": "Question",
      name: "Waa intee le eg waqtiga loo baahanyahay inuu noqdo horumariye?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Barnaamijka Tartanka Garaad wuxuu yahay barnaamijka 3 bilood ah ee intensiive. Adigoo 30 daqiiqo maalin kasta ka shaqeinaya, waxaad dhisay mashaariic real oo aad ready noqon karto shaqo.",
      },
    },
    {
      "@type": "Question",
      name: "Waa maxay Tartanka Garaad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tartanka Garaad waa barnaamijka 3 bilood ah ee tartan ah oo la jaan qaaya-hagaha shakhsiga, dhismaha mashaariic, iyo waxbarashada kooxda ah — waa habka ugu dhaqsaha badan ee noqoshada professional developer.",
      },
    },
    {
      "@type": "Question",
      name: "Ma u baahanahay inaan horey uga aqoon code-ka?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aqoon hore ma loo baahna. Garaad wuxuu loogu talgalay horyaallada. Waxaad ka bilowdaa aasaasida HTML, CSS, iyo JavaScript.",
      },
    },
    {
      "@type": "Question",
      name: "Casharadaasha waa maxay luqadaha lagubarayaa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dhammaan casharadaasha waxay baranayaa Af-Soomaali, iyadoo la ilaalinayo erayada tignoolajiyada Ingiriisiga. Tani waxay samaynaysaa waxbarashada la heli karo Af-Soomaaligallba dunida oo dhan.",
      },
    },
    {
      "@type": "Question",
      name: "Ma heli karaa shaqo ka dib markaan dhameeyo Garaad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haa. Garaad wuxuu bixinayaa mashaariic portfolio, shahaadado, iyo taageerada gelida shaqo. ardaydeena waxay bilaabeen kororsannadii shirkado tignoolajiyada iyo freelancers.",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }}
      />
      <HomeContent />
    </div>
  );
}
