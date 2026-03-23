export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org";

/**
 * Admin cohort list/create/update paths are built as `/api/{prefix}/`.
 * Default `cohorts` → GET/POST `/api/cohorts/`, PATCH `/api/cohorts/:id/`.
 * Set if Django mounts the ViewSet elsewhere, e.g. `lms/cohorts` → `/api/lms/cohorts/`.
 */
export const ADMIN_COHORTS_API_PREFIX = (
    process.env.NEXT_PUBLIC_ADMIN_COHORTS_API_PREFIX ?? "cohorts"
)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
