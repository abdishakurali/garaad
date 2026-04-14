import { Metadata, ResolvingMetadata } from "next";
import { launchpadService } from "@/services/launchpad";
import { StartupDetailClient } from "./StartupDetailClient";

interface Props {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;

    try {
        const startup = await launchpadService.getStartup(id);
        const previousImages = (await parent).openGraph?.images || [];

        const canonicalSlug = startup.slug || id;
        const canonicalUrl = `https://garaad.org/launchpad/${canonicalSlug}`;
        const titleBase = (startup.title || "Startup").trim();
        const title = titleBase.length > 55 ? `${titleBase.slice(0, 55).trim()}… | Garaad Launchpad` : `${titleBase} | Garaad Launchpad`;
        const rawDesc = (startup.tagline || startup.description || "").trim();
        const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157).trim()}…` : rawDesc;

        return {
            title,
            description,
            alternates: { canonical: canonicalUrl },
            openGraph: {
                title,
                description,
                url: canonicalUrl,
                images: [
                    startup.logo_url || startup.logo || "",
                    ...startup.images.map((img) => img.image_url || img.image || "").filter(Boolean),
                    ...previousImages,
                ].filter(Boolean),
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [startup.logo_url || startup.logo || ""].filter(Boolean),
            },
            robots: { index: true, follow: true },
        };
    } catch (error) {
        return {
            title: "Startup Detail | Garaad Launchpad",
            description: "Faahfaahinta startup-ka ee Garaad Launchpad.",
            robots: { index: false, follow: true },
        };
    }
}

export default async function StartupDetailPage({ params }: Props) {
    const { id } = await params;
    let initialData = null;
    try {
        initialData = await launchpadService.getStartup(id);
    } catch (error) {
        console.error("Failed to fetch initial data for startup:", error);
    }

    const schemas = initialData ? [
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": initialData.title,
            "description": initialData.description,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "logo": initialData.logo_url || initialData.logo,
            "url": `https://garaad.org/launchpad/${id}`,
            "author": {
                "@type": "Person",
                "name": initialData.maker ? `${initialData.maker.first_name} ${initialData.maker.last_name}` : "Garaad Builder"
            },
            "datePublished": initialData.created_at
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://garaad.org"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Launchpad",
                    "item": "https://garaad.org/launchpad"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": initialData.title,
                    "item": `https://garaad.org/launchpad/${id}`
                }
            ]
        }
    ] : null;

    return (
        <>
            {schemas?.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
            <StartupDetailClient initialData={initialData} startupId={id} />
        </>
    );
}
