import { buildMetadata, faqSchema, breadcrumbSchema, SITE_URL } from "@/lib/seo";
import { TrackGridClient } from "./TrackGridClient";

const CANONICAL = "/courses";
const TITLE = "Korsooyinka — Garaad | Baro Freelancing, Programming & AI Af-Soomaali";
const DESCRIPTION =
  "Dooro jidkaaga: Bilow Freelancing, Hel Shaqo Remote, ama Dhis SaaS. Korsooyinka Garaad waxay ku barayaan xirfadaha dijital Af-Soomaali. Bilaash bilow.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: CANONICAL,
  keywords: [
    "korsooyinka Garaad",
    "baro freelancing Soomaali",
    "baro programming Soomaali",
    "baro AI Soomaali",
    "online courses Somalia",
    "xirfadaha dijital Soomaali",
    "shaqo remote Somalia",
    "lacag online Soomaali",
    "Garaad courses",
    "Somali online learning",
    "best courses Somalia",
    "tech education Somalia",
    "digital skills Somalia",
  ],
});

// Revalidate every 5 minutes — tracks rarely change but should reflect
// new additions without a full redeploy.
export const revalidate = 300;

const jsonLdBreadcrumb = breadcrumbSchema([
  { name: "Garaad", item: SITE_URL },
  { name: "Korsooyinka", item: `${SITE_URL}${CANONICAL}` },
]);

const jsonLdFaq = faqSchema([
  {
    question: "Garaad waxay baraysa maxay tahay?",
    answer:
      "Garaad waxay baraysa freelancing, programming (React, Next.js, JavaScript), AI xirfado, graphic design, iyo copywriting — oo dhan Af-Soomaali.",
  },
  {
    question: "Koorsooyinka miyay bilaash yihiin?",
    answer:
      "Casharrada hore ee koorso kasta waa bilaash. Premium korsooyinka waxaad ka hesaa dheeraad cashar, mashruucyo, iyo taageero.",
  },
  {
    question: "Waa kuwan korsooyinka jira?",
    answer:
      "Hadda Garaad waxay leedahay koorsooyinka: Bilow Freelancing (5 toddobaad), Full-Stack Development, iyo AI Fundamentals. Wax badan ayaa soo socda.",
  },
]);

async function getTracks() {
  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org"
  ).replace(/\/$/, "");

  try {
    const res = await fetch(`${apiBase}/api/lms/tracks/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.results ?? []);
  } catch {
    return [];
  }
}

export default async function CoursesPage() {
  const tracks = await getTracks();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <TrackGridClient initialTracks={tracks} />
    </>
  );
}
