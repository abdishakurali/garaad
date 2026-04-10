"use client";import {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";import { useLearningStore } from "@/store/useLearningStore";
import { useLesson, useCourse, useCategories,  useEnrollments, useUserProgress } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import {
    ChevronRight,
    RefreshCw,
    Home,

    Sparkles,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ExplanationText, TextContent, DiagramConfig, ProblemContent } from "@/types/learning";
import { LessonStepBullets } from "@/components/learning/LessonStepBullets";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import type { Course, Lesson } from "@/types/lms";
import AuthService from "@/services/auth";
import { FREE_TIER_LESSON_COUNT } from "@/lib/lessonTierAccess";
import { useAuthStore } from "@/store/useAuthStore";
import 'katex/dist/katex.min.css';
import ProblemBlock from "@/components/lesson/ProblemBlock";
import TextBlock from "@/components/lesson/TextBlock";
import ImageBlock from "@/components/lesson/ImageBlock";
import VideoBlock from "@/components/lesson/VideoBlock";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { LessonCompleteModal } from "@/components/learning/LessonCompleteModal";
import { LessonChallengeSoftInvite } from "@/components/challenge/LessonChallengeSoftInvite";
import { EmailVerificationBanner } from "@/components/learning/EmailVerificationBanner";
import dynamic from "next/dynamic";
import posthog from "posthog-js";

const ShikiCode = dynamic(() => import("@/components/lesson/ShikiCode"), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted rounded-xl h-40 w-full" />,
});

