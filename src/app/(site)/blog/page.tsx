import { getBlogPosts } from "@/lib/blog";
import { BlogListClient } from "@/components/blog/BlogListClient";

export const revalidate = 3600; // ISR: Revalidate hourly

const BLOG_URL = "https://garaad.org/blog";

export async function generateMetadata() {
  return {
    title: "Blog — Garaad | Tech Af-Soomaali",
    description: "Maqaallada tech, coding, iyo AI ee af-Soomaali.",
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
      title: "Blog — Garaad | Tech Af-Soomaali",
      description: "Maqaallada tech, coding, iyo AI ee af-Soomaali.",
      images: [
        { url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad Blog" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog — Garaad | Tech Af-Soomaali",
      description: "Maqaallada tech, coding, iyo AI ee af-Soomaali.",
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
