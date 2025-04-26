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
  Trophy,
  Users,
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
import type { ProblemContent, TextContent } from "@/types/learning";
import LessonHeader from "@/components/LessonHeader";
import AnswerFeedback from "@/components/AnswerFeedback";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { LeaderboardEntry, UserRank } from "@/services/progress";
import AuthService from "@/services/auth";



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

  const playSound = useCallback(async (
    soundName: "click" | "correct" | "incorrect" | "continue"
  ) => {
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
  }, []);

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
  onExplanationChange?: (explanation: { explanation: string; image: string }) => void;
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
        image: content.image || ""
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
              <CardTitle>Scale Balance Exercise</CardTitle>
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

        <CardFooter className="bg-gray-50 p-4 border-t border-gray-100">
          {!showSolution ? (
            <Button
              onClick={handleShowNextStep}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {currentStepIndex === -1 ? "Start Solving" : "Next Step"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNextProblem}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isLastProblem ? "Complete Exercise" : "Next Problem"}
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
            <Button onClick={onContinue} className="mt-4">
              Continue to Next Section
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Determine if user has checked an answer
    const hasAnswered = !!answerState.lastAttempt;

    return (
      <div className="max-w-3xl mx-auto px-4">
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
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                    Dhamaad
                  </Badge>
                </div>
              )}
              <div className="pt-4">
                <CardTitle className="text-2xl text-center mt-2">
                  {content.question}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Options Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {content.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isOptionCorrect = hasAnswered && isSelected && isCorrect;
                  const isOptionIncorrect =
                    hasAnswered && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => onOptionSelect(option)}
                      disabled={hasAnswered}
                      className={cn(
                        "p-5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",

                        // Default state
                        !isSelected &&
                        !hasAnswered &&
                        "border-gray-200 hover:border-primary/50 hover:bg-primary/5",

                        // Selected but not yet checked
                        isSelected &&
                        !hasAnswered &&
                        "border-primary bg-primary/10 shadow-md",

                        // Correct or incorrect
                        isOptionCorrect &&
                        "border-green-500 bg-green-50 shadow-md",
                        isOptionIncorrect && "border-red-500 bg-red-50 shadow-md"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-gray-800">
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

                        {isOptionIncorrect && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center"
                          >
                            <X className="h-4 w-4 text-white" />
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
            </CardContent>

            <CardFooter className="pt-0 pb-4 px-6">
              <div className="w-full space-y-4">
                {answerState.isCorrect === null && !hasAnswered && (
                  <Button
                    onClick={onCheckAnswer}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={!selectedOption || isLoading}
                  >
                    Check Answer
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
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4"
      // variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full">
        <CardContent className="p-6 space-y-6">
          {content.text && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown>{content.text}</ReactMarkdown>
            </div>
          )}
          {content.desc && (
            <div className="prose prose-sm text-muted-foreground mt-4">
              <ReactMarkdown>{content.desc}</ReactMarkdown>
            </div>
          )}
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0 flex justify-center">
          <Button
            onClick={onContinue}
            className="px-8 py-6 text-lg rounded-xl"
            size="lg"
          >
            {isLastBlock ? "Finish" : "Continue"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// ImageBlock component for image-type content
const ImageBlock: React.FC<{
  content: {
    url: string;
    alt: string;
    width: number;
    height: number;
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
              {isLastBlock ? "Finish" : "Continue"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4"
      // variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full overflow-hidden">
        <CardContent className="p-6">
          <figure className="space-y-3">
            <div className="flex justify-center">
              <motion.div
                className="relative rounded-lg overflow-hidden shadow-lg"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src={content.url || "/placeholder.svg"}
                  alt={content.alt || "Lesson content"}
                  width={content.width}
                  height={content.height}
                  className="w-full h-full object-contain"
                  style={{
                    aspectRatio:
                      content.width && content.height
                        ? `${content.width} / ${content.height}`
                        : "16 / 9",
                  }}
                />
              </motion.div>
            </div>
            {content.caption && (
              <figcaption className="text-center text-base text-muted-foreground">
                {content.caption}
              </figcaption>
            )}
          </figure>
        </CardContent>
        <CardFooter className="flex justify-center p-6 pt-0">
          <Button
            onClick={onContinue}
            className="px-8 py-6 text-lg rounded-xl"
            size="lg"
          >
            {isLastBlock ? "Finish" : "Continue"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// LessonCompletionModal component to show leaderboard, badges, and completion information
interface LessonCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  leaderboard: LeaderboardEntry[];
  userRank: Partial<UserRank>;
}

const LessonCompletionModal: React.FC<LessonCompletionModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  leaderboard = [],
  userRank = { rank: 0, points: 0 },
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            <span className="flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Casharka wuu dhamaday!
            </span>
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Hambalyo! Waxaad helay 15 XP.
          </DialogDescription>
        </DialogHeader>



        {/* Leaderboard section */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Shaxda tartanka
          </h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div
                key={entry.id || index}
                className={`flex items-center justify-between p-2 rounded-lg ${userRank.rank === index + 1 ? "bg-primary/10 font-medium" : ""
                  }`}
              >
                <div className="flex items-center gap-2 ">
                  <span className="font-bold">{index + 1}</span>
                  <span className="truncate w-28">{entry.username || "User"}</span>
                </div>
                <span>{entry.points || 0} XP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Button
            className="w-full"
            onClick={onContinue}
          >
            Casharka xiga
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main LessonPage component
const LessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { answerState, currentLesson } = useSelector(
    (state: RootState) => state.learning
  );
  const isLoading = useSelector((state: RootState) => state.learning.isLoading);
  const [content, setContent] = useState<ProblemContent | null>(null);
  const [problemLoading, setProblemLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCorrect, setIscorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<Partial<UserRank>>({ rank: 0, points: 0 });
  const [explanationData, setExplanationData] = useState<{ explanation: string; image: string }>({
    explanation: "",
    image: ""
  });
  const { playSound } = useSoundManager();
  const continueRef = useRef<() => void>(() => { });

  useEffect(() => {
    const fetchProblemContent = async () => {
      try {
        const sortedBlocks = currentLesson?.content_blocks
          ? [...currentLesson.content_blocks].sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          )
          : [];

        const block = sortedBlocks.find(
          (block) => block.block_type === "problem"
        );
        if (!block) return;

        const problemId = block.problem;
        if (!problemId) {
          console.error("No problem ID found in block");
          return;
        }

        setProblemLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lms/problems/${problemId}/`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch problem: ${response.statusText}`);
        }

        const problemData = await response.json();

        const transformedContent: ProblemContent = {
          question: problemData.question_text,
          options: problemData.options.map(
            (opt: { id: string; text: string }) => opt.text
          ),
          correct_answer: problemData.correct_answer,
          explanation: problemData.explanation || "No explanation available",
        };

        // Update the explanation data state with the problem's explanation
        setExplanationData({
          explanation: problemData.explanation || "",
          image: problemData.image || ""
        });

        setContent(transformedContent);
        setError(null);
      } catch (error) {
        console.error("Error fetching problem content:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load problem"
        );
      } finally {
        setProblemLoading(false);
      }
    };

    fetchProblemContent();
  }, [currentLesson]);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentBlock, setCurrentBlock] = useState<React.ReactNode>(null);

  // Reset state when block changes
  useEffect(() => {
    setSelectedOption(null);
  }, [currentBlockIndex]);

  const coursePath = `/courses/${params.categoryId}/${params.courseSlug}`;
  // Fetch lesson data
  useEffect(() => {
    if (params.lessonId) {
      dispatch(fetchLesson(params.lessonId as string));
    }
  }, [dispatch, params.lessonId]);

  // Handle option selection
  const handleOptionSelect = useCallback((option: string) => {
    setShowFeedback(false);
    dispatch(resetAnswerState());
    setSelectedOption(String(option));
    playSound("click");
  }, [dispatch, playSound]);

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
            const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
            if (!completedLessons.includes(currentLesson.id)) {
              completedLessons.push(currentLesson.id);
              localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
            }

            // Immediately show completion modal without waiting for API
            setIsCompletionModalOpen(true);

            // Try API updates in background
            (async () => {
              try {
                // 1. Mark lesson as completed with score
                const completionResult = await AuthService.getInstance().makeAuthenticatedRequest<{
                  reward?: { value: number };
                }>(
                  'post',
                  `/api/lms/lessons/${currentLesson.id}/complete/`,
                  { score: isCorrect ? 100 : 0 }
                );

                // 2. Update progress status
                await AuthService.getInstance().makeAuthenticatedRequest(
                  'put',
                  `/api/lms/user-progress/${currentLesson.id}/`,
                  {
                    status: "completed",
                    score: isCorrect ? 100 : 0
                  }
                );

                // 3. Get updated course progress
                const courseProgress = await AuthService.getInstance().makeAuthenticatedRequest<{
                  progress: number;
                  user_progress: {
                    progress_percent: number;
                  };
                }>(
                  'get',
                  `/api/lms/courses/${params.courseId}/`
                );

                // 4. Show reward notification if any
                if (completionResult.reward) {
                  toast.success(
                    <div className="space-y-2">
                      <p className="font-medium">Hambalyo!</p>
                      <p>Waxaad ku guulaysatay {completionResult.reward.value} XP</p>
                      <p>Horumarkaaga: {courseProgress.user_progress.progress_percent}%</p>
                    </div>,
                    {
                      duration: 5000,
                      id: "reward-toast"
                    }
                  );
                }

                // 5. Get updated leaderboard
                const leaderboardData = await AuthService.getInstance().makeAuthenticatedRequest<LeaderboardEntry[]>(
                  'get',
                  '/api/lms/leaderboard/?time_period=all_time&limit=10'
                );

                // 6. Get user rank
                const userRankData = await AuthService.getInstance().makeAuthenticatedRequest<Partial<UserRank>>(
                  'get',
                  '/api/lms/leaderboard/my_rank/'
                );

                // Update state with new data
                setLeaderboard(leaderboardData);
                setUserRank(userRankData);

              } catch (error) {
                console.error("Error updating progress:", error);
                // Show error toast but don't prevent completion
                toast.error(
                  <div className="space-y-2">
                    <p className="font-medium">Xalad ayaa dhacday</p>
                    <p>Waxaa jira khalad markii la diiwaangelinayay horumarkaaga. Fadlan isku day mar kale.</p>
                  </div>,
                  {
                    duration: 5000,
                    id: "error-toast"
                  }
                );
              }
            })().catch(error => {
              console.error("Overall progress error:", error);
              // Show error toast but don't prevent completion
              toast.error(
                <div className="space-y-2">
                  <p className="font-medium">Xalad ayaa dhacday</p>
                  <p>Waxaa jira khalad markii la diiwaangelinayay horumarkaaga. Fadlan isku day mar kale.</p>
                </div>,
                {
                  duration: 5000,
                  id: "error-toast"
                }
              );
            });
          } catch (storageError) {
            console.error("Error with local storage:", storageError);
            // Even if local storage fails, still show completion modal
            setIsCompletionModalOpen(true);
          }
        } else {
          // No lesson ID, still show completion modal
          setIsCompletionModalOpen(true);
        }
      } else {
        // Not the last block, move to the next block
        setCurrentBlockIndex((prev) => Math.min(prev + 1, contentBlocks.length - 1));
      }
    }
  }, [currentLesson, currentBlockIndex, isCorrect, playSound, setLeaderboard, setUserRank, params.courseId]);

  // Update the ref when handleContinue changes
  useEffect(() => {
    continueRef.current = handleContinue;
  }, [handleContinue]);

  // Handle answer checking
  const handleCheckAnswer = useCallback(async () => {
    if (selectedOption === null || selectedOption === "") {
      return;
    }

    const correctAnswer = content?.correct_answer?.map((txt) => txt.text);

    // Direct comparison without API call
    const isCorrect = correctAnswer?.includes(selectedOption) || false;

    setIscorrect(isCorrect);

    // Always show feedback after checking answer
    setShowFeedback(true);

    // Play appropriate sound based on the result
    playSound(isCorrect ? "correct" : "incorrect");

    // If answer is correct, also show success message with XP
    if (isCorrect) {
      // Check if this is the last block in the lesson
      const contentBlocks = currentLesson?.content_blocks || [];
      const isLastBlock = currentBlockIndex === contentBlocks.length - 1;

      toast.success(
        <div className="space-y-2">
          <p className="font-medium">Jawaab Sax ah!</p>
          <p>Waxaad ku guulaysatay 15 XP</p>
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
          id: "correct-answer-toast" // Add an ID to ensure we can dismiss it
        }
      );
    }
  }, [selectedOption, content, currentLesson, currentBlockIndex, playSound]);

  // Function to handle continuing after the completion modal
  const handleContinueAfterCompletion = () => {
    setIsCompletionModalOpen(false);
    // Navigate to the course page
    router.push(`${coursePath}`);
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
        const sortedBlocks = [...currentLesson.content_blocks].sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );

        const block = sortedBlocks[currentBlockIndex];
        if (!block) return;

        const isLastBlock = currentBlockIndex === sortedBlocks.length - 1;

        switch (block.block_type) {
          case "problem":
            setCurrentBlock(
              <ProblemBlock
                onContinue={handleContinue}
                selectedOption={selectedOption}
                answerState={answerState}
                onOptionSelect={handleOptionSelect}
                onCheckAnswer={handleCheckAnswer}
                isLoading={problemLoading}
                error={error}
                content={content}
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
                        Continue
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
                      Continue
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
    content,
    isCorrect,
    handleCheckAnswer,
    handleContinue,
    handleOptionSelect
  ]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading lesson content...</p>
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
              <div className="flex items-center justify-center gap-3 mt-4">
                <Button asChild className="">
                  <a href={`${coursePath}`}>Return to Course</a>
                </Button>
                <Button className="gap-2" onClick={() => router.refresh()}>
                  <ReplaceIcon /> Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LessonHeader
        currentQuestion={currentBlockIndex + 1}
        totalQuestions={currentLesson.content_blocks?.length || 0}
      // lessonTitle={currentLesson.title}
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

      <LessonCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onContinue={handleContinueAfterCompletion}
        leaderboard={leaderboard}
        userRank={userRank}
      />
    </div>
  );
};

export default LessonPage;
