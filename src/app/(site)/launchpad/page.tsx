import { Metadata } from "next";
import { LaunchpadListClient } from "./LaunchpadListClient";
import { API_BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Garaad Launchpad | Soo Bandhig Startup-kaaga",
    description: "Xarunta startup-yada Soomaaliyeed. Hel mashruucyo cusub, codee kuwa aad jeceshahay, ama soo bandhig mashruucaaga tech-ka ah.",
    alternates: { canonical: "https://garaad.so/launchpad" },
    openGraph: {
        type: "website",
        locale: "so_SO",
        url: "https://garaad.so/launchpad",
        siteName: "Garaad STEM",
        title: "Garaad Launchpad - Builders to Founders",
        description: "Hel mashaariicda ugu xiisaha badan ee ay dhisayaan dhalinyarada Soomaaliyeed. Launch, Vote & Grow.",
        images: [{ url: "/images/og-launchpad.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: "Garaad Launchpad" },
    robots: { index: true, follow: true },
};

async function getStartups() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/launchpad/startups/`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
        return [];
    }
}

export default async function LaunchpadPage() {
    const startups = await getStartups();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Garaad Launchpad",
        "description": "Mashaariicda iyo Startup-yada ay dhisayaan dhalinyarada Soomaaliyeed.",
        "itemListElement": startups.map((startup: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "SoftwareApplication",
                "name": startup.title,
                "description": startup.tagline || startup.description,
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "url": `https://garaad.so/launchpad/${startup.slug || startup.id}`
            }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LaunchpadListClient />
        </>
    );
}
