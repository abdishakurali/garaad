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
import { ArrowLeft, BookOpen, Loader2, LogIn, Sparkles } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { isAllowedRedirect, parseLessonIdFromRedirectPath } from "@/lib/auth-redirect";
import { fetchLessonWallPreview } from "@/lib/lesson-wall-preview";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

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

    const handleGoogleCredential = async (credential: string) => {
        setError("");
        setIsLoading(true);
        try {
            const result = await AuthService.getInstance().signInWithGoogle({ credential });
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
            setError(
                err instanceof Error ? err.message : "Google login ma guulaysan. Fadlan mar kale isku day."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-foreground dark:bg-slate-950">
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/20"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -bottom-40 -left-24 h-[24rem] w-[24rem] rounded-full bg-purple-400/20 blur-3xl dark:bg-fuchsia-600/15"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[length:2.5rem_2.5rem] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)]"
                aria-hidden
            />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-10 sm:py-14">
                <header className="mb-8 flex flex-col items-center gap-5 sm:mb-10">
                    <Link
                        href="/"
                        className="rounded-2xl outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                    >
                        <Logo priority loading="eager" className="h-11 sm:h-12" />
                    </Link>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-4 shrink-0" aria-hidden />
                        Ku laabo koorsooyinka
                    </Link>
                </header>

                <main className="flex flex-1 flex-col justify-center pb-6">
                    <Card className="w-full overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl shadow-violet-500/[0.07] ring-1 ring-black/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/75 dark:shadow-black/40 dark:ring-white/10">
                        <CardContent className="space-y-6 p-6 sm:p-8">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                                    <LogIn className="size-6" aria-hidden />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Soo gal
                                </h1>
                                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    Geli emailkaaga iyo passwordkaaga si aad ugu soo noqoto akoonkaaga.
                                </p>
                            </div>

                            {showLessonWall && (
                                <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.08] via-card to-purple-500/[0.06] p-5 shadow-inner dark:from-violet-500/15 dark:via-slate-900/50 dark:to-purple-900/20">
                                    <div
                                        className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-violet-400/20 blur-2xl dark:bg-violet-500/20"
                                        aria-hidden
                                    />
                                    <div className="relative space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">
                                            <Sparkles className="size-3.5" aria-hidden />
                                            Casharka aad rabto inaad furto
                                        </div>
                                        {wallPreviewLoading && (
                                            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                                <Loader2 className="size-4 shrink-0 animate-spin text-violet-500" />
                                                <span>Waa la soo saarayaa macluumaadka casharka…</span>
                                            </div>
                                        )}
                                        {!wallPreviewLoading && wallPreview && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 shrink-0 rounded-xl bg-violet-500/15 p-2.5 text-violet-600 dark:bg-violet-500/25 dark:text-violet-300">
                                                        <BookOpen className="size-5" />
                                                    </div>
                                                    <div className="min-w-0 space-y-1.5">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                            {wallPreview.courseTitle}
                                                        </p>
                                                        <p className="text-base font-semibold leading-snug text-foreground">
                                                            {wallPreview.lessonTitle}
                                                        </p>
                                                        {wallPreview.teaser && (
                                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                                {wallPreview.teaser}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    asChild
                                                    className="h-12 w-full rounded-xl text-base font-semibold shadow-md"
                                                    variant="default"
                                                >
                                                    <Link href={signupHref}>Abuur akoon bilaash</Link>
                                                </Button>
                                            </>
                                        )}
                                        {!wallPreviewLoading && wallPreview === null && lessonIdFromPath && (
                                            <div className="space-y-4">
                                                <p className="text-sm leading-relaxed text-muted-foreground">
                                                    Fur akoon si aad u furto casharkan oo aad barashada u bilowdo.
                                                </p>
                                                <Button
                                                    asChild
                                                    className="h-12 w-full rounded-xl text-base font-semibold shadow-md"
                                                    variant="default"
                                                >
                                                    <Link href={signupHref}>Abuur akoon bilaash</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {error && (
                                <Alert
                                    variant="destructive"
                                    className="rounded-2xl border-red-200/80 bg-red-50/90 dark:border-red-900/50 dark:bg-red-950/40"
                                >
                                    <AlertTitle className="font-semibold">Khalad</AlertTitle>
                                    <AlertDescription className="text-pretty">{error}</AlertDescription>
                                </Alert>
                            )}

                            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                                <div className="space-y-4">
                                    <GoogleSignInButton
                                        disabled={isLoading}
                                        onCredential={(c) => void handleGoogleCredential(c)}
                                    />
                                    <div className="relative py-1 text-center text-xs font-medium text-muted-foreground">
                                        <span className="relative z-10 bg-card px-3">ama sii wad email</span>
                                        <span
                                            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border"
                                            aria-hidden
                                        />
                                    </div>
                                </div>
                            ) : null}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Emailkaaga
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                                        disabled={isLoading}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Passwordkaaga
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                                        disabled={isLoading}
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/35 disabled:opacity-60"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 size-5 animate-spin" />
                                            Waa la socodaa...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="mr-2 size-5 opacity-90" />
                                            Soo gal
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/[0.06] p-4 text-center">
                                <p className="text-sm font-semibold text-foreground">Akoon ma haystid?</p>
                                <Link
                                    href={signupHref}
                                    className="mt-2 inline-flex items-center justify-center text-sm font-bold text-violet-600 hover:underline dark:text-violet-400"
                                >
                                    Bilaash ku samee hadda →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
                    <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
                        aria-hidden
                    />
                    <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card/90 px-10 py-12 shadow-xl backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80">
                        <Loader2 className="size-10 animate-spin text-violet-600 dark:text-violet-400" />
                        <p className="text-sm font-medium text-muted-foreground">Waa la diyaarinayaa…</p>
                    </div>
                </div>
            }
        >
            <LoginPageContent />
        </Suspense>
    );
}
