// src/app/courses/[categoryId]/[courseSlug]/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { fetchCourse } from "@/store/features/learningSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookOpen, Clock, Trophy } from "lucide-react";
import { ModuleList } from "@/components/learning/ModuleList";
 
export default function CourseDetailPage() {
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { currentCourse: course, error, isLoading } = useSelector((state: RootState) => state.learning);

    useEffect(() => {
        if (params.courseSlug && params.categoryId) {
            dispatch(fetchCourse({
                courseSlug: params.courseSlug as string,
                categoryId: params.categoryId as string
            }));
        }
    }, [dispatch, params.courseSlug, params.categoryId]);

    if (error) {
        return (
            <div className="container py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isLoading || !course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-lg text-gray-600">Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Course Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div
                        
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                        <p className="text-xl text-gray-600 mb-8">{course.description}</p>

                        <div className="flex justify-center gap-8 text-gray-600">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                <span>{course.modules?.length || 0} modules</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>2 hours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5" />
                                <span>Beginner</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="py-12">
                {course.modules && course.modules.length > 0 ? (
                    <ModuleList
                        modules={course.modules.map(module => ({
                            ...module,
                            type: "lesson",
                            isLocked: false,
                            isCompleted: false,
                            lessons: module.lessons || []
                        }))}
                        categoryId={params.categoryId as string}
                        courseSlug={params.courseSlug as string}
                    />
                ) : (
                    <div className="text-center text-gray-500">
                        <p className="text-lg">No modules available yet.</p>
                        <p className="text-sm mt-2">Check back later for updates!</p>
                    </div>
                )}
            </div>
        </div>
    );
}