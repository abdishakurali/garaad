"use client";
import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { RootState, AppDispatch } from "@/store";
import { fetchLesson, resetAnswerState } from "@/store/features/learningSlice";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Scale,
  MinusCircle,
  Check,
  ArrowRight,
  ReplaceIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExplanationText, TextContent } from "@/types/learning";
import LessonHeader from "@/components/LessonHeader";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import { toast } from "sonner";
import type {
  LeaderboardEntry,
  UserRank,
  UserReward,
} from "@/services/progress";
import AuthService from "@/services/auth";
import type { Course } from "@/types/lms";
import RewardComponent from "@/components/RewardComponent";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import ShareLesson from "@/components/ShareLesson";
import {
  useCourseProgress,
  useLeaderboard,
  useRewards,
  useUserRank,
} from "@/hooks/useCompletedLessonFetch";
// import "katex/dist/katex.min.css";
// import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import ProblemBlock from "@/components/lesson/ProblemBlock";
import TextBlock from "@/components/lesson/TextBlock";
import ImageBlock from "@/components/lesson/ImageBlock";
import VideoBlock from "@/components/lesson/VideoBlock";
import SignatureCalculator from "@/components/lesson/SignatureCalculator";
import CalculatorProblemBlock from '@/components/lesson/CalculatorProblemBlock';

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

// Sound manager for better audio handling
const useSoundManager = () => {
  const soundsRef = useRef<Record<string, HTMLAudioElement | null>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sounds = {
        click: new Audio("/sounds/toggle-on.mp3"),
        correct: new Audio("/sounds/correct.mp3"),
        incorrect: new Audio("/sounds/incorrect.mp3"),
        continue: new Audio("/sounds/lightweight-choice.mp3"),
      };

      // Preload all sounds
      Object.entries(sounds).forEach(([key, audio]) => {
        if (audio) {
          audio.preload = "auto";
          audio.load();
          soundsRef.current[key] = audio;
        }
      });

      // Store the current sounds in a variable for cleanup
      const currentSounds = soundsRef.current;

      return () => {
        Object.values(currentSounds).forEach((audio) => {
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
          }
        });
      };
    }
  }, []);

  const playSound = useCallback(
    async (soundName: "click" | "correct" | "incorrect" | "continue") => {
      const audio = soundsRef.current[soundName];
      if (audio) {
        try {
          audio.currentTime = 0;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        } catch (error) {
          console.error(`Error playing ${soundName} sound:`, error);
        }
      }
    },
    []
  );

  return { playSound };
};

// ScaleBalanceInteractive component with improved design
interface ScaleBalanceProblem {
  equation: string;
  steps: string[];
}

interface ScaleBalanceContent {
  type: "scale_balance";
  problems: ScaleBalanceProblem[];
  instructions: string;
  explanation?: string;
  image?: string;
}

