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

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

const adminApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org/api",
    headers: {
        "Content-Type": "application/json",
    },
}) as AxiosInstance;

// Request interceptor
adminApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAdminAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

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
