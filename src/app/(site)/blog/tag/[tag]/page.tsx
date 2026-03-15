import { getBlogPosts, getBlogTags } from "@/lib/blog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, BookOpen, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SharePost } from "@/components/SharePost";
import { Metadata } from "next";

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("so-SO", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    };

    return (
        <main className="min-h-screen bg-white">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {posts.map((post) => (
                                <Card key={post.id} className="group overflow-hidden border-none bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="relative aspect-video w-full overflow-hidden">
                                        <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10">
                                            <span className="sr-only">Akhri: {post.title}</span>
                                        </Link>
                                        {(post.cover || post.cover_image_url) ? (
                                            <Image
                                                src={post.cover || post.cover_image_url || ""}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                <span className="text-zinc-600 text-sm">Garaad</span>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-5">
                                        <div className="flex flex-wrap gap-3 mb-3 text-xs text-slate-500">
                                            <div className="flex items-center">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-3 w-3" />
                                                <span>{calculateReadingTime(post.body)} daqiiqo</span>
                                            </div>
                                        </div>

                                        <Link href={`/blog/${post.slug}`} className="block group-hover:text-primary transition-colors">
                                            <h3 className="font-semibold text-xl mb-3 line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        <p className="line-clamp-3 text-sm text-slate-600 mb-4">
                                            {post.excerpt}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="px-5 py-4 bg-slate-50 flex justify-between items-center">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                        >
                                            <BookOpen className="mr-1.5 h-4 w-4" />
                                            Akhri
                                            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                        <SharePost title={post.title} slug={post.slug} />
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
        </main>
    );
}
