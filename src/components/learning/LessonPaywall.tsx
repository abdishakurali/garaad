"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Lock, Sparkles, ArrowLeft } from "lucide-react";

interface LessonPaywallProps {
  coursePath: string;
  courseTitle?: string;
}

/**
 * Shown when a free user tries to access lesson 2+ of a course.
 * Prompts upgrade to Explorer to continue.
 */
export function LessonPaywall({ coursePath, courseTitle }: LessonPaywallProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-black dark:via-slate-900/50 dark:to-purple-900/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl border-2 border-primary/20 dark:border-primary/30 overflow-hidden">
        <CardContent className="pt-8 pb-4 px-6 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 dark:from-primary/30 dark:to-purple-500/30 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary dark:text-primary" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Casharadan waa kuwo Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
            {courseTitle
              ? `Si aad ugu dhex galato casharada \"${courseTitle}\" oo dhan, ku biir Explorer. Waxaad sii wadi kartaa casharka 1aad ee koorso kasta oo bilaash ah.`
              : "Si aad u sii wadato casharadan, ku biir Explorer. Waxaad heli kartaa dhammaan koorsaska iyo casharada."}
          </p>
          <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Hel XP, streaks, iyo community — casharka 1aad iyo community waa bilaash</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 p-6 pt-0">
          <Button
            asChild
            className="w-full font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Link href="/subscribe">Ku biir Explorer</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full gap-2 text-gray-600 dark:text-gray-400"
            onClick={() => router.push(coursePath)}
          >
            <ArrowLeft className="w-4 h-4" />
            Ku noqo bogga koorsada
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
