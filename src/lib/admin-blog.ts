import axios from "axios";

const API_URL = (() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return base.endsWith('/api') ? base : (base.endsWith('/') ? `${base}api` : `${base}/api`);
})();

// Auth is carried by the httpOnly accessToken cookie — no Authorization header needed.
const cfg = { withCredentials: true };

export const blogAdminApi = {
    getPosts: async () => {
        const res = await axios.get(`${API_URL}/blog/posts/`, cfg);
        return res.data;
    },

    getPost: async (slug: string) => {
        const res = await axios.get(`${API_URL}/blog/posts/${slug}/`, cfg);
        return res.data;
    },

    createPost: async (data: any) => {
        const headers: Record<string, string> = {};
        if (!(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }
        const res = await axios.post(`${API_URL}/blog/posts/`, data, { ...cfg, headers });
        return res.data;
    },

    updatePost: async (slug: string, data: any) => {
        const headers: Record<string, string> = {};
        if (!(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }
        const res = await axios.patch(`${API_URL}/blog/posts/${slug}/`, data, { ...cfg, headers });
        return res.data;
    },

    deletePost: async (slug: string) => {
        const res = await axios.delete(`${API_URL}/blog/posts/${slug}/`, cfg);
        return res.data;
    },

    publishPost: async (slug: string) => {
        const res = await axios.post(`${API_URL}/blog/posts/${slug}/publish/`, {}, cfg);
        return res.data;
    },

    seoAudit: async (payload: {
        title: string;
        body: string;
        meta_description: string;
        tags: string;
    }) => {
        const res = await axios.post(`${API_URL}/blog/posts/seo-audit/`, payload, {
            ...cfg,
            headers: { "Content-Type": "application/json" },
        });
        return res.data as {
            score: number;
            primary_keyword: string;
            recommendations: string[];
            internal_links_count: number;
            internal_link_suggestions: string[];
            headline_suggestions: string[];
        };
    },

    getTags: async () => {
        const res = await axios.get(`${API_URL}/blog/tags/`, cfg);
        return res.data;
    },

    revalidate: async (slug?: string) => {
        try {
            await axios.get(`/api/revalidate?path=/blog`);
            if (slug) {
                await axios.get(`/api/revalidate?path=/blog/${slug}`);
            }
        } catch (error) {
            console.error("Revalidation failed", error);
        }
    }
};
