"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth";
import { userHasExplorerContentAccess } from "@/config/featureFlags";

interface PremiumCheckProps {
    children: React.ReactNode;
}

export default function PremiumCheck({ children }: PremiumCheckProps) {
    const router = useRouter();
    const authService = AuthService.getInstance();
    const user = authService.getCurrentUser();

    useEffect(() => {
        if (user && !userHasExplorerContentAccess(user)) {
            router.push("/subscribe");
        }
    }, [user, router]);

    // If user is not premium, don't render children
    if (user && !userHasExplorerContentAccess(user)) {
        return null;
    }

    return <>{children}</>;
} 