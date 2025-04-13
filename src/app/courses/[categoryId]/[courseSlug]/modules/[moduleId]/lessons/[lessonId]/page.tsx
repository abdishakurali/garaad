"use client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/learning/Confetti";
import useSound from "use-sound";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import axios from "axios";

interface LessonType {
    id: number;
    title: string;
    slug: string;
    description: string;
    progress: number;
    type: string;
    problem: {
        options: string[];
        question: string;
        solution: string;
        explanation: string;
    };
    module: string;
    progress_id?: string;
}

interface CachedData {
    lessons: LessonType[];
    timestamp: number;
    moduleId: string;
    courseSlug: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

function getCachedLessons(moduleId: string, courseSlug: string): LessonType[] | null {
    try {
        const cacheKey = `lessons_${moduleId}_${courseSlug}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (!cachedData) return null;

        const data: CachedData = JSON.parse(cachedData);
        const now = Date.now();

        // Check if cache is still valid
        if (
            now - data.timestamp < CACHE_DURATION &&
            data.moduleId === moduleId &&
            data.courseSlug === courseSlug
        ) {
            return data.lessons;
        }

        // Clear expired cache
        localStorage.removeItem(cacheKey);
        return null;
    } catch (error) {
        console.error('Error reading from cache:', error);
        return null;
    }
}

function cacheLessons(lessons: LessonType[], moduleId: string, courseSlug: string) {
    try {
        const cacheKey = `lessons_${moduleId}_${courseSlug}`;
        const cacheData: CachedData = {
            lessons,
            timestamp: Date.now(),
            moduleId,
            courseSlug
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error writing to cache:', error);
    }
}

export default function LessonPage() {
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { currentLesson: lesson, error, isLoading }: { currentLesson: LessonType | null; error: string | null; isLoading: boolean } = useSelector((state: RootState) => state.learning);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [moduleLessons, setModuleLessons] = useState<LessonType[]>([]);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    // Sound effects
    const [playCorrect] = useSound('/sounds/correct.mp3');
    const [playIncorrect] = useSound('/sounds/incorrect.mp3');
    const [playSelect] = useSound('/sounds/select.mp3', { volume: 0.5 });

    // Fetch all module lessons first
    useEffect(() => {
        const fetchModuleLessons = async () => {
            try {
                // Check cache first
                const cachedLessons = getCachedLessons(
                    params.moduleId as string,
                    params.courseSlug as string
                );

                if (cachedLessons) {
                    setModuleLessons(cachedLessons);
                    const index = cachedLessons.findIndex((l: LessonType) => l.id === Number(params.lessonId));
                    setCurrentLessonIndex(index);

                    if (cachedLessons[index]) {
                        dispatch({ type: 'learning/setCurrentLesson', payload: cachedLessons[index] });
                    }
                    return;
                }

                // If no cache, fetch from API
                const endpoint = process.env.NEXT_PUBLIC_API_GET_MODULE_LESSONS!
                    .replace('{course_slug}', params.courseSlug as string)
                    .replace('{module_slug}', params.moduleId as string);

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
                const lessons = response.data;

                // Cache the fetched data
                cacheLessons(
                    lessons,
                    params.moduleId as string,
                    params.courseSlug as string
                );

                setModuleLessons(lessons);
                const index = lessons.findIndex((l: LessonType) => l.id === Number(params.lessonId));
                setCurrentLessonIndex(index);

                if (lessons[index]) {
                    dispatch({ type: 'learning/setCurrentLesson', payload: lessons[index] });
                }
            } catch (error) {
                console.error('Error fetching module lessons:', error);
                dispatch({ type: 'learning/setError', payload: 'Failed to fetch lessons' });
            }
        };

        if (params.moduleId && params.courseSlug) {
            fetchModuleLessons();
        }
    }, [params.moduleId, params.courseSlug, params.lessonId, dispatch]);

    // Update progress after correct answer
    useEffect(() => {
        if (feedback === 'correct' && lesson) {
            // Update the cached lessons with new progress
            const updatedLessons = moduleLessons.map(l =>
                l.id === lesson.id
                    ? { ...l, progress: 100 }
                    : l
            );

            cacheLessons(
                updatedLessons,
                params.moduleId as string,
                params.courseSlug as string
            );
            setModuleLessons(updatedLessons);
        }
    }, [feedback, lesson, moduleLessons, params.moduleId, params.courseSlug]);

    // Reset state when lesson changes
    useEffect(() => {
        setSelectedAnswer(null);
        setFeedback(null);
        setShowConfetti(false);
    }, [params.lessonId]);

    const handleSubmitAnswer = useCallback(async () => {
        if (!selectedAnswer || !lesson) return;

        try {
            setIsSubmitting(true);

            if (lesson.progress_id) {
                const endpoint = process.env.NEXT_PUBLIC_API_SUBMIT_ANSWER!
                    .replace('{progress_id}', lesson.progress_id);

                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                    answer: selectedAnswer
                });

                const isCorrect = response.data.is_correct;

                if (isCorrect) {
                    playCorrect();
                    setShowConfetti(true);
                    setFeedback('correct');
                    setTimeout(() => setShowConfetti(false), 3000);
                } else {
                    playIncorrect();
                    setFeedback('incorrect');
                }
            } else {
                // Fallback to direct solution check if no progress_id
                const isCorrect = selectedAnswer === lesson.problem.solution;
                if (isCorrect) {
                    playCorrect();
                    setShowConfetti(true);
                    setFeedback('correct');
                    setTimeout(() => setShowConfetti(false), 3000);
                } else {
                    playIncorrect();
                    setFeedback('incorrect');
                }
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedAnswer, lesson, playCorrect, playIncorrect, setShowConfetti, setFeedback]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (isSubmitting || feedback === 'correct') return;

            // Number keys 1-4 for selecting options
            if (e.key >= "1" && e.key <= "4" && lesson?.problem.options) {
                const index = parseInt(e.key) - 1;
                if (lesson.problem.options[index]) {
                    playSelect();
                    setSelectedAnswer(lesson.problem.options[index]);
                }
            }

            // Enter to submit
            if (e.key === "Enter" && selectedAnswer) {
                handleSubmitAnswer();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [selectedAnswer, isSubmitting, feedback, lesson, handleSubmitAnswer, playSelect]);

    const getNextLessonUrl = () => {
        if (currentLessonIndex < moduleLessons.length - 1) {
            const nextLesson = moduleLessons[currentLessonIndex + 1];
            return `/courses/${params.categoryId}/${params.courseSlug}/modules/${params.moduleId}/lessons/${nextLesson.id}`;
        }
        return null;
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
                <span className="ml-3 text-lg text-gray-600">Loading lesson...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Confetti isActive={showConfetti} />

            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href={`/courses/${params.categoryId}/${params.courseSlug}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Course</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Progress indicator */}
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${((currentLessonIndex + 1) / moduleLessons.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium">
                                {currentLessonIndex + 1}/{moduleLessons.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="pt-24 pb-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
                        <p className="text-xl text-gray-600">{lesson.problem.question}</p>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-4 mb-8">
                        <AnimatePresence>
                            {lesson.problem.options.map((option, index) => (
                                <div key={option}>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            if (!feedback && !isSubmitting) {
                                                playSelect();
                                                setSelectedAnswer(option);
                                            }
                                        }}
                                        className={cn(
                                            "w-full p-6 text-left justify-start h-auto transition-all duration-200",
                                            selectedAnswer === option
                                                ? feedback === 'correct'
                                                    ? "bg-green-50 border-green-500"
                                                    : feedback === 'incorrect'
                                                        ? "bg-red-50 border-red-500"
                                                        : "bg-blue-50 border-blue-500"
                                                : "bg-white hover:border-gray-300",
                                            feedback === 'correct' && option === lesson.problem.solution && "bg-green-50 border-green-500"
                                        )}
                                        disabled={isSubmitting || feedback === 'correct'}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm transition-colors",
                                                selectedAnswer === option
                                                    ? feedback === 'correct'
                                                        ? "border-green-500 text-green-500"
                                                        : feedback === 'incorrect'
                                                            ? "border-red-500 text-red-500"
                                                            : "border-blue-500 text-blue-500"
                                                    : "border-gray-300 text-gray-500",
                                                feedback === 'correct' && option === lesson.problem.solution && "border-green-500 text-green-500"
                                            )}>
                                                {index + 1}
                                            </span>
                                            <span className="flex-grow">{option}</span>
                                            {feedback === 'correct' && option === lesson.problem.solution && (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    </Button>
                                </div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Action Buttons */}
                    <div className="sticky bottom-4 space-y-4">
                        {selectedAnswer && !feedback && (
                            <>
                                <Button
                                    onClick={handleSubmitAnswer}
                                    disabled={isSubmitting}
                                    className="w-full p-6 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Checking..." : "Check Answer"}
                                </Button>
                                <p className="text-center text-sm text-gray-500">
                                    Press Enter ↵ to check
                                </p>
                            </>
                        )}

                        {feedback === 'incorrect' && (
                            <Button
                                onClick={() => {
                                    setFeedback(null);
                                    setSelectedAnswer(null);
                                }}
                                className="w-full p-6 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
                            >
                                Try Again
                            </Button>
                        )}

                        {feedback === 'correct' && (
                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                    <p className="text-green-800 text-center font-medium">
                                        {lesson.problem.explanation}
                                    </p>
                                </div>

                                {getNextLessonUrl() ? (
                                    <Link href={getNextLessonUrl()!}>
                                        <Button
                                            className="w-full p-6 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span>Next Lesson</span>
                                            <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={`/courses/${params.categoryId}/${params.courseSlug}`}>
                                        <Button
                                            className="w-full p-6 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span>Complete Module</span>
                                            <CheckCircle className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 