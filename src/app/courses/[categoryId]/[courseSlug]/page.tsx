/* src/app/courses/[categoryId]/[courseSlug]/page.tsx */

"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

const defaultCourseImage = "/images/placeholder-course.svg";

export default function CourseDetailPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, isLoading, error } = useSelector(
    (state: RootState) => state.learning
  );
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

  console.log("===============CURRENT COURSE============", currentCourse);

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

  // const handleModuleClick = (moduleId: string | number) => {
  //   router.push(
  //     `/courses/${params.categoryId}/${params.courseSlug}/lessons/${moduleId}`
  //   );
  // };

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

  console.log(currentCourse)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Course Info */}
          <div className="max-w-sm md:max-w-lg h-fit border-2 p-6 bg-white rounded-xl shadow-md  border-gray-200">
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
            <CourseProgress progress={currentCourse.progress} />

            {/* Description */}
            <p className="text-sm text-gray-600 mb-6">
              {currentCourse.description}
            </p>

            {/* Stats Row */}
            <div className="flex justify-start gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <span>📘</span>
                <span>{currentCourse.lesson_count} Lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🧩</span>
                <span>{currentCourse.estimatedHours} Practice</span>
              </div>
            </div>
          </div>

          {/* Right Column: Enhanced Learning Path */}
          <div className="relative">
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Learning Journey</h2>
                {/* <LevelMarker level={1} isLocked={false} /> */}
              </div>

              <div className="relative flex flex-col items-center gap-12">
                {/* Connecting line */}
                <div className="absolute w-1 h-full bg-gradient-to-b from-blue-200 to-transparent left-1/2 -translate-x-1/2 z-0" />

                {(currentCourse?.modules ?? []).map((module, index) => (
                  <div key={module.id} className="relative z-10 ">
                    {/* Level Indicator */}

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
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: New Learning Path Implementation */}
          {/* <div className="relative]">
              <LearningPathPresenter
                courseData={CourseData}
                onNodeSelected={handleNodeSelect}
                dimensions={{ width: 600, height: 700 }}
                
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
