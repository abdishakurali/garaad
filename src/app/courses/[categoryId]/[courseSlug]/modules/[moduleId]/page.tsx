"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { fetchModuleLessons } from "@/store/features/learningSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function ModuleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { currentModule, error, isLoading } = useSelector((state: RootState) => state.learning);

    useEffect(() => {
        if (params.moduleId) {
            dispatch(fetchModuleLessons({
                moduleId: params.moduleId as string
            }));
        }
    }, [dispatch, params.moduleId]);

    const handleLessonClick = (lessonId: number) => {
        router.push(`/courses/${params.categoryId}/${params.courseSlug}/modules/${params.moduleId}/lessons/${lessonId}`);
    };

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

    if (isLoading || !currentModule.data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-lg text-gray-600">Loading...</span>
            </div>
        );
    }

    const moduleData = currentModule.data;
    const lessons = moduleData.lessons || [];
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(lesson => lesson.progress === 100).length;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

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
                        <h1 className="text-3xl font-bold mb-4">{moduleData.title}</h1>
                        {moduleData.description && (
                            <p className="text-xl text-gray-600 mb-8">{moduleData.description}</p>
                        )}
                        <div className="flex items-center justify-center space-x-4 mb-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{completedLessons}</div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{totalLessons}</div>
                                <div className="text-sm text-gray-600">Total Lessons</div>
                            </div>
                        </div>
                        <Progress value={progressPercentage} className="w-full max-w-md mx-auto" />
                    </div>
                </div>
            </div>

            {/* Lessons List */}
            <div className="max-w-3xl mx-auto py-12 px-4">
                <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                        <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson.id)}
                            className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                                            {index + 1}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                                            {lesson.description && (
                                                <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {lesson.progress === 100 ? (
                                            <div className="flex items-center text-green-600">
                                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                                <span className="text-sm font-medium">Completed</span>
                                            </div>
                                        ) : lesson.progress > 0 ? (
                                            <div className="flex items-center text-blue-600">
                                                <PlayCircle className="w-5 h-5 mr-2" />
                                                <span className="text-sm font-medium">Continue</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-gray-600">
                                                <PlayCircle className="w-5 h-5 mr-2" />
                                                <span className="text-sm font-medium">Start</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {lesson.progress > 0 && lesson.progress < 100 && (
                                    <div className="mt-4">
                                        <Progress value={lesson.progress} className="w-full" />
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 