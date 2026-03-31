import { Metadata } from "next";
import { HomeContent } from "../home-content";

const SITE_URL = "https://garaad.org";

export const metadata: Metadata = {
  title: "Garaad — Learn Full-Stack Development in Somali | React, Next.js, AI",
  description:
    "Somalia's #1 coding platform. Learn React, Next.js, Node.js & AI in Somali. 30 min/day. Build real projects. Free to start.",
  keywords: [
    "somali coding", "learn programming somali", "garaad", "somali tech", "full-stack somali",
    "learn React", "learn Next.js", "full-stack developer", "coding Somalia",
    "Somali programming", "web development course", "learn to code in Somali",
    "Garaad STEM", "software engineer Somalia", "MERN stack", "JavaScript Somali",
    "Node.js Somali", "MongoDB Somali", "AI Somali", "coding bootcamp Somali",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Garaad — Learn Full-Stack Development in Somali | React, Next.js, AI",
    description:
      "Somalia's #1 coding platform. Learn React, Next.js, Node.js & AI in Somali. 30 min/day. Build real projects. Free to start.",
    images: [{ url: `${SITE_URL}/images/og-main.jpg`, width: 1200, height: 630, alt: "Garaad — Somalia's #1 Coding Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Garaad — Learn React, Next.js & AI in Somali",
    description:
      "Somalia's #1 coding platform. Learn full-stack development in your language. 30 min/day. Free to start.",
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
    <div className="min-h-screen bg-[#f8f8fc] transition-colors duration-300 dark:bg-[#0a0a0f]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }}
      />
      <HomeContent />
    </div>
  );
}
