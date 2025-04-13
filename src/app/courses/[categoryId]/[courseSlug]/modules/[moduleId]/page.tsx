"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { fetchCourse } from "@/store/features/learningSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ModuleDetailPage() {
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

    const currentModule = course.modules?.find(m => m.id === params.moduleId);

    if (!currentModule) {
        return (
            <div className="container py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Module Not Found</AlertTitle>
                    <AlertDescription>The requested module could not be found.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Module Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="mb-6">
                        <Link
                            href={`/courses/${params.categoryId}/${params.courseSlug}`}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Course
                        </Link>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">{currentModule.title}</h1>
                        {currentModule.description && (
                            <p className="text-xl text-gray-600 mb-8">{currentModule.description}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Lessons List */}
            <div className="max-w-3xl mx-auto py-12 px-4">
                <div className="space-y-4">
                    {currentModule.lessons?.map((lesson, index) => (
                        <div
                            key={lesson.id}
                        >
                            <Link
                                href={`/courses/${params.categoryId}/${params.courseSlug}/modules/${params.moduleId}/lessons/${lesson.id}`}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full p-6 h-auto flex items-center justify-between hover:border-blue-500 hover:bg-blue-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                                            {index + 1}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                                            {lesson.progress > 0 && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Progress: {lesson.progress}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {lesson.progress === 100 ? (
                                        <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                                            Completed
                                        </div>
                                    ) : lesson.progress > 0 ? (
                                        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                            In Progress
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                            Not Started
                                        </div>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 