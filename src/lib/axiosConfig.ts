import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AuthService from '@/services/auth';
import { API_BASE_URL } from '@/lib/constants';

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor: attach access token to every request
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Skip token attachment for auth endpoints
        if (
            config.url?.includes('/auth/signin/') ||
            config.url?.includes('/auth/signup/') ||
            config.url?.includes('/auth/refresh/')
        ) {
            return config;
        }

        try {
            const authService = AuthService.getInstance();
            const token = await authService.ensureValidToken();

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token in request interceptor:', error);
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor: handle 401 errors and auto-refresh token
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is not 401 or request has already been retried, reject immediately
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Don't retry auth endpoints
        if (
            originalRequest.url?.includes('/auth/signin/') ||
            originalRequest.url?.includes('/auth/signup/') ||
            originalRequest.url?.includes('/auth/refresh/')
        ) {
            return Promise.reject(error);
        }

        // If we're currently refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return axiosInstance(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        }

        // Mark this request as being retried
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const authService = AuthService.getInstance();
            const newToken = await authService.refreshAccessToken();

            if (newToken && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            processQueue(null, newToken);
            isRefreshing = false;

            // Retry the original request with new token
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError as Error, null);
            isRefreshing = false;

            // Refresh failed - let the caller handle redirection
            const authService = AuthService.getInstance();
            authService.logout();

            return Promise.reject(refreshError);
        }
    }
);

export default axiosInstance;