const ScaleBalanceInteractive: React.FC<{
  content: ScaleBalanceContent;
  onComplete: () => void;
  onExplanationChange?: (explanation: {
    explanation: string | ExplanationText;
    image: string;
    type: string;
  }) => void;
}> = ({ content, onComplete, onExplanationChange }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);
  const { playSound } = useSoundManager();

  const currentProblem = content.problems[currentProblemIndex];
  const isLastProblem = currentProblemIndex === content.problems.length - 1;

  // Add this effect to notify parent when explanation changes
  useEffect(() => {
    if (onExplanationChange) {
      onExplanationChange({
        explanation: content.explanation || "",
        image: content.image || "",
        type: content.type,
      });
    }
  }, [content.explanation, content.image, onExplanationChange]);

  const handleNextProblem = () => {
    playSound("continue");
    if (!isLastProblem) {
      setCurrentProblemIndex((prev) => prev + 1);
      setCurrentStepIndex(-1);
      setShowSolution(false);
    } else {
      onComplete();
    }
  };

  const handleShowNextStep = () => {
    playSound("click");
    if (currentStepIndex < currentProblem.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setShowSolution(true);
      playSound("correct");
    }
  };

  return (
    <motion.div
      className="space-y-6 max-w-3xl mx-auto"
      initial="hidden"
      animate="visible"
    >
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <CardTitle>Hubi Xallinta</CardTitle>
            </div>
            <Badge variant="outline" className="bg-white">
              Problem {currentProblemIndex + 1} of {content.problems.length}
            </Badge>
          </div>
          <CardDescription>{content.instructions}</CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <motion.div
            className="text-2xl font-semibold text-center py-6 px-4 bg-gray-50 rounded-xl border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={currentProblem.equation}
          >
            {currentProblem.equation}
          </motion.div>

          {currentStepIndex >= 0 && (
            <motion.div
              className="space-y-3 p-4 bg-gray-50 rounded-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="font-medium text-gray-700">Solution Steps:</h4>
              <div className="space-y-2">
                {currentProblem.steps
                  .slice(0, currentStepIndex + 1)
                  .map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 text-sm bg-white p-3 rounded-lg border border-gray-100"
                    >
                      <MinusCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{step}</span>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {showSolution && (
            <motion.div
              className="p-4 rounded-xl bg-green-50 border border-green-100"
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-green-700 font-medium">Solution Complete!</p>
              </div>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 p-2 border-t border-gray-100 flex justify-start">
          {!showSolution ? (
            <Button
              onClick={handleShowNextStep}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {currentStepIndex === -1 ? "Bilow xallinta" : "Aad Qaybta kale"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNextProblem}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isLastProblem ? "Dhamaystir" : "Aad Qaybta kale"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const LessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { answerState, currentLesson } = useSelector(
    (state: RootState) => state.learning
  );
  const isLoading = useSelector((state: RootState) => state.learning.isLoading);
  const [courseId, setCourseId] = useState("");
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
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
  const { playSound } = useSoundManager();
  const continueRef = useRef<() => void>(() => { });
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  // 1. Add a new state to track whether to show the share component
  const [showShareComponent, setShowShareComponent] = useState(false);

  // State for all problems and current problem
  const [problems, setProblems] = useState<ProblemContent[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentBlock, setCurrentBlock] = useState<React.ReactNode>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

  const {
    data: rewards,
    mutate: mutateRewards,
    isLoading: isLoadingRewards,
  } = useRewards(currentLesson?.id) as {
    data: UserReward[];
    mutate: () => void;
    isLoading: boolean;
  };

  const {
    data: leaderboard,
    mutate: mutateLeaderboard,
    isLoading: isLoadingLeaderboard,
  } = useLeaderboard() as {
    data: LeaderboardEntry[];
    mutate: () => void;
    isLoading: boolean;
  };

  const {
    data: userRank,
    mutate: mutateUserRank,
    isLoading: isLoadingUserRank,
  } = useUserRank() as {
    data: Partial<UserRank>;
    mutate: () => void;
    isLoading: boolean;
  };

  const {
    data: courseProgress,
    mutate: mutateCourseProgress,
    isLoading: isLoadingCourseProgress,
  } = useCourseProgress(courseId);

  // Derived state for current problem
  const currentProblem =
    problems.length > 0 && currentProblemIndex < problems.length
      ? problems[currentProblemIndex]
      : null;

  const coursePath = `/courses/${params.categoryId}/${params.courseSlug}`;

  // Reset state when block changes
  useEffect(() => {
    setSelectedOption(null);
    setDisabledOptions([]);
  }, [currentBlockIndex]);

  const fetchCourseIdFromSlug = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch course ID: ${response.statusText}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return setCourseId(
          data.filter((course: Course) => course.slug === params.courseSlug)[0]
            .id
        ); // Assuming the API returns an array of courses
      }
      throw new Error("Course not found");
    } catch (error) {
      console.error("Error fetching course ID:", error);
      return null;
    }
  };

  // Fetch lesson data
  useEffect(() => {
    if (params.lessonId) {
      dispatch(fetchLesson(params.lessonId as string));
    }
  }, [dispatch, params.lessonId]);

  useEffect(() => {
    fetchCourseIdFromSlug();
  }, [params.courseSlug]);

  // Fetch all problems for the lesson
  useEffect(() => {
    const fetchAllProblems = async () => {
      if (!currentLesson?.content_blocks) {
        setProblems([]);
        return;
      }

      // Sort and filter all problem blocks
      const sortedBlocks = [...(currentLesson?.content_blocks || [])]
        .filter((b) => !(b.block_type === "problem" && !b.problem))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

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
        // Kick off all fetches in parallel
        const fetches = problemBlocks.map((block) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/lms/problems/${block.problem}/`
          )
        );
        const responses = await Promise.all(fetches);

        // Check for errors
        responses.forEach((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch problem: ${res.statusText}`);
          }
        });

        // Parse JSON bodies in parallel
        const datas = await Promise.all(
          responses.map((r) => r.json() as Promise<ProblemData>)
        );
        console.log(datas);
        // Transform into your shape
        const transformed: ProblemContent[] = datas.map((pd: ProblemData) => ({
          id: pd.id,
          question: pd.question_text,
          which: pd.which,
          options: Array.isArray(pd.options) ? pd.options.map((opt) => opt.text) : [],
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
          type: pd.content.type,
        }));
        // Update state with new data
        setProblems(transformed);

        // Set initial explanation data
        if (transformed.length > 0) {
          setExplanationData({
            explanation: transformed[0].explanation || "",
            image: "", // Set image if available in your data
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
    };

    fetchAllProblems();
  }, [currentLesson]);

  // Save and restore lesson progress using localStorage
  useEffect(() => {
    // When component mounts, try to restore progress from localStorage
    if (currentLesson?.id) {
      const storageKey = `lesson_progress_${currentLesson.id}`;
      const savedProgress = localStorage.getItem(storageKey);

      if (savedProgress) {
        try {
          const { blockIndex } = JSON.parse(savedProgress);
          // Only restore if the saved block index is valid
          if (
            blockIndex >= 0 &&
            currentLesson.content_blocks &&
            blockIndex < currentLesson.content_blocks.length
          ) {
            setCurrentBlockIndex(blockIndex);
          }
        } catch (e) {
          console.error("Error parsing saved lesson progress:", e);
        }
      }
    }
  }, [currentLesson?.id]);

  // Save progress whenever block changes
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

  // Update explanation data when current problem changes
  useEffect(() => {
    if (currentProblem) {
      setExplanationData({
        explanation: currentProblem.explanation || "",
        image: "", // Set image if available in your data
        type: currentProblem.content.type || "",
      });
    }
  }, [currentProblem]);

  // Handle option selection
  const handleOptionSelect = useCallback(
    (option: string) => {
      // Prevent further selection after the first choice
      if (selectedOption !== null) return;
      setShowFeedback(false);
      dispatch(resetAnswerState());
      setSelectedOption(String(option));
      playSound("click");
    },
    [dispatch, playSound, selectedOption]
  );

  const fetcher = async (
    url: string,
    method: "get" | "post" = "get",
    body?: any
  ) => {
    const service = AuthService.getInstance();
    return service.makeAuthenticatedRequest(method, url, body);
  };

  // Handle continue to next block
  const handleContinue = useCallback(async () => {
    // 1) sort & filter your blocks
    const sortedBlocks = (currentLesson?.content_blocks || [])
      .filter((b) => !(b.block_type === "problem" && !b.problem))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (sortedBlocks.length === 0) {
      return;
    }

    const lastIndex = sortedBlocks.length - 1;
    const isLastBlock = currentBlockIndex === lastIndex;

    // common UI stuff
    playSound("continue");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowFeedback(false);
    toast.dismiss("correct-answer-toast");
    toast.dismiss("reward-toast");

    if (!isLastBlock) {
      // → not last: just advance
      setCurrentBlockIndex((i) => Math.min(i + 1, lastIndex));
      return;
    }

    // → last block: handle completion
    setIsLessonCompleted(true);

    if (currentLesson?.id) {
      // fallback localStorage
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
        // 1. mark lesson complete
        await fetcher(
          `/api/lms/lessons/${currentLesson.id}/complete/`,
          "post",
          {
            score: isCorrect ? 100 : 0,
          }
        );

        // 2. revalidate all SWR hooks in parallel
        await Promise.all([
          mutateCourseProgress(),
          mutateRewards(),
          mutateLeaderboard(),
          mutateUserRank(),
        ]);

        // setIsLoadingRewards(false);
      } catch (err) {
        console.error("Completion error", err);
        toast.error(
          <div className="space-y-2">
            <p className="font-medium">Xalad ayaa dhacday</p>
            <p>Fadlan isku day mar kale.</p>
          </div>,
          { duration: 5000, id: "error-toast" }
        );
      }
    }
  }, [
    currentBlockIndex,
    currentLesson,
    isCorrect,
    playSound,
    mutateRewards,
    mutateLeaderboard,
    mutateUserRank,
    mutateCourseProgress,
  ]);

  // Update the ref when handleContinue changes
  useEffect(() => {
    continueRef.current = handleContinue;
  }, [handleContinue]);

  // Handle answer checking
  const handleCheckAnswer = useCallback(() => {
    if (!selectedOption || !currentProblem) {
      return;
    }

    // Get correct answer from the current problem
    const correctAnswer = currentProblem.correct_answer?.map((ans) => ans.text);

    // Check if selected option is correct
    const isCorrect = correctAnswer?.includes(selectedOption) || false;

    // Update state
    setIsCorrect(isCorrect);
    setShowFeedback(true);

    // Play appropriate sound
    playSound(isCorrect ? "correct" : "incorrect");

    if (!isCorrect) {
      setDisabledOptions((prev) => [...prev, selectedOption]);
      setSelectedOption(null); // allow user to pick another
    }

    // If answer is correct, show success message
    if (isCorrect) {
      // Check if this is the last block in the lesson
      const contentBlocks = currentLesson?.content_blocks || [];
      const isLastBlock = currentBlockIndex === contentBlocks.length - 1;

      toast.success(
        <div className="space-y-2">
          <p className="font-medium">Jawaab Sax ah!</p>
          <p>Waxaad ku guulaysatay 10 dhibcood</p>
          <Button
            className="w-full mt-2"
            onClick={() => {
              // Close toast and continue
              toast.dismiss("correct-answer-toast");
              toast.dismiss("reward-toast");
              continueRef.current?.();
            }}
          >
            {isLastBlock ? "Casharka xiga" : "Sii wado"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>,
        {
          duration: 5000,
          id: "correct-answer-toast",
        }
      );
    }
  }, [
    selectedOption,
    currentProblem,
    currentLesson,
    currentBlockIndex,
    playSound,
  ]);

  const handleContinueAfterCompletion = () => {
    setShowLeaderboard(false);
    setIsLessonCompleted(false);
    setNavigating(true);
    router.push(`${coursePath}`);
  };

  const handleShowLeaderboard = () => {
    setShowShareComponent(false); // Hide ShareLesson
    setLeaderboardLoading(true);
    setTimeout(() => {
      setShowLeaderboard(true); // Show Leaderboard after delay
      setLeaderboardLoading(false);
    }, 200);
  };

  // Add the new function to handle showing the share component
  const handleShowShareComponent = () => {
    setShowShareComponent(true);
  };

  // Reset answer state
  const handleResetAnswer = () => {
    dispatch(resetAnswerState());
    setShowFeedback(false);
    setSelectedOption(null);
    toast.dismiss("correct-answer-toast");
    toast.dismiss("reward-toast");
  };

  // Render current block based on content type
  useEffect(() => {
    const renderCurrentBlock = async () => {
      if (
        currentLesson?.content_blocks &&
        currentLesson.content_blocks.length > 0
      ) {
        // Debug: log all block types in the lesson
        const allBlockTypes = currentLesson.content_blocks.map((b, i) => ({ i, type: b.block_type }));
        console.log('[DEBUG] All block types in lesson:', allBlockTypes);
        if (!currentLesson.content_blocks.some(b => b.block_type === 'calculator_interface')) {
          console.warn('[DEBUG] No calculator_interface block found in lesson!');
        }
        const sortedBlocks = [...currentLesson.content_blocks]
          .filter((b) => !(b.block_type === "problem" && !b.problem))
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        const block = sortedBlocks[currentBlockIndex];
        if (!block) return;

        const isLastBlock = currentBlockIndex === sortedBlocks.length - 1;
        console.log(block)

        switch (block.block_type) {
          case "problem":
            // Find the problem index that corresponds to this block
            const problemId = block.problem;
            const problemIndex = problems.findIndex((p) => p.id === problemId);

            if (problemIndex !== -1) {
              const problem = problems[problemIndex];
              // Special case: render calculator interface for problems with content.type === 'calculator'
              if (problem.content && problem.content.type === 'calculator') {
                setCurrentBlock(
                  <CalculatorProblemBlock
                    {...problem}
                  />
                );
                break;
              }
              setCurrentProblemIndex(problemIndex);
            }
            setCurrentBlock(
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
            break;

          case "diagram":
            // Similar to problem case, find the corresponding problem
            const diagramProblemId = block.problem;
            const diagramProblemIndex = problems.findIndex(
              (p) => p.id === diagramProblemId
            );

            if (diagramProblemIndex !== -1) {
              setCurrentProblemIndex(diagramProblemIndex);
            }

            setCurrentBlock(
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
            break;

          case "text":
            const textContent =
              typeof block.content === "string"
                ? (JSON.parse(block.content) as TextContent)
                : (block.content as TextContent);

            // Ensure we're using the global sorted blocks for determining last block
            const isActuallyLastBlock =
              currentBlockIndex === sortedBlocks.length - 1;

            setCurrentBlock(
              <TextBlock
                content={textContent}
                onContinue={handleContinue}
                isLastBlock={isActuallyLastBlock}
              />
            );
            break;

          case "image":
            const imageContent =
              typeof block.content === "string"
                ? JSON.parse(block.content)
                : block.content;

            setCurrentBlock(
              <ImageBlock
                content={imageContent}
                onContinue={handleContinue}
                isLastBlock={isLastBlock}
              />
            );
            break;

          case "video":
            const videoContent =
              typeof block.content === "string"
                ? JSON.parse(block.content)
                : block.content;

            setCurrentBlock(
              <VideoBlock
                content={videoContent}
                onContinue={handleContinue}
                isLastBlock={isLastBlock}
              />
            );
            break;

          case "interactive":
            const interactiveContent =
              typeof block.content === "string"
                ? JSON.parse(block.content)
                : block.content;
            // Extract calculator props from options.view if present
            let calcProps = {};
            if (block.options && block.options.view && interactiveContent.type === "calculator") {
              const view = block.options.view;
              // Find n and g from view.sections
              let n = 29, g = 17, sk = 35, m = 7;
              if (Array.isArray(view.sections)) {
                for (const section of view.sections) {
                  if (section.elements) {
                    for (const el of section.elements) {
                      if (el.label === "n" && el.value) n = Number(el.value);
                      if (el.label === "g" && el.value) g = Number(el.value);
                      if (el.label === "furaha qarsoon (sk)" && el.value) sk = Number(el.value);
                      if (el.label === "farriin (m)" && el.value) m = Number(el.value);
                    }
                  }
                }
              }
              calcProps = { n, g, defaultSk: sk, defaultM: m };
            }
            if (interactiveContent.type === "scale_balance") {
              setCurrentBlock(
                <ScaleBalanceInteractive
                  content={interactiveContent}
                  onComplete={handleContinue}
                  onExplanationChange={setExplanationData}
                />
              );
            } else if (interactiveContent.type === "calculator") {
              setCurrentBlock(
                <SignatureCalculator
                  {...calcProps}
                />
              );
            } else {
              setCurrentBlock(
                <div className="max-w-2xl mx-auto px-4">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground">
                        This type of interactive content is not supported yet.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleContinue}>
                        Sii wado
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              );
            }
            break;

          case "calculator":
            // Extract calculator props from options.view if present
            let calcProps2 = {};
            if (block.options && block.options.view) {
              const view = block.options.view;
              let n = 29, g = 17, sk = 35, m = 7;
              if (Array.isArray(view.sections)) {
                for (const section of view.sections) {
                  if (section.elements) {
                    for (const el of section.elements) {
                      if (el.label === "n" && el.value) n = Number(el.value);
                      if (el.label === "g" && el.value) g = Number(el.value);
                      if (el.label === "furaha qarsoon (sk)" && el.value) sk = Number(el.value);
                      if (el.label === "farriin (m)" && el.value) m = Number(el.value);
                    }
                  }
                }
              }
              calcProps2 = { n, g, defaultSk: sk, defaultM: m };
            }
            setCurrentBlock(
              <SignatureCalculator
                {...calcProps2}
              />
            );
            break;

          case "calculator_interface":
            // Debug: log block and options
            console.log("[DEBUG] calculator_interface block:", block);
            console.log("[DEBUG] calculator_interface options:", block.options);
            // Pass the full options.view config to SignatureCalculator
            setCurrentBlock(
              <SignatureCalculator
                config={block.options?.view}
              />
            );
            break;

          default:
            setCurrentBlock(
              <div className="max-w-2xl mx-auto px-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      This content type is not supported.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button onClick={handleContinue}>
                      Sii wado
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            );
        }
      }
    };

    renderCurrentBlock();
  }, [
    currentLesson,
    currentBlockIndex,
    selectedOption,
    answerState,
    problemLoading,
    error,
    problems,
    currentProblem,
    currentProblemIndex,
    isCorrect,
    handleCheckAnswer,
    handleContinue,
    handleOptionSelect,
  ]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Soo-dejinaya casharada....</p>
        </div>
      </div>
    );
  }

  // No lesson found
  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-gray-600 space-y-4">
              <h2 className="text-xl font-semibold">No Lesson Found</h2>
              <p>The requested lesson could not be found or loaded.</p>
              <div className="flex items-center justify-center gap-3 mt-2">
                <Button asChild className="">
                  <a href={`${coursePath}`}>Kulaabo Bogga Casharka</a>
                </Button>
                <Button className="gap-2" onClick={() => router.refresh()}>
                  <ReplaceIcon /> Isku day
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the page
  console.log("Render state:", {
    isLessonCompleted,
    showLeaderboard,
    leaderboardLoading,
  });
  return (
    <div className="min-h-screen bg-white">
      {navigating ? (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">
              Soo dajinaya bogga casharada...
            </p>
          </div>
        </div>
      ) : isLessonCompleted && showShareComponent ? (
        <ShareLesson
          lessonTitle={currentLesson?.title}
          onContinue={handleShowLeaderboard} // Now properly triggers Leaderboard
        />
      ) : isLessonCompleted && showLeaderboard ? (
        <Leaderboard
          onContinue={handleContinueAfterCompletion}
          leaderboard={leaderboard || []}
          userRank={userRank}
        />
      ) : isLessonCompleted && leaderboardLoading ? (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">
              Soo dajinaya shaxda tartanka...
            </p>
          </div>
        </div>
      ) : isLessonCompleted ? (
        <div>
          {isLoadingRewards ? (
            <div className="min-h-screen bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">
                  soo dajinaya abaalmarinada...
                </p>
              </div>
            </div>
          ) : rewards.length === 0 && !isLoadingRewards ? (
            <ShareLesson
              lessonTitle={currentLesson?.title || "Cashar"}
              onContinue={handleShowLeaderboard}
            />
          ) : (
            <RewardComponent
              onContinue={handleShowShareComponent}
              rewards={rewards.map((reward) => ({
                id: reward.id,
                user: reward.user,
                reward_type: reward.reward_type,
                reward_name: reward.reward_name,
                value: reward.value,
                awarded_at: reward.awarded_at,
              }))}
            />
          )}
        </div>
      ) : (
        <div>
          <LessonHeader
            currentQuestion={currentBlockIndex + 1}
            totalQuestions={
              currentLesson.content_blocks?.filter(
                (b) => !(b.block_type === "problem" && b.problem === null)
              ).length || 0
            }
            coursePath={coursePath}
          />

          <main className="pt-20 pb-32 mt-4">
            <div className="container mx-auto">{currentBlock}</div>
          </main>

          {/* Show AnswerFeedback for all answers */}
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
      )}
    </div>
  );
};

export default LessonPage;
