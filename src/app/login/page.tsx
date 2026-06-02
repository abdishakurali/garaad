"use client";

import Link from "next/link";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/ui/Logo";

const ACCESS_EMAIL = "info@garaad.org";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-foreground dark:bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-10 sm:py-14">
        <header className="mb-8 flex flex-col items-center gap-5 sm:mb-10">
          <Link href="/" className="rounded-2xl outline-offset-4 transition-opacity hover:opacity-90">
            <Logo priority loading="eager" className="h-11 sm:h-12" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            Dib u laabo
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-center pb-6">
          <Card className="w-full overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl shadow-violet-500/[0.07] ring-1 ring-black/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/75 dark:shadow-black/40 dark:ring-white/10">
            <CardContent className="space-y-6 p-6 text-center sm:p-8">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                <Lock className="size-7" aria-hidden />
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
                  Codsi kaliya
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Garaad hadda lama galo si iskiis ah
                </h1>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Request access and you will be approved.
                </p>
              </div>
              <Button asChild className="h-12 w-full rounded-xl text-base font-semibold shadow-md">
                <a href={`mailto:${ACCESS_EMAIL}?subject=Codsi%20Garaad%20Access`}>
                  <Mail className="mr-2 size-5" />
                  Codso access: {ACCESS_EMAIL}
                </a>
              </Button>
              <p className="rounded-2xl border border-violet-500/25 bg-violet-500/[0.06] p-4 text-sm font-semibold text-foreground">
                No form filling. No self login. Email only.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
