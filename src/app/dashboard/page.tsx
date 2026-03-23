"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { PracticeSet } from "@/components/practice/PracticeSet";
import { GamificationPanel } from "@/components/gamification/GamificationPanel";
import { progressService } from "@/services/progress";
import { practiceService } from "@/services/practice";
import AuthService from "@/services/auth";
import { API_BASE_URL } from "@/lib/constants";
import { useCategories, useEnrollments } from "@/hooks/useApi";
import type { UserProgress } from "@/services/progress";
import type { PracticeSet as PracticeSetType } from "@/services/practice";
import type { Course } from "@/types/lms";
import { pricingTranslations as t } from "@/config/translations/pricing";

function SubscribedSuccessBanner() {
  const searchParams = useSearchParams();
  const subscribed = searchParams.get("subscribed");
  if (!subscribed) return null;
  return (
    <div className="rounded-xl border border-primary/25 bg-primary/5 px-5 py-4 mb-6 text-sm font-medium text-foreground">
      🎉{" "}
      {subscribed === "challenge" ? t.success_challenge : t.success_explorer}
    </div>
  );
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [practiceSets, setPracticeSets] = useState<PracticeSetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [continueData, setContinueData] = useState<{
    continue_url: string;
    lesson_title: string;
    course_title: string;
  } | null>(null);

  const { categories } = useCategories();
  const { enrollments } = useEnrollments();

  const getCourseProgress = (courseId: number) => {
    if (!enrollments || !Array.isArray(enrollments)) return undefined;
    const e = enrollments.find((x: { course: number }) => x.course === courseId);
    return (e as { progress_percent?: number } | undefined)?.progress_percent;
  };

  const safeCategories = useMemo(() => Array.isArray(categories) ? categories : [], [categories]);

  // First 6 published courses for "Koorsoyinka" section (no recommendation framing)
  const coursesForDashboard = useMemo(() => {
    const flat: { course: Course; categoryId: string }[] = [];
    for (const cat of safeCategories) {
      if (!cat?.courses?.length) continue;
      for (const c of cat.courses) {
        if (c?.is_published) flat.push({ course: c, categoryId: String(cat.id) });
      }
    }
    return flat.slice(0, 6);
  }, [safeCategories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = await AuthService.getInstance().ensureValidToken();
        const continueResp = token
          ? await fetch(`${API_BASE_URL}/api/continue/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }).then(async (r) => {
              if (!r.ok) return null;
              return (await r.json()) as {
                continue_url: string | null;
                lesson_title?: string;
                course_title?: string;
              };
            })
          : null;

        const continueUrl = continueResp?.continue_url;
        if (continueUrl) {
          setContinueData({
            continue_url: continueUrl,
            lesson_title: continueResp.lesson_title || "",
            course_title: continueResp.course_title || "",
          });
        } else {
          setContinueData(null);
        }

        const [
          progressData,
          practiceSetsData,
        ] = await Promise.all([
          progressService.getUserProgress(),
          practiceService.getPracticeSets(),
        ]);

        setProgress(progressData);
        setPracticeSets(practiceSetsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={null}>
        <SubscribedSuccessBanner />
      </Suspense>
      <h1 className="text-3xl font-bold mb-8">Boorka Shaqada</h1>

      {continueData && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-violet-50 dark:bg-violet-950/20 p-6">
          <h2 className="text-xl font-bold mb-2">Barashada sii wad</h2>
          <div className="text-slate-700 dark:text-slate-200 mb-4">
            {continueData.course_title} &rarr; {continueData.lesson_title}
          </div>
          <Link href={continueData.continue_url}>
            <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold">
              Sii wad &rarr;
            </Button>
          </Link>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
        <div className="space-y-8">
          <ProgressCard progress={progress} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {practiceSets.map((practiceSet) => (
            <PracticeSet
              key={practiceSet.id}
              practiceSet={practiceSet}
              onSubmit={(problemId, answer) => {
                // Handle answer submission
                console.log("Answer submitted:", { problemId, answer });
              }}
            />
          ))}
        </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <GamificationPanel />
        </aside>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-4">Koorsoyinka</h2>
        {coursesForDashboard.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coursesForDashboard.map(({ course, categoryId }) => (
              <Link
                key={course.id}
                href={`/courses/${categoryId}/${course.slug}`}
                className="block p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30 transition-colors"
              >
                <span className="font-bold text-foreground">{course.title}</span>
                {course.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{course.description}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">Lama hayo koorsooyin hadda.</p>
        )}
        <Link href="/courses" className="mt-4 text-primary font-bold hover:underline inline-flex items-center gap-2">
          View full course list →
        </Link>
      </div>
    </div>
  );
}
