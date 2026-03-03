/**
 * Referral Service
 * API calls for referral program functionality
 */

import AuthService from './auth';

export interface ReferralReward {
    id: string;
    referrer_username: string;
    referred_user_username: string;
    order_number: string;
    reward_amount: string;
    currency: string;
    commission_percentage: string;
    status: 'pending' | 'paid' | 'cancelled' | 'processing';
    paid_at: string | null;
    created_at: string;
    notes: string;
}

export interface ReferredUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

export interface ReferralLink {
    referral_code: string;
    referral_link: string;
    message: string;
}

export interface ReferralEarnings {
    total_earnings: string;
    pending_earnings: string;
    paid_earnings: string;
    currency: string;
    total_rewards_count: number;
    recent_rewards: ReferralReward[];
}

export interface ReferralDashboard {
    referral_code: string;
    referral_link: string;
    referral_points: number;
    total_referred: number;
    subscribed_count: number;
    conversion_rate: number;
    total_earnings: string;
    pending_earnings: string;
    currency: string;
    referred_users: ReferredUser[];
    recent_rewards: ReferralReward[];
    motivational_message: string;
}

/**
 * Generate a shareable referral link
 */
export const generateReferralLink = async (): Promise<ReferralLink> => {
    const authService = AuthService.getInstance();
    try {
        return await authService.makeAuthenticatedRequest<ReferralLink>('get', '/api/auth/referral-link/');
    } catch (error: any) {
        // Gracefully handle 404 or missing endpoint by falling back
        const status = error?.response?.status;
        if (status === 404) {
            const user = authService.getCurrentUser() as { username?: string } | null;
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://garaad.so';
            const username = user?.username || 'friend';
            const fallbackLink = `${baseUrl}/?ref=${encodeURIComponent(username)}`;

            return {
                referral_code: username,
                referral_link: fallbackLink,
                message: 'Referral endpoint not available, using fallback link.',
            };
        }
        throw error;
    }
};

/**
 * Get referral earnings data
 */
export const getReferralEarnings = async (): Promise<ReferralEarnings> => {
    const authService = AuthService.getInstance();
    return authService.makeAuthenticatedRequest<ReferralEarnings>('get', '/api/auth/referral-earnings/');
};

/**
 * Get complete referral dashboard data
 */
export const getReferralDashboard = async (): Promise<ReferralDashboard> => {
    const authService = AuthService.getInstance();
    return authService.makeAuthenticatedRequest<ReferralDashboard>('get', '/api/auth/referral-dashboard/');
};

/**
 * Get list of referred users (legacy endpoint)
 */
export const getReferralList = async () => {
    const authService = AuthService.getInstance();
    return authService.makeAuthenticatedRequest('get', '/api/auth/referrals/');
};

/**
 * Get referral statistics (legacy endpoint)
 */
export const getReferralStats = async () => {
    const authService = AuthService.getInstance();
    return authService.makeAuthenticatedRequest('get', '/api/auth/referral-stats/');
};
