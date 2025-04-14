// src/app/courses/[categoryId]/[courseSlug]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "@/store/features/learningSlice";
import { AppDispatch, RootState } from "@/store";
import { BookOpen, Clock, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function CourseDetailPage() {
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { currentCourse, isLoading, error } = useSelector((state: RootState) => state.learning);

    useEffect(() => {
        if (params.categoryId && params.courseSlug) {
            dispatch(fetchCourse({
                categoryId: params.categoryId as string,
                courseSlug: params.courseSlug as string
            }));
        }
    }, [dispatch, params.categoryId, params.courseSlug]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto p-8">
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
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="space-y-8">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <div className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, index) => (
                                <Card key={index} className="p-6">
                                    <Skeleton className="h-6 w-3/4 mb-4" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Course Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">{currentCourse.title}</h1>
                        <p className="text-xl text-gray-600 mb-8">{currentCourse.description}</p>

                        <div className="flex justify-center gap-8 text-gray-600">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                <span>{currentCourse.totalLessons} lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{currentCourse.estimatedHours} hours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5" />
                                <span>{currentCourse.skillLevel}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentCourse.modules.map((module) => (
                        <Card key={module.id} className="p-6">
                            <h3 className="text-xl font-semibold mb-4">{module.title}</h3>
                            <p className="text-gray-600 mb-4">{module.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    {module.lessons.length} lessons
                                </span>
                                {module.progress > 0 && (
                                    <div className="w-24 bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-primary h-full rounded-full"
                                            style={{ width: `${module.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}