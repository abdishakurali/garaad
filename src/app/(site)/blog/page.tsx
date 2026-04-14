import { getBlogPosts } from "@/lib/blog";
import { BlogListClient } from "@/components/blog/BlogListClient";
import type { Metadata } from "next";

/** Always fetch posts on the server (avoids stale empty page if first static/ISR build missed the API). */
export const dynamic = "force-dynamic";

const BLOG_URL = "https://garaad.org/blog";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog — Baro React, Next.js, AI & Full-Stack Development | Garaad",
    description:
      "Maqaallo qoraal ah oo ku saabsan barashada programming-ka, React, Next.js, Node.js, MongoDB, AI, iyo full-stack development-ka. Bilow bilaash ah.",
    keywords: [
      "blog programming Somali",
      "baro React Somali",
      "baro Next.js Somali",
      "baro JavaScript Somali",
      "baro full-stack development Somali",
      "baro AI Somali",
      "baro Node.js Somali",
      "baro MongoDB Somali",
      "tutorial React Somali",
      "tutorial Next.js Somali",
      "coding Somalia",
      "programming Somali",
      "web development Somali",
      "software development Somalia",
      "career in tech Somalia",
      "learn to code Somali",
      "Garaad blog",
      "Somali tech education",
      "Af-Soomaali programming",
    ],
    alternates: { canonical: BLOG_URL },
    openGraph: {
      type: "website",
      url: BLOG_URL,
      title: "Blog — Baro React, Next.js & Full-Stack Development | Garaad",
      description:
        "Baro programming-ka, React, Next.js, AI iyo full-stack development-ka Af-Soomaaliga. Bilow bilaash.",
      images: [
        { url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad Blog" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@garaadorg",
      title: "Blog — Baro React, Next.js & Full-Stack | Garaad",
      description:
        "Baro React, Next.js, AI iyo full-stack development Af-Soomaaliga. Bilow bilaash.",
      images: ["https://garaad.org/images/og-main.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogListPage() {
    let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
    try {
        posts = await getBlogPosts();
    } catch (e) {
        if (process.env.NODE_ENV === "development") {
            console.error("[blog] getBlogPosts failed:", e);
        }
    }

    const itemListJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Garaad Blog",
      url: BLOG_URL,
      hasPart: posts.slice(0, 20).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${BLOG_URL}/${post.slug}`,
        name: post.title,
      })),
    };

    return (
        <main className="min-h-screen bg-slate-50/30 dark:bg-black transition-colors duration-500">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
            <BlogListClient initialPosts={posts} />
        </main>
    );
}
