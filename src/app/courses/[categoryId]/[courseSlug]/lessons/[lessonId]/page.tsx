"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import type { RootState, AppDispatch } from "@/store";
import { fetchLesson, resetAnswerState } from "@/store/features/learningSlice";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  RefreshCw,
  Home,
  Loader,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ExplanationText, TextContent } from "@/types/learning";
import LessonHeader from "@/components/LessonHeader";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import type { Course } from "@/types/lms";
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
import RewardSequence from "@/components/Reward";

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
  xp?: number;
  xp_value?: number;
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
  points?: number;
  xp?: number;
  xp_value?: number;
}

interface ProblemOptions {
  view?: {
    type: string;
    config: Record<string, unknown>;
  };
}

interface DailyActivity {
  date: string;
  day: string;
  status: "complete" | "none";
  problems_solved: number;
  lesson_ids: number[];
  isToday: boolean;
}

interface StreakData {
  userId: string;
  username: string;
  current_streak: number;
  max_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  energy: {
    current: number;
    max: number;
    next_update: string;
  };
  dailyActivity: DailyActivity[];
  xp: number;
  daily_xp: number;
}

interface User {
  id: number;
  name: string;
}

interface Standing {
  rank: number;
  user: User;
  points: number;
  streak: number;
}

interface LeaderboardData {
  time_period: string;
  league: string;
  standings: Standing[];
  my_standing: {
    rank: number;
    points: number;
    streak: number;
  };
}

// SWR fetchers
const publicFetcher = async <T = unknown>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  return response.json();
};

const authFetcher = async <T = unknown>(
  url: string,
  method: "get" | "post" = "get",
  body?: Record<string, unknown>
): Promise<T> => {
  const service = AuthService.getInstance();
  return service.makeAuthenticatedRequest(method, url, body);
};

const streakFetcher = async <T = unknown>(url: string): Promise<T> => {
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
  totalXp,
}: {
  onComplete: () => void;
  totalXp: number;
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
              <Sparkles className="w-4 h-4 text-green-400" />
              <Sparkles className="w-3 h-3 text-green-300" />
            </div>
          </div>

          {/* Side sparkles */}
          <div className="absolute top-4 -right-8">
            <Sparkles className="w-3 h-3 text-green-300" />
          </div>
          <div className="absolute top-8 -left-6">
            <Sparkles className="w-4 h-4 text-green-400" />
          </div>

          {/* Main diamond icon */}
          <div
            className={cn(
              "transition-all duration-500 ease-out mx-auto",
              stage >= 1 ? "scale-100 opacity-100" : "scale-90 opacity-0"
            )}
          >
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 bg-green-500 transform rotate-45 rounded-lg flex items-center justify-center">
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

        {/* XP display */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            stage >= 2 ? "scale-100 opacity-100" : "scale-90 opacity-0"
          )}
        >
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
            Dhibcaha Guud
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-4xl font-bold text-gray-800">{totalXp}</span>
            <Sparkles className="w-6 h-6 text-green-500" />
          </div>
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
  const [xp, setXp] = useState<number>();
  const [totalXp, setTotalXp] = useState<number>();

  const { playSound } = useSoundManager();
  const continueRef = useRef<() => void>(() => { });

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
    isLoading: isLeagueLoading,
    mutate: refreshLeagueData,
  } = useSWR<LeaderboardData>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/league/leagues/status/`,
    streakFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onSuccess: () => {
        setLeagueId(Number(1));
      },
    }
  );

  const {
    data: leagueLeaderboard,
    isLoading: isLeaderboardLoading,
    mutate: refreshLeaderboardData,
  } = useSWR<LeaderboardData>(
    `${process.env.NEXT_PUBLIC_API_URL
    }/api/league/leagues/leaderboard/?time_period=weekly&league=${leagueId ?? 1
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
        // setLoadingProgress((prev) => {
        //   if (prev >= 90) return prev;
        //   return prev + Math.random() * 10;
        // });
      }, 200);

      return () => clearInterval(interval);
    } else {
      // setLoadingProgress(100);
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
      // setCourseId(String(courseIdFromSlug));
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

      const transformed: ProblemContent[] = datas.map((pd: ProblemData & { xp?: number }) => ({
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
        points: pd.xp,
        xp: pd.xp,
        xp_value: pd.xp_value,
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

    if (block.block_type === "problem") {
      const totalPoints = sortedBlocks
        .filter((b) => b.block_type === "problem")
        .reduce((sum, block) => {
          const points =
            typeof block.content === "object" &&
              block.content !== null &&
              "points" in block.content
              ? (block.content as { points?: number }).points || 0
              : 0;
          return sum + points;
        }, 0);

      setTotalXp(totalPoints);

      // Get the current problem's XP value
      const currentProblem = problems.find(p => p.id === block.problem);
      if (currentProblem) {
        const experience = currentProblem.xp || currentProblem.xp_value || 0;
        setXp(experience);
      }
    }

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
    return <LoadingSpinner message="soo dajinaya casharada..." />;
  }

  // No lesson found
  if (!currentLesson) {
    return <ErrorCard coursePath={coursePath} onRetry={handleRetry} />;
  }

  if (showCompletionAnimation) {
    return (
      <LessonCompletionAnimation
        onComplete={handleCompletionAnimationFinish}
        totalXp={totalXp ?? 0}
      />
    );
  }

  // Show rewards after completion
  if (showRewards) {
    if (isStreakLoading || isLeagueLoading || isLeaderboardLoading) {
      return (
        <LoadingSpinner
          message="soo dajinaya abaalmarinaada..."
        />
      );
    }

    if (streakData && leagueLeaderboard) {
      return (
        <RewardSequence
          onContinue={handleContinueAfterRewards}
          streak={streakData}
          leaderboard={leagueLeaderboard}
          completedLesson={currentLesson.title}
        />
      );
    }

    return null;
  }

  // Show navigating state
  if (navigating) {
    return <LoadingSpinner message="ku laabanaya koordooyinka..." />;
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
          xp={xp ?? 0}
          explanationData={explanationData}
        />
      )}
    </div>
  );
};

export default LessonPage;
