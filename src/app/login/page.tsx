"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect all root /login hits to /welcome onboarding/login flow
        router.replace("/welcome");
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">
                    Adiga ayaa laguu sii gudbinayaa...
                </p>
            </div>
        </div>
    );
}
