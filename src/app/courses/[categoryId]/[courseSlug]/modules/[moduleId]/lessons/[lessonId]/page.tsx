"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { fetchLesson, submitLessonAnswer } from "@/store/features/learningSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { currentLesson: lesson, error, isLoading } = useSelector((state: RootState) => state.learning);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        if (params.lessonId) {
            dispatch(fetchLesson(params.lessonId as string));
        }
    }, [dispatch, params.lessonId]);

    const handleAnswerSubmit = async () => {
        if (!selectedAnswer || !lesson || isAnswerSubmitted) return;

        try {
            const result = await dispatch(submitLessonAnswer({
                lessonId: lesson.id.toString(),
                answer: selectedAnswer
            })).unwrap();

            setIsAnswerSubmitted(true);
            setIsCorrect(result.is_correct);

            if (result.is_correct) {
                // Show success message and allow proceeding to next lesson
                setTimeout(() => {
                    // Navigate to next lesson if available
                }, 2000);
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
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

    if (isLoading || !lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-lg text-gray-600">Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Lesson Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">

                            <Link
                                href={`/courses/${params.categoryId}/${params.courseSlug}`}
                                className="inline-flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Course
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={() => router.back()}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={() => router.forward()}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lesson Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h1 className="text-2xl font-bold mb-6">{lesson.title}</h1>

                    {/* Question */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">{lesson.problem.question}</h2>
                        <div className="space-y-3">
                            {lesson.problem.options.map((option, index) => (
                                <div
                                    key={index}
                                >
                                    <button
                                        onClick={() => !isAnswerSubmitted && setSelectedAnswer(option)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedAnswer === option
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            } ${isAnswerSubmitted
                                                ? option === lesson.problem.solution
                                                    ? 'border-green-500 bg-green-50'
                                                    : selectedAnswer === option
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-gray-200'
                                                : ''
                                            }`}
                                        disabled={isAnswerSubmitted}
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-1">{option}</div>
                                            {isAnswerSubmitted && option === lesson.problem.solution && (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <Button
                            onClick={handleAnswerSubmit}
                            disabled={!selectedAnswer || isAnswerSubmitted}
                            className="px-8 py-2"
                        >
                            {isAnswerSubmitted ? 'Submitted' : 'Submit Answer'}
                        </Button>
                    </div>

                    {/* Feedback */}
                    {isAnswerSubmitted && (
                        <div
                            className={`mt-8 p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'
                                }`}
                        >
                            <h3 className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'
                                } mb-2`}>
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </h3>
                            <p className="text-gray-600">{lesson.problem.explanation}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 