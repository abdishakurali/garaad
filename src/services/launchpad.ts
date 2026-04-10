import { api } from "@/lib/api";
import type {
    StartupCategory,
    StartupListItem,
    StartupDetail,
    StartupFormData,
    VoteResponse,
    StartupComment,
    StartupFilter,
    Project,
    ProjectComment,
    ProjectFormData,
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

        const response = await api.get<any>(url);

        // Handle both paginated and non-paginated responses
        if (Array.isArray(response)) {
            return {
                count: response.length,
                next: null,
                previous: null,
                results: response
            };
        }

        return response as PaginatedResponse<StartupListItem>;
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
        formData.append("is_hiring", (data.is_hiring || false).toString());

        formData.append("tech_stack", JSON.stringify(data.tech_stack));

        if (data.category_id) {
            formData.append("category_id", data.category_id);
        }

        if (data.logo) {
            formData.append("logo", data.logo);
        }

        if (data.pitch_data) {
            const prunedPitch = Object.fromEntries(
                Object.entries(data.pitch_data).filter(([_, v]) => v && v.trim() !== "")
            );
            formData.append("pitch_data", JSON.stringify(prunedPitch));
        }


        if (data.github_url?.trim()) formData.append("github_url", data.github_url.trim());
        if (data.linkedin_url?.trim()) formData.append("linkedin_url", data.linkedin_url.trim());
        if (data.twitter_url?.trim()) formData.append("twitter_url", data.twitter_url.trim());
        if (data.facebook_url?.trim()) formData.append("facebook_url", data.facebook_url.trim());
        if (data.instagram_url?.trim()) formData.append("instagram_url", data.instagram_url.trim());
        if (data.video_url?.trim()) formData.append("video_url", data.video_url.trim());



        return api.post<StartupDetail>(`${BASE_URL}/startups/`, formData);
    },

    /**
     * Update an existing startup
     */
    async updateStartup(id: string, data: Partial<StartupFormData>): Promise<StartupDetail> {
        const formData = new FormData();

        if (data.title?.trim()) formData.append("title", data.title.trim());
        if (data.tagline?.trim()) formData.append("tagline", data.tagline.trim());
        if (data.description !== undefined) formData.append("description", data.description?.trim() || "");
        if (data.website_url?.trim()) formData.append("website_url", data.website_url.trim());
        if (data.is_hiring !== undefined) formData.append("is_hiring", (data.is_hiring || false).toString());

        if (data.tech_stack !== undefined) formData.append("tech_stack", JSON.stringify(data.tech_stack));
        if (data.category_id !== undefined) formData.append("category_id", data.category_id || "");
        if (data.logo) formData.append("logo", data.logo);

        if (data.pitch_data) {
            const prunedPitch = Object.fromEntries(
                Object.entries(data.pitch_data).filter(([_, v]) => v && v.trim() !== "")
            );
            formData.append("pitch_data", JSON.stringify(prunedPitch));
        }

        if (data.github_url?.trim()) formData.append("github_url", data.github_url.trim());
        else if (data.github_url === "") formData.append("github_url", "");

        if (data.linkedin_url?.trim()) formData.append("linkedin_url", data.linkedin_url.trim());
        else if (data.linkedin_url === "") formData.append("linkedin_url", "");

        if (data.twitter_url?.trim()) formData.append("twitter_url", data.twitter_url.trim());
        else if (data.twitter_url === "") formData.append("twitter_url", "");

        if (data.facebook_url?.trim()) formData.append("facebook_url", data.facebook_url.trim());
        else if (data.facebook_url === "") formData.append("facebook_url", "");

        if (data.instagram_url?.trim()) formData.append("instagram_url", data.instagram_url.trim());
        else if (data.instagram_url === "") formData.append("instagram_url", "");

        if (data.video_url?.trim()) formData.append("video_url", data.video_url.trim());
        else if (data.video_url === "") formData.append("video_url", "");

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

    // —— Projects (lightweight submissions) ——
    async getProjects(params?: { sort?: string; course?: number }): Promise<Project[]> {
        const p: Record<string, string> = {};
        if (params?.sort) p.sort = params.sort;
        if (params?.course != null) p.course = String(params.course);
        return api.get<Project[]>(`${BASE_URL}/projects/`, p);
    },

    async getProject(slug: string): Promise<Project> {
        return api.get<Project>(`${BASE_URL}/projects/${encodeURIComponent(slug)}/`);
    },

    async createProject(data: ProjectFormData): Promise<Project> {
        return api.post<Project>(`${BASE_URL}/projects/`, data);
    },

    async updateProject(slug: string, data: Partial<ProjectFormData>): Promise<Project> {
        return api.patch<Project>(`${BASE_URL}/projects/${encodeURIComponent(slug)}/`, data);
    },

    async deleteProject(slug: string): Promise<void> {
        return api.delete(`${BASE_URL}/projects/${encodeURIComponent(slug)}/`);
    },

    async voteProject(slug: string): Promise<VoteResponse> {
        return api.post<VoteResponse>(`${BASE_URL}/projects/${encodeURIComponent(slug)}/vote/`);
    },

    async addProjectComment(slug: string, content: string): Promise<ProjectComment> {
        return api.post<ProjectComment>(
            `${BASE_URL}/projects/${encodeURIComponent(slug)}/add_comment/`,
            { content }
        );
    },

    async getMyProjects(): Promise<Project[]> {
        return api.get<Project[]>(`${BASE_URL}/projects/my_projects/`);
    },
};