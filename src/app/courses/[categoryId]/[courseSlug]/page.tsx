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
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import { useCourse } from "@/hooks/useApi";
import { API_BASE_URL } from "@/lib/constants";
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
    const router = useRouter();
    const { categoryId, courseSlug } = useParams();
    const {
        course: currentCourse,
        isLoading,
        error,
    } = useCourse(String(categoryId), String(courseSlug));

    const {
        data: enrollments,
    } = useSWR<EnrollmentProgress[]>(`${API_BASE_URL}/api/lms/enrollments/`, authFetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 600000,
    });

    const {
        data: progress,
    } = useSWR<UserProgress[]>(`${API_BASE_URL}/api/lms/user-progress/`, authFetcher, {
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

    const handleEnrollClick = () => {
        router.push('/welcome');
    };

    const handleModuleClick = (moduleId: number) => {
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
            <ProtectedRoute requirePremium={true}>
                <div className="min-h-screen bg-white">
                    <div className="max-w-7xl mx-auto p-8">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{String(error)}</AlertDescription>
                        </Alert>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (isLoading || !currentCourse) {
        return (
            <ProtectedRoute requirePremium={true}>
                <div className="min-h-screen bg-white">
                    <div className="max-w-7xl mx-auto p-8">
                        <Skeleton className="h-12 w-3/4" />
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const totalLessons =
        currentCourse.modules?.flatMap((m) => m.lessons).length || 0;

    return (
        <ProtectedRoute requirePremium={true}>
            <div className="min-h-screen bg-gray-50">
                <Header />
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

                            {enrollmentProgress > 0 && (
                                <CourseProgress progress={enrollmentProgress} />
                            )}

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
                                {enrollmentProgress === 0 && (
                                    <p className="text-gray-600">
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
        </ProtectedRoute>
    );
}