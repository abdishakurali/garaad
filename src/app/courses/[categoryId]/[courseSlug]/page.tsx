/* src/app/courses/[categoryId]/[courseSlug]/page.tsx */

"use client";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "@/store/features/learningSlice";
import { AppDispatch, RootState } from "@/store";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronRight } from "lucide-react";

import { Header } from "@/components/Header";
import ModuleZigzag from "@/components/learning/ui/ModuleZigzag";
import { CourseProgress } from "@/components/learning/CourseProgress";
import { Module } from "@/types/learning";
import { progressService, UserProgress } from "@/services/progress";

const defaultCourseImage = "/images/placeholder-course.svg";

export default function CourseDetailPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, isLoading, error } = useSelector(
    (state: RootState) => state.learning
  );

  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

  const handleModuleClick = (moduleId: number) => {
    setActiveModuleId(activeModuleId === moduleId ? null : moduleId);
  };

  useEffect(() => {
    if (params.categoryId && params.courseSlug) {
      dispatch(
        fetchCourse({
          categoryId: params.categoryId as string,
          courseSlug: params.courseSlug as string,
        })
      );
    }
  }, [dispatch, params.categoryId, params.courseSlug]);

  const fetchProgress = useCallback(async () => {
    try {
      const progressData = await progressService.getUserProgress();
      setProgress(progressData || []);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Error fetching progress");
      }
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Calculate progress based on current course and user progress
  const calculateCourseProgress = () => {
    if (!currentCourse || !progress.length) return 0;

    // Get all lesson Title from the current course
    const courseLessonTitle =
      currentCourse.modules?.flatMap((module) =>
        module.lessons?.map((lesson) => lesson.title)
      ) || [];

    // Filter progress items that belong to this course and are completed
    const completedLessons = progress.filter(
      (item) =>
        courseLessonTitle.includes(item.lesson_title) &&
        item.status === "completed"
    );

    // Calculate percentage
    return courseLessonTitle.length > 0
      ? (completedLessons.length / courseLessonTitle.length) * 100
      : 0;
  };

  const completedPercentage = calculateCourseProgress();

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading || !currentCourse) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-8">
          {/* ... existing skeleton UI ... */}
          <Skeleton className="h-12 w-3/4" />
          {/* repeat skeletons as before */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Course Info */}
          <div className="max-w-sm md:max-w-lg h-fit border-2 p-6 bg-white rounded-xl shadow-md border-gray-200">
            {/* Detached Icon/Image */}
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

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentCourse.title}
            </h2>

            {/* Progress */}
            <CourseProgress progress={completedPercentage} />

            {/* Description */}
            <p className="text-sm text-gray-600 mb-6">
              {currentCourse.description}
            </p>

            {/* Stats Row */}
            <div className="flex justify-start gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <span>📘</span>
                <span>
                  {currentCourse.modules?.flatMap((m) => m.lessons).length || 0}{" "}
                  casharo
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>🧩</span>
                <span>{currentCourse.estimatedHours} waydiimo</span>
              </div>
              <div className="flex items-center gap-1">
                <span>✅</span>
                <span>{Math.round(completedPercentage)}% dhameystiran</span>
              </div>
            </div>
          </div>

          {/* Right Column: Enhanced Learning Path */}
          <div className="relative">
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Naqshada Barashada</h2>
              </div>

              <div className="relative flex flex-col items-center gap-12">
                {/* Connecting line */}
                <div className="absolute w-1 h-full bg-gradient-to-b from-blue-200 to-transparent left-1/2 -translate-x-1/2 z-0" />

                {(currentCourse?.modules ?? []).map(
                  (module: Module, index: number) => (
                    <div key={module.id} className="relative z-10">
                      {/* Module Block */}
                      <div className="relative hover:scale-[1.02] transition-transform duration-300 translate-y-12">
                        <ModuleZigzag
                          modules={[module]}
                          activeModuleId={activeModuleId}
                          onModuleClick={handleModuleClick}
                        />
                        {/* Progress connector */}
                        {index < (currentCourse.modules?.length ?? 0) - 1 && (
                          <div className="absolute left-1/2 bottom-0 translate-y-24 -translate-x-1/2 text-blue-500">
                            <ChevronRight className="w-8 h-8 animate-bounce" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
