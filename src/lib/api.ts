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
    /** Resolvers must always be called (with token or null) or parallel requests hang forever. */
    private refreshQueue: ((token: string | null) => void)[] = [];

    private constructor() { }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    private getCookie(name: string): string | null {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const rawValue = parts.pop()?.split(';').shift() || null;
            try {
                return rawValue ? decodeURIComponent(rawValue) : null;
            } catch (e) {
                return rawValue;
            }
        }
        return null;
    }

    /** Match AuthService cookie shape so refresh does not create a conflicting host-only token on www.garaad.org. */
    private setAccessTokenCookie(access: string, days: number = 1): void {
        if (typeof document === 'undefined') return;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
        const isLocalhost =
            typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const encodedValue = encodeURIComponent(access);
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const domain = hostname.includes('garaad.org') ? '; domain=.garaad.org' : '';
        if (isLocalhost || !isHttps) {
            document.cookie = `accessToken=${encodedValue}; ${expires}; path=/; SameSite=Lax${domain}`;
        } else {
            document.cookie = `accessToken=${encodedValue}; ${expires}; path=/; SameSite=Lax; Secure${domain}`;
        }
    }

    private async refreshAccessToken(): Promise<string | null> {
        const refreshToken = this.getCookie('refreshToken');
        if (!refreshToken) return null;

        const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        try {
            const response = await fetch(`${cleanBaseUrl}/api/auth/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) throw new Error('Refresh failed');

            const data = await response.json();
            const newAccessToken = data.access;

            this.setAccessTokenCookie(newAccessToken, 1);

            return newAccessToken;
        } catch (error) {
            console.error('Token refresh error:', error);
            return null;
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

        const token = this.getCookie('accessToken');
        if (token && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const config: RequestInit = {
            ...init,
            headers,
            body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
        };

        try {
            let response = await fetch(url, config);

            // Handle 401 Unauthorized (Token expired)
            if (response.status === 401 && !path.includes('/auth/signin/') && !path.includes('/auth/refresh/')) {
                if (this.isRefreshing) {
                    const newToken = await new Promise<string | null>((resolve) => {
                        this.refreshQueue.push(resolve);
                    });

                    if (newToken) {
                        headers.set('Authorization', `Bearer ${newToken}`);
                        response = await fetch(url, config);
                    }
                } else {
                    this.isRefreshing = true;
                    let newToken: string | null = null;
                    try {
                        newToken = await this.refreshAccessToken();
                    } finally {
                        const queue = this.refreshQueue;
                        this.refreshQueue = [];
                        this.isRefreshing = false;
                        queue.forEach((cb) => cb(newToken));
                    }

                    if (newToken) {
                        headers.set('Authorization', `Bearer ${newToken}`);
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

            // Handle empty response
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
export default api;
