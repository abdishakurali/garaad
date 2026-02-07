"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useLearningStore } from "@/store/useLearningStore";
import { useLesson, useCourse, useCategories, useProblem } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import {
    ChevronRight,
    RefreshCw,
    Home,
    Loader,
    Sparkles,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ExplanationText, TextContent, DiagramConfig, ProblemContent } from "@/types/learning";
import LessonHeader from "@/components/LessonHeader";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import type { Course, Lesson } from "@/types/lms";
import AuthService from "@/services/auth";
import "katex/dist/katex.min.css";
import ProblemBlock from "@/components/lesson/ProblemBlock";
import TextBlock from "@/components/lesson/TextBlock";
import ImageBlock from "@/components/lesson/ImageBlock";
import VideoBlock from "@/components/lesson/VideoBlock";
import CalculatorProblemBlock from "@/components/lesson/CalculatorProblemBlock";
import { useSoundManager } from "@/hooks/use-sound-effects";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { useGamificationData } from "@/hooks/useGamificationData";
import RewardSequence from "@/components/RewardSequence";
import dynamic from "next/dynamic";

const ShikiCode = dynamic(() => import("@/components/lesson/ShikiCode"), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted rounded-xl h-40 w-full" />,
});

interface ProblemData {
    id: number;
    question_text: string;
    which: string;
    options: { text: string }[];
    correct_answer: { text: string }[];
    explanation?: string;
    diagram_config?: DiagramConfig;
    diagrams?: DiagramConfig[];
    question_type: string;
    img?: string;
    alt?: string;
    content: {
        format?: string;
        type?: string;
    };
}

interface ProblemOptions {
    view?: {
        type: string;
        config: Record<string, unknown>;
    };
}

interface User {
    id: number;
    name: string;
}

// Enhanced Loading Component with smooth animations
const LoadingSpinner = ({
    message,
}: {
    message: string;
}) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8 p-8">
            <Loader className="animate-spin w-16 h-16" />
            <div className="text-center space-y-2">
                <p className="text-gray-700 font-medium text-xl">{message}</p>
            </div>
        </div>
    </div>
);

// Enhanced Error Component
const ErrorCard = ({
    coursePath,
    onRetry,
}: {
    coursePath: string;
    onRetry: () => void;
}) => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-0 transform transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
                <div className="space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <RefreshCw className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Wax cashar ah lama helin
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            waa soo dajin weynay casharka aad dalbatay sababo jira awgood
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            asChild
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            <a
                                href={coursePath}
                                className="flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Ku laabo bogga koorsada
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 gap-2 hover:bg-gray-50"
                            onClick={onRetry}
                        >
                            <RefreshCw className="w-4 h-4" />
                            soo daji markale
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

// Lesson Completion Animation Component
const LessonCompletionAnimation = ({
    onComplete,
}: {
    onComplete: () => void;
}) => {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage(1), 200),
            setTimeout(() => setStage(2), 900),
            setTimeout(() => setStage(3), 1700),
        ];

        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 p-4">
            <div className="text-center space-y-8 max-w-md w-full">
                {/* Decorative sparkles and main icon */}
                <div className="relative">
                    {/* Top sparkles */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <Sparkles className="w-3 h-3 text-purple-300" />
                        </div>
                    </div>

                    {/* Side sparkles */}
                    <div className="absolute top-4 -right-8">
                        <Sparkles className="w-3 h-3 text-purple-300" />
                    </div>
                    <div className="absolute top-8 -left-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>

                    {/* Main diamond icon */}
                    <div
                        className={cn(
                            "transition-all duration-500 ease-out mx-auto",
                            stage >= 1 ? "scale-100 opacity-100" : "scale-90 opacity-0"
                        )}
                    >
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="w-20 h-20 bg-purple-500 transform rotate-45 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-black rounded-sm transform -rotate-45"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lesson complete text */}
                <div
                    className={cn(
                        "transition-all duration-500 ease-out",
                        stage >= 2 ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    )}
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">
                        Cashar baa
                        <br />
                        la Dhammeeyay!
                    </h2>
                </div>

                {/* Continue button */}
                <div
                    className={cn(
                        "transition-all duration-500 ease-out pt-8",
                        stage >= 3 ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    )}
                >
                    <Button onClick={onComplete} className="w-full rounded-md">
                        Sii wado
                    </Button>
                </div>
            </div>
        </div>
    );
};

