import { api } from "@/lib/api";
import type {
    StartupCategory,
    StartupListItem,
    StartupDetail,
    StartupFormData,
    VoteResponse,
    StartupComment,
    StartupFilter,
} from "@/types/launchpad";

// API response types
interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

const BASE_URL = "/api/launchpad";

/**
 * Launchpad API Service
 * Handles all startup-related API calls
 */
export const launchpadService = {
    /**
     * Get all startup categories
     */
    async getCategories(): Promise<StartupCategory[]> {
        return api.get<StartupCategory[]>(`${BASE_URL}/categories/`);
    },

    /**
     * Get startups with optional filters
     */
    async getStartups(params?: {
        filter?: StartupFilter;
        category?: string;
        is_hiring?: boolean;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<StartupListItem>> {
        const searchParams = new URLSearchParams();

        if (params?.filter) searchParams.set("filter", params.filter);
        if (params?.category) searchParams.set("category", params.category);
        if (params?.is_hiring) searchParams.set("is_hiring", "true");
        if (params?.page) searchParams.set("page", params.page.toString());
        if (params?.page_size) searchParams.set("page_size", params.page_size.toString());

        const queryString = searchParams.toString();
        const url = `${BASE_URL}/startups/${queryString ? `?${queryString}` : ""}`;

        return api.get<PaginatedResponse<StartupListItem>>(url);
    },

    /**
     * Get a single startup by ID (full details)
     */
    async getStartup(id: string): Promise<StartupDetail> {
        return api.get<StartupDetail>(`${BASE_URL}/startups/${id}/`);
    },

    /**
     * Create a new startup
     */
    async createStartup(data: StartupFormData): Promise<StartupDetail> {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("tagline", data.tagline);
        formData.append("description", data.description);
        formData.append("website_url", data.website_url);
        formData.append("is_hiring", data.is_hiring.toString());
        formData.append("tech_stack", JSON.stringify(data.tech_stack));

        if (data.category_id) {
            formData.append("category_id", data.category_id);
        }

        if (data.logo) {
            formData.append("logo", data.logo);
        }

        return api.post<StartupDetail>(`${BASE_URL}/startups/`, formData);
    },

    /**
     * Update an existing startup
     */
    async updateStartup(id: string, data: Partial<StartupFormData>): Promise<StartupDetail> {
        const formData = new FormData();

        if (data.title !== undefined) formData.append("title", data.title);
        if (data.tagline !== undefined) formData.append("tagline", data.tagline);
        if (data.description !== undefined) formData.append("description", data.description);
        if (data.website_url !== undefined) formData.append("website_url", data.website_url);
        if (data.is_hiring !== undefined) formData.append("is_hiring", data.is_hiring.toString());
        if (data.tech_stack !== undefined) formData.append("tech_stack", JSON.stringify(data.tech_stack));
        if (data.category_id !== undefined) formData.append("category_id", data.category_id || "");
        if (data.logo) formData.append("logo", data.logo);

        return api.patch<StartupDetail>(`${BASE_URL}/startups/${id}/`, formData);
    },

    /**
     * Delete a startup
     */
    async deleteStartup(id: string): Promise<void> {
        return api.delete(`${BASE_URL}/startups/${id}/`);
    },

    /**
     * Toggle vote on a startup (upvote/remove vote)
     */
    async toggleVote(startupId: string): Promise<VoteResponse> {
        return api.post<VoteResponse>(`${BASE_URL}/startups/${startupId}/vote/`);
    },

    /**
     * Add an image to a startup
     */
    async addImage(startupId: string, image: File, caption?: string): Promise<void> {
        const formData = new FormData();
        formData.append("image", image);
        if (caption) formData.append("caption", caption);

        return api.post(`${BASE_URL}/startups/${startupId}/add_image/`, formData);
    },

    /**
     * Add a comment to a startup
     */
    async addComment(startupId: string, content: string): Promise<StartupComment> {
        return api.post<StartupComment>(`${BASE_URL}/startups/${startupId}/add_comment/`, {
            content,
        });
    },

    /**
     * Get current user's startups
     */
    async getMyStartups(): Promise<StartupListItem[]> {
        return api.get<StartupListItem[]>(`${BASE_URL}/startups/my_startups/`);
    },

    /**
     * Delete a comment
     */
    async deleteComment(commentId: string): Promise<void> {
        return api.delete(`${BASE_URL}/comments/${commentId}/`);
    },

    /**
     * Update a comment
     */
    async updateComment(commentId: string, content: string): Promise<StartupComment> {
        return api.patch<StartupComment>(`${BASE_URL}/comments/${commentId}/`, {
            content,
        });
    },
};

export default launchpadService;
