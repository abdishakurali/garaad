import { ChallengeHero } from "@/components/landing/ChallengeHero";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const OurStorySection = dynamic(() => import("@/components/landing/OurStorySection").then(mod => mod.OurStorySection), { ssr: true });
const TransformationSection = dynamic(() => import("@/components/landing/TransformationSection").then(mod => mod.TransformationSection), { ssr: true });
const FAQSection = dynamic(() => import("@/components/landing/FAQSection").then(mod => mod.FAQSection), { ssr: true });
const ClosingCTA = dynamic(() => import("@/components/landing/ClosingCTA").then(mod => mod.ClosingCTA), { ssr: true });
const WhatsAppFloat = dynamic(() => import("@/components/landing/WhatsAppFloat").then(mod => mod.WhatsAppFloat));

export const metadata: Metadata = {
    title: "Tartanka SaaS - 5 Toddobaad",
    description: "SaaS & AI Business. 5 Toddobaad.",
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
    alternates: { canonical: "https://garaad.so/challenge" },
    openGraph: {
        type: "website",
        locale: "so_SO",
        url: "https://garaad.so/challenge",
        siteName: "Garaad STEM",
        title: "Bilow Safarkaaga Tech-ga ee Garaad",
        description: "Dhis oo daabac software-kaaga ugu horreeya 5 toddobaad gudahood. Ku soo biir bahda wax dhisidda Soomaaliya.",
        images: [{ url: "/images/og-main.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: "Tartanka SaaS - Garaad" },
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
                        name: "SaaS & AI Challenge",
                        description:
                            "Dhis Ganacsigaaga SaaS & AI business 5 toddobaad gudahood.",
                        provider: {
                            "@type": "Organization",
                            name: "Garaad",
                            url: "https://garaad.org",
                        },
                        educationalLevel: "Beginner to Intermediate",
                        timeRequired: "P5W",
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
