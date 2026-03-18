"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AuthService from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

// Allowed redirect targets (same-origin paths only; no open redirect)
function isAllowedRedirect(redirect: string | null): boolean {
    if (!redirect || typeof redirect !== "string") return false;
    const path = redirect.startsWith("/") ? redirect : `/${redirect}`;
    return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = useMemo(() => {
        const r = searchParams.get("redirect");
        return isAllowedRedirect(r) ? r : null;
    }, [searchParams]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setUser: setAuthStoreUser } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await AuthService.getInstance().signIn({ email: email.trim(), password });

            if (result?.user) {
                setAuthStoreUser({
                    ...result.user,
                    is_premium: result.user.is_premium ?? false,
                });
            }

            // Prefer redirect param (e.g. lesson URL); otherwise always go to courses
            if (redirectTo) {
                router.push(redirectTo);
            } else {
                router.push("/courses");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Wax khalad ah ayaa dhacay. Fadlan mar kale isku day.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-8">
            <Card className="w-full max-w-md shadow-lg border-0 md:border border-border overflow-hidden bg-card">
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
                        Soo gal
                    </h1>
                    <p className="text-muted-foreground text-sm text-center mb-6">
                        Geli emailkaaga iyo passwordkaaga si aad ugu soo noqoto akoonkaaga.
                    </p>

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTitle className="font-medium">Khalad</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                Emailkaaga
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 h-auto rounded-xl border-border bg-card focus:border-primary focus:ring-primary/20"
                                disabled={isLoading}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                Passwordkaaga
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 h-auto rounded-xl border-border bg-card focus:border-primary focus:ring-primary/20"
                                disabled={isLoading}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full rounded-lg py-6 font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Waa la socodaa...
                                </>
                            ) : (
                                "Soo gal"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/welcome"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
