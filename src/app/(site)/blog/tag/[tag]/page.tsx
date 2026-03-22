import { getBlogPosts, getBlogTags } from "@/lib/blog";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";

export const revalidate = 60;

interface TagPageProps {
    params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const { tag } = await params;
    const tagName = tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, " ");
    const canonicalUrl = `https://garaad.org/blog/tag/${tag}`;
    return {
        title: `Qoraalada ku saabsan ${tagName} | Garaad Blog`,
        description: `Ka dhex baadh dhammaan qoraalada ku saabsan ${tagName} ee ku jira wargeyska Garaad.`,
        keywords: [tagName, "Garaad Blog", "STEM Soomaali", "mowduuc"],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            type: "website",
            locale: "so_SO",
            url: canonicalUrl,
            siteName: "Garaad STEM",
            title: `Qoraalada ku saabsan ${tagName} | Garaad Blog`,
            description: `Ka dhex baadh qoraalada mowduuca ${tagName} ee wargeyska Garaad.`,
            images: [{ url: "/images/og-blog.jpg", width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title: `Qoraalada ku saabsan ${tagName} | Garaad Blog`,
            images: ["/images/og-blog.jpg"],
        },
        robots: { index: true, follow: true },
    };
}

export async function generateStaticParams() {
    const tags = await getBlogTags().catch(() => []);
    return tags.map((tag) => ({
        tag: tag.slug,
    }));
}

export default async function TagPage({ params }: TagPageProps) {
    const { tag } = await params;
    const posts = await getBlogPosts(tag).catch(() => []);
    const tagName = tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, " ");

    return (
        <main className="min-h-screen bg-white dark:bg-black">
                <section className="bg-primary/5 py-12 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Ku noqo Blog-ga
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900">
                            Mowduuca: <span className="text-primary">{tagName}</span>
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">
                            Waxaad halkan ka helaysaa {posts.length} qoraal oo ku saabsan mowduucan.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {posts.length === 0 ? (
                        <div className="text-center py-16">
                            <h2 className="text-xl font-medium text-slate-800">Mowduucan qoraal lagama helin</h2>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                            {posts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </section>
        </main>
    );
}
