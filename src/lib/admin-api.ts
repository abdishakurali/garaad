import axios from "axios";
import type {
    AxiosInstance,
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { useAdminAuthStore } from "@/store/admin/auth";

export interface ApiErrorResponse {
    detail?: string;
    message?: string;
    error?: string;
    lesson?: string[];
}

export type ApiError = AxiosError<ApiErrorResponse>;

interface ApiResponse<T> {
    data: T;
    message?: string;
}

const adminApi = axios.create({
    baseURL: (() => {
        const base = process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org";
        return base.endsWith('/api') ? base : `${base}/api`;
    })(),
    headers: {
        "Content-Type": "application/json",
    },
    // Auth is carried by the httpOnly accessToken cookie set by the backend.
    withCredentials: true,
}) as AxiosInstance;

// Response interceptor
adminApi.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                // Handle unauthorized
                useAdminAuthStore.getState().clearTokens();
            }
        }
        return Promise.reject(error);
    }
);

export { adminApi, type AxiosError };
