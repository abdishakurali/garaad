import axios from "axios";
import Cookies from "js-cookie";
import { useAdminAuthStore } from "@/store/admin/auth";

const API_URL = (() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return base.endsWith('/api') ? base : (base.endsWith('/') ? `${base}api` : `${base}/api`);
})();

const getAuthHeader = (): Record<string, string> => {
    const adminToken = typeof window !== "undefined" ? useAdminAuthStore.getState().token : null;
    if (adminToken) return { Authorization: `Bearer ${adminToken}` };
    const token = Cookies.get("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

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
        const res = await axios.get(`${API_URL}/webinars/`, { headers: getAuthHeader() });
        return res.data;
    },

    get: async (slug: string): Promise<WebinarData> => {
        const res = await axios.get(`${API_URL}/webinars/${slug}/`, { headers: getAuthHeader() });
        return res.data;
    },

    create: async (data: FormData): Promise<WebinarData> => {
        const res = await axios.post(`${API_URL}/webinars/`, data, { headers: getAuthHeader() });
        return res.data;
    },

    update: async (slug: string, data: FormData): Promise<WebinarData> => {
        const res = await axios.patch(`${API_URL}/webinars/${slug}/`, data, { headers: getAuthHeader() });
        return res.data;
    },

    delete: async (slug: string): Promise<void> => {
        await axios.delete(`${API_URL}/webinars/${slug}/`, { headers: getAuthHeader() });
    },
};
