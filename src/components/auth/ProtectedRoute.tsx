"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "./AuthDialog";
import { useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    useEffect(() => {
        if (!user) {
            setShowAuthDialog(true);
        }
    }, [user]);

    if (!user) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Fadlan gal si aad u hesho koorsooyinka</h2>
                        <p className="text-gray-600 mb-6">Waxaad u baahan tahay inaad gasho si aad u hesho koorsooyinka</p>
                    </div>
                </div>
                {showAuthDialog && <AuthDialog />}
            </>
        );
    }

    return <>{children}</>;
} 