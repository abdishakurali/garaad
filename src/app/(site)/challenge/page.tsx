import { Metadata } from "next";
import dynamic from "next/dynamic";
import { ChallengePageClient } from "@/components/challenge/ChallengePageClient";

const WhatsAppFloat = dynamic(() => import("@/components/landing/WhatsAppFloat").then(mod => mod.WhatsAppFloat));

export const metadata: Metadata = {
  title: "Garaad Challenge — Ka Bilow Eber ilaa Shaqo Tech ama Startup 3 Bilood",
  description:
    "Challenge-ka 3 bilood ah: ka bilow eber, gaar shaqo tech ama dhis startup-kaaga. Mentor Af-Soomaali, koox 10 qof, lacag celin 7 maalmood. $149 hal mar. Kan ugu weyn Somaliya.",
  keywords: [
    // English keywords
    "React challenge", "Next.js challenge", "coding bootcamp", "web development bootcamp",
    "full-stack project", "build portfolio", "software development course",
    "learn by building", "project-based learning", "coding challenge",
    "become developer", "developer career", "job ready skills", "tech career change",
    "MERN projects", "full-stack portfolio", "real-world projects",
    "React projects", "Next.js projects", "Node.js projects", "MongoDB projects",
    // Somali keywords
    "Garaad Challenge", "Challenge programming Somali", "koorso challenge Somali",
    "baro coding challenge", "bilow programming Somali", "shaqo tech Somali",
    "dhis startup Somali", "portfolio dhisme", "mashruuc coding",
    "koox barashada", "mentor Somali", "developer Somali",
    "tech career Somalia", "software jobs Somalia", "IT jobs Somalia",
    "coding bootcamp Somalia", "programming school Somalia",
    "build real projects Somali", "portfolio building Somali",
    "full-stack developer training", "react developer course",
    "Somali tech builders", "Somali startups", "SaaS development Somalia",
  ],
  alternates: { canonical: "https://garaad.org/challenge" },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: "https://garaad.org/challenge",
    siteName: "Garaad",
    title: "Garaad Challenge — Ka Bilow Eber ilaa Shaqo Tech ama Startup",
    description:
      "3 bilood: mentor Af-Soomaali, koox 10 qof, lacag celin 7 maalmood. $149 hal mar.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garaad Challenge — Ka Bilow Eber ilaa Shaqo Tech ama Startup",
    description: "3 bilood, mentor Af-Soomaali, $149 hal mar.",
  },
  robots: { index: true, follow: true },
};

export default function ChallengePage() {
    return (
        <div className="dark min-h-screen bg-zinc-950 text-zinc-100 antialiased">
            {/* JSON-LD for Search Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Course",
                        name: "Garaad Challenge",
                        description:
                            "3-month group mentorship program, mentor access, launchpad (submit a startup). Runs quarterly.",
                        provider: {
                            "@type": "Organization",
                            name: "Garaad",
                            url: "https://garaad.org",
                        },
                        educationalLevel: "Beginner to Intermediate",
                        timeRequired: "P3M",
                        inLanguage: ["so", "en"],
                        coursePrerequisites: "Basic computer skills and willingness to learn",
                        hasCourseInstance: {
                            "@type": "CourseInstance",
                            courseMode: "online",
                            courseWorkload: "PT10H",
                        },
                    }),
                }}
            />

            <main>
                <ChallengePageClient />
            </main>

            <WhatsAppFloat />
        </div>
    );
}
