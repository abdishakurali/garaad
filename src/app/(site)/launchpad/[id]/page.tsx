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

        return {
            title: `${startup.title} | Garaad Launchpad`,
            description: startup.tagline || startup.description.substring(0, 160),
            openGraph: {
                title: startup.title,
                description: startup.tagline,
                url: `https://garaad.so/launchpad/${id}`,
                images: [
                    startup.logo_url || startup.logo || "",
                    ...startup.images.map((img) => img.image_url || img.image || "").filter(Boolean),
                    ...previousImages,
                ].filter(Boolean),
            },
            twitter: {
                card: "summary_large_image",
                title: startup.title,
                description: startup.tagline,
                images: [startup.logo_url || startup.logo || ""].filter(Boolean),
            },
        };
    } catch (error) {
        return {
            title: "Startup Detail | Garaad Launchpad",
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
            "url": `https://garaad.so/launchpad/${id}`,
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
                    "item": "https://garaad.so"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Launchpad",
                    "item": "https://garaad.so/launchpad"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": initialData.title,
                    "item": `https://garaad.so/launchpad/${id}`
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
