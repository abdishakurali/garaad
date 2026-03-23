import { getBlogPosts } from "@/lib/blog";
import { BlogListClient } from "@/components/blog/BlogListClient";

/** Always fetch posts on the server (avoids stale empty page if first static/ISR build missed the API). */
export const dynamic = "force-dynamic";

const BLOG_URL = "https://garaad.org/blog";

export async function generateMetadata() {
  return {
    title: "Blog — Teknoolojiyada Soomaalida | Garaad",
    description:
      "Maqaallo ku saabsan Full-Stack Development, AI, iyo xirfadaha mustaqbalka — qoran Af-Soomaali.",
    keywords: [
      "Garaad Blog",
      "Tech Soomaali",
      "Coding Soomaali",
      "AI Soomaali",
      "Wararka Garaad",
    ],
    alternates: { canonical: BLOG_URL },
    openGraph: {
      type: "website",
      url: BLOG_URL,
      title: "Blog — Teknoolojiyada Soomaalida | Garaad",
      description:
        "Maqaallo ku saabsan Full-Stack Development, AI, iyo xirfadaha mustaqbalka — qoran Af-Soomaali.",
      images: [
        { url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad Blog" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@garaadorg",
      title: "Blog — Teknoolojiyada Soomaalida | Garaad",
      description:
        "Maqaallo ku saabsan Full-Stack Development, AI, iyo xirfadaha mustaqbalka — qoran Af-Soomaali.",
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

    return (
        <main className="min-h-screen bg-slate-50/30 dark:bg-black transition-colors duration-500">
            <BlogListClient initialPosts={posts} />
        </main>
    );
}
