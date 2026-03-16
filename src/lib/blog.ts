import { BlogPost, Tag } from "@/types/blog";

const API_URL = (() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return base.endsWith('/api') ? base : (base.endsWith('/') ? `${base}api` : `${base}/api`);
})();

export async function getBlogPosts(tag?: string): Promise<BlogPost[]> {
    const url = new URL(`${API_URL}/blog/posts/`);
    if (tag) {
        url.searchParams.append("tag", tag);
    }

    const res = await fetch(url.toString(), {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch blog posts");
    }

    return res.json();
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
    const res = await fetch(`${API_URL}/blog/posts/${slug}/`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch blog post");
    }

    return res.json();
}

export async function getBlogTags(): Promise<Tag[]> {
    const res = await fetch(`${API_URL}/blog/tags/`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch blog tags");
    }

    return res.json();
}