interface ProblemData {
    id: number;
    question_text: string;
    which: string;
    options: { id?: string | number; text: string; wrong_explanation?: string }[];
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

interface LessonCompleteApiResponse {
    status?: string;
    next_lesson_id?: number | null;
    next_lesson_title?: string | null;
}

type CompletionNavigateMeta = {
    nextLessonId: number | null;
    nextLessonTitle: string | null;
};

async function fetchAllCourseLessons(courseId: number | string): Promise<Lesson[]> {
    const all: Lesson[] = [];
    let url: string | null = `${API_BASE_URL}/api/lms/lessons/?course=${courseId}&page_size=100`;
    while (url) {
        const res = await fetch(url);
        if (!res.ok) break;
        const raw = (await res.json()) as
            | Lesson[]
            | { results?: Lesson[]; next?: string | null };
        const page = Array.isArray(raw) ? raw : raw.results ?? [];
        all.push(...page);
        const next = !Array.isArray(raw) ? raw.next : undefined;
        url = next && typeof next === "string" && next.length > 0 ? next : null;
    }
    return all;
}

/** Remove CMS heading so we do not repeat the label in the feedback banner. */
function stripDuplicateCorrectExplanationLead(plain: string): string {
    let s = plain.trim();
    let prev = "";
    while (s !== prev) {
        prev = s;
        s = s
            .replace(/^Sababta jawaabtu sax tahay:?\s*/i, "")
            .replace(
                /^<p>\s*<strong>Sababta jawaabtu sax tahay:?<\/strong>\s*<\/p>\s*/i,
                ""
            )
            .trim();
    }
    return s;
}

const LoadingSpinner = ({ message }: { message: string }) => (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8">
            <div className="h-10 w-10 rounded-full border-2 border-zinc-700 border-t-violet-500 animate-spin" />
            <p className="text-zinc-400 text-sm font-medium">{message}</p>
        </div>
    </div>
);

const ErrorCard = ({ coursePath, onRetry }: { coursePath: string; onRetry: () => void }) => (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-center space-y-5">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-red-400" />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-white">Wax cashar ah lama helin</h2>
                <p className="text-sm text-zinc-500 mt-1">waa soo dajin weynay casharka aad dalbatay sababo jira awgood</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm">
                    <Link href={coursePath} className="flex items-center justify-center gap-2">
                        <Home className="w-4 h-4" />
                        Ku laabo bogga koorsada
                    </Link>
                </Button>
                <Button variant="outline" className="h-11 rounded-xl border-zinc-700 text-zinc-400 hover:bg-white/[0.04]" onClick={onRetry}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    soo daji markale
                </Button>
            </div>
        </div>
    </div>
);

const LessonCompletionAnimation = ({ onComplete }: { onComplete: () => void }) => {
    const [stage, setStage] = useState(0);
    useEffect(() => {
        const t1 = setTimeout(() => setStage(1), 200);
        const t2 = setTimeout(() => setStage(2), 600);
        const t3 = setTimeout(() => setStage(3), 1000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 p-4">
            <div className="text-center space-y-6 max-w-md w-full">
                <div className={cn("transition-opacity duration-300", stage >= 1 ? "opacity-100" : "opacity-0")}>
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-emerald-400" />
                    </div>
                </div>
                <div className={cn("transition-opacity duration-300", stage >= 2 ? "opacity-100" : "opacity-0")}>
                    <h2 className="text-xl font-semibold text-white">Cashar baa la Dhammeeyay!</h2>
                </div>
                <div className={cn("transition-opacity duration-300 pt-2", stage >= 3 ? "opacity-100" : "opacity-0")}>
                    <Button onClick={onComplete} className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm">
                        Sii wad
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface LessonDetailClientProps {
    initialLesson?: any;
}

export function LessonDetailClient({ initialLesson }: LessonDetailClientProps) {
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

    // useLesson hook - use initialLesson from server as fallback
    const { lesson: swrLesson, isLoading: lessonLoading, isError: lessonError } = useLesson(params.lessonId as string);
    // Server-side initial lesson takes priority, then SWR, then store
    const currentLesson = initialLesson || swrLesson || storeLesson;
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
    /** Quiz score 0–100 for the completion modal when the lesson had problems */
    const [completionScore, setCompletionScore] = useState(0);
    const [completionHasQuiz, setCompletionHasQuiz] = useState(false);
    const solvedProblemIdsRef = useRef<Set<number>>(new Set());
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
    const [showQuitConfirm, setShowQuitConfirm] = useState(false);
    /** Set after complete API succeeds; drives auto-advance toast + redirect */
    const [completionNavigateMeta, setCompletionNavigateMeta] = useState<CompletionNavigateMeta | null>(null);

    const { enrollments } = useEnrollments();
    const { progress: userProgress } = useUserProgress();

    const { toast } = useToast();
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
    const lessonMainRef = useRef<HTMLElement | null>(null);

    const sortedCourseLessonsOrdered = useMemo(() => {
        return [...courseLessons].sort(
            (a, b) => ((a as { lesson_number?: number }).lesson_number ?? 0) - ((b as { lesson_number?: number }).lesson_number ?? 0)
        );
    }, [courseLessons]);

    const lessonNumberInCourse = useMemo(() => {
        if (!currentLesson?.id) return 0;
        const i = sortedCourseLessonsOrdered.findIndex(
            (l) => Number(l.id) === Number(currentLesson.id)
        );
        return i >= 0 ? i + 1 : 0;
    }, [sortedCourseLessonsOrdered, currentLesson?.id]);

    const lessonPositionLabel =
        lessonNumberInCourse > 0 && sortedCourseLessonsOrdered.length > 0
            ? `Casharka ${lessonNumberInCourse} ee ${sortedCourseLessonsOrdered.length}`
            : undefined;

    const handleVideoPlaybackEnded = useCallback(() => {
        const el = lessonMainRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, []);

    const isPayingSubscriber = useAuthStore((s) => Boolean(s.user?.is_premium));

    // Fetch all course lessons (paginated API)
    useEffect(() => {
        const run = async () => {
            if (!courseIdFromSlug) return;
            try {
                const lessons = await fetchAllCourseLessons(courseIdFromSlug);
                setCourseLessons(lessons);
            } catch (error) {
                console.error("Error fetching course lessons:", error);
            }
        };
        run();
    }, [courseIdFromSlug]);

    useEffect(() => {
        solvedProblemIdsRef.current = new Set();
    }, [currentLesson?.id]);

    // Track lesson start in PostHog
    useEffect(() => {
        if (!mounted || !currentLesson?.id) return;
        if (posthog.__loaded) {
            posthog.capture('lesson_started', {
                lesson_id: currentLesson.id,
                lesson_title: currentLesson.title,
                course_id: currentLesson.course,
            });
        }
    }, [mounted, currentLesson?.id, currentLesson?.title, currentLesson?.course]);

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

    const estMinutesRemaining = useMemo(() => {
        const blocksLeft = Math.max(0, sortedBlocks.length - currentBlockIndex - 1);
        return Math.max(2, blocksLeft * 3);
    }, [sortedBlocks.length, currentBlockIndex]);

    // Current problem derived from problems state and current block
    const currentProblem = useMemo(() => {
        if (!problems || (problems?.length || 0) === 0) return null;
        const problemId = sortedBlocks[currentBlockIndex]?.problem;
        return problems.find(p => p.id === problemId) || problems[0];
    }, [problems, sortedBlocks, currentBlockIndex]);

    const showChallengeSoftInvite =
        lessonNumberInCourse > FREE_TIER_LESSON_COUNT && !isPayingSubscriber;

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

    useEffect(() => {
        setShowCompletionAnimation(false);
        setCompletionNavigateMeta(null);
        setNavigating(false);
    }, [params.lessonId]);

    // Sync lesson to Zustand for other components
    useEffect(() => {
        if (swrLesson) {
            setCurrentLesson(swrLesson as any);
        }
    }, [swrLesson, setCurrentLesson]);


    // Play start lesson sound when lesson is loaded and ready
    useEffect(() => {
        if (currentLesson && !isLoading && (sortedBlocks?.length || 0) > 0 && !hasPlayedStartSound) {
            setHasPlayedStartSound(true);
        }
    }, [currentLesson, isLoading, sortedBlocks?.length, hasPlayedStartSound]);

    // Warm bridge: on lesson load, silent fetch first video URL with Range to prime cache/session
    useEffect(() => {
        if (!sortedBlocks?.length) return;
        const firstVideoBlock = sortedBlocks.find((b) => b.block_type === "video");
        if (!firstVideoBlock?.content) return;
        const c = typeof firstVideoBlock.content === "string" ? JSON.parse(firstVideoBlock.content) : firstVideoBlock.content;
        const url = c?.source || c?.url;
        if (url && typeof url === "string" && url.includes("/bridge/dl/")) {
            fetch(url, { headers: { Range: "bytes=0-1048575" } }).catch(() => {});
        }
    }, [sortedBlocks]);

    // Prefetch next block when current block is not video and next block is video (1MB to warm bridge/cache)
    useEffect(() => {
        if (!sortedBlocks?.length || currentBlockIndex < 0) return;
        const nextBlock = sortedBlocks[currentBlockIndex + 1];
        if (nextBlock?.block_type !== "video" || !nextBlock.content) return;
        const c = typeof nextBlock.content === "string" ? JSON.parse(nextBlock.content) : nextBlock.content;
        const url = c?.source || c?.url;
        if (url && typeof url === "string" && url.includes("/bridge/dl/")) {
            fetch(url, { headers: { Range: "bytes=0-1048575" } }).catch(() => {});
        }
    }, [currentBlockIndex, sortedBlocks]);

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
                optionsDetail: Array.isArray(pd.options)
                    ? pd.options.map((opt: any) =>
                        typeof opt === 'object' && opt && opt.text != null
                            ? {
                                id: opt.id,
                                text: String(opt.text),
                                wrong_explanation: opt.wrong_explanation,
                            }
                            : { text: typeof opt === 'string' ? opt : '' }
                    )
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
                "Su'aalaha lama soo gelin karo"
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

        window.scrollTo({ top: 0, behavior: "instant" });
        setShowFeedback(false);

        if (!isLastBlock) {
            setCurrentBlockIndex((i) => Math.min(i + 1, lastIndex));
            return;
        }

        // Handle completion with modal
        const problemBlocks = sortedBlocks.filter(
            (b) => b.block_type === "problem" && b.problem != null && b.problem !== undefined
        );
        const hasQuiz = problemBlocks.length > 0;
        const quizTotal = problemBlocks.length;
        const quizScore = hasQuiz
            ? Math.round(
                  (Math.min(solvedProblemIdsRef.current.size, quizTotal) / quizTotal) * 100
              )
            : 100;
        setCompletionHasQuiz(hasQuiz);
        setCompletionScore(quizScore);
        setCompletionNavigateMeta(null);

        let navMeta: CompletionNavigateMeta | null = null;

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

            const auth = AuthService.getInstance();
            if (auth.isAuthenticated()) {
                try {
                    const completedProblemIds = sortedBlocks
                        .filter((b) => b.block_type === "problem" && b.problem)
                        .map((b) => b.problem);

                    const res = await auth.makeAuthenticatedRequest<LessonCompleteApiResponse>(
                        "post",
                        `/api/lms/lessons/${currentLesson.id}/complete/`,
                        {
                            completed_problems: completedProblemIds,
                            total_score: quizScore,
                        }
                    );
                    if (res?.status === "success") {
                        if ("next_lesson_id" in res) {
                            navMeta = {
                                nextLessonId: res.next_lesson_id ?? null,
                                nextLessonTitle: res.next_lesson_title ?? null,
                            };
                        } else {
                            const ordered = [...courseLessons].sort(
                                (a, b) =>
                                    ((a as { lesson_number?: number }).lesson_number ?? 0) -
                                    ((b as { lesson_number?: number }).lesson_number ?? 0)
                            );
                            const currentIdx = ordered.findIndex((l) => l.id === currentLesson.id);
                            const nextLesson =
                                currentIdx !== -1 && currentIdx < ordered.length - 1
                                    ? ordered[currentIdx + 1]
                                    : null;
                            navMeta = {
                                nextLessonId: nextLesson?.id ?? null,
                                nextLessonTitle: nextLesson?.title ?? null,
                            };
                        }
                    }
                } catch (err) {
                    console.error("Completion error", err);
                    navMeta = null;
                }
            }
        }

        setCompletionNavigateMeta(navMeta);
        setShowCompletionAnimation(true);

        // Track lesson completion in PostHog
        if (posthog.__loaded && currentLesson?.id) {
            posthog.capture('lesson_completed', {
                lesson_id: currentLesson.id,
                lesson_title: currentLesson.title,
                course_id: currentLesson.course,
                score: quizScore,
                has_next_lesson: !!(navMeta?.nextLessonId),
            });
        }
    }, [currentBlockIndex, sortedBlocks, currentLesson?.id, courseLessons]);

    useEffect(() => {
        if (!showCompletionAnimation || completionNavigateMeta === null) return;

        const cancelled = { v: false };
        let toastDismiss: (() => void) | undefined;
        let redirectTimer: ReturnType<typeof setTimeout> | undefined;

        const run = () => {
            if (cancelled.v) return;
            const { nextLessonId, nextLessonTitle } = completionNavigateMeta;

            const { dismiss } = toast({
                title:
                    nextLessonId != null
                        ? `Xiga: ${nextLessonTitle || "casharka xiga"}`
                        : "Koorsada waa la soo celinayaa",
                description:
                    nextLessonId != null
                        ? "Waxaan kugu wareejinaynaa xilli yar…"
                        : "Waxaad ku noqonaysaa bogga koorsada…",
                duration: 4000,
                action: (
                    <ToastAction
                        altText="Jooji toos u wareejinta"
                        onClick={() => {
                            cancelled.v = true;
                            if (redirectTimer) clearTimeout(redirectTimer);
                            dismiss();
                        }}
                    >
                        Jooji
                    </ToastAction>
                ),
            });
            toastDismiss = dismiss;

            redirectTimer = setTimeout(() => {
                if (cancelled.v) return;
                dismiss();
                setShowCompletionAnimation(false);
                setNavigating(true);
                setCompletionNavigateMeta(null);
                if (nextLessonId != null) {
                    router.push(
                        `/courses/${params.categoryId}/${params.courseSlug}/lessons/${nextLessonId}`
                    );
                } else {
                    router.push(`${coursePath}?completed=true`);
                }
            }, 3000);
        };

            const afterAnimationMs = setTimeout(run, 2000);

        return () => {
            cancelled.v = true;
            clearTimeout(afterAnimationMs);
            if (redirectTimer) clearTimeout(redirectTimer);
            toastDismiss?.();
        };
    }, [
        showCompletionAnimation,
        completionNavigateMeta,
        coursePath,
        router,
        params.categoryId,
        params.courseSlug,
        toast,
    ]);

    const handleCompletionAnimationFinish = useCallback(() => {
        setCompletionNavigateMeta(null);
        setShowCompletionAnimation(false);
        setNavigating(true);

        const sortedLessons = [...courseLessons].sort(
            (a, b) => ((a as { lesson_number?: number }).lesson_number ?? 0) - ((b as { lesson_number?: number }).lesson_number ?? 0)
        );
        const currentIdx = sortedLessons.findIndex((l) => l.id === currentLesson?.id);
        const nextLesson =
            currentIdx !== -1 && currentIdx < sortedLessons.length - 1 ? sortedLessons[currentIdx + 1] : null;

        if (nextLesson) {
            router.push(`/courses/${params.categoryId}/${params.courseSlug}/lessons/${nextLesson.id}`);
        } else {
            router.push(`${coursePath}?completed=true`);
        }
    }, [router, coursePath, courseLessons, currentLesson?.id, params.categoryId, params.courseSlug]);

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
            const correctAnswers = currentProblem.correct_answer?.map((ans) => (ans.text || "").toLowerCase().trim()) || [];
            isCorrect = correctAnswers.includes((userSelections[0] || "").toLowerCase().trim());
        } else if (currentProblem.question_type === "multiple_choice" || currentProblem.question_type === "single_choice" || currentProblem.question_type === "mcq") {
            // Compare by option text (trimmed); only one option is selected at a time
            const correctTexts = new Set(
                (currentProblem.correct_answer || [])
                    .map((ans) => (ans.text || "").trim())
                    .filter(Boolean)
            );
            const selectedText = (userSelections[0] || "").trim();
            isCorrect = correctTexts.size > 0 && correctTexts.has(selectedText);
        } else {
            const correctAnswer = currentProblem.correct_answer?.map((ans) => (ans.text || "").trim());
            isCorrect = correctAnswer?.includes((userSelections[0] || "").trim()) || false;
        }

        if (isCorrect) {
            if (currentProblem.id != null) {
                solvedProblemIdsRef.current.add(Number(currentProblem.id));
            }
        }

        const rawExpl = currentProblem.explanation;
        const explPlain =
            typeof rawExpl === "string"
                ? rawExpl
                : rawExpl && typeof rawExpl === "object"
                  ? Object.values(rawExpl)
                        .filter((t): t is string => typeof t === "string" && Boolean(t.trim()))
                        .join("\n\n")
                  : "";

        const selectedText = (userSelections[0] || "").trim();
        const optDetail = currentProblem.optionsDetail?.find(
            (o) => (o.text || "").trim() === selectedText
        );

        const toHtmlParagraphs = (plain: string) =>
            plain.includes("<") && plain.includes(">")
                ? plain
                : plain
                      .replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                      .replace(/\n\n/g, "</p><p>")
                      .replace(/\n/g, "<br/>");

        if (isCorrect) {
            const explBody = explPlain ? stripDuplicateCorrectExplanationLead(explPlain) : "";
            const correctHtml = explBody
                ? `<div class="feedback-prose text-xs sm:text-sm leading-relaxed text-zinc-300 [&_p]:mb-2 [&_strong]:text-emerald-200/90"><p><strong>Sababta jawaabtu sax tahay:</strong></p><p>${toHtmlParagraphs(explBody)}</p></div>`
                : "";
            setExplanationData({
                explanation: correctHtml,
                image: "",
                type: currentProblem.content?.type || "",
            });
        } else {
            const wrongFromOpt = optDetail?.wrong_explanation?.trim();
            let wrongHtml = wrongFromOpt || "";
            if (!wrongHtml && explPlain) {
                const inner = toHtmlParagraphs(explPlain);
                wrongHtml = `<div class="feedback-prose text-xs sm:text-sm leading-relaxed text-zinc-300 [&_p]:mb-2"><p><strong>Maxaa loo qaldantahay?</strong></p><p>${inner}</p></div>`;
            } else if (wrongHtml && !wrongHtml.includes("Maxaa loo qaldantahay")) {
                wrongHtml = `<div class="feedback-prose text-xs sm:text-sm leading-relaxed text-zinc-300 [&_p]:mb-2"><p><strong>Maxaa loo qaldantahay?</strong></p><div>${wrongHtml}</div></div>`;
            } else if (wrongHtml) {
                wrongHtml = `<div class="feedback-prose text-xs sm:text-sm leading-relaxed text-zinc-300 [&_p]:mb-2">${wrongHtml}</div>`;
            } else {
                wrongHtml = `<div class="feedback-prose text-xs sm:text-sm text-zinc-400"><p><strong>Maxaa loo qaldantahay?</strong></p><p>Dib u eeg cutubka casharka oo isku day mar kale.</p></div>`;
            }
            setExplanationData({
                explanation: wrongHtml,
                image: "",
                type: currentProblem.content?.type || "",
            });
        }

        setIsCorrect(isCorrect);
        setShowFeedback(true);

        if (!isCorrect && currentProblem.question_type !== "short_input") {
            // For single choice: disable the wrong option so it can't be selected again; keep it visually selected
            if (!Array.isArray(selectedOption)) {
                setDisabledOptions((prev) => [...prev, selectedOption]);
                // Do not clear selectedOption — wrong option stays visible and disabled
            }
            // For multiple choice, we don't disable options, just reset
        }
    }, [selectedOption, currentProblem]);

