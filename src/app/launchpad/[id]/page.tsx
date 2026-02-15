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
    const id = params.id;

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
    let initialData = null;
    try {
        initialData = await launchpadService.getStartup(params.id);
    } catch (error) {
        console.error("Failed to fetch initial data for startup:", error);
    }

    return <StartupDetailClient initialData={initialData} startupId={params.id} />;
}
