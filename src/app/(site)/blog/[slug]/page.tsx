import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlogDetailClient } from "@/components/blog/BlogDetailClient";

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

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug).catch(() => null);
    if (!post) return { title: "Post Not Found" };

    const coverImage = post.cover_image_url || post.cover_image;
    const canonicalUrl = `https://garaad.so/blog/${slug}`;
    const keywords = post.tags?.length
        ? [...post.tags.map((t) => t.name), "Garaad Blog", "STEM Soomaali"]
        : ["Garaad Blog", "STEM Soomaali"];

    return {
        title: `${post.title} | Garaad Blog`,
        description: post.meta_description || post.excerpt,
        keywords,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: post.title,
            description: post.meta_description || post.excerpt,
            type: "article",
            url: canonicalUrl,
            siteName: "Garaad STEM",
            locale: "so_SO",
            publishedTime: post.published_at,
            authors: [post.author_name],
            images: coverImage ? [{ url: coverImage, width: 1200, height: 630 }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.meta_description || post.excerpt,
            images: coverImage ? [coverImage] : [],
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

    // Fetch related posts (same tag if possible)
    const allPosts = await getBlogPosts();
    const relatedPosts = allPosts
        .filter(p => p.slug !== slug)
        .slice(0, 3);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://garaad.so/blog/${slug}` },
        "headline": post.title,
        "image": post.cover_image_url || post.cover_image || "https://garaad.so/images/og-blog.jpg",
        "datePublished": post.published_at,
        "dateModified": post.updated_at || post.published_at,
        "author": { "@type": "Person", "name": post.author_name },
        "publisher": {
            "@type": "Organization",
            "name": "Garaad STEM",
            "logo": { "@type": "ImageObject", "url": "https://garaad.so/logo.png" },
        },
        "description": post.meta_description || post.excerpt,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogDetailClient post={post} relatedPosts={relatedPosts} />
        </>
    );
}