    const handleResetAnswer = useCallback(() => {
        resetAnswerState();
        setShowFeedback(false);
        setSelectedOption(null);
        setDisabledOptions([]);
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
                        showReviewBanner={false}
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
                        lessonId={currentLesson?.id != null ? Number(currentLesson.id) : undefined}
                        onPlaybackEnded={handleVideoPlaybackEnded}
                    />
                );

            case "code":
                const codeContent = typeof block.content === 'string' ? JSON.parse(block.content) : block.content;
                return (
                    <div className="w-full px-4 sm:px-6 lg:px-0 max-w-2xl mx-auto space-y-4">
                        <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 overflow-x-auto">
                            <ShikiCode code={codeContent.code || ""} language={codeContent.language || "javascript"} />
                        </div>
                        {codeContent.explanation && (
                            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-6">
                                <p className="text-zinc-300 text-sm leading-relaxed">{codeContent.explanation}</p>
                            </div>
                        )}
                        <Button onClick={handleContinue} className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm">
                            {isLastBlock ? "Dhamee" : "Sii wad"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );

            case "example":
                const exampleContent = typeof block.content === 'string' ? JSON.parse(block.content) : block.content;
                return (
                    <div className="w-full px-4 sm:px-6 lg:px-0 max-w-2xl mx-auto mb-4 sm:mb-5">
                        <div className="rounded-2xl bg-zinc-900 border border-amber-500/30 p-5 sm:p-6">
                            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-3">Tusaale</p>
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
                    <div className="w-full px-4 sm:px-6 lg:px-0 max-w-2xl mx-auto">
                        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-center space-y-4">
                            <p className="text-zinc-400 text-sm">Nooca waxyaabahan weli lama taageerayo.</p>
                            <Button onClick={handleContinue} className="h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-6">
                                Sii wad
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
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
        isReviewMode,
        currentLesson,
        handleVideoPlaybackEnded,
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
        const courseSlug = params.courseSlug as string;
        // Ordered by lesson_number to match backend
        const sortedLessons = [...courseLessons].sort((a, b) => ((a as any).lesson_number ?? 0) - ((b as any).lesson_number ?? 0));
        const currentIdx = sortedLessons.findIndex(l => l.id === currentLesson?.id);
        const nextLesson = currentIdx !== -1 && currentIdx < sortedLessons.length - 1 ? sortedLessons[currentIdx + 1] : null;
        const listCount = sortedLessons.length;
        const declaredCount = (currentCourse as { lesson_count?: number } | null)?.lesson_count ?? 0;
        const totalLessonsCount = Math.max(listCount, declaredCount, 1);
        const enrollmentProgressPercent = courseIdFromSlug && enrollments
            ? (enrollments.find((e: { course: number }) => e.course === courseIdFromSlug) as { progress_percent?: number } | undefined)?.progress_percent ?? 0
            : 0;
        const completedForCourse = (userProgress ?? []).filter(
            (p: { status: string; course_slug?: string }) =>
                p.status === "completed" && p.course_slug === courseSlug
        );
        const completedLessonsCount = Math.min(
            completedForCourse.length + 1,
            totalLessonsCount
        );
        const courseProgressPercent = totalLessonsCount > 0
            ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
            : enrollmentProgressPercent;
        const courseFullyComplete = completedLessonsCount >= totalLessonsCount;

        return (
            <LessonCompleteModal
                lessonTitle={currentLesson?.title || ""}
                score={completionScore}
                hasQuiz={completionHasQuiz}
                courseProgressPercent={courseProgressPercent}
                completedLessonsCount={completedLessonsCount}
                totalLessonsCount={totalLessonsCount}
                hasNextLesson={!!nextLesson}
                courseFullyComplete={courseFullyComplete}
                onNextLesson={handleCompletionAnimationFinish}
                onReview={() => {
                    setCompletionNavigateMeta(null);
                    setShowCompletionAnimation(false);
                }}
                onDashboard={() => {
                    setCompletionNavigateMeta(null);
                    setShowCompletionAnimation(false);
                }}
                lessonId={currentLesson.id}
                showExplorerUpsell={!AuthService.getInstance().isPremium()}
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
        <div className="relative min-h-screen bg-zinc-950 flex flex-col overflow-x-hidden overscroll-y-contain">
            <div
                className="pointer-events-none fixed inset-0 z-0"
                aria-hidden
                style={{
                    background:
                        "radial-gradient(ellipse 85% 45% at 50% -8%, rgba(139, 92, 246, 0.11), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(59, 130, 246, 0.05), transparent 50%)",
                }}
            />
            <div className="relative z-10 flex flex-col flex-1 min-h-0">
            <EmailVerificationBanner />
            <LessonStepBullets
                currentIndex={currentBlockIndex}
                totalSteps={sortedBlocks?.length || 0}
                onStepClick={(blockIndex) => setCurrentBlockIndex(blockIndex)}
                coursePath={coursePath}
                onBackRequest={() => setShowQuitConfirm(true)}
                lessonPositionLabel={lessonPositionLabel}
                estMinutesRemaining={estMinutesRemaining}
            />

            <AlertDialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
                <AlertDialogContent className="max-w-sm rounded-2xl border-zinc-800 bg-zinc-900 p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold text-white">
                            Ma hubtaa inaad ka baxayso?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400 text-sm">
                            Haddii aad baxdo, horumarka casharkan weli waa la keydinayaa.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-2 sm:justify-end mt-6">
                        <AlertDialogCancel className="rounded-xl border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-800">
                            Maya
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.push(coursePath)}
                            className="rounded-xl bg-violet-600 hover:bg-violet-500 text-white"
                        >
                            Haa, bax
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <main
                ref={lessonMainRef}
                className={cn(
                    "flex-1 flex flex-col items-center justify-center min-h-0 w-full px-0 pt-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch]",
                    showFeedback ? "pb-44" : "pb-6"
                )}
            >
                <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
                    <div className="flex flex-col w-full overflow-hidden">
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
                        {showChallengeSoftInvite ? <LessonChallengeSoftInvite /> : null}
                    </div>
                </div>
            </main>

            </div>
            {showFeedback && (
                <AnswerFeedback
                    isCorrect={isCorrect}
                    currentLesson={currentLesson as any}
                    onResetAnswer={handleResetAnswer}
                    onContinue={handleContinue}
                    explanationData={explanationData}
                />
            )}
        </div>
    );
};


