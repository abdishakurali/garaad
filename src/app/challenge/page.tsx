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
    title: "5-Week Tech Challenge | Bilow SaaS-kaaga Koowaad - Garaad",
    description:
        "Ka qaybgal tartanka 5-ta toddobaad oo dhis meheraddaada SaaS ee ugu horreysa. Join the 5-Week Tech Challenge and build your first profitable SaaS business. From idea to paying customers.",
    keywords: [
        "SaaS builder",
        "5-week challenge",
        "AI business",
        "tech entrepreneurship",
        "Somali tech",
        "online business",
        "web development",
        "startup course",
        "AI integration",
        "business automation",
    ],
    openGraph: {
        title: "5-Week Tech Challenge | Launch Your First SaaS",
        description:
            "Dhis oo bilow meheraddaada SaaS ee ugu horreysa 5 toddobaad gudahood. Build and launch your first AI-powered SaaS business in just 5 weeks.",
        type: "website",
        locale: "en_US",
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
