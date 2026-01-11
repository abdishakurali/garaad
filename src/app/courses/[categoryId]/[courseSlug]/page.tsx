"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

import { useCourse, useEnrollments, useUserProgress } from "@/hooks/useApi";
import { API_BASE_URL } from "@/lib/constants";
import AuthService from "@/services/auth";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { UserProgress } from "@/services/progress";

interface EnrollmentProgress {
    id: number;
    user: number;
    course: number;
    course_title: string;
    progress_percent: number;
    enrolled_at: string;
}

const ModuleZigzag = dynamic(
    () => import("@/components/learning/ui/ModuleZigzag")
);

const CourseProgress = dynamic(() =>
    import("@/components/learning/CourseProgress").then(
        (mod) => mod.CourseProgress
    )
);

const defaultCourseImage = "/images/placeholder-course.svg";

export default function CourseDetailPage() {
    const router = useRouter();
    const { categoryId, courseSlug } = useParams();
    const {
        course: currentCourse,
        isLoading: isCourseLoading,
        error: courseError,
    } = useCourse(String(categoryId), String(courseSlug));

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const {
        enrollments,
        isLoading: isEnrollmentsLoading,
    } = useEnrollments();

    const {
        progress,
        isLoading: isProgressLoading,
    } = useUserProgress();

    const isLoading = isCourseLoading || isEnrollmentsLoading || isProgressLoading;
    const error = courseError;

    const enrollmentProgress = useMemo(() => {
        if (!enrollments) return 0;
        return (
            enrollments.find((e) => e.course === currentCourse?.id)
                ?.progress_percent || 0
        );
    }, [enrollments, currentCourse]);

    const handleEnrollClick = () => {
        router.push('/welcome');
    };

    const handleModuleClick = (moduleId: number) => {
        if (!isAuthenticated) {
            router.push('/welcome');
            return;
        }

        // Check if the module is completed to determine if it's in review mode
        const courseModule = currentCourse?.modules.find(m => m.id === moduleId);
        const isModuleCompleted = courseModule && progress?.some(
            (p) => p.module_id === moduleId && p.status === "completed"
        );

        // Add review parameter if the module is completed
        const reviewParam = isModuleCompleted ? '?review=true' : '';
        router.push(`/courses/${categoryId}/${courseSlug}/lessons/${moduleId}${reviewParam}`);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500">
                <Header />
                <div className="max-w-7xl mx-auto p-8">
                    <Alert variant="destructive" className="rounded-3xl border-2">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="font-black">Khalad ayaa dhacay</AlertTitle>
                        <AlertDescription className="font-bold">{String(error)}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (isLoading || !currentCourse) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black">
                <Header />
                <div className="max-w-7xl mx-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                        <div className="space-y-8">
                            <Skeleton className="h-20 w-3/4 rounded-2xl" />
                            <Skeleton className="h-40 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalLessons =
        currentCourse.modules?.flatMap((m) => m.lessons).length || 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-500">
            <Header />
            <div className="max-w-7xl mx-auto p-8 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Course Info */}
                    <aside className="max-w-sm md:max-w-lg h-fit border-2 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border-gray-200 dark:border-slate-800 md:sticky md:top-32">
                        <div className="flex mb-6 border-border dark:border-slate-800 border-2 px-4 py-2 rounded-md w-fit bg-slate-50 dark:bg-black">
                            <div className="relative w-16 h-16">
                                <Image
                                    src={optimizeCloudinaryUrl(currentCourse.thumbnail) || defaultCourseImage}
                                    alt={currentCourse.title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {currentCourse.title}
                        </h2>

                        {enrollmentProgress > 0 && (
                            <CourseProgress progress={enrollmentProgress} />
                        )}

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">
                            {currentCourse.description}
                        </p>

                        <div className="flex justify-start gap-6 text-sm text-gray-700 dark:text-gray-300 font-bold">
                            <div className="flex items-center gap-1">
                                <span>📘</span>
                                <span>{totalLessons} casharo</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>🧩</span>
                                <span>
                                    {currentCourse?.modules
                                        ?.flatMap(mod => mod.lessons || [])
                                        .filter(lesson =>
                                            lesson.content_blocks?.some(block => block.block_type === 'problem')
                                        ).length || 0}{" "}
                                    waydiimo
                                </span>
                            </div>
                        </div>
                    </aside>

                    {/* Learning Path */}
                    <section className="relative space-y-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4 dark:text-white">Naqshada Barashada</h2>
                            {enrollmentProgress === 0 && (
                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    Waxaad arki kartaa naqshada barashada. Si aad u bilowdo casharada, fadlan isdiiwaangeli.
                                </p>
                            )}
                        </div>

                        <div className="relative flex flex-col items-center gap-12">
                            {currentCourse.modules && (
                                <ModuleZigzag
                                    modules={currentCourse.modules}
                                    onModuleClick={handleModuleClick}
                                    progress={progress ?? []}
                                />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}