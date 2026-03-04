import { getBlogPosts } from "@/lib/blog";
import { BlogListClient } from "@/components/blog/BlogListClient";

export const revalidate = 3600; // ISR: Revalidate hourly

export async function generateMetadata() {
    return {
        title: "Wargeyska Garaad | Blog",
        description:
            "Nagala soco halkan waxyaalaha naga cusub, sida casharda, wararka iyo waxyaalaha ku saabsan STEM iyo Programming.",
        keywords: [
            "Garaad Blog", "Wargeys Soomaali", "STEM Soomaali", "Programming Soomaali",
            "Tech Soomaali", "AI Soomaali", "SaaS Soomaali", "Wararka Garaad",
        ],
        alternates: { canonical: "https://garaad.so/blog" },
        openGraph: {
            type: "website",
            locale: "so_SO",
            url: "https://garaad.so/blog",
            siteName: "Garaad STEM",
            title: "Wargeyska Garaad | Blog",
            description: "Nagala soco waxyaalaha cusub: casharada, wararka iyo STEM iyo Programming.",
            images: [
                { url: "/images/og-blog.jpg", width: 1200, height: 630, alt: "Garaad Blog" },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Wargeyska Garaad | Blog",
            description: "Nagala soco waxyaalaha cusub ku saabsan STEM iyo Programming.",
            images: ["/images/og-blog.jpg"],
        },
        robots: { index: true, follow: true },
    };
}

export default async function BlogListPage() {
    const posts = await getBlogPosts().catch(() => []);

    return (
        <main className="min-h-screen bg-slate-50/30 dark:bg-black transition-colors duration-500">
            <BlogListClient initialPosts={posts} />
        </main>
    );
}
