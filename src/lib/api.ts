import { API_BASE_URL } from './constants';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions extends RequestInit {
    method?: HttpMethod;
    body?: any;
    params?: Record<string, string>;
}

class ApiClient {
    private static instance: ApiClient;
    private isRefreshing = false;
    private refreshQueue: ((success: boolean) => void)[] = [];

    private constructor() { }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    private async refreshAccessToken(): Promise<boolean> {
        const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        try {
            // No body needed — backend reads refreshToken from httpOnly cookie.
            // credentials:'include' ensures the cookie is sent.
            const response = await fetch(`${cleanBaseUrl}/api/auth/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
        const { params, body, ...init } = options;

        const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        let url = path.startsWith('http') ? path : `${cleanBaseUrl}${cleanPath}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += (url.includes('?') ? '&' : '?') + searchParams.toString();
        }

        const headers = new Headers(init.headers);
        if (!headers.has('Content-Type') && !(body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
        }

        const config: RequestInit = {
            ...init,
            headers,
            credentials: 'include',
            body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
        };

        try {
            let response = await fetch(url, config);

            if (response.status === 401 && !path.includes('/auth/signin/') && !path.includes('/auth/refresh/')) {
                if (this.isRefreshing) {
                    const success = await new Promise<boolean>((resolve) => {
                        this.refreshQueue.push(resolve);
                    });

                    if (success) {
                        response = await fetch(url, config);
                    }
                } else {
                    this.isRefreshing = true;
                    let success = false;
                    try {
                        success = await this.refreshAccessToken();
                    } finally {
                        const queue = this.refreshQueue;
                        this.refreshQueue = [];
                        this.isRefreshing = false;
                        queue.forEach((cb) => cb(success));
                    }

                    if (success) {
                        response = await fetch(url, config);
                    }
                }
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || errorData.detail || 'API Request failed');
                (error as any).status = response.status;
                (error as any).data = errorData;
                throw error;
            }

            if (response.status === 204) return {} as T;

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    public get<T>(path: string, params?: Record<string, string>, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'GET', params });
    }

    public post<T>(path: string, body?: any, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'POST', body });
    }

    public put<T>(path: string, body?: any, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'PUT', body });
    }

    public patch<T>(path: string, body?: any, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'PATCH', body });
    }

    public delete<T>(path: string, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'DELETE' });
    }
}

export const api = ApiClient.getInstance();
