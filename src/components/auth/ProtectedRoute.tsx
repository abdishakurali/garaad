"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import AuthService from "@/services/auth";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requirePremium?: boolean;
    requireEmailVerification?: boolean;
}

export function ProtectedRoute({
    children,
    requirePremium = false,
    requireEmailVerification = true
}: ProtectedRouteProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Get user from Redux store
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const checkAuth = () => {
            const authService = AuthService.getInstance();

            // Check if user is authenticated
            if (!isAuthenticated && !authService.isAuthenticated()) {
                router.push('/welcome');
                return;
            }

            // Get current user from auth service or Redux
            const currentUser = user || authService.getCurrentUser();

            if (!currentUser) {
                router.push('/welcome');
                return;
            }

            // Check email verification if required
            if (requireEmailVerification && !currentUser.is_email_verified) {
                console.log('User email not verified, redirecting to verification page');
                router.push(`/verify-email?email=${encodeURIComponent(currentUser.email)}`);
                return;
            }

            // If premium is required, check premium status
            if (requirePremium && !currentUser.is_premium) {
                router.push('/subscribe');
                return;
            }

            // User is authorized
            setIsAuthorized(true);
            setIsLoading(false);
        };

        // Small delay to allow Redux to hydrate
        const timer = setTimeout(checkAuth, 100);

        return () => clearTimeout(timer);
    }, [isAuthenticated, user, requirePremium, requireEmailVerification, router]);

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <Loader className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-gray-600 text-lg">Xaqiijinaya...</p>
                </div>
            </div>
        );
    }

    // Show nothing if not authorized (redirect is in progress)
    if (!isAuthorized) {
        return null;
    }

    // Render children if authorized
    return <>{children}</>;
} 