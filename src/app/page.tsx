import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Metadata } from "next";
import { HomeContent } from "./home-content";

export const metadata: Metadata = {
  title: "Garaad STEM | Baro Full-Stack Development - #1 Somali Tech Platform",
  description:
    "Garaad STEM waa platform-ka waxbarasho ee ugu horreeya ee Soomaalida (First Somali Learning Platform). Baro Full-Stack Development, React, Next.js, AI, iyo Cybersecurity adiga oo isticmaalaya Af-Soomaali hufan.",
  keywords: [
    "Garaad", "Garaad STEM", "First Somali Platform", "Baro Coding Soomaali",
    "Sidee loo bartaa Full-Stack Development?",
    "Sidee loo bartaa coding Soomaali?",
    "Barashada React iyo Next.js oo Soomaali ah",
    "Sida loo dhiso Mobile App Soomaali",
    "Baro Cybersecurity Soomaali",
    "Amniga Internetka Soomaaliya",
    "Sirdoonka Macmalka ah Soomaali",
    "AI Soomaali",
    "Somali Coding Platform",
    "SaaS Soomaali",
    "Tech Founders Soomaali",
  ],
  openGraph: {
    title: "Garaad STEM | First Somali Platform - SaaS, AI, Tech, Cybersecurity",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida. Baro SaaS, AI, Tech, Cloud, React, iyo Amniga Internetka barnaamijyo Af-Soomaali ah.",
    type: "website",
    locale: "so_SO",
    url: "https://garaad.so",
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
            url: "https://garaad.so",
            logo: "https://garaad.so/logo.png",
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
