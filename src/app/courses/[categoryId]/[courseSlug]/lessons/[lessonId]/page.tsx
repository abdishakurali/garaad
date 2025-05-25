"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import type { RootState, AppDispatch } from "@/store";
import { fetchLesson, resetAnswerState } from "@/store/features/learningSlice";
import { Button } from "@/components/ui/button";
import { ChevronRight, RefreshCw, Home, CheckCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ExplanationText, TextContent } from "@/types/learning";
import LessonHeader from "@/components/LessonHeader";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import type { Course } from "@/types/lms";
import EnhancedRewardDisplay from "@/components/Reward";
import ShareLesson from "@/components/ShareLesson";
import AuthService from "@/services/auth";
import "katex/dist/katex.min.css";
import ProblemBlock from "@/components/lesson/ProblemBlock";
import TextBlock from "@/components/lesson/TextBlock";
import ImageBlock from "@/components/lesson/ImageBlock";
import VideoBlock from "@/components/lesson/VideoBlock";
import CalculatorProblemBlock from "@/components/lesson/CalculatorProblemBlock";
import { useSoundManager } from "@/hooks/use-sound-effects";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import RewardDisplay from "@/components/Reward";

// Types and Interfaces
type Position = "left" | "center" | "right";
type Orientation = "vertical" | "horizontal" | "none";

interface DiagramObject {
  type: string;
  color: string;
  number: number;
  position: Position;
  orientation: Orientation;
  weight_value?: number;
}

interface DiagramConfig {
  diagram_id: number;
  diagram_type: string;
  scale_weight: number;
  objects: DiagramObject[];
}

interface ProblemData {
  id: number;
  question_text: string;
  which: string;
  options: { text: string }[];
  correct_answer: { text: string }[];
  explanation?: string;
  diagram_config?: DiagramConfig;
  question_type: string;
  img?: string;
  alt?: string;
  content: {
    format?: string;
    type?: string;
  };
}

export interface ProblemContent {
  id: number;
  question: string;
  which: string;
  options: string[];
  correct_answer: { id: string; text: string }[];
  explanation?: string;
  diagram_config?: DiagramConfig;
  question_type?:
    | "code"
    | "mcq"
    | "short_input"
    | "diagram"
    | "multiple_choice";
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

interface Energy {
  current: number;
  max: number;
  next_update: string;
}

interface DailyActivity {
  date: string;
  day: string;
  status: "none" | "partial" | "complete";
  problems_solved: number;
  lesson_ids: string[];
  isToday: boolean;
}

interface StreakData {
  userId: string;
  username: string;
  current_streak: number;
  max_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  energy: Energy;
  dailyActivity: DailyActivity[];
  xp: number;
  daily_xp: number;
}

interface LeagueData {
  current_league: {
    id: string;
    name: string;
    min_xp: number;
  };
  current_points: number;
  weekly_rank: number;
  streak: {
    current_streak: number;
    max_streak: number;
    streak_charges: number;
    last_activity_date: string;
  };
  next_league: {
    id: string;
    name: string;
    min_xp: number;
    points_needed: number;
  };
}

interface LeagueLeaderboardData {
  time_period: string;
  league: string;
  standings: Array<{
    rank: number;
    user: {
      id: string;
      name: string;
    };
    points: number;
    streak: number;
  }>;
  my_standing: {
    rank: number;
    points: number;
    streak: number;
  };
}

interface UserReward {
  id: number;
  user: number;
  reward_type: string;
  reward_name: string;
  value: number;
  awarded_at: string;
}

// SWR fetchers
const publicFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  return response.json();
};

const authFetcher = async (
  url: string,
  method: "get" | "post" = "get",
  body?: Record<string, unknown>
): Promise<any> => {
  const service = AuthService.getInstance();
  return service.makeAuthenticatedRequest(method, url, body);
};

