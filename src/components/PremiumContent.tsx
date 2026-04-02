"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth";
import { userHasExplorerContentAccess } from "@/config/featureFlags";

interface PremiumContentProps {
    children: React.ReactNode;
}

export default function PremiumContent({ children }: PremiumContentProps) {
    const router = useRouter();
    const authService = AuthService.getInstance();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect -- navigation/loading state flow */
        const user = authService.getCurrentUser();

        // Gated content: no session → login so returning users don't get full onboarding.
        if (!user) {
            router.push("/login");
            return;
        }

        if (!userHasExplorerContentAccess(user)) {
            router.push("/subscribe");
            return;
        }

        setIsLoading(false);
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
} 