"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AuthService from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, BookOpen } from "lucide-react";
import { isAllowedRedirect, parseLessonIdFromRedirectPath } from "@/lib/auth-redirect";
import { fetchLessonWallPreview } from "@/lib/lesson-wall-preview";

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const posthog = usePostHog();
    const [redirectTo, setRedirectTo] = useState<string | null>(null);
    useEffect(() => {
        const r = searchParams.get("redirect");
        if (isAllowedRedirect(r)) {
            setRedirectTo(r);
            return;
        }
        try {
            const stored = sessionStorage.getItem("post_login_redirect");
            if (isAllowedRedirect(stored)) setRedirectTo(stored);
            else setRedirectTo(null);
        } catch {
            setRedirectTo(null);
        }
    }, [searchParams]);
    const reason = searchParams.get("reason");
    const lessonIdFromPath = useMemo(
        () => (redirectTo ? parseLessonIdFromRedirectPath(redirectTo) : null),
        [redirectTo]
    );
    const showLessonWall =
        reason === "unauthenticated" && Boolean(redirectTo) && Boolean(lessonIdFromPath);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setUser: setAuthStoreUser } = useAuthStore();

    const shouldLoadWallPreview = Boolean(showLessonWall && lessonIdFromPath);
    const [wallPreview, setWallPreview] = useState<NonNullable<Awaited<ReturnType<typeof fetchLessonWallPreview>>> | null>(
        null
    );
    const [wallPreviewLoading, setWallPreviewLoading] = useState(shouldLoadWallPreview);
    const wallHitCaptured = useRef(false);

    useEffect(() => {
        if (!showLessonWall || !lessonIdFromPath) {
            setWallPreview(null);
            setWallPreviewLoading(false);
            return;
        }

        let cancelled = false;
        setWallPreviewLoading(true);
        setWallPreview(null);

        (async () => {
            try {
                const data = await fetchLessonWallPreview(lessonIdFromPath);
                if (cancelled) return;
                setWallPreview(data);
                if (!wallHitCaptured.current && posthog) {
                    wallHitCaptured.current = true;
                    posthog.capture("lesson_wall_hit", {
                        lesson_id: Number(lessonIdFromPath),
                        course_id: data?.courseId ?? null,
                        source: "unauthenticated_redirect",
                    });
                }
            } catch {
                if (cancelled) return;
                setWallPreview(null);
                if (!wallHitCaptured.current && posthog) {
                    wallHitCaptured.current = true;
                    posthog.capture("lesson_wall_hit", {
                        lesson_id: Number(lessonIdFromPath),
                        course_id: null,
                        source: "unauthenticated_redirect",
                    });
                }
            } finally {
                if (!cancelled) setWallPreviewLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [showLessonWall, lessonIdFromPath, posthog]);

    const signupHref =
        redirectTo != null
            ? `/signup?redirect=${encodeURIComponent(redirectTo)}`
            : "/signup";

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

            try {
                sessionStorage.removeItem("post_login_redirect");
            } catch {
                /* ignore */
            }
            if (redirectTo) {
                router.refresh();
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
                    <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Soo gal</h1>
                    <p className="text-muted-foreground text-sm text-center mb-6">
                        Geli emailkaaga iyo passwordkaaga si aad ugu soo noqoto akoonkaaga.
                    </p>

                    {showLessonWall && (
                        <div className="mb-6 rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                            {wallPreviewLoading && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                                    <span>Waa la soo saarayaa macluumaadka casharka…</span>
                                </div>
                            )}
                            {!wallPreviewLoading && wallPreview && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                {wallPreview.courseTitle}
                                            </p>
                                            <p className="text-base font-semibold text-foreground leading-snug">
                                                {wallPreview.lessonTitle}
                                            </p>
                                            {wallPreview.teaser && (
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {wallPreview.teaser}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button asChild className="w-full rounded-lg py-5 font-semibold" variant="default">
                                        <Link href={signupHref}>Abuur akoon bilaash</Link>
                                    </Button>
                                </>
                            )}
                            {!wallPreviewLoading && wallPreview === null && lessonIdFromPath && (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        Fur akoon si aad u furto casharkan oo aad barashada u bilowdo.
                                    </p>
                                    <Button asChild className="w-full rounded-lg py-5 font-semibold" variant="default">
                                        <Link href={signupHref}>Abuur akoon bilaash</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

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
                        Ma haysatid akoon?{" "}
                        <Link href={signupHref} className="text-primary hover:underline font-medium">
                            Isdiiwaangeli
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-background">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            }
        >
            <LoginPageContent />
        </Suspense>
    );
}
