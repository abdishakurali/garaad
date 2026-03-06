import { Metadata } from "next";
import { HomeContent } from "../home-content";

export const metadata: Metadata = {
  title: "Garaad STEM | Baro Full-Stack, AI & STEM oo Soomaali ah",
  description:
    "Platform-ka ugu horreeya ee Soomaalida ee STEM iyo Programming. Baro React, Next.js, AI, Cybersecurity Af-Soomaali. Bilaash bilow.",
  openGraph: {
    title: "Garaad STEM | Baro Full-Stack, AI & STEM",
    description: "Platform-ka ugu horreeya ee Soomaalida. Baro coding iyo technology afkaaga hooyo.",
    url: "https://garaad.org",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#09090b] transition-colors duration-300">
      <HomeContent />
    </div>
  );
}
