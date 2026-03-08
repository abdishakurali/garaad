import { Metadata } from "next";
import { LaunchpadListClient } from "./LaunchpadListClient";
import { API_BASE_URL } from "@/lib/constants";

const LAUNCHPAD_URL = "https://garaad.org/launchpad";

export const metadata: Metadata = {
  title: "Launchpad — Garaad | Somali Startups",
  description:
    "Ku soo bandhig startup-kaaga bulshada Garaad. Vote, comment, kuna biir ecosystem-ka.",
  alternates: { canonical: LAUNCHPAD_URL },
  openGraph: {
    type: "website",
    url: LAUNCHPAD_URL,
    title: "Launchpad — Garaad | Somali Startups",
    description:
      "Ku soo bandhig startup-kaaga bulshada Garaad. Vote, comment, kuna biir ecosystem-ka.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad Launchpad" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Launchpad — Garaad | Somali Startups",
    description: "Ku soo bandhig startup-kaaga bulshada Garaad. Vote, comment, kuna biir ecosystem-ka.",
    images: ["https://garaad.org/images/og-main.jpg"],
  },
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
                "url": `https://garaad.org/launchpad/${startup.slug || startup.id}`
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
