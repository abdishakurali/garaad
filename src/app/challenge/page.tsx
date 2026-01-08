import { Header } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { TechChallengeHero } from "@/components/landing/TechChallengeHero";
import { OurStorySection } from "@/components/landing/OurStorySection";
import { TransformationSection } from "@/components/landing/TransformationSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bilow Safarkaaga Tech-ga | 5-toddobaad ee Tartanka SaaS - Garaad",
    description:
        "Ku soo biir tartanka ugu horreeya ee dhisidda software-ka Soomaaliya. Baro sida loo abuuro meherad SaaS ah oo faa'iido leh 5 toddobaad gudahood. Build and launch your first SaaS business.",
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
    openGraph: {
        title: "Bilow Safarkaaga Tech-ga ee Garaad",
        description:
            "Dhis oo daabac software-kaaga ugu horreeya 5 toddobaad gudahood. Ku soo biir bahda wax dhisidda Soomaaliya.",
        type: "website",
        locale: "so_SO",
        url: "https://garaad.org/challenge",
    },
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
                        name: "5-Week Tech Challenge | Tartanka Tech-ga",
                        description:
                            "Dhis oo bilow meheraddaada SaaS ee ugu horreysa 5 toddobaad gudahood. Build and launch your first AI-powered SaaS business in 5 weeks.",
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

            <Header />

            <main>
                <TechChallengeHero />
                <OurStorySection />
                <TransformationSection />
                <FAQSection />
                <ClosingCTA />
            </main>

            <FooterSection />
            <WhatsAppFloat />
        </div>
    );
}
