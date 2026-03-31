import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { getBlogAuthorDisplayName } from "@/lib/blogAuthor";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlogDetailClient } from "@/components/blog/BlogDetailClient";

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

const OG_FALLBACK = "https://garaad.org/images/og-main.jpg";

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

    return {
        title: `${post.title} | Garaad Blog`,
        description: description || post.title,
        keywords,
        authors: [{ name: authorDisplay }],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: `${post.title} | Garaad Blog`,
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
            title: `${post.title} | Garaad Blog`,
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
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
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
            <BlogDetailClient post={post} relatedPosts={relatedPosts} />
        </>
    );
}
