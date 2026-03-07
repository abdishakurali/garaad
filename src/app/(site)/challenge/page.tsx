import { ChallengeHero } from "@/components/landing/ChallengeHero";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const OurStorySection = dynamic(() => import("@/components/landing/OurStorySection").then(mod => mod.OurStorySection), { ssr: true });
const TransformationSection = dynamic(() => import("@/components/landing/TransformationSection").then(mod => mod.TransformationSection), { ssr: true });
const FAQSection = dynamic(() => import("@/components/landing/FAQSection").then(mod => mod.FAQSection), { ssr: true });
const ClosingCTA = dynamic(() => import("@/components/landing/ClosingCTA").then(mod => mod.ClosingCTA), { ssr: true });
const WhatsAppFloat = dynamic(() => import("@/components/landing/WhatsAppFloat").then(mod => mod.WhatsAppFloat));

export const metadata: Metadata = {
    title: "Challenge — 4–6 Toddobaad oo Mentorship",
    description: "Qorshaha Challenge: €149 hal bixi (4x sannadkii). 4–6 toddobaad oo mentorship, mentor access, launchpad (gudbi startup). Ma ku jiraan koorsooyinka haddii aadan isticmaalin Explorer.",
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
        siteName: "Garaad STEM",
        title: "Challenge — 4–6 Toddobaad oo Mentorship",
        description: "€149 hal bixi (4x sannadkii). 4–6 toddobaad oo mentorship, mentor access, launchpad (gudbi startup).",
        images: [{ url: "/images/og-main.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: "Challenge — Garaad" },
    robots: { index: true, follow: true },
};

export default function ChallengePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* JSON-LD for Search Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Course",
                        name: "Garaad Challenge",
                        description:
                            "4–6 week group mentorship program, mentor access, launchpad (submit a startup). Runs quarterly. €149 one-time per cohort.",
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
                <ChallengeHero />
                <OurStorySection />
                <TransformationSection />
                <FAQSection />
                <ClosingCTA />
            </main>

            <WhatsAppFloat />
        </div>
    );
}
