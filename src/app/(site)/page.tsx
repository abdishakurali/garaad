import { Metadata } from "next";
import { HomeContent } from "../home-content";

const SITE_URL = "https://garaad.org";

export const metadata: Metadata = {
  title: "Garaad — Baro Full-Stack Dev & AI Af-Soomaali",
  description:
    "Garaad waa platform-ka kowaad ee Full-Stack Development iyo AI lagu barto Af-Soomaali. Bilow maanta — bilaash ah.",
  keywords: [
    "somali coding",
    "learn programming somali",
    "garaad",
    "somali tech",
    "full-stack somali",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Garaad — Baro Full-Stack Dev & AI Af-Soomaali",
    description:
      "Garaad waa platform-ka kowaad ee Full-Stack Development iyo AI lagu barto Af-Soomaali. Bilow maanta — bilaash ah.",
    images: [{ url: `${SITE_URL}/images/og-main.jpg`, width: 1200, height: 630, alt: "Garaad" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Garaad — Baro Full-Stack Dev & AI Af-Soomaali",
    description:
      "Garaad waa platform-ka kowaad ee Full-Stack Development iyo AI lagu barto Af-Soomaali. Bilow maanta — bilaash ah.",
    images: [`${SITE_URL}/images/og-main.jpg`],
  },
};

const landingJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Garaad",
  url: "https://garaad.org",
  description: "Somali-language coding and AI education platform",
  inLanguage: "so",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#09090b] transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }}
      />
      <HomeContent />
    </div>
  );
}