const streakFetcher = async (url: string): Promise<any> => {
  const authService = AuthService.getInstance();
  const token = authService.getToken();

  if (!token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Enhanced Loading Component with smooth animations
const LoadingSpinner = ({
  message,
  progress,
}: {
  message: string;
  progress?: number;
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600"></div>
        <div
          className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-blue-400 animate-spin"
          style={{ animationDelay: "0.1s", animationDuration: "1.5s" }}
        ></div>
        <div
          className="absolute inset-2 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin"
          style={{ animationDelay: "0.2s", animationDuration: "2s" }}
        ></div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-gray-700 font-medium text-xl">{message}</p>
        {progress !== undefined && (
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
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
              Lesson Not Found
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We couldn't load the requested lesson. Please check your
              connection and try again.
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
                Return to Course
              </a>
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 hover:bg-gray-50"
              onClick={onRetry}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
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
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center z-50">
      <div className="text-center text-white space-y-8">
        <div
          className={cn(
            "transform transition-all duration-1000",
            stage >= 1 ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}
        >
          <CheckCircle className="w-24 h-24 mx-auto mb-4" />
          <h2 className="text-4xl font-bold">Casharku waa dhamaaday!</h2>
        </div>

        <div
          className={cn(
            "transform transition-all duration-1000 delay-500",
            stage >= 2 ? "scale-100 opacity-100" : "scale-50 opacity-0"
          )}
        >
          <p className="text-xl">Shaqo Wacan! Nala Arag abaalmarinadaada...</p>
        </div>
      </div>
    </div>
  );
};

const LessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { answerState, currentLesson } = useSelector(
    (state: RootState) => state.learning
  );
  const isLoading = useSelector((state: RootState) => state.learning.isLoading);

  // Local state
  const [courseId, setCourseId] = useState("");
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [problemLoading, setProblemLoading] = useState(true);
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
  const [problems, setProblems] = useState<ProblemContent[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentBlock, setCurrentBlock] = useState<React.ReactNode>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [leagueId, setLeagueId] = useState<number>();
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { playSound } = useSoundManager();
  const continueRef = useRef<() => void>(() => {});

  // SWR hooks for data fetching
  const { data: courses } = useSWR<Course[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/`,
    publicFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  const {
    data: streakData,
    error: streakError,
    isLoading: isStreakLoading,
    mutate: refreshStreakData,
  } = useSWR<StreakData>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/streaks/`,
    streakFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  const {
    data: league,
    error: leagueError,
    isLoading: isLeagueLoading,
    mutate: refreshLeagueData,
  } = useSWR<LeagueData>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/league/leagues/status/`,
    streakFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onSuccess: (data) => {
        setLeagueId(Number(data.current_league.id));
      },
    }
  );

  const {
    data: leagueLeaderboard,
    error: leaderboardError,
    isLoading: isLeaderboardLoading,
    mutate: refreshLeaderboardData,
  } = useSWR<LeagueLeaderboardData>(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/league/leagues/leaderboard/?time_period=weekly&league=${
      leagueId ?? 1
    }`,
    streakFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Simulate loading progress
  useEffect(() => {
    if (isStreakLoading || isLeagueLoading || isLeaderboardLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isStreakLoading, isLeagueLoading, isLeaderboardLoading]);

  // Memoized derived values
  const currentProblem = useMemo(() => {
    return problems.length > 0 && currentProblemIndex < problems.length
      ? problems[currentProblemIndex]
      : null;
  }, [problems, currentProblemIndex]);

  const coursePath = useMemo(
    () => `/courses/${params.categoryId}/${params.courseSlug}`,
    [params]
  );

  const sortedBlocks = useMemo(() => {
    if (!currentLesson?.content_blocks) return [];
    return [...currentLesson.content_blocks]
      .filter((b) => !(b.block_type === "problem" && !b.problem))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [currentLesson?.content_blocks]);

  const courseIdFromSlug = useMemo(() => {
    if (!courses || !params.courseSlug) return null;
    const course = courses.find(
      (course: Course) => course.slug === params.courseSlug
    );
    return course?.id || null;
  }, [courses, params.courseSlug]);

  // Update courseId when found
  useEffect(() => {
    if (courseIdFromSlug) {
      setCourseId(String(courseIdFromSlug));
    }
  }, [courseIdFromSlug]);

  // Reset state when block changes
  useEffect(() => {
    setSelectedOption(null);
    setDisabledOptions([]);
  }, [currentBlockIndex]);

  // Fetch lesson data
  useEffect(() => {
    if (params.lessonId) {
      dispatch(fetchLesson(params.lessonId as string));
    }
  }, [dispatch, params.lessonId]);

  // Fetch all problems
  const fetchAllProblems = useCallback(async () => {
    if (!currentLesson?.content_blocks) {
      setProblems([]);
      return;
    }

    const problemBlocks = sortedBlocks.filter(
      (b) => b.block_type === "problem" && b.problem !== null
    );

    if (problemBlocks.length === 0) {
      setProblems([]);
      setProblemLoading(false);
      return;
    }

    setProblemLoading(true);

    try {
      const fetches = problemBlocks.map((block) =>
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lms/problems/${block.problem}/`
        )
      );
      const responses = await Promise.all(fetches);

      responses.forEach((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch problem: ${res.statusText}`);
        }
      });

      const datas = await Promise.all(
        responses.map((r) => r.json() as Promise<ProblemData>)
      );

      const transformed: ProblemContent[] = datas.map((pd: ProblemData) => ({
        id: pd.id,
        question: pd.question_text,
        which: pd.which,
        options: Array.isArray(pd.options)
          ? pd.options.map((opt) => opt.text)
          : pd?.options,
        correct_answer: pd.correct_answer.map((ans, index) => ({
          id: `answer-${index}`,
          text: ans.text,
        })),
        img: pd.img,
        alt: pd.alt,
        explanation: pd.explanation || "No explanation available",
        diagram_config: pd.diagram_config,
        question_type: ["code", "mcq", "short_input", "diagram"].includes(
          pd.question_type
        )
          ? (pd.question_type as "code" | "mcq" | "short_input" | "diagram")
          : undefined,
        content: pd.content,
      }));

      setProblems(transformed);

      if (transformed.length > 0) {
        setExplanationData({
          explanation: transformed[0].explanation || "",
          image: "",
          type: transformed[0].content.type || "",
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
      const savedProgress = localStorage.getItem(storageKey);

      if (savedProgress) {
        try {
          const { blockIndex } = JSON.parse(savedProgress);
          if (
            blockIndex >= 0 &&
            sortedBlocks &&
            blockIndex < sortedBlocks.length
          ) {
            setCurrentBlockIndex(blockIndex);
          }
        } catch (e) {
          console.error("Error parsing saved lesson progress:", e);
        }
      }
    }
  }, [currentLesson?.id, sortedBlocks]);

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
    (option: string) => {
      setShowFeedback(false);
      dispatch(resetAnswerState());
      setSelectedOption(String(option));
      playSound("click");
    },
    [dispatch, playSound]
  );

  const handleContinue = useCallback(async () => {
    if (sortedBlocks.length === 0) return;

    const lastIndex = sortedBlocks.length - 1;
    const isLastBlock = currentBlockIndex === lastIndex;

    playSound("continue");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowFeedback(false);

    if (!isLastBlock) {
      setCurrentBlockIndex((i) => Math.min(i + 1, lastIndex));
      return;
    }

    // Handle completion with animation
    setShowCompletionAnimation(true);
    playSound("click");

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

        await authFetcher(
          `/api/lms/lessons/${currentLesson.id}/complete/`,
          "post",
          {
            completed_problems: completedProblemIds,
            score: isCorrect ? 100 : 0,
          }
        );

        // Refresh data
        await Promise.all([
          refreshStreakData(),
          refreshLeagueData(),
          refreshLeaderboardData(),
        ]);
      } catch (err) {
        console.error("Completion error", err);
        toast({
          title: "Error",
          description: "An error occurred while submitting your progress",
          variant: "destructive",
        });
      }
    }
  }, [
    currentBlockIndex,
    currentLesson,
    isCorrect,
    playSound,
    toast,
    sortedBlocks,
    refreshStreakData,
    refreshLeagueData,
    refreshLeaderboardData,
  ]);

  const handleCompletionAnimationFinish = useCallback(() => {
    setShowCompletionAnimation(false);
    setIsLessonCompleted(true);
    setShowRewards(true);
  }, []);

  useEffect(() => {
    continueRef.current = handleContinue;
  }, [handleContinue]);

  const handleCheckAnswer = useCallback(() => {
    if (!selectedOption || !currentProblem) return;

    const correctAnswer = currentProblem.correct_answer?.map((ans) => ans.text);
    const isCorrect = correctAnswer?.includes(selectedOption) || false;

    setIsCorrect(isCorrect);
    setShowFeedback(true);
    playSound(isCorrect ? "correct" : "incorrect");

    if (!isCorrect) {
      setDisabledOptions((prev) => [...prev, selectedOption]);
      setSelectedOption(null);
    }
  }, [selectedOption, currentProblem, playSound]);

  const handleContinueAfterRewards = useCallback(() => {
    setShowRewards(false);
    setIsLessonCompleted(false);
    setNavigating(true);
    router.push(coursePath);
  }, [router, coursePath]);

  const handleResetAnswer = useCallback(() => {
    dispatch(resetAnswerState());
    setShowFeedback(false);
    setSelectedOption(null);
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    router.refresh();
  }, [router]);

  // Block rendering
  const renderCurrentBlock = useCallback(() => {
    if (!sortedBlocks || sortedBlocks.length === 0) return null;

    const block = sortedBlocks[currentBlockIndex];
    if (!block) return null;

    const isLastBlock = currentBlockIndex === sortedBlocks.length - 1;

    switch (block.block_type) {
      case "problem":
        const problemId = block.problem;
        const problemIndex = problems.findIndex((p) => p.id === problemId);

        if (problemIndex !== -1) {
          const currentProblem = problems[problemIndex];

          if (
            currentProblem.content &&
            currentProblem.content.type === "calculator"
          ) {
            const options = currentProblem.options as unknown as ProblemOptions;
            return (
              <CalculatorProblemBlock
                question={currentProblem.question}
                which={currentProblem?.which}
                view={options?.view}
                onContinue={handleContinue}
              />
            );
          }
          setCurrentProblemIndex(problemIndex);
        }

        return (
          <ProblemBlock
            onContinue={handleContinue}
            selectedOption={selectedOption}
            answerState={answerState}
            onOptionSelect={handleOptionSelect}
            onCheckAnswer={handleCheckAnswer}
            isLoading={problemLoading}
            error={error}
            content={currentProblem}
            isCorrect={isCorrect}
            isLastInLesson={isLastBlock}
            disabledOptions={disabledOptions}
          />
        );

      case "diagram":
        const diagramProblemId = block.problem;
        const diagramProblemIndex = problems.findIndex(
          (p) => p.id === diagramProblemId
        );

        if (diagramProblemIndex !== -1) {
          setCurrentProblemIndex(diagramProblemIndex);
        }

        return (
          <ProblemBlock
            onContinue={handleContinue}
            selectedOption={selectedOption}
            answerState={answerState}
            onOptionSelect={handleOptionSelect}
            onCheckAnswer={handleCheckAnswer}
            isLoading={problemLoading}
            error={error}
            content={currentProblem}
            isCorrect={isCorrect}
            isLastInLesson={isLastBlock}
            disabledOptions={disabledOptions}
          />
        );

      case "text":
        const textContent =
          typeof block.content === "string"
            ? (JSON.parse(block.content) as TextContent)
            : (block.content as TextContent);

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

      default:
        return (
          <div className="max-w-2xl mx-auto px-4">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 text-lg">
                  This content type is not yet supported.
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

  useEffect(() => {
    setCurrentBlock(renderCurrentBlock());
  }, [renderCurrentBlock]);

  const totalQuestions = useMemo(() => {
    return sortedBlocks.length;
  }, [sortedBlocks]);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading lesson content..." />;
  }

  // No lesson found
  if (!currentLesson) {
    return <ErrorCard coursePath={coursePath} onRetry={handleRetry} />;
  }

  // Show completion animation
  if (showCompletionAnimation) {
    return (
      <LessonCompletionAnimation onComplete={handleCompletionAnimationFinish} />
    );
  }

  if (isLessonCompleted) {
    <ShareLesson lessonTitle={currentLesson?.title || "Lesson"} />;
  }

  // Show rewards after completion
  if (showRewards) {
    if (isStreakLoading || isLeagueLoading || isLeaderboardLoading) {
      return (
        <LoadingSpinner
          message="Loading your achievements..."
          progress={loadingProgress}
        />
      );
    }

    // Transform leagueLeaderboard to match LeagueStanding type if it exists
    const leaderboardStanding = leagueLeaderboard
      ? {
          ...leagueLeaderboard,
          league:
            typeof leagueLeaderboard.league === "string"
              ? {
                  id: leagueLeaderboard.league,
                  name: leagueLeaderboard.league,
                }
              : leagueLeaderboard.league,
        }
      : undefined;

    return (
      <RewardDisplay
        onContinue={handleContinueAfterRewards}
        streak={
          streakData
            ? {
                current_streak: streakData.current_streak,
                max_streak: streakData.max_streak,
                problems_solved_today:
                  streakData.dailyActivity?.find((a) => a.isToday)
                    ?.problems_solved ?? 0,
                problems_to_next_streak: streakData.problems_to_next_streak,
                energy: streakData.energy,
              }
            : undefined
        }
        league={league}
        leaderboard={leaderboardStanding}
        rewards={[]}
        lessonTitle={currentLesson?.title || "Lesson"}
      />
    );
  }

  // Show navigating state
  if (navigating) {
    return <LoadingSpinner message="Returning to course..." />;
  }

  // Render the main lesson page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <LessonHeader
        currentQuestion={currentBlockIndex + 1}
        totalQuestions={totalQuestions}
        coursePath={coursePath}
      />

      <main className="pt-20 pb-32 mt-4">
        <div className="container mx-auto transition-all duration-300">
          {currentBlock}
        </div>
      </main>

      {showFeedback && (
        <AnswerFeedback
          isCorrect={isCorrect}
          currentLesson={currentLesson}
          onResetAnswer={handleResetAnswer}
          onContinue={handleContinue}
          explanationData={explanationData}
        />
      )}
    </div>
  );
};

export default LessonPage;
