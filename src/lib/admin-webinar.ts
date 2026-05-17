import axios from "axios";

const API_URL = (() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return base.endsWith('/api') ? base : (base.endsWith('/') ? `${base}api` : `${base}/api`);
})();

// Auth is carried by the httpOnly accessToken cookie — no Authorization header needed.
const cfg = { withCredentials: true };

export interface WebinarData {
    id: number;
    title: string;
    slug: string;
    description: string;
    banner_image: string | null;
    date_utc: string;
    zoom_url: string;
    meeting_id: string;
    passcode: string;
    is_active: boolean;
    is_past: boolean;
    created_at: string;
}

export const webinarAdminApi = {
    list: async (): Promise<WebinarData[]> => {
        const res = await axios.get(`${API_URL}/webinars/`, cfg);
        return res.data;
    },

    get: async (slug: string): Promise<WebinarData> => {
        const res = await axios.get(`${API_URL}/webinars/${slug}/`, cfg);
        return res.data;
    },

    create: async (data: FormData): Promise<WebinarData> => {
        const res = await axios.post(`${API_URL}/webinars/`, data, cfg);
        return res.data;
    },

    update: async (slug: string, data: FormData): Promise<WebinarData> => {
        const res = await axios.put(`${API_URL}/webinars/${slug}/`, data, {
            ...cfg,
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    delete: async (slug: string): Promise<void> => {
        await axios.delete(`${API_URL}/webinars/${slug}/`, cfg);
    },
};
