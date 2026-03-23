import { Metadata } from "next";
import dynamic from "next/dynamic";
import { ChallengePageClient } from "@/components/challenge/ChallengePageClient";

const WhatsAppFloat = dynamic(() => import("@/components/landing/WhatsAppFloat").then(mod => mod.WhatsAppFloat));

export const metadata: Metadata = {
  title: "Garaad Challenge — Ka eber ilaa shaqo tech ama startup (6 toddobaad)",
  description:
    "6 toddobaad: ka bilow eber, gaar shaqo tech ama dhis startup-kaaga. Mentor af Soomaali, koox 10 qof, lacag celin 7 maalmood. $149/bilaan.",
  keywords: [
    "Tartanka dhisidda software-ka",
    "Barashada IT-ga casriga ah",
    "Dhisidda SaaS iyo AI",
    "Ganacsiga digital-ka ah",
    "Somali tech builders",
    "SaaS development Somalia",
    "First Somali SaaS challenge",
    "Garaad Academy",
    "AI for business Somalia",
  ],
  alternates: { canonical: "https://garaad.org/challenge" },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: "https://garaad.org/challenge",
    siteName: "Garaad",
    title: "Garaad Challenge — Ka eber ilaa shaqo tech ama startup",
    description:
      "6 toddobaad: mentor af Soomaali, koox, lacag celin 7 maalmood. $149/bilaan.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garaad Challenge — Ka eber ilaa shaqo tech ama startup",
    description: "6 toddobaad, mentor af Soomaali, $149/bilaan.",
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
                            "4–6 week group mentorship program, mentor access, launchpad (submit a startup). Runs quarterly.",
                        provider: {
                            "@type": "Organization",
                            name: "Garaad",
                            url: "https://garaad.org",
                        },
                        educationalLevel: "Beginner to Intermediate",
                        timeRequired: "P6W",
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
