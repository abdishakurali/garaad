import { adminApi as api } from "@/lib/admin-api";
import { ADMIN_COHORTS_API_PREFIX } from "@/lib/constants";

/** Path under /api/ for cohort CRUD (no leading/trailing slashes in prefix). */
function cohortsApiPath(rest: string): string {
    const tail = rest.replace(/^\/+/, "");
    const joined = tail ? `${ADMIN_COHORTS_API_PREFIX}/${tail}` : `${ADMIN_COHORTS_API_PREFIX}/`;
    return `/${joined}`.replace(/\/+/g, "/");
}

/** Cohort row from GET /cohorts/ (shape may vary slightly by backend). */
export interface AdminCohortRow {
    id: string;
    name: string;
    start_date?: string | null;
    end_date?: string | null;
    max_students?: number | null;
    enrolled_count?: number | null;
    is_active?: boolean;
    is_waitlist_only?: boolean;
    slug?: string | null;
}

export interface CreateCohortPayload {
    name: string;
    start_date: string;
    end_date: string;
    max_students: number;
    is_active?: boolean;
    is_waitlist_only?: boolean;
}

function normalizeList<T>(data: unknown): T[] {
    if (Array.isArray(data)) return data as T[];
    const o = data as { results?: unknown } | null;
    if (Array.isArray(o?.results)) return o.results as T[];
    return [];
}

export const cohortAdminApi = {
    /** GET …/ — list all cohorts (admin). */
    async listCohorts(): Promise<AdminCohortRow[]> {
        const res = await api.get(cohortsApiPath(""));
        return normalizeList<AdminCohortRow>(res.data);
    },

    /** POST …/ — create a new cohort. */
    async createCohort(payload: CreateCohortPayload): Promise<unknown> {
        const res = await api.post(cohortsApiPath(""), payload);
        return res.data;
    },

    /** PATCH …/:id/ — update cohort (e.g. toggle active / waitlist). */
    async updateCohort(id: string, payload: Partial<CreateCohortPayload> & { is_active?: boolean; is_waitlist_only?: boolean }): Promise<unknown> {
        const res = await api.patch(cohortsApiPath(`${id}/`), payload);
        return res.data;
    },
};
