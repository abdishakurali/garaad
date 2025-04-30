"use client";
import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { RootState, AppDispatch } from "@/store";
import { fetchLesson, resetAnswerState } from "@/store/features/learningSlice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Scale,
  MinusCircle,
  Check,
  X,
  ArrowRight,
  ReplaceIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
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
import type { TextContent } from "@/types/learning";
import LessonHeader from "@/components/LessonHeader";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import Image from "next/image";
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
import DiagramScale from "@/components/DiagramScale";

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
  options: { text: string }[];
  correct_answer: { text: string }[];
  explanation?: string;
  diagram_config?: DiagramConfig;
  question_type: string;
  img?: string;
  alt?: string;
}

interface ProblemContent {
  id: number;
  question: string;
  options: string[];
  correct_answer: { id: string; text: string }[];
  explanation?: string;
  diagram_config?: DiagramConfig;
  question_type?: "code" | "mcq" | "short_input" | "diagram" | "multiple_choice";
  img?: string;
  alt?: string;
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
    explanation: string;
    image: string;
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

// ProblemBlock component for problem-type content
const ProblemBlock: React.FC<{
  onContinue: () => void;
  selectedOption: string | null;
  answerState: {
    isCorrect: boolean | null;
    showAnswer: boolean;
    lastAttempt: string | null;
  };
  onOptionSelect: (option: string) => void;
  onCheckAnswer: () => void;
  isLoading: boolean;
  error: string | null;
  content: ProblemContent | null;
  isCorrect: boolean;
  isLastInLesson: boolean;
}> = ({
  onContinue,
  selectedOption,
  answerState,
  onOptionSelect,
  onCheckAnswer,
  isLoading,
  error,
  content,
  isCorrect,
  isLastInLesson,
}) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error || !content) {
      return (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">
              {error || "Problem content could not be loaded"}
            </p>
            <Button onClick={onContinue} className="mt-2">
              SiiWado Qaybta Kale
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Determine if user has checked an answer
    const hasAnswered = answerState.isCorrect !== null;

    // Render image only for multiple_choice and mcq types
    const showImage = ["multiple_choice", "mcq"].includes(content.question_type || "");

    return (
      <div className="max-w-5xl mx-auto  ">
        <motion.div className="space-y-8">
          {/* Question Card */}
          <Card className="border-none shadow-xl z-0">
            <CardHeader className="relative bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary hover:bg-primary text-white px-4 py-1.5 text-sm shadow-md">
                  {isLastInLesson ? "Su'aasha Ugu Dambeysa" : "Su'aal"}
                </Badge>
              </div>
              {isLastInLesson && (
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-200"
                  >
                    Dhamaad
                  </Badge>
                </div>
              )}
              <div className="pt-4">
                <CardTitle className="text-lg text-max items-center justify-center flex text-center mt-2">
                  {content.question}
                </CardTitle>
              </div>
            </CardHeader>

            {content.img && (
              <CardContent className="flex justify-center">
                <div className="relative w-full max-w-[400px] aspect-[16/7] my-4">
                  <Image
                    src={content.img}
                    alt={content.alt || "lesson image"}
                    fill
                    className="rounded-xl shadow-lg object-fit bg-white"
                    sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 400px"
                    priority
                  />
                </div>
              </CardContent>
            )}
            {content.question_type === "diagram" && (
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-center h-auto">
                {content?.diagram_config &&
                  (Array.isArray(content.diagram_config) ? (
                    content.diagram_config.length === 1 ? (
                      <DiagramScale config={content.diagram_config[0]} />
                    ) : (
                      content.diagram_config.map((config, index) => (
                        <DiagramScale key={index} config={config} />
                      ))
                    )
                  ) : (
                    <DiagramScale config={content.diagram_config} />
                  ))}
              </CardContent>
            )}
            <CardContent className="p-4">
              {/* Options Layout */}
              {content.question_type === "diagram" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {content?.options?.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isOptionCorrect = hasAnswered && isSelected && isCorrect;
                    const isOptionIncorrect = hasAnswered && isSelected && !isCorrect;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => onOptionSelect(option)}
                        disabled={hasAnswered && isSelected}
                        className={cn(
                          "p-5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden text-left",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          !isSelected && !hasAnswered && "border-gray-200 hover:border-primary/50 hover:bg-primary/5",
                          isSelected && !hasAnswered && "border-primary bg-primary/10 shadow-md",
                          isOptionCorrect && "border-green-500 bg-green-50 shadow-md",
                          isOptionIncorrect && "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed",
                        )}
                      >
                        {/* X icon for incorrect */}
                        {isOptionIncorrect && (
                          <span className="absolute top-2 right-2 text-gray-400">
                            <X className="h-5 w-5" />
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-lg font-medium",
                            isOptionIncorrect ? "text-gray-400" : "text-gray-800"
                          )}>
                            {option}
                          </span>
                          {isOptionCorrect && (
                            <motion.div
                              initial="hidden"
                              animate="visible"
                              className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        {isSelected && !hasAnswered && (
                          <motion.div
                            className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                            layoutId="selectedOption"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {content?.options?.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isOptionCorrect = hasAnswered && isSelected && isCorrect;
                    const isOptionIncorrect = hasAnswered && isSelected && !isCorrect;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => onOptionSelect(option)}
                        disabled={hasAnswered && isSelected}
                        className={cn(
                          "w-full p-5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden text-left",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          // Default state
                          !isSelected && !hasAnswered && "border-gray-200 hover:border-primary/50 hover:bg-primary/5",
                          // Selected but not yet checked
                          isSelected && !hasAnswered && "border-primary bg-primary/10 shadow-md",
                          // Correct
                          isOptionCorrect && "border-green-500 bg-green-50 shadow-md",
                          // Incorrect (custom style)
                          isOptionIncorrect && "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed",
                        )}
                      >
                        {/* X icon for incorrect */}
                        {isOptionIncorrect && (
                          <span className="absolute top-2 right-2 text-gray-400">
                            <X className="h-5 w-5" />
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-base md:text-lg font-medium",
                            isOptionIncorrect ? "text-gray-400" : "text-gray-800"
                          )}>
                            {option}
                          </span>
                          {isOptionCorrect && (
                            <motion.div
                              initial="hidden"
                              animate="visible"
                              className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        {isSelected && !hasAnswered && (
                          <motion.div
                            className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                            layoutId="selectedOption"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 pb-4 px-6">
              <div className="w-full space-y-2">
                {answerState.isCorrect === null && !hasAnswered && (
                  <Button
                    onClick={onCheckAnswer}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={!selectedOption || isLoading}
                  >
                    Hubi Jawaabta
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  };

// TextBlock component for text-type content
const TextBlock: React.FC<{
  content: TextContent;
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  const isHorizontal = content.orientation === "horizontal";

  const handleContinue = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onContinue();
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[40vh] max-w-4xl mx-auto px-4"
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full max-w-full shadow-lg rounded-2xl border border-gray-100 bg-white">
        <CardContent className="flex flex-col items-center justify-center p-6 md:p-10 space-y-6 md:space-y-10">
          {content.title && (
            <div className="prose prose-lg dark:prose-invert max-w-none text-xl md:text-xl font-bold text-center">
              <ReactMarkdown>{content.title}</ReactMarkdown>
            </div>
          )}
          {content.text && (
            <div className="prose prose-base mt-2 text-muted-foreground text-left text-lg md:text-xl">
              <ReactMarkdown>{content.text}</ReactMarkdown>
            </div>
          )}
          {content.url && (
            <div className="flex justify-center w-full">
              <div className="relative w-full max-w-[500px] aspect-[16/7] md:aspect-[16/7] my-6">
                <Image
                  src={content.url}
                  alt={content.alt || "lesson image"}
                  fill
                  className="rounded-2xl shadow-xl border border-gray-200 object-cover bg-white"
                  sizes="(max-width: 900px) 90vw, (max-width: 1200px) 50vw, 500px"
                  priority
                />
              </div>
            </div>
          )}
          {content.text1 && (
            <div className="prose prose-base mt-2 text-muted-foreground text-left text-lg md:text-xl">
              <ReactMarkdown>{content.text1}</ReactMarkdown>
            </div>
          )}
          <div className="flex justify-center w-full pt-2">
            <Button
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isLastBlock ? "Dhamee" : "Sii wado"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ImageBlock component for image-type content
const ImageBlock: React.FC<{
  content: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption: string;
  };
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  if (!content?.url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Image not available</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={onContinue}>
              {isLastBlock ? "Dhamee" : "Sii wado"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="relative aspect-video w-full">
            <Image
              src={content.url}
              alt={content.alt || "image"}
              width={content.width || 800}
              height={content.height || 600}
              className="object-cover rounded-lg"
              unoptimized={process.env.NODE_ENV !== "production"} // Optional: disable optimization in development
            />
          </div>
          {content.caption && (
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {content.caption}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onContinue}>
            {isLastBlock ? "Dhamee" : "Sii wado"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
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
  const [rewards, setRewards] = useState<UserReward[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<Partial<UserRank>>({
    rank: 0,
    points: 0,
  });
  const [explanationData, setExplanationData] = useState<{
    explanation: string;
    image: string;
  }>({
    explanation: "",
    image: "",
  });
  const { playSound } = useSoundManager();
  const continueRef = useRef<() => void>(() => { });
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  // State for all problems and current problem
  const [problems, setProblems] = useState<ProblemContent[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentBlock, setCurrentBlock] = useState<React.ReactNode>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Derived state for current problem
  const currentProblem =
    problems.length > 0 && currentProblemIndex < problems.length
      ? problems[currentProblemIndex]
      : null;

  const coursePath = `/courses/${params.categoryId}/${params.courseSlug}`;

  // Reset state when block changes
  useEffect(() => {
    setSelectedOption(null);
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
      const sortedBlocks = [...currentLesson.content_blocks]
        .filter(b => !(b.block_type === 'problem' && !b.problem))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      const problemBlocks = sortedBlocks.filter(
        (b) => b.block_type === "problem" && b.problem
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
        console.log(datas)
        // Transform into your shape
        const transformed: ProblemContent[] = datas.map((pd: ProblemData) => ({
          id: pd.id,
          question: pd.question_text,
          options: pd.options.map((opt) => opt.text),
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
        }));
        // Update state with new data
        setProblems(transformed);

        // Set initial explanation data
        if (transformed.length > 0) {
          setExplanationData({
            explanation: transformed[0].explanation || "",
            image: "", // Set image if available in your data
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

  // Update explanation data when current problem changes
  useEffect(() => {
    if (currentProblem) {
      setExplanationData({
        explanation: currentProblem.explanation || "",
        image: "", // Set image if available in your data
      });
    }
  }, [currentProblem]);

  // Handle option selection
  const handleOptionSelect = useCallback(
    (option: string) => {
      setShowFeedback(false);
      dispatch(resetAnswerState());
      setSelectedOption(String(option));
      playSound("click");
    },
    [dispatch, playSound]
  );

  // Handle continue to next block
  const handleContinue = useCallback(async () => {
    const contentBlocks = currentLesson?.content_blocks || [];

    if (contentBlocks.length > 0) {
      playSound("continue");

      // Check if this is the last block in the lesson
      const isLastBlock = currentBlockIndex === contentBlocks.length - 1;

      // Clear any feedback or toasts
      setShowFeedback(false);
      toast.dismiss("correct-answer-toast");
      toast.dismiss("reward-toast");

      if (isLastBlock) {
        // This is the last block - handle lesson completion
        if (currentLesson?.id) {
          try {
            // Try to store progress in local storage as a fallback
            const completedLessons = JSON.parse(
              localStorage.getItem("completedLessons") || "[]"
            );
            if (!completedLessons.includes(currentLesson.id)) {
              completedLessons.push(currentLesson.id);
              localStorage.setItem(
                "completedLessons",
                JSON.stringify(completedLessons)
              );
            }

            // Immediately show completion modal without waiting for API
            setIsLessonCompleted(true);

            // Try API updates in background
            (async () => {
              try {
                // 1. Mark lesson as completed with score
                const completionResult =
                  await AuthService.getInstance().makeAuthenticatedRequest<{
                    reward?: { value: number };
                  }>("post", `/api/lms/lessons/${currentLesson.id}/complete/`, {
                    score: isCorrect ? 100 : 0,
                  });

                // 2. Get updated course progress
                const courseProgress =
                  await AuthService.getInstance().makeAuthenticatedRequest<{
                    progress: number;
                    user_progress: {
                      progress_percent: number;
                    };
                  }>("get", `/api/lms/courses/${courseId}/`);

                // 3. Show reward notification if any
                if (completionResult.reward) {
                  toast.success(
                    <div className="space-y-2">
                      <p className="font-medium">Hambalyo!</p>
                      <p>
                        Waxaad ku guulaysatay {completionResult.reward.value} XP
                      </p>
                      <p>
                        Horumarkaaga:{" "}
                        {courseProgress.user_progress.progress_percent}%
                      </p>
                    </div>,
                    {
                      duration: 5000,
                      id: "reward-toast",
                    }
                  );
                }

                // 4. Get updated user rewards
                const rewardsData =
                  await AuthService.getInstance().makeAuthenticatedRequest<
                    UserReward[]
                  >("get", "/api/lms/rewards/");

                setRewards(rewardsData);

                // 5. Get updated leaderboard
                const leaderboardData =
                  await AuthService.getInstance().makeAuthenticatedRequest<
                    LeaderboardEntry[]
                  >(
                    "get",
                    "/api/lms/leaderboard/?time_period=all_time&limit=10"
                  );

                // 6. Get user rank
                const userRankData =
                  await AuthService.getInstance().makeAuthenticatedRequest<
                    Partial<UserRank>
                  >("get", "/api/lms/leaderboard/my_rank/");

                // Update state with new data
                setLeaderboard(leaderboardData);
                setUserRank(userRankData);
              } catch (error) {
                console.error("Error updating progress:", error);

                // Show error toast but don't prevent completion
                toast.error(
                  <div className="space-y-2">
                    <p className="font-medium">Xalad ayaa dhacday</p>
                    <p>
                      Waxaa jira khalad markii la diiwaangelinayay horumarkaaga.
                      Fadlan isku day mar kale.
                    </p>
                  </div>,
                  {
                    duration: 5000,
                    id: "error-toast",
                  }
                );
              }
            })().catch((error) => {
              console.error("Overall progress error:", error);
              // Show error toast but don't prevent completion
              toast.error(
                <div className="space-y-2">
                  <p className="font-medium">Xalad ayaa dhacday</p>
                  <p>
                    Waxaa jira khalad markii la diiwaangelinayay horumarkaaga.
                    Fadlan isku day mar kale.
                  </p>
                </div>,
                {
                  duration: 5000,
                  id: "error-toast",
                }
              );
            });
          } catch (storageError) {
            console.error("Error with local storage:", storageError);
            // Even if local storage fails, still show completion modal
            setIsLessonCompleted(true);
          }
        } else {
          // No lesson ID, still show completion modal
          setIsLessonCompleted(true);
        }
      } else {
        // Not the last block, move to the next block
        setCurrentBlockIndex((prev) =>
          Math.min(prev + 1, contentBlocks.length - 1)
        );
      }
    }
  }, [currentLesson, currentBlockIndex, isCorrect, playSound, courseId]);

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

    // If answer is correct, show success message
    if (isCorrect) {
      // Check if this is the last block in the lesson
      const contentBlocks = currentLesson?.content_blocks || [];
      const isLastBlock = currentBlockIndex === contentBlocks.length - 1;

      toast.success(
        <div className="space-y-2">
          <p className="font-medium">Jawaab Sax ah!</p>
          <p>Waxaad ku guulaysatay 10 XP</p>
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
    setLeaderboardLoading(true);
    setTimeout(() => {
      setShowLeaderboard(true);
      setLeaderboardLoading(false);
    }, 300);
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
        const sortedBlocks = [...currentLesson.content_blocks]
          .filter(b => !(b.block_type === 'problem' && !b.problem))
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        const block = sortedBlocks[currentBlockIndex];
        if (!block) return;

        const isLastBlock = currentBlockIndex === sortedBlocks.length - 1;

        switch (block.block_type) {
          case "problem":
            // Find the problem index that corresponds to this block
            const problemId = block.problem;
            const problemIndex = problems.findIndex((p) => p.id === problemId);

            // Update current problem index if found
            if (problemIndex !== -1) {
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
              />
            );
            break;

          case "text":
            const textContent =
              typeof block.content === "string"
                ? (JSON.parse(block.content) as TextContent)
                : (block.content as TextContent);

            setCurrentBlock(
              <TextBlock
                content={textContent}
                onContinue={handleContinue}
                isLastBlock={isLastBlock}
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

          case "interactive":
            const interactiveContent =
              typeof block.content === "string"
                ? JSON.parse(block.content)
                : block.content;

            if (interactiveContent.type === "scale_balance") {
              setCurrentBlock(
                <ScaleBalanceInteractive
                  content={interactiveContent}
                  onComplete={handleContinue}
                  onExplanationChange={setExplanationData}
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
  return (
    <div className="min-h-screen bg-white">
      {navigating ? (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading course page...</p>
          </div>
        </div>
      ) : isLessonCompleted && showLeaderboard ? (
        <Leaderboard
          onContinue={handleContinueAfterCompletion}
          leaderboard={leaderboard}
          userRank={userRank}
        />
      ) : isLessonCompleted && leaderboardLoading ? (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      ) : isLessonCompleted ? (
        <div>
          {rewards.length === 0 ? (
            <div className="min-h-screen bg-white flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading rewards...</p>
              </div>
            </div>
          ) : (
            <RewardComponent
              onContinue={handleShowLeaderboard}
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
            totalQuestions={currentLesson.content_blocks?.length || 0}
          />

          <main className="pt-20 pb-32 mt-10">
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
