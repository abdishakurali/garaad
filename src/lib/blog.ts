import { BlogPost, Tag } from "@/types/blog";
import { API_BASE_URL } from "@/lib/constants";

/** Same origin as sitemap / client api — default production API if env is missing (SSR was using localhost and returned []). */
const API_URL = (() => {
    const base = API_BASE_URL.replace(/\/$/, "");
    return base.endsWith("/api") ? base : `${base}/api`;
})();

/** Plain array, or DRF { results }, or common wrappers { data | posts | items } */
function normalizePostList(data: unknown): BlogPost[] {
    if (Array.isArray(data)) return normalizePostTags(data);
    const o = data as Record<string, unknown> | null;
    const raw =
        o?.results ??
        o?.data ??
        o?.posts ??
        o?.items;
    if (!Array.isArray(raw)) return [];
    return normalizePostTags(raw);
}

function normalizePostTags(raw: unknown[]): BlogPost[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((post: BlogPost) => ({
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : [],
    })) as BlogPost[];
}

function normalizeTagList(data: unknown): Tag[] {
    if (Array.isArray(data)) return data as Tag[];
    const o = data as Record<string, unknown> | null;
    const raw = o?.results ?? o?.data ?? o?.items;
    return Array.isArray(raw) ? (raw as Tag[]) : [];
}

export async function getBlogPosts(tag?: string): Promise<BlogPost[]> {
    const url = new URL(`${API_URL}/blog/posts/`);
    if (tag) {
        url.searchParams.append("tag", tag);
    }
    // DRF pagination: fetch enough posts for the public list in one request
    url.searchParams.set("page_size", "100");

    const res = await fetch(url.toString(), {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch blog posts");
    }

    const data = await res.json();
    return normalizePostList(data);
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

    const data = await res.json();
    return normalizeTagList(data);
}
