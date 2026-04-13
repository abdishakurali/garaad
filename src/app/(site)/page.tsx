import { Metadata } from "next";
import { HomeContent } from "../home-content";

const SITE_URL = "https://garaad.org";

export const metadata: Metadata = {
  title: "Garaad — Baro React, Next.js, Node.js & AI Af-Soomaaliga | #1 Coding Platform",
  description:
    "Somaliya ugu weyn platform-ka coding-ka. Baro React, Next.js, Node.js, MongoDB & AI Af-Soomaaliga. 30 daqiiqe/day. Dhismee mashaariic real. Bilow bilaash.",
  keywords: [
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
      name: "What is Garaad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Garaad is Somalia's first full-stack coding platform. Learn React, Next.js, Node.js, MongoDB and AI — taught in Somali.",
      },
    },
    {
      "@type": "Question",
      name: "Is Garaad free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Garaad offers free access to get started. Premium plans unlock all courses and mentorship.",
      },
    },
    {
      "@type": "Question",
      name: "What tech stack does Garaad teach?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Garaad teaches React, Next.js, Node.js, MongoDB (MERN stack), and AI — the same stack used at top tech companies worldwide.",
      },
    },
    {
      "@type": "Question",
      name: "Can I learn coding in Somali?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Garaad is the only platform where you can learn full-stack web development and AI entirely in the Somali language.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Garaad for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Garaad is for Somali speakers worldwide — beginners with no coding experience and developers who want to level up. Somalia, Ireland, UK, US diaspora all welcome.",
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
