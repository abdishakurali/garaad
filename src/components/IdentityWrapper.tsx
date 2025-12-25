"use client";

import React from "react";
import { UserIdentity } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

const IDENTITY_LEVELS: Record<UserIdentity, number> = {
    "explorer": 1,
    "builder": 2,
    "solver": 3,
    "mentor": 4
};

interface IdentityWrapperProps {
    minIdentity: UserIdentity;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    /**
     * If true, only renders if the user identity EXACTLY matches minIdentity.
     * Otherwise, renders if user identity is equal or greater.
     */
    exact?: boolean;
}

export function IdentityWrapper({
    minIdentity,
    children,
    fallback = null,
    exact = false
}: IdentityWrapperProps) {
    const { user } = useAuth();

    if (!user || !user.identity) {
        return <>{fallback}</>;
    }

    const userLevel = IDENTITY_LEVELS[user.identity] || 1;
    const requiredLevel = IDENTITY_LEVELS[minIdentity];

    const isAuthorized = exact
        ? user.identity === minIdentity
        : userLevel >= requiredLevel;

    return isAuthorized ? <>{children}</> : <>{fallback}</>;
}
