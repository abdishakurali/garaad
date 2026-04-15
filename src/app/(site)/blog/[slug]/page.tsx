import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { getBlogAuthorDisplayName } from "@/lib/blogAuthor";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlogDetailClient } from "@/components/blog/BlogDetailClient";
import Link from "next/link";

export const revalidate = 60;
export const dynamicParams = true;

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const posts = await getBlogPosts().catch(() => []);
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

function descriptionFromBody(body: string | null | undefined, maxLength = 155): string {
    if (!body || typeof body !== "string") return "";
    const stripped = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (stripped.length <= maxLength) return stripped;
    return stripped.slice(0, maxLength).trim() + "…";
}
function plainText(body: string | null | undefined): string {
    if (!body || typeof body !== "string") return "";
    return body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const OG_FALLBACK = "https://garaad.org/images/og-main.jpg";
const TITLE_SUFFIX = " | Garaad Blog";

function seoTitle(title: string): string {
    const clean = (title || "").trim();
    const max = 60 - TITLE_SUFFIX.length;
    const clipped = clean.length > max ? clean.slice(0, max).trim() + "…" : clean;
    return `${clipped || "Blog"}${TITLE_SUFFIX}`;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug).catch(() => null);
    if (!post) return { title: "Post Not Found" };

    const coverImage = post.cover || post.cover_image_url || null;
    const canonicalUrl = `https://garaad.org/blog/${slug}`;
    const keywords = post.tags?.length
        ? [...post.tags.map((t) => t.name), "Garaad Blog", "STEM Soomaali"]
        : ["Garaad Blog", "STEM Soomaali"];

    const description =
        post.meta_description?.trim() || descriptionFromBody(post.body, 155);
    const descFinal = (description || post.title).slice(0, 155).trim();
    const ogDescription = descFinal.length >= 155 ? descFinal + "…" : descFinal;
    const authorDisplay = getBlogAuthorDisplayName(post);

    // Cover from API is always absolute bridge URL when present
    const absoluteCoverImage = coverImage
        ? (coverImage.startsWith("http") ? coverImage : `https://garaad.org${coverImage.startsWith("/") ? "" : "/"}${coverImage}`)
        : undefined;
    const ogImage = absoluteCoverImage || OG_FALLBACK;

    const title = seoTitle(post.title);
    return {
        title,
        description: description || post.title,
        keywords,
        authors: [{ name: authorDisplay }],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description: ogDescription,
            type: "article",
            url: canonicalUrl,
            siteName: "Garaad",
            locale: "so_SO",
            publishedTime: post.published_at ?? undefined,
            modifiedTime: post.updated_at ?? undefined,
            authors: [authorDisplay],
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            site: "@garaadorg",
            title,
            description: ogDescription,
            images: [ogImage],
        },
        robots: { index: true, follow: true },
    };
}

export default async function BlogPostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getBlogPost(slug).catch(() => null);

    if (!post) {
        notFound();
    }

    const allPosts = await getBlogPosts();
    const primaryTagSlug = post.tags[0]?.slug;
    const others = allPosts.filter((p) => p.slug !== slug);
    const sameCategory = primaryTagSlug
        ? others.filter((p) => p.tags.some((t) => t.slug === primaryTagSlug))
        : [];
    const rest = others.filter((p) => !sameCategory.includes(p));
    const relatedPosts = [...sameCategory, ...rest].slice(0, 2);
    const authorDisplay = getBlogAuthorDisplayName(post);

    const keywordsForSeo = post.tags?.length
        ? [...post.tags.map((t: { name: string }) => t.name), "Garaad Blog", "STEM Soomaali"]
        : ["Garaad Blog", "STEM Soomaali"];
    const plain = plainText(post.body);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://garaad.org/blog/${slug}` },
        "headline": post.title,
        "image": post.cover || post.cover_image_url || "https://garaad.org/images/og-blog.jpg",
        "datePublished": post.published_at,
        "dateModified": post.updated_at || post.published_at,
        "author": { "@type": "Person", "name": authorDisplay },
        "publisher": {
            "@type": "Organization",
            "name": "Garaad STEM",
            "logo": { "@type": "ImageObject", "url": "https://garaad.org/logo.png" },
        },
        "description":
            post.meta_description?.trim() || descriptionFromBody(post.body, 160) || post.title,
        "keywords": keywordsForSeo.join(", "),
        "articleSection": post.tags?.[0]?.name || "Technology",
        "wordCount": plain ? plain.split(" ").length : undefined,
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://garaad.org" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://garaad.org/blog" },
            { "@type": "ListItem", position: 3, name: post.title, item: `https://garaad.org/blog/${slug}` },
        ],
    };

    const faqJsonLd = post.tags?.some(t => 
        ["faq", "q&a", "questions", "su'aalo"].includes(t.name.toLowerCase())
    ) ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: post.title,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: post.meta_description?.trim() || descriptionFromBody(post.body, 300) || `Learn about ${post.title} on Garaad STEM.`,
                },
            },
        ],
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <BlogDetailClient post={post} relatedPosts={relatedPosts} />
            <section className="mx-auto mt-8 max-w-4xl px-4 pb-12">
                <div className="rounded-xl border border-border bg-card p-5">
                    <h2 className="text-base font-semibold text-foreground">Related Resources</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Continue learning with these resources related to this post.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                            href="/courses"
                            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
                        >
                            Free Programming Courses
                        </Link>
                        <Link
                            href="/welcome"
                            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
                        >
                            Start Learning Journey
                        </Link>
                        <Link
                            href="/blog"
                            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
                        >
                            All Blog Posts
                        </Link>
                        <Link
                            href="/about"
                            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
                        >
                            About Garaad
                        </Link>
                        {post.tags.slice(0, 3).map((t) => (
                            <Link
                                key={t.slug}
                                href={`/blog/tag/${t.slug}`}
                                className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
                            >
                                {t.name} Articles
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
