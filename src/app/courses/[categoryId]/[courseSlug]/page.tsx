"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import { useCourse } from "@/hooks/useApi";
import AuthService from "@/services/auth";
import useSWR from "swr";
import { UserProgress } from "@/services/progress";

interface EnrollmentProgress {
  id: number;
  user: number;
  course: number;
  course_title: string;
  progress_percent: number;
  enrolled_at: string;
}

interface DailyActivity {
  date: string;
  day: string;
  status: "complete" | "none";
  problems_solved: number;
  lesson_ids: number[];
  isToday: boolean;
}

interface StreakData {
  userId: string;
  username: string;
  current_streak: number;
  max_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  energy: {
    current: number;
    max: number;
    next_update: string;
  };
  dailyActivity: DailyActivity[];
  xp: number;
  daily_xp: number;
}

const ModuleZigzag = dynamic(
  () => import("@/components/learning/ui/ModuleZigzag")
);

const CourseProgress = dynamic(() =>
  import("@/components/learning/CourseProgress").then(
    (mod) => mod.CourseProgress
  )
);

const authFetcher = async <T,>(url: string): Promise<T> => {
  const service = AuthService.getInstance();
  return await service.makeAuthenticatedRequest<T>("get", url);
};

const defaultCourseImage = "/images/placeholder-course.svg";

export default function CourseDetailPage() {
  const { categoryId, courseSlug } = useParams();
  const {
    course: currentCourse,
    isLoading,
    error,
  } = useCourse(String(categoryId), String(courseSlug));

  const {
    data: enrollments,
  } = useSWR<EnrollmentProgress[]>("/api/lms/enrollments/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

  const {
    data: progress,
  } = useSWR<UserProgress[]>("/api/lms/user-progress/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

  useSWR<StreakData>("/api/streaks/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

  const enrollmentProgress = useMemo(() => {
    if (!enrollments) return 0;
    return (
      enrollments.find((e) => e.course === currentCourse?.id)
        ?.progress_percent || 0
    );
  }, [enrollments, currentCourse]);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{String(error)}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading || !currentCourse) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-8">
          <Skeleton className="h-12 w-3/4" />
        </div>
      </div>
    );
  }

  const totalLessons =
    currentCourse.modules?.flatMap((m) => m.lessons).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto p-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Course Info */}
            <aside className="max-w-sm md:max-w-lg h-fit border-2 p-6 bg-white rounded-xl shadow-md border-gray-200 md:sticky md:top-10">
              <div className="flex mb-6 border-border border-2 px-4 py-2 rounded-md w-fit">
                <div className="relative w-16 h-16">
                  <Image
                    src={currentCourse.thumbnail || defaultCourseImage}
                    alt={currentCourse.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentCourse.title}
              </h2>

              <CourseProgress progress={enrollmentProgress} />

              <p className="text-sm text-gray-600 mb-6">
                {currentCourse.description}
              </p>

              <div className="flex justify-start gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <span>📘</span>
                  <span>{totalLessons} casharo</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🧩</span>
                  <span>
                    {currentCourse?.modules
                      .map(
                        (mod) =>
                          (mod?.lessons ?? []).filter(
                            (lesson) => lesson?.problem
                          ).length
                      )
                      .reduce((acc, curr) => acc + curr, 0) ?? 0}{" "}
                    waydiimo
                  </span>
                </div>
              </div>
            </aside>

            {/* Learning Path */}
            <section className="relative space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Naqshada Barashada</h2>
              </div>

              <div className="relative flex flex-col items-center gap-12">
                {currentCourse.modules && (
                  <ModuleZigzag
                    modules={currentCourse.modules}
                    onModuleClick={() => { }}
                    progress={progress ?? []}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
}