export function LessonDetailClient() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        answerState,
        currentLesson: storeLesson,
        setLesson: setCurrentLesson,
        resetAnswerState,
        isLoading: storeLoading
    } = useLearningStore();

    // useLesson hook
    const { lesson: swrLesson, isLoading: lessonLoading, isError: lessonError } = useLesson(params.lessonId as string);
    const currentLesson = swrLesson || storeLesson;
    const isLoading = lessonLoading || storeLoading;

    // useCourse for breadcrumbs/info
    const { course: currentCourse } = useCourse(params.categoryId as string, params.courseSlug as string);

    // Breadcrumbs courses (already handled by useCategories in useApi if needed, 
    // but breadcrumbs often need all categories/courses)
    const { categories } = useCategories();
    const courses = useMemo(() => {
        return categories?.flatMap(cat => cat.courses || []);
    }, [categories]);

    // Local state
    const [mounted, setMounted] = useState(false);
    const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [explanationData, setExplanationData] = useState<{
        explanation: string | ExplanationText;
        image: string;
        type: string;
    }>({
        explanation: "",
        image: "",
        type: "",
    });
    const [navigating, setNavigating] = useState(false);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | string[] | null>(null);
    const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
    const [hasPlayedStartSound, setHasPlayedStartSound] = useState(false);
    const [problems, setProblems] = useState<ProblemContent[]>([]);
    const [problemLoading, setProblemLoading] = useState(false);
    const [currentXp, setCurrentXp] = useState(10);

    const { streak, leaderboard, mutateAll } = useGamificationData();

    const { playSound } = useSoundManager();
    const continueRef = useRef<() => void>(() => { });

    const coursePath = useMemo(
        () => `/courses/${params.categoryId}/${params.courseSlug}`,
        [params]
    );

    const courseIdFromSlug = useMemo(() => {
        if (!courses || !params.courseSlug || !params.categoryId) return null;
        // The course might have category as an object or just an ID
        const foundCourse = courses.find(
            (course: Course) => {
                const categoryMatch = String(course.category_id) === String(params.categoryId) ||
                    String((course as any).category) === String(params.categoryId);
                return course.slug === params.courseSlug && categoryMatch;
            }
        );
        return foundCourse?.id || null;
    }, [courses, params.courseSlug, params.categoryId]);

    const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);

    // Fetch course lessons
    useEffect(() => {
        const fetchCourseLessons = async () => {
            if (!courseIdFromSlug) return;

            try {
                // Ensure we only fetch for the current course
                const response = await fetch(
                    `${API_BASE_URL}/api/lms/lessons/?course=${courseIdFromSlug}`
                );
                if (!response.ok) throw new Error('Failed to fetch lessons');

                const lessons = await response.json();
                setCourseLessons(lessons);
            } catch (error) {
                console.error('Error fetching course lessons:', error);
            }
        };

        fetchCourseLessons();
    }, [courseIdFromSlug]);


    // Check if lesson is in review mode
    const isReviewMode = useMemo(() => {
        // Check URL parameter first
        const reviewParam = searchParams.get('review');
        if (reviewParam === 'true') return true;

        // Check if lesson is completed (fallback method)
        if (currentLesson?.id) {
            try {
                const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
                return completed.includes(currentLesson.id);
            } catch {
                return false;
            }
        }
        return false;
    }, [searchParams, currentLesson?.id]);


    const sortedBlocks = useMemo(() => {
        if (!currentLesson?.content_blocks || !Array.isArray(currentLesson.content_blocks)) return [];
        return [...currentLesson.content_blocks]
            .filter((b) => !(b.block_type === "problem" && !b.problem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [currentLesson?.content_blocks]);

    // Current problem derived from problems state and current block
    const currentProblem = useMemo(() => {
        if (!problems || (problems?.length || 0) === 0) return null;
        const problemId = sortedBlocks[currentBlockIndex]?.problem;
        return problems.find(p => p.id === problemId) || problems[0];
    }, [problems, sortedBlocks, currentBlockIndex]);

    // Memoized derived values
    const currentProblemBlock = useMemo(() => {
        if (!sortedBlocks) return null;
        return sortedBlocks[currentBlockIndex]?.block_type === 'problem' ? sortedBlocks[currentBlockIndex] : null;
    }, [sortedBlocks, currentBlockIndex]);


    // Reset state when block changes
    useEffect(() => {
        setSelectedOption(null);
        setDisabledOptions([]);
    }, [currentBlockIndex]);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync lesson to Zustand for other components
    useEffect(() => {
        if (swrLesson) {
            setCurrentLesson(swrLesson as any);
        }
    }, [swrLesson, setCurrentLesson]);


    // Play start lesson sound when lesson is loaded and ready
    useEffect(() => {
        if (currentLesson && !isLoading && (sortedBlocks?.length || 0) > 0 && !hasPlayedStartSound) {
            playSound("start-lesson");
            setHasPlayedStartSound(true);
        }
    }, [currentLesson, isLoading, sortedBlocks?.length, playSound, hasPlayedStartSound]);

    // Use derived indices for problems

    // Fetch all problems
    const fetchAllProblems = useCallback(async () => {
        if (!currentLesson?.content_blocks || !Array.isArray(currentLesson.content_blocks)) {
            setProblems([]);
            return;
        }

        const problemBlocks = (sortedBlocks || []).filter(
            (b) => b.block_type === "problem" && b.problem !== null && b.problem !== undefined
        );

        if (problemBlocks.length === 0) {
            setProblems([]);
            setProblemLoading(false);
            return;
        }

        setProblemLoading(true);

        try {
            // Fetch all problems with individual error handling
            const fetchPromises = problemBlocks.map(async (block) => {
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/api/lms/problems/${block.problem}/`
                    );

                    if (!response.ok) {
                        console.error(`Failed to fetch problem ${block.problem}: ${response.status} ${response.statusText}`);
                        return null;
                    }

                    return await response.json();
                } catch (err) {
                    console.error(`Error fetching problem ${block.problem}:`, err);
                    return null;
                }
            });

            const datas = await Promise.all(fetchPromises);

            // Filter out null responses (failed fetches)
            const validDatas = datas.filter((data): data is ProblemData => data !== null);

            if (validDatas.length === 0) {
                throw new Error("No valid problems could be loaded");
            }

            const transformed: ProblemContent[] = validDatas.map((pd: ProblemData) => ({
                id: pd.id,
                question: pd.question_text,
                which: pd.which,
                options: Array.isArray(pd.options)
                    ? pd.options.map((opt: any) => typeof opt === 'string' ? opt : opt.text)
                    : [],
                correct_answer: Array.isArray(pd.correct_answer)
                    ? pd.correct_answer.map((ans: any, index: number) => ({
                        id: `answer-${ans.id || index}`,
                        text: ans.text || "",
                    }))
                    : [],
                img: pd.img,
                alt: pd.alt,
                explanation: pd.explanation || "No explanation available",
                diagram_config: pd.diagram_config,
                diagrams: pd.diagrams,
                question_type: ["code", "mcq", "short_input", "diagram", "matching", "multiple_choice", "single_choice", "calculator"].includes(
                    pd.question_type
                )
                    ? (pd.question_type as any)
                    : pd.question_type,
                content: pd.content,
                xp: pd.xp || pd.points || pd.xp_value,
                points: pd.points || pd.xp || pd.xp_value,
            }));

            setProblems(transformed);

            if (transformed.length > 0) {
                setExplanationData({
                    explanation: transformed[0]?.explanation || "",
                    image: "",
                    type: transformed[0]?.content?.type || "",
                });
            }

            setError(null);
        } catch (err: unknown) {
            console.error("Error fetching problems:", err);
            setError(
                (err instanceof Error ? err.message : String(err)) ||
                "Failed to load problems"
            );
        } finally {
            setProblemLoading(false);
        }
    }, [currentLesson, sortedBlocks]);

    useEffect(() => {
        fetchAllProblems();
    }, [fetchAllProblems]);

    // Progress management
    useEffect(() => {
        if (currentLesson?.id) {
            const storageKey = `lesson_progress_${currentLesson.id}`;

            // If in review mode, start from the beginning
            if (isReviewMode) {
                setCurrentBlockIndex(0);
                // Clear any saved progress for this lesson
                localStorage.removeItem(storageKey);
                return;
            }

            // Otherwise, load saved progress
            const savedProgress = localStorage.getItem(storageKey);
            if (savedProgress) {
                try {
                    const { blockIndex } = JSON.parse(savedProgress);
                    if (
                        blockIndex >= 0 &&
                        blockIndex >= 0 &&
                        blockIndex < (sortedBlocks?.length || 0)
                    ) {
                        setCurrentBlockIndex(blockIndex);
                    }
                } catch (e) {
                    console.error("Error parsing saved lesson progress:", e);
                }
            }
        }
    }, [currentLesson?.id, sortedBlocks, isReviewMode]);

    useEffect(() => {
        if (currentLesson?.id && currentBlockIndex >= 0) {
            const storageKey = `lesson_progress_${currentLesson.id}`;
            localStorage.setItem(
                storageKey,
                JSON.stringify({
                    blockIndex: currentBlockIndex,
                    timestamp: new Date().toISOString(),
                })
            );
        }
    }, [currentLesson?.id, currentBlockIndex]);

    useEffect(() => {
        if (currentProblem) {
            setExplanationData({
                explanation: currentProblem.explanation || "",
                image: "",
                type: currentProblem.content.type || "",
            });
        }
    }, [currentProblem]);

    // Event handlers
    const handleOptionSelect = useCallback(
        (option: string | string[]) => {
            setShowFeedback(false);
            resetAnswerState();
            setSelectedOption(option);
        },
        [resetAnswerState]
    );

    const handleContinue = useCallback(async () => {
        if ((sortedBlocks?.length || 0) === 0) return;

        const lastIndex = (sortedBlocks?.length || 0) - 1;
        const isLastBlock = currentBlockIndex === lastIndex;

        playSound("continue");
        window.scrollTo({ top: 0, behavior: "instant" });
        setShowFeedback(false);

        if (!isLastBlock) {
            setCurrentBlockIndex((i) => Math.min(i + 1, lastIndex));
            return;
        }

        // Handle completion with animation
        setShowCompletionAnimation(true);

        if (currentLesson?.id) {
            try {
                const done = JSON.parse(
                    localStorage.getItem("completedLessons") || "[]"
                );
                if (!done.includes(currentLesson.id)) {
                    done.push(currentLesson.id);
                    localStorage.setItem("completedLessons", JSON.stringify(done));
                }
            } catch (err) {
                console.error("LocalStorage error", err);
            }

            try {
                const completedProblemIds = sortedBlocks
                    .filter((b) => b.block_type === "problem" && b.problem)
                    .map((b) => b.problem);

                await AuthService.getInstance().makeAuthenticatedRequest(
                    "post",
                    `/api/lms/lessons/${currentLesson.id}/complete/`,
                    {
                        completed_problems: completedProblemIds,
                        score: isCorrect ? 100 : 0,
                    }
                );
                // Refresh gamification data after completion
                mutateAll();
            } catch (err) {
                console.error("Completion error", err);
            }
        }
    }, [
        currentBlockIndex,
        isCorrect,
        playSound,
        sortedBlocks,
        currentLesson?.id,
        mutateAll,
    ]);

    const handleCompletionAnimationFinish = useCallback(() => {
        setShowCompletionAnimation(false);
        setNavigating(true);

        // Find next lesson info to pass as hint for highlighting
        const sortedLessons = [...courseLessons].sort((a, b) => (a.order || 0) - (b.order || 0));
        const currentIdx = sortedLessons.findIndex(l => l.id === currentLesson?.id);
        const nextLesson = currentIdx !== -1 && currentIdx < sortedLessons.length - 1 ? sortedLessons[currentIdx + 1] : null;

        const queryParam = nextLesson ? `?nextLessonId=${nextLesson.id}` : "";
        router.push(`${coursePath}${queryParam}`);
    }, [router, coursePath, courseLessons, currentLesson?.id]);

    useEffect(() => {
        continueRef.current = handleContinue;
    }, [handleContinue]);

    const handleCheckAnswer = useCallback(() => {
        if (!selectedOption || !currentProblem) return;

        let isCorrect = false;

        // Normalize selectedOption to array for comparison
        const userSelections = Array.isArray(selectedOption) ? selectedOption : [selectedOption];

        if (selectedOption === "matching_success" || (Array.isArray(selectedOption) && selectedOption[0] === "matching_success")) {
            isCorrect = true;
        } else if (currentProblem.question_type === "short_input") {
            const correctAnswers = currentProblem.correct_answer?.map((ans) => ans.text.toLowerCase().trim()) || [];
            isCorrect = correctAnswers.includes(userSelections[0].toLowerCase().trim());
        } else if (currentProblem.question_type === "multiple_choice") {
            // For multiple choice, check if all selected options match the correct answers
            const correctIds = new Set(currentProblem.correct_answer?.map((ans) => ans.text) || []);
            const userIds = new Set(userSelections);

            // Exact match: same size and all elements match
            isCorrect = correctIds.size === userIds.size &&
                [...correctIds].every(id => userIds.has(id));
        } else {
            // For single choice and other types
            const correctAnswer = currentProblem.correct_answer?.map((ans) => ans.text);
            isCorrect = correctAnswer?.includes(userSelections[0]) || false;
        }

        if (isCorrect) {
            setCurrentXp(currentProblem.xp || currentProblem.points || 10);
        }

        setIsCorrect(isCorrect);
        setShowFeedback(true);
        playSound(isCorrect ? "correct" : "incorrect");

        if (!isCorrect && currentProblem.question_type !== "short_input") {
            // For single choice, disable the incorrect option
            if (!Array.isArray(selectedOption)) {
                setDisabledOptions((prev) => [...prev, selectedOption]);
                setSelectedOption(null);
            }
            // For multiple choice, we don't disable options, just reset
        }
    }, [selectedOption, currentProblem, playSound]);

    const handleResetAnswer = useCallback(() => {
        resetAnswerState();
        setShowFeedback(false);
        setSelectedOption(null);
    }, [resetAnswerState]);

    const handleRetry = useCallback(() => {
        router.refresh();
    }, [router]);

    // Auto-dismiss feedback after 20s if incorrect
    useEffect(() => {
        if (showFeedback && !isCorrect) {
            const timer = setTimeout(() => {
                handleResetAnswer();
            }, 20000);
            return () => clearTimeout(timer);
        }
    }, [showFeedback, isCorrect, handleResetAnswer]);

    // Block rendering
    const renderBlock = useCallback((block: any, index: number) => {
        if (!block) return null;
        const isLastBlock = index === (sortedBlocks?.length || 0) - 1;

        switch (block.block_type) {
            case "problem":
            case "diagram":
                return (
                    <ProblemBlock
                        problemId={block.problem}
                        content={typeof block.content === 'string' ? JSON.parse(block.content) : block.content}
                        onContinue={handleContinue}
                        selectedOption={index === currentBlockIndex ? selectedOption : null}
                        answerState={index === currentBlockIndex ? answerState : { isCorrect: true, showAnswer: true, lastAttempt: null }}
                        onOptionSelect={handleOptionSelect}
                        onCheckAnswer={handleCheckAnswer}
                        isLoading={isLoading}
                        error={error}
                        isCorrect={index === currentBlockIndex ? isCorrect : true}
                        isLastInLesson={isLastBlock}
                        disabledOptions={index === currentBlockIndex ? disabledOptions : []}
                    />
                );

            case "text":
            case "list":
            case "table":
            case "table-grid":
                let textContent =
                    typeof block.content === "string"
                        ? (JSON.parse(block.content) as TextContent)
                        : (block.content as TextContent);

                // Create a copy to avoid mutation error if object is frozen
                textContent = { ...textContent };

                // Add type to content if not present for correct internal TextBlock rendering
                if (!textContent.type) {
                    textContent.type = block.block_type as any;
                }

                return (
                    <TextBlock
                        content={textContent}
                        onContinue={handleContinue}
                        isLastBlock={isLastBlock}
                    />
                );

            case "image":
                const imageContent =
                    typeof block.content === "string"
                        ? JSON.parse(block.content)
                        : block.content;

                return (
                    <ImageBlock
                        content={imageContent}
                        onContinue={handleContinue}
                        isLastBlock={isLastBlock}
                    />
                );

            case "video":
                const videoContent =
                    typeof block.content === "string"
                        ? JSON.parse(block.content)
                        : block.content;

                return (
                    <VideoBlock
                        content={videoContent}
                        onContinue={handleContinue}
                        isLastBlock={isLastBlock}
                    />
                );

            case "code":
                const codeContent = typeof block.content === 'string' ? JSON.parse(block.content) : block.content;
                return (
                    <div className="max-w-3xl mx-auto px-4 space-y-4">
                        <div className="bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                            <ShikiCode code={codeContent.code || ""} language={codeContent.language || "javascript"} />
                        </div>
                        {codeContent.explanation && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    {codeContent.explanation}
                                </p>
                            </div>
                        )}
                        <Button onClick={handleContinue} className="w-full h-12 rounded-xl font-bold">
                            {isLastBlock ? "Dhamee" : "Sii wado"}
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                );

            case "example":
                const exampleContent = typeof block.content === 'string' ? JSON.parse(block.content) : block.content;
                return (
                    <div className="max-w-2xl mx-auto px-4">
                        <div className="bg-amber-50/50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 rounded-3xl p-8 space-y-4">
                            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest text-xs">
                                <Sparkles className="w-4 h-4" />
                                Tusaale
                            </div>
                            <TextBlock
                                content={{ ...exampleContent, type: 'text' }}
                                onContinue={handleContinue}
                                isLastBlock={isLastBlock}
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="max-w-2xl mx-auto px-4">
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                            <CardContent className="p-8 text-center">
                                <p className="text-gray-600 text-lg">
                                    Nooca waxyaabahan weli lama taageerayo.
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-center pb-8">
                                <Button
                                    onClick={handleContinue}
                                    className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    Continue
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                );
        }
    }, [
        sortedBlocks,
        currentBlockIndex,
        problems,
        handleContinue,
        selectedOption,
        answerState,
        handleOptionSelect,
        handleCheckAnswer,
        problemLoading,
        error,
        currentProblem,
        isCorrect,
        disabledOptions,
    ]);



    // Loading state
    if (isLoading) {
        return <LoadingSpinner message="soo dajinaya casharada..." />;
    }

    // No lesson found or no content
    if (!currentLesson || (sortedBlocks?.length || 0) === 0) {
        if (!isLoading) {
            return <ErrorCard coursePath={coursePath} onRetry={handleRetry} />;
        }
        return <LoadingSpinner message="soo dajinaya casharada..." />;
    }

    if (showCompletionAnimation) {
        const sortedLessons = [...courseLessons].sort((a, b) => (a.order || 0) - (b.order || 0));
        const isLastLessonOfCourse = sortedLessons.length > 0 &&
            sortedLessons[sortedLessons.length - 1].id === currentLesson?.id;

        return (
            <RewardSequence
                streak={streak}
                leaderboard={leaderboard}
                completedLesson={currentLesson?.title || ""}
                courseTitle={currentCourse?.title}
                isCourseComplete={isLastLessonOfCourse}
                onContinue={handleCompletionAnimationFinish}
                onBack={() => router.push(coursePath)}
            />
        );
    }

    // Show navigating state
    if (navigating) {
        return <LoadingSpinner message="ku laabanaya koordooyinka..." />;
    }

    // Render the main lesson page
    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background">
            <LessonHeader
                currentQuestion={currentBlockIndex + 1}
                totalQuestions={sortedBlocks?.length || 0}
                coursePath={coursePath}
                onDotClick={(blockIndex) => setCurrentBlockIndex(blockIndex)}
                completedLessons={[]}
            />

            <main className="pt-20 pb-32">
                <div className="container mx-auto">
                    {/* Review Mode Indicator */}
                    {isReviewMode && (
                        <div className="max-w-2xl mx-auto px-4 mb-4">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-400 text-sm font-bold">
                                    Muraajacee - Casharkan waa la dhammeeyay, waxaad ku celcelaysaa
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center w-full overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentBlockIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0 }}
                                className="w-full"
                            >
                                {renderBlock(sortedBlocks[currentBlockIndex], currentBlockIndex)}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {showFeedback && (
                <AnswerFeedback
                    isCorrect={isCorrect}
                    currentLesson={currentLesson as any}
                    onResetAnswer={handleResetAnswer}
                    onContinue={handleContinue}
                    explanationData={explanationData}
                    xp={currentXp}
                />
            )}
        </div>
    );
};


