import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Metadata } from "next";
import { HomeContent } from "./home-content";

export const metadata: Metadata = {
  title: "Garaad | Baro Full-Stack Development - #1 First Somali Platform",
  description:
    "Garaad waa platform-ka ugu horreeya ee Soomaalida (First Somali Platform). Baro Full-Stack Development, React, Next.js, Node.js, iyo Mobile Apps adiga oo isticmaalaya Af-Soomaali.",
  keywords: [
    "Garaad",
    "First Somali Platform",
    "Sidee loo bartaa Full-Stack Development?",
    "Barashada React iyo Next.js oo Soomaali ah",
    "Sida loo dhiso Mobile App",
    "SaaS",
    "AI",
    "Tech",
    "Founders Soomaali",
  ],
  openGraph: {
    title: "Garaad | First Somali Platform - SaaS, AI, Tech, Cloud",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida. Baro SaaS, AI, Tech, Cloud, React, JS, iyo Tiknoolajiyada casriga ah.",
    type: "website",
    locale: "so_SO",
    url: "https://garaad.org",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Garaad STEM",
            url: "https://garaad.org",
            logo: "https://garaad.org/logo.png",
            description:
              "Garaad waa hoyga aqoonta casriga ah. Baro Xisaabta, Fiisigiska, iyo Tiknoolajiyada adiga oo isticmaalaya Af-Soomaali hufan.",
            address: {
              "@type": "PostalAddress",
              addressCountry: "SO",
            },
            sameAs: [
              "https://www.linkedin.com/company/garaad",
              "https://x.com/Garaadstem",
              "https://facebook.com/Garaadstem",
            ],
          }),
        }}
      />

      <SiteHeader />

      <HomeContent />

      <FooterSection />
    </div>
  );
}
