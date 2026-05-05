import { Metadata } from "next";
import { MentorshipContent } from "./mentorship-content";
import { PremiumGuard } from "@/components/auth/PremiumGuard";

const SITE_URL = "https://garaad.org";

export const metadata: Metadata = {
  title: "Tartanka Garaad — 1-on-1 Coaching Af-Soomaali",
  description:
    "Tartanka Garaad: Barnaamij 3-bilood ah oo lagugu barayo software development & AI — iyadoo la siinayo 1-on-1 mentorship. Ku biir cohort-ka.",
  keywords: [
    "Tartanka Garaad",
    "Garaad Challenge",
    "1-on-1 mentorship Somali",
    "software development mentorship",
    "cohort-based learning Somalia",
    "Somali developer coaching",
    "Af-Soomaali coding mentorship",
  ],
  alternates: { canonical: `${SITE_URL}/mentorship` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/mentorship`,
    title: "Tartanka Garaad — 1-on-1 Coaching Af-Soomaali",
    description:
      "Tartanka Garaad: Barnaamij 3-bilood ah oo lagugu barayo software development & AI — iyadoo la siinayo 1-on-1 mentorship.",
    images: [{ url: `${SITE_URL}/images/mentorship_cover.png`, width: 1200, height: 630 }],
  },
};

export default function MentorshipPage() {
  return (
    <MentorshipContent />
  );
}