"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  Suspense,
  useCallback,
} from "react";
import type { FormEvent, ReactNode } from "react";
import { usePostHog } from "posthog-js/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import AuthService from "@/services/auth";
import type { SignUpData } from "@/services/auth";
import { validateEmail } from "@/lib/email-validation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, Loader2, RotateCcw, Sparkles, X, AlertTriangle } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { isAllowedRedirect } from "@/lib/auth-redirect";
import { progressService } from "@/services/progress";
import { getResumeLessonPath } from "@/lib/onboarding-resume";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

import {
  goals,
  topics,
  topicsByGoal,
  learningGoals,
  experienceOptions,
  barrierOptions,
  projectIdeaOptions,
  projectIdeaPrompt,
  recommendedTopicByGoal,
} from "@/config/onboarding-data";
import { useIsMobile } from "@/hooks/use-mobile";

const MOBILE_OPTION_COLLAPSE_AT = 3;
const WELCOME_STORAGE_KEY = "welcome_onboarding_v2";
const SIGNUP_DEFAULT_AGE = 18;

type StepKind =
  | "goal"
  | "experience"
  | "barrier"
  | "time"
  | "track"
  | "project"
  | "personal";

type Answers = {
  /** Primary goal for API / legacy; kept in sync with goals[0] when goals is set */
  goal?: string;
  /** Multi-select on step 1; first item is canonical `goal` for tracks + backend */
  goals?: string[];
  experience?: string;
  barrier?: string | null;
  learning_goal?: string;
  topic?: string;
  project_idea?: string;
  project_description?: string;
};

function getSelectedGoals(a: Answers): string[] {
  if (a.goals?.length) return a.goals;
  if (a.goal) return [a.goal];
  return [];
}

function normalizeAnswersGoals(
  partial: Partial<Answers> & Record<string, unknown>
): Pick<Answers, "goals" | "goal"> {
  const rawGoals = partial.goals;
  const single = partial.goal;
  if (Array.isArray(rawGoals) && rawGoals.length > 0) {
    return { goals: rawGoals, goal: rawGoals[0] };
  }
  if (typeof single === "string" && single) {
    return { goals: [single], goal: single };
  }
  return {};
}

function stepsForAnswers(a: Answers): StepKind[] {
  const s: StepKind[] = ["goal", "experience"];
  if (a.experience === "tried_before") s.push("barrier");
  s.push("time", "track", "project", "personal");
  return s;
}

function learningGoalToMinutes(id: string): number {
  const n = Number.parseInt(String(id), 10);
  return Number.isNaN(n) ? 15 : n;
}

function buildWizardSnapshot(answers: Answers): Record<string, unknown> {
  const barrier =
    answers.experience === "tried_before"
      ? answers.barrier ?? null
      : null;
  const goalIds = getSelectedGoals(answers);
  return {
    welcome_v2: {
      goals: goalIds.length ? goalIds : null,
      goal: goalIds[0] ?? answers.goal ?? null,
      experience: answers.experience ?? null,
      barrier,
      learning_goal: answers.learning_goal ?? null,
      topic: answers.topic ?? null,
      project_idea: answers.project_idea ?? null,
      project_description: answers.project_description?.trim() || null,
    },
  };
}

function buildOnboardingPayload(answers: Answers): SignUpData["onboarding_data"] {
  const lg = answers.learning_goal ?? "15_min";
  const minutes = learningGoalToMinutes(lg);
  const barrier =
    answers.experience === "tried_before"
      ? answers.barrier ?? null
      : null;
  const desc = answers.project_description?.trim() || null;
  const snap = buildWizardSnapshot(answers);

  const primaryGoal = getSelectedGoals(answers)[0] ?? answers.goal!;
  return {
    goal: primaryGoal,
    topic: answers.topic!,
    math_level: "beginner",
    minutes_per_day: minutes,
    preferred_study_time: "flexible",
    learning_approach: "Waxbarasho shaqsiyeed",
    learning_goal: lg,
    project_idea: answers.project_idea!,
    project_description: desc,
    experience: answers.experience!,
    barrier,
    wizard_progress: snap,
  };
}

const STEP_COPY: Record<
  Exclude<StepKind, "personal">,
  { heading: string; subheading?: string }
> = {
  goal: {
    heading: "Maxaad doonaysaa inaad gaarto?",
  },
  experience: {
    heading: "Horey ma isugu dayday inaad coding barato?",
  },
  barrier: {
    heading: "Maxaa markii hore ku hor istaagay?",
    subheading: "Kani waa su'aasha noogu muhiimsan ee aan ku weydiinno.",
  },
  time: {
    heading:
      "Waqti intee le'eg ayaad toddobaadkii si dhab ah u bixin kartaa?",
  },
  track: {
    heading: "Maxaad doonaysaa inaad dhisato?",
    subheading:
      "Dooro midda aad aadka u xiisaynayso — kuwa kale mar dambe ayaad dhex geli kartaa.",
  },
  project: {
    heading: "Ma haysaa fikrad mashruuc?",
    subheading:
      "Habka ugu fiican ee wax loo barto waa inaad wax dhab ah dhisato.",
  },
};

type OptionRow = {
  id: string;
  text: string;
  badge: string;
  subtitle?: string;
  icon: ReactNode;
  disabled?: boolean;
};

function buildChallengeNarrative(a: Answers): string {
  const parts: string[] = [];

  switch (a.experience) {
    case "first_time":
      parts.push(
        "Wali hal xariiq oo code ah ma qorin — taasi waa meesha ugu fiican ee laga bilaabo."
      );
      break;
    case "tried_before":
      parts.push(
        "Horey ayaad isugu dayday — markan farqiga jira waa in mentor xirfadle ah uu kula joogo oo kuu hagayo."
      );
      break;
    case "knows_basics":
      parts.push(
        "Aasaaska waad taqaanaa — hadda waa waqtigii aad wax dhab ah dhisid lahayd."
      );
      break;
    case "can_build":
      parts.push(
        "Waxba waad dhison kartaa — Challenge-gu wuxuu kuu qaadayaa ilaa heerka ugu sarreeya."
      );
      break;
    default:
      break;
  }

  switch (a.barrier) {
    case "english":
      parts.push(
        "Taas ayaa ah sababta Garaad Challenge loo sameeyay — wax kasta waa Soomaali."
      );
      break;
    case "alone":
      parts.push(
        "Challenge-ga dhexdiisa waligaa keligaa ma noqonaysid — mentor xirfadle ah iyo sagaal arday oo kale ayaa kula jooga toddobaad kasta."
      );
      break;
    case "expensive":
      parts.push(
        "Qiimuhu waa ku dheellitiran yahay waxa aad hesho — ma aha bootcamp $10k+ ah. Wax khatar ah ma leh marka aad isku daydo."
      );
      break;
    case "life":
      parts.push(
        "Challenge-gu wuxuu la jaanqaadayaa noloshaada — 30 daqiiqo maalintii ayaa kugu filan."
      );
      break;
    case "overwhelming":
      parts.push(
        "Challenge-gu wuxuu ku siinayaa hal waddo oo cad — ma jirto jahawareer ama qiyaas waxaad baran lahayd."
      );
      break;
    default:
      break;
  }

  const primaryGoal = getSelectedGoals(a)[0] ?? a.goal;
  switch (primaryGoal) {
    case "get_hired":
      parts.push(
        "Markaad dhammayso waxaad haysan doontaa portfolio iyo shahaado ready u ah suuqa shaqada."
      );
      break;
    case "build_product":
      parts.push(
        "Markaad dhammayso waxaad haysan doontaa alaab dhab ah oo shaqaynaysa."
      );
      break;
    case "freelance":
      parts.push(
        "Markaad dhammayso waxaad haysan doontaa portfolio-gaagii ugu horreeyay ee aad macaamiisha ku tustid."
      );
      break;
    case "level_up":
      parts.push(
        "Markaad dhammayso waxaad haysan doontaa xirfado heerka-sare ah iyo mashruuc dhab ah oo aad tustid."
      );
      break;
    case "understand_tech":
      parts.push(
        "Markaad dhammayso waxaad haysan doontaa aqoon tech oo kugu filan si aad kooxdaada kalsooni ugu hoggaamiso."
      );
      break;
    default:
      break;
  }

  parts.push(
    "Mentor xirfadle ah oo ku hadlaya af Soomaali ayaa kula joogi doona toddobaad kasta muddo saddex bilood ah."
  );

  return parts.filter(Boolean).join(" ");
}

function WelcomeOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postAuthRedirect = useMemo(() => {
    const r = searchParams.get("redirect");
    return isAllowedRedirect(r) ? r : null;
  }, [searchParams]);

  const [resumeRedirecting, setResumeRedirecting] = useState(false);
  const [phase, setPhase] = useState<"wizard" | "verify_email" | "challenge">("wizard");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    promoCode: "",
  });
  const [actualError, setActualError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [showAllStepOptions, setShowAllStepOptions] = useState(false);
  const [wizardHydrated, setWizardHydrated] = useState(false);
  const [postSignupDest, setPostSignupDest] = useState("/courses");
  const [verifyCode, setVerifyCode] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);

  const posthog = usePostHog();
  const posthogRef = useRef(posthog);
  posthogRef.current = posthog;
  const isMobile = useIsMobile();
  const exitCapturedRef = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const { data: challengeData, loading: challengeLoading } =
    useChallengeStatus();

  const steps = useMemo(() => stepsForAnswers(answers), [answers]);
  const currentKind = steps[Math.min(stepIndex, steps.length - 1)];

  const { error: authStoreError, setError: setAuthStoreError, setUser: setAuthStoreUser } =
    useAuthStore();

  useEffect(() => {
    setStepIndex((i) => Math.min(i, Math.max(0, steps.length - 1)));
  }, [steps.length]);

  // Check email verification on mount and redirect to verify if needed
  useEffect(() => {
    if (!wizardHydrated) return;
    const auth = AuthService.getInstance();
    if (auth.isAuthenticated() && !auth.getCurrentUser()?.is_email_verified) {
      setPhase("verify_email");
    }
  }, [wizardHydrated]);

  useEffect(() => {
    if (answers.experience !== "tried_before" && answers.barrier != null) {
      setAnswers((prev) => ({ ...prev, barrier: null }));
    }
  }, [answers.experience, answers.barrier]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const loadLocal = () => {
      const raw = localStorage.getItem(WELCOME_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as {
            answers?: Answers;
            stepIndex?: number;
            phase?: "wizard" | "challenge";
            userData?: typeof userData;
          };
          if (parsed.answers) {
            const a = parsed.answers as Answers;
            setAnswers({ ...a, ...normalizeAnswersGoals(a) });
          }
          if (typeof parsed.stepIndex === "number") setStepIndex(parsed.stepIndex);
          if (parsed.phase === "challenge") setPhase("challenge");
          if (parsed.userData) setUserData((u) => ({ ...u, ...parsed.userData }));
        } catch (e) {
          console.error("welcome v2 parse", e);
        }
      }
      const savedUserData = localStorage.getItem("welcome_user_data");
      if (savedUserData && !raw) {
        try {
          setUserData((u) => ({ ...u, ...JSON.parse(savedUserData) }));
        } catch {
          /* ignore */
        }
      }
    };

    (async () => {
      const auth = AuthService.getInstance();
      if (auth.isAuthenticated()) {
        try {
          const data = await auth.getOnboarding();
          const w = data.wizard_progress as Record<string, unknown> | undefined;
          const wv = w?.welcome_v2 as Answers | undefined;
          if (!cancelled && wv && typeof wv === "object") {
            const wa = wv as Answers;
            setAnswers((prev) => ({
              ...prev,
              ...wa,
              ...normalizeAnswersGoals(wa),
            }));
            if (typeof w.current_step === "number" && w.current_step >= 0) {
              setStepIndex(w.current_step);
            }
            setWizardHydrated(true);
            return;
          }
          if (!cancelled && w && typeof w === "object") {
            const wp = w as Record<string, unknown>;
            if (typeof wp.current_step === "number") {
              setStepIndex(wp.current_step);
            }
          }
        } catch {
          /* fallback */
        }
      }
      if (!cancelled) {
        loadLocal();
        setWizardHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!wizardHydrated) return;
    const auth = AuthService.getInstance();
    if (!auth.isAuthenticated()) return;
    const t = window.setTimeout(() => {
      auth
        .patchOnboardingWizardProgress({
          current_step: stepIndex,
          user_data: userData,
          selections: answers as unknown as Record<number, string | number>,
          topic_levels: {},
          selected_topic: answers.topic ?? "",
          welcome_v2: answers,
          phase,
        })
        .catch(() => {});
    }, 600);
    return () => clearTimeout(t);
  }, [wizardHydrated, stepIndex, userData, answers, phase]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      WELCOME_STORAGE_KEY,
      JSON.stringify({ answers, stepIndex, phase, userData })
    );
  }, [answers, stepIndex, phase, userData]);

  useEffect(() => {
    const auth = AuthService.getInstance();
    if (!auth.isAuthenticated()) return;

    let cancelled = false;
    (async () => {
      try {
        const list = await progressService.getUserProgress();
        if (cancelled || !list?.length) return;
        setResumeRedirecting(true);
        router.replace(getResumeLessonPath(list));
      } catch {
        /* stay */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingPhase(0);
      return;
    }
    setLoadingPhase(1);
    const t2 = window.setTimeout(() => setLoadingPhase(2), 1500);
    const t3 = window.setTimeout(() => setLoadingPhase(3), 3000);
    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isLoading]);

  useEffect(() => {
    exitCapturedRef.current = false;
    const captureWelcomeExit = () => {
      if (exitCapturedRef.current) return;
      exitCapturedRef.current = true;
      const gs = getSelectedGoals(answersRef.current);
      const seen = new Set<string>();
      gs.forEach((g) =>
        (topicsByGoal[g] ?? []).forEach((tid) => seen.add(tid))
      );
      const tracksViewed = Array.from(seen);
      const trackSel = answersRef.current.topic;
      const deviceType =
        typeof window !== "undefined" && window.innerWidth < 768
          ? "mobile"
          : "desktop";
      posthogRef.current?.capture("welcome_page_exited", {
        tracks_viewed: tracksViewed,
        track_selected:
          trackSel === undefined || trackSel === null ? null : String(trackSel),
        device_type: deviceType,
      });
    };
    const onPageHide = () => captureWelcomeExit();
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      captureWelcomeExit();
    };
  }, []);

  useEffect(() => {
    if (authStoreError) setAuthStoreError(null);
  }, [authStoreError, setAuthStoreError]);

  const trackOptions = useMemo(() => {
    const gs = getSelectedGoals(answers);
    if (!gs.length) return [] as OptionRow[];
    const allowed = new Set<string>();
    gs.forEach((g) =>
      (topicsByGoal[g] ?? []).forEach((tid) => allowed.add(tid))
    );
    return topics.filter((t) => allowed.has(t.id)) as OptionRow[];
  }, [answers.goal, answers.goals]);

  const { visibleOptions, optionsHasMore } = useMemo(() => {
    if (currentKind !== "goal" && currentKind !== "track") {
      return { visibleOptions: null as OptionRow[] | null, optionsHasMore: false };
    }
    const opts = currentKind === "goal" ? (goals as OptionRow[]) : trackOptions;
    if (!opts?.length) {
      return { visibleOptions: null, optionsHasMore: false };
    }
    const collapseAt =
      currentKind === "goal" ? opts.length : MOBILE_OPTION_COLLAPSE_AT;
    if (!isMobile || opts.length <= collapseAt || showAllStepOptions) {
      return { visibleOptions: opts, optionsHasMore: false };
    }
    return {
      visibleOptions: opts.slice(0, MOBILE_OPTION_COLLAPSE_AT),
      optionsHasMore: true,
    };
  }, [currentKind, trackOptions, isMobile, showAllStepOptions]);

  useEffect(() => {
    setShowAllStepOptions(false);
  }, [currentKind]);

  useEffect(() => {
    if (currentKind !== "track") return;
    const opts = trackOptions;
    if (
      !opts?.length ||
      !isMobile ||
      opts.length <= MOBILE_OPTION_COLLAPSE_AT
    ) {
      return;
    }
    const sel = answers.topic;
    if (!sel) return;
    const idx = opts.findIndex((o) => o.id === sel);
    if (idx >= MOBILE_OPTION_COLLAPSE_AT) {
      setShowAllStepOptions(true);
    }
  }, [currentKind, trackOptions, isMobile, answers.topic]);

  const selectIdForKind = useCallback(
    (kind: StepKind): string | undefined => {
      switch (kind) {
        case "goal":
          return answers.goals?.length
            ? answers.goals[0]
            : answers.goal;
        case "experience":
          return answers.experience;
        case "barrier":
          return answers.barrier ?? undefined;
        case "time":
          return answers.learning_goal;
        case "track":
          return answers.topic;
        case "project":
          return answers.project_idea;
        default:
          return undefined;
      }
    },
    [answers]
  );

  const handleSelectOption = (kind: StepKind, id: string) => {
    if (isLoading) return;

    if (kind === "goal") {
      setAnswers((prev) => {
        const cur = getSelectedGoals(prev);
        const isOn = cur.includes(id);
        const nextIds = isOn ? cur.filter((x) => x !== id) : [...cur, id];
        const next: Answers = { ...prev };
        if (nextIds.length === 0) {
          delete next.goals;
          delete next.goal;
          delete next.topic;
          return next;
        }
        next.goals = nextIds;
        next.goal = nextIds[0];
        const allowed = new Set<string>();
        nextIds.forEach((g) =>
          (topicsByGoal[g] ?? []).forEach((tid) => allowed.add(tid))
        );
        if (next.topic && !allowed.has(next.topic)) delete next.topic;
        return next;
      });
      return;
    }
    if (kind === "experience") {
      setAnswers((prev) => {
        const next = { ...prev, experience: id };
        if (id !== "tried_before") next.barrier = null;
        return next;
      });
      return;
    }
    if (kind === "barrier") {
      setAnswers((prev) => ({ ...prev, barrier: id }));
      return;
    }
    if (kind === "time") {
      setAnswers((prev) => ({ ...prev, learning_goal: id }));
      return;
    }
    if (kind === "track") {
      setAnswers((prev) => ({ ...prev, topic: id }));
      posthog?.capture("onboarding_track_selected", {
        track_id: id,
        track_name: topics.find((t) => t.id === id)?.text ?? id,
      });
      return;
    }
    if (kind === "project") {
      setAnswers((prev) => ({
        ...prev,
        project_idea: id,
        project_description:
          id === "no_idea" ? "" : prev.project_description ?? "",
      }));
    }
  };

  const toggleDeselect = (kind: StepKind, id: string) => {
    if (selectIdForKind(kind) !== id) return;
    setAnswers((prev) => {
      const next = { ...prev };
      if (kind === "goal") {
        delete next.goals;
        delete next.goal;
        delete next.topic;
      } else if (kind === "experience") {
        delete next.experience;
        next.barrier = null;
      } else if (kind === "barrier") {
        next.barrier = null;
      } else if (kind === "time") {
        delete next.learning_goal;
      } else if (kind === "track") {
        delete next.topic;
      } else if (kind === "project") {
        delete next.project_idea;
        next.project_description = "";
      }
      return next;
    });
  };

  const canAdvance = useMemo(() => {
    if (currentKind === "goal") {
      return getSelectedGoals(answers).length >= 1;
    }
    const id = selectIdForKind(currentKind);
    if (currentKind === "project") {
      if (!id) return false;
      if (id === "yes_clear" || id === "yes_vague") {
        return (answers.project_description ?? "").trim().length > 0;
      }
      return true;
    }
    return Boolean(id);
  }, [
    currentKind,
    selectIdForKind,
    answers.project_description,
    answers.goal,
    answers.goals,
  ]);

  const goNext = () => {
    if (!canAdvance || stepIndex >= steps.length - 1) return;
    setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    if (stepIndex <= 0) return;
    setStepIndex((i) => i - 1);
  };

  const skipBarrier = () => {
    if (currentKind !== "barrier") return;
    setAnswers((prev) => ({ ...prev, barrier: null }));
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  };

  const clearWelcomeStorage = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(WELCOME_STORAGE_KEY);
    localStorage.removeItem("welcome_user_data");
    localStorage.removeItem("welcome_selections");
    localStorage.removeItem("welcome_current_step");
    localStorage.removeItem("welcome_topic_levels");
    localStorage.removeItem("welcome_selected_topic");
    localStorage.removeItem("user");
  };

  const handleStartOver = () => {
    clearWelcomeStorage();
    setPhase("wizard");
    setStepIndex(0);
    setAnswers({});
    setUserData({
      name: "",
      email: "",
      password: "",
      promoCode: "",
    });
    setActualError("");
    setIsLoading(false);
    setShowAllStepOptions(false);
  };

  const validatePersonal = (): string | null => {
    if (!userData.name.trim()) return "Meeshan waa qasab in la buuxiyo.";
    if (!userData.email.trim()) return "Meeshan waa qasab in la buuxiyo.";
    if (!userData.password.trim()) return "Meeshan waa qasab in la buuxiyo.";
    const ev = validateEmail(userData.email);
    if (!ev.isValid) return "Fadlan geli email sax ah.";
    if (userData.password.length < 8) {
      return "Password-ku waa inuu ka koobnaadaa ugu yaraan 8 xaraf.";
    }
    return null;
  };

  const onboardingCompleteEnough = (a: Answers) =>
    Boolean(
      getSelectedGoals(a).length >= 1 &&
        a.experience &&
        a.learning_goal &&
        a.topic &&
        a.project_idea &&
        (a.experience !== "tried_before" || a.barrier !== undefined)
    );

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setActualError("");
      if (!onboardingCompleteEnough(answers)) {
        setActualError(
          "Fadlan buuxi dhammaan su'aalaha ka hor intaadan Google isticmaalin."
        );
        return;
      }
      setIsLoading(true);
      setAuthStoreError(null);
      try {
        const authService = AuthService.getInstance();
        const onboarding_data = buildOnboardingPayload(answers);
        const result = await authService.signInWithGoogle({
          credential,
          onboarding_data,
          ...(userData.promoCode.trim() ? { promo_code: userData.promoCode.trim() } : {}),
        });

        if (result?.user) {
          setAuthStoreUser({
            ...result.user,
            is_premium: result.user.is_premium || false,
          });
        }

        let finalDest =
          (postAuthRedirect && postAuthRedirect.startsWith("/")
            ? postAuthRedirect
            : null) ||
          (result?.redirect_url && result.redirect_url.startsWith("/")
            ? result.redirect_url
            : null);

        const topic = String(answers.topic ?? "").trim();
        const deeplink = await AuthService.getInstance().getOnboardingFirstLesson(topic);
        if (!finalDest) {
          finalDest = deeplink.path || "/courses";
        }

        setPostSignupDest(finalDest);

        posthog?.capture("onboarding_completed", {
          destination_lesson_id: deeplink.lesson_id ?? undefined,
          source: "google_gis",
        });

        clearWelcomeStorage();
        setPhase("challenge");
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "";
        if (error instanceof Error) {
          setActualError(errMsg || "Google ma guulaysan. Fadlan isku day email/password.");
        } else {
          setActualError("Waxbaa khaldamay. Fadlan mar kale isku day.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      answers,
      userData.promoCode,
      postAuthRedirect,
      posthog,
      setAuthStoreUser,
    ]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setActualError("");
    const v = validatePersonal();
    if (v) {
      setActualError(v);
      return;
    }

    if (!onboardingCompleteEnough(answers)) {
      setActualError("Fadlan buuxi dhammaan su'aalaha");
      return;
    }

    setIsLoading(true);
    setAuthStoreError(null);

    try {
      const authService = AuthService.getInstance();
      const currentUser = authService.getCurrentUser();
      const isCompletingOnboarding =
        authService.isAuthenticated() &&
        currentUser &&
        currentUser.has_completed_onboarding === false;

      if (isCompletingOnboarding) {
        try {
          const lg = answers.learning_goal ?? "15_min";
          const mins = learningGoalToMinutes(lg);
          const primary = getSelectedGoals(answers)[0] ?? answers.goal!;
          const payload = {
            goal: primary.trim(),
            learning_approach: "Waxbarasho shaqsiyeed",
            topic: answers.topic!.trim(),
            math_level: "beginner",
            minutes_per_day: mins,
            preferred_study_time: "flexible",
            wizard_progress: {
              ...buildWizardSnapshot(answers),
              current_step: stepIndex,
            },
          };
          const res = await authService.completeOnboarding(payload);
          await authService.fetchAndUpdateUserData();
          clearWelcomeStorage();
          const updated = authService.getCurrentUser();
          if (updated) {
            setAuthStoreUser({
              ...updated,
              has_completed_onboarding: true,
            });
          }
          posthog?.capture("onboarding_completed", {
            destination_lesson_id: res.destination_lesson_id ?? undefined,
          });
          router.replace(postAuthRedirect || res.redirect_url || "/dashboard");
          return;
        } catch (err) {
          console.error(err);
          setActualError("Waxbaa khaldamay. Fadlan mar kale isku day.");
          return;
        }
      }

      const onboarding_data = buildOnboardingPayload(answers);

      const signUpData: SignUpData = {
        email: userData.email.trim(),
        password: userData.password.trim(),
        name: userData.name.trim(),
        username: userData.email.trim(),
        age: SIGNUP_DEFAULT_AGE,
        onboarding_data,
        ...(userData.promoCode ? { promo_code: userData.promoCode.trim() } : {}),
      };

      const result = await AuthService.getInstance().signUp(signUpData);

      if (result?.user) {
        setAuthStoreUser({
          ...result.user,
          is_premium: result.user.is_premium || false,
        });
      }

      if (result) {
        let finalDest =
          (postAuthRedirect && postAuthRedirect.startsWith("/")
            ? postAuthRedirect
            : null) ||
          (result.redirect_url && result.redirect_url.startsWith("/")
            ? result.redirect_url
            : null);

        const topic = String(answers.topic ?? "").trim();
        const deeplink = await AuthService.getInstance().getOnboardingFirstLesson(
          topic
        );
        if (!finalDest) {
          finalDest = deeplink.path || "/courses";
        }

        setPostSignupDest(finalDest);

        posthog?.capture("onboarding_completed", {
          destination_lesson_id: deeplink.lesson_id ?? undefined,
        });

        clearWelcomeStorage();
        setPhase("verify_email");
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "";
      const emailTaken =
        errMsg.includes("Email-kan waa la isticmaalay") ||
        errMsg.includes("email:") ||
        errMsg.toLowerCase().includes("already") ||
        errMsg.includes("already exists");

      if (emailTaken) {
        setActualError(
          "Email-kan account ayaa horay loogu sameeyay. Ma doonaysaa inaad gasho (sign in)?"
        );
        return;
      }
      if (error instanceof Error) {
        setActualError(error.message);
      } else {
        setActualError("Waxbaa khaldamay. Fadlan mar kale isku day.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const firstName = useMemo(() => {
    const p = userData.name.trim().split(/\s+/);
    return p[0] || "saaxiib";
  }, [userData.name]);

  const progressTotal = steps.length;
  const progressCurrent = Math.min(stepIndex + 1, progressTotal);
  const progressPct =
    progressTotal > 0 ? (progressCurrent / progressTotal) * 100 : 0;

  const [animatedProgress, setAnimatedProgress] = useState(0);
  useEffect(() => {
    const target = progressPct;
    setAnimatedProgress(0);
    let raf = 0;
    let cancelled = false;
    const start = performance.now();
    const duration = 400;
    const easeOut = (t: number) => 1 - (1 - t) ** 3;
    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      setAnimatedProgress(target * easeOut(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [progressPct]);

  const forwardCtaLabel = useMemo(() => {
    if (currentKind !== "goal") return "Horey u soco";
    const n = getSelectedGoals(answers).length;
    if (n === 0) return "Dooro mid — ka dibna soco";
    if (n === 1) return "Horey u soco";
    return `Horey u soco (${n} doorasho)`;
  }, [currentKind, answers.goal, answers.goals]);

  const showRecBadge = (topicId: string) => {
    const gs = getSelectedGoals(answers);
    if (!gs.length) return false;
    const exp = answers.experience;
    if (exp !== "first_time" && exp !== "tried_before") return false;
    return gs.some((g) => recommendedTopicByGoal[g] === topicId);
  };

  const renderGoalOptionCard = (option: OptionRow) => {
    const selected = getSelectedGoals(answers);
    const isSelected = selected.includes(option.id);
    const sub = option.subtitle ?? option.badge;
    return (
      <div key={option.id} className="relative">
        <div
          role="button"
          tabIndex={option.disabled || isLoading ? -1 : 0}
          aria-pressed={isSelected}
          onClick={() => {
            if (!option.disabled && !isLoading) {
              handleSelectOption("goal", option.id);
            }
          }}
          onKeyDown={(e) => {
            if (
              (e.key === "Enter" || e.key === " ") &&
              !option.disabled &&
              !isLoading
            ) {
              e.preventDefault();
              handleSelectOption("goal", option.id);
            }
          }}
          className={cn(
            "flex min-h-[72px] cursor-pointer items-start gap-2 overflow-hidden rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40",
            isSelected
              ? "border-violet-500/80 bg-violet-500/10 shadow-md shadow-violet-500/10 ring-1 ring-violet-500/15 dark:border-violet-400/70 dark:bg-violet-500/15"
              : "border-border bg-card/50 hover:border-violet-400/45 hover:bg-muted/40 dark:bg-slate-900/50",
            option.disabled && "pointer-events-none opacity-50"
          )}
        >
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/12 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300">
              {option.icon}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                {option.text}
              </p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {sub}
              </p>
            </div>
          </div>
          <span
            aria-hidden
            className={cn(
              "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-2 transition-colors",
              isSelected
                ? "border-violet-600 bg-violet-600 text-white dark:border-violet-500 dark:bg-violet-500"
                : "border-border bg-transparent"
            )}
          >
            {isSelected ? (
              <Check className="h-3 w-3 stroke-[3]" aria-hidden />
            ) : null}
          </span>
        </div>
      </div>
    );
  };

  const renderOptionCard = (
    kind: StepKind,
    option: OptionRow,
    selectedId: string | undefined
  ) => {
    const isSelected = selectedId === option.id;
    return (
      <div key={option.id} className="group relative">
        <div
          className={cn(
            "flex min-h-[68px] items-stretch overflow-hidden rounded-xl border-2 transition-all duration-200 ease-in-out",
            isSelected
              ? "border-violet-500/80 bg-violet-500/10 shadow-md shadow-violet-500/10 ring-1 ring-violet-500/15 dark:border-violet-400/70 dark:bg-violet-500/15"
              : "border-border bg-card/50 hover:border-violet-400/45 hover:bg-muted/40 dark:bg-slate-900/50",
            option.disabled && "pointer-events-none opacity-50"
          )}
        >
          <div
            role="button"
            tabIndex={option.disabled || isLoading ? -1 : 0}
            aria-pressed={isSelected}
            onClick={() => {
              if (!option.disabled && !isLoading) {
                if (isSelected) toggleDeselect(kind, option.id);
                else handleSelectOption(kind, option.id);
              }
            }}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                !option.disabled &&
                !isLoading
              ) {
                e.preventDefault();
                if (isSelected) toggleDeselect(kind, option.id);
                else handleSelectOption(kind, option.id);
              }
            }}
            className="flex min-w-0 flex-1 cursor-pointer flex-col gap-0 p-3 text-left"
          >
            <div className="flex items-start gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/12 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300">
                {option.icon}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {option.text}
                </p>
                {isSelected && (
                  <p className="mt-1.5 border-t border-violet-500/25 pt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {option.badge}
                  </p>
                )}
              </div>
            </div>
          </div>
          {isSelected && (
            <button
              type="button"
              aria-label="Ka saar doorashada"
              disabled={isLoading}
              className="flex shrink-0 self-stretch items-start border-l border-border px-3 pt-4 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                toggleDeselect(kind, option.id);
              }}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          )}
        </div>
        {kind === "track" && showRecBadge(option.id) && (
          <div className="pointer-events-none absolute -top-2 right-2 z-10 rounded-full border border-violet-500/35 bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold text-violet-700 shadow-sm dark:border-violet-400/40 dark:bg-violet-500/25 dark:text-violet-200">
            Adiga ayaa lagula taliyay
          </div>
        )}
      </div>
    );
  };

  if (resumeRedirecting) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
          aria-hidden
        />
        <Loader2 className="relative z-10 size-10 animate-spin text-violet-600 dark:text-violet-400" />
      </div>
    );
  }

  // Email verification required
  if (phase === "verify_email") {
    const verifyEmail = userData.email || AuthService.getInstance().getCurrentUser()?.email || "";

    const handleVerifyCode = async () => {
      if (!verifyCode.trim()) return;
      setActualError("");
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/verify-email/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: verifyEmail, code: verifyCode.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        // Refresh user data then go to challenge
        await AuthService.getInstance().fetchAndUpdateUserData();
        const updated = AuthService.getInstance().getCurrentUser();
        if (updated) setAuthStoreUser({ ...updated, is_premium: updated.is_premium || false });
        setVerifySuccess(true);
        setPhase("challenge");
      } catch (e) {
        setActualError(e instanceof Error ? e.message : "Waxbaa khaldamay. Mar kale isku day.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleResend = async () => {
      setActualError("");
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/resend-verification/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: verifyEmail }),
        });
        if (!res.ok) throw new Error("Failed");
      } catch {
        setActualError("Waxbaa khaldamay. Mar kale isku day.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-foreground dark:bg-slate-950">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6 sm:py-8">
          <header className="mb-4 flex flex-col items-center gap-3 sm:mb-6">
            <Link href="/" className="rounded-2xl">
              <Logo priority loading="eager" className="h-10 sm:h-11" />
            </Link>
          </header>
          <main className="flex flex-1 flex-col justify-center pb-6">
            <Card className="w-full overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl shadow-violet-500/[0.07] ring-1 ring-black/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/75 dark:shadow-black/40 dark:ring-white/10">
              <CardContent className="space-y-5 p-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                  <Check className="size-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Xaqiiji Email-kaaga</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Koodhka 6-lambareed waxaa loo diray:
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-violet-600 dark:text-violet-400">
                    {verifyEmail}
                  </p>
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="verifyCode" className="text-sm font-semibold text-foreground">
                    Geli koodhka xaqiijinta
                  </Label>
                  <Input
                    id="verifyCode"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    disabled={isLoading}
                    onKeyDown={(e) => { if (e.key === "Enter") void handleVerifyCode(); }}
                    className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-center text-2xl tracking-[0.4em] transition-shadow focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                  />
                </div>
                <Button
                  onClick={() => void handleVerifyCode()}
                  disabled={isLoading || verifyCode.trim().length < 4}
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60"
                >
                  {isLoading ? <Loader2 className="size-5 animate-spin" /> : "Xaqiiji →"}
                </Button>
                {actualError && (
                  <Alert variant="destructive">
                    <AlertDescription>{actualError}</AlertDescription>
                  </Alert>
                )}
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  Koodhka ma heshay? <span className="font-semibold text-violet-600 dark:text-violet-400">Dir mar kale</span>
                </button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (phase === "challenge") {
    const spots = challengeData?.spots_remaining;
    const spotsLabel =
      typeof spots === "number" ? String(spots) : "…";
    const waitlist = challengeData?.is_waitlist_only === true;
    const narrative = buildChallengeNarrative(answers);

    return (
      <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-foreground dark:bg-slate-950">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-24 h-[24rem] w-[24rem] rounded-full bg-purple-400/20 blur-3xl dark:bg-fuchsia-600/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[length:2.5rem_2.5rem] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-10 sm:py-14">
          <header className="mb-8 flex flex-col items-center gap-5 sm:mb-10">
            <Link
              href="/"
              className="rounded-2xl outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Logo priority loading="eager" className="h-11 sm:h-12" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              Ku laabo koorsooyinka
            </Link>
          </header>

          <main className="flex flex-1 flex-col justify-center pb-8">
            <Card className="w-full overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl shadow-violet-500/[0.07] ring-1 ring-black/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/75 dark:shadow-black/40 dark:ring-white/10">
              <CardContent className="space-y-4 p-4 text-center sm:space-y-4 sm:p-5 md:text-left">
                <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 md:mx-0">
                  <Sparkles className="size-5" aria-hidden />
                </div>
                {waitlist && (
                  <p className="text-sm text-muted-foreground">
                    Cohort-ka hadda waa buuxaa — markii kan xiga uu furmo adiga ayaa noqon doona qofka ugu horreeya ee lala soo xiriiro.
                  </p>
                )}

                <div className="rounded-xl border border-violet-200/50 bg-violet-50/40 p-3 dark:border-violet-500/20 dark:bg-violet-500/10 sm:rounded-2xl sm:p-4">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    Tallaabadaada xigta: Dooro sida aad rabto inaad ku bilaubto
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Waxaad leedahay laba waddo: in mentor uu tallaabo-tallaabo kuu haggo, ama inaad koorsooyinka ku bilaubto lacag la&apos;aan.
                  </p>
                </div>

                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  {/* Option 1 — Recommended: Ballan Samee */}
                  <div className="relative rounded-xl border-2 border-violet-500/60 bg-violet-50/50 p-3 dark:bg-violet-500/10 sm:rounded-2xl sm:p-4">
                    <span className="absolute -top-2.5 left-3 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Lagu taliyay
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-foreground sm:text-sm">
                      1) Qabso Ballan — Mentor 1:1
                    </h4>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                      Ha kuu hanuuniyo mentor qorshaha kugu habboon — si bilaash ah.
                    </p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300 sm:text-xs">
                      Maxaad helaysaa
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground sm:text-sm">
                      <li>✓ Qiimeyn 1:1 ah si loo ogaado heerkaaga</li>
                      <li>✓ Qorshe adiga kuu gaar ah oo ku salaysan hadafkaaga</li>
                      <li>✓ Tallaabo koowaad oo cad oo aad ku bilaubto</li>
                    </ul>
                    <Button
                      asChild
                      className="mt-3 h-10 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500 sm:mt-4 sm:h-11"
                    >
                      <Link
                        href="https://cal.com/garaad/assessment"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Qabso Ballan →
                      </Link>
                    </Button>
                  </div>

                  {/* Option 2 — Free Courses */}
                  <div className="rounded-xl border border-border bg-background/80 p-3 sm:rounded-2xl sm:p-4">
                    <h4 className="text-sm font-semibold text-foreground">
                      2) Billow Koorsooyin Bilaash ah
                    </h4>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                      Way fiican tahay haddii aad rabto inaad hadda bilowdo adigoon sugin.
                    </p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-200 sm:text-xs">
                      Maxaad helaysaa
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground sm:text-sm">
                      <li>✓ Koorsooyin bilaash ah oo diyaarsan isla hadda</li>
                      <li>✓ Waddada cad oo aad ku dhisato aasaaskaaga</li>
                      <li>✓ Waxaad qabsan kartaa qiimeyn waqti kasta</li>
                    </ul>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-3 h-10 w-full rounded-xl border-violet-200 bg-violet-50/70 text-sm font-semibold text-violet-700 hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:bg-violet-500/20 sm:mt-4 sm:h-11"
                    >
                      <Link
                        href={postSignupDest}
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            sessionStorage.setItem("post_signup_redirect", postSignupDest);
                          }
                        }}
                      >
                        Billow Koorsooyinka →
                      </Link>
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const listOpts =
    visibleOptions ??
    (currentKind === "goal"
      ? (goals as OptionRow[])
      : currentKind === "track"
        ? trackOptions
        : null);

  const selectedId = selectIdForKind(currentKind);

  const optionStepGridClass = (itemCount: number) =>
    "flex flex-col gap-1.5";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-foreground dark:bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-[24rem] w-[24rem] rounded-full bg-purple-400/20 blur-3xl dark:bg-fuchsia-600/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[length:2.5rem_2.5rem] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-3 py-3 sm:px-4 sm:py-5">
        <header className="mb-2 flex items-center justify-between">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3 shrink-0" aria-hidden />
            Koorsooyinka
          </Link>
          <Link
            href="/"
            className="rounded-xl outline-offset-4 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Logo priority loading="eager" className="h-7" />
          </Link>
          <div className="w-20" />
        </header>

        <Card className="mx-auto w-full overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl shadow-violet-500/[0.07] ring-1 ring-black/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/75 dark:shadow-black/40 dark:ring-white/10">
          <CardContent className="p-0">
            <Progress
              value={animatedProgress}
              className="h-1 rounded-none bg-muted [&>div]:bg-gradient-to-r [&>div]:from-violet-600 [&>div]:to-purple-600 [&>div]:transition-none"
            />

            <div className="flex flex-col p-3 md:p-4">
              <div className="mb-1.5 flex items-start justify-between gap-3">
                <h2 className="text-pretty text-lg font-bold tracking-tight text-foreground md:text-xl">
                  {currentKind === "personal"
                    ? "Waxyar ayaa kuu dhiman."
                    : STEP_COPY[currentKind as Exclude<StepKind, "personal">]
                        .heading}
                </h2>
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Bilow cusub
                  </button>
                )}
              </div>

              {currentKind !== "personal" && (
                <p className="mb-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {STEP_COPY[currentKind as Exclude<StepKind, "personal">]
                    .subheading}
                </p>
              )}

              {currentKind === "personal" && (
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                  Sameyso account si aad u xafidato horumarkaaga.
                </p>
              )}

              {actualError && (
                <Alert
                  variant="destructive"
                  className="mb-6 rounded-2xl border-red-200/80 bg-red-50/90 dark:border-red-900/50 dark:bg-red-950/40"
                >
                  <AlertTitle className="font-semibold">Khalad</AlertTitle>
                  <AlertDescription className="text-pretty">
                    {actualError}
                  </AlertDescription>
                  {actualError.includes("sign in") && (
                    <div className="mt-3">
                      <Link
                        href="/login"
                        className="text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
                      >
                        Soo gal
                      </Link>
                    </div>
                  )}
                </Alert>
              )}

            {currentKind === "goal" && listOpts && (
              <div className="flex flex-col gap-1.5">
                {listOpts.map((opt) => renderGoalOptionCard(opt))}
              </div>
            )}

            {currentKind === "track" && listOpts && (
              <div className={optionStepGridClass(listOpts.length)}>
                {listOpts.map((opt) =>
                  renderOptionCard("track", opt, selectedId)
                )}
              </div>
            )}

            {currentKind === "experience" && (
              <div className={optionStepGridClass(experienceOptions.length)}>
                {(experienceOptions as OptionRow[]).map((opt) =>
                  renderOptionCard("experience", opt, answers.experience)
                )}
              </div>
            )}

            {currentKind === "barrier" && (
              <div className={optionStepGridClass(barrierOptions.length)}>
                {(barrierOptions as OptionRow[]).map((opt) =>
                  renderOptionCard(
                    "barrier",
                    opt,
                    answers.barrier ?? undefined
                  )
                )}
              </div>
            )}

            {currentKind === "time" && (
              <div className={optionStepGridClass(learningGoals.length)}>
                {(learningGoals as OptionRow[]).map((opt) =>
                  renderOptionCard("time", opt, answers.learning_goal)
                )}
              </div>
            )}

            {currentKind === "project" && (
              <div className="space-y-4">
                <div className={optionStepGridClass(projectIdeaOptions.length)}>
                  {(projectIdeaOptions as OptionRow[]).map((opt) =>
                    renderOptionCard("project", opt, answers.project_idea)
                  )}
                </div>
                {(answers.project_idea === "yes_clear" ||
                  answers.project_idea === "yes_vague") && (
                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-semibold text-foreground">
                      {projectIdeaPrompt.label}
                    </Label>
                    <Input
                      value={answers.project_description ?? ""}
                      onChange={(e) =>
                        setAnswers((p) => ({
                          ...p,
                          project_description: e.target.value,
                        }))
                      }
                      placeholder={projectIdeaPrompt.placeholder}
                      disabled={isLoading}
                      className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                    />
                    <p className="text-xs text-muted-foreground">
                      {projectIdeaPrompt.helpText}
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentKind === "personal" && (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Magacaaga oo buuxa
                  </Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData((u) => ({ ...u, name: e.target.value }))
                    }
                    disabled={isLoading}
                    className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground"
                  >
                    Email-kaaga
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData((u) => ({ ...u, email: e.target.value }))
                    }
                    disabled={isLoading}
                    className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-foreground"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={userData.password}
                    onChange={(e) =>
                      setUserData((u) => ({ ...u, password: e.target.value }))
                    }
                    disabled={isLoading}
                    className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                  />
                </div>
                {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                  <div className="space-y-3">
                    <div className="relative py-1 text-center text-xs font-medium text-muted-foreground">
                      <span className="relative z-10 bg-card px-3">
                        ama sii wad Google
                      </span>
                      <span
                        className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border"
                        aria-hidden
                      />
                    </div>
                    <GoogleSignInButton
                      disabled={isLoading}
                      onCredential={(c) => void handleGoogleCredential(c)}
                    />
                  </div>
                ) : null}
                <div className="space-y-2">
                  <Label
                    htmlFor="promoCode"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Koodka Dalacsiinta (Ikhtiyaari)
                  </Label>
                  <Input
                    id="promoCode"
                    value={userData.promoCode}
                    onChange={(e) =>
                      setUserData((u) => ({ ...u, promoCode: e.target.value }))
                    }
                    disabled={isLoading}
                    className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                  />
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                  <input
                    type="checkbox"
                    id="termsAcceptance"
                    checked
                    readOnly
                    className="mt-1 h-4 w-4 cursor-default rounded border-border"
                  />
                  <label
                    htmlFor="termsAcceptance"
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    Wan aqbalay{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
                    >
                      shuruudaha Garaad
                    </Link>
                  </label>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Horey ma uu kuu jiraan akoon?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
                  >
                    Soo gal
                  </Link>
                </p>
              </form>
            )}

            <div
              className={cn(
                "mt-4 flex w-full items-center justify-between gap-3",
                "max-md:sticky max-md:bottom-4 max-md:z-20 max-md:-mx-4 max-md:border-t max-md:border-border max-md:bg-background/95 max-md:px-4 max-md:pb-1 max-md:pt-4 max-md:backdrop-blur-sm"
              )}
            >
              <div className="flex items-center gap-3">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={isLoading}
                    className="flex items-center gap-2 border-0 bg-transparent px-4 py-2 text-center text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground disabled:opacity-40"
                  >
                    <ArrowLeft className="size-4" />
                    Dib u noqo
                  </button>
                )}
                {currentKind === "barrier" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={skipBarrier}
                    disabled={isLoading}
                    className="border-border bg-background/80 text-foreground hover:bg-muted/50"
                  >
                    Ka bood
                  </Button>
                )}
              </div>
              {currentKind === "personal" ? (
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => void handleSubmit(e)}
                  className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/35 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {loadingPhase <= 1
                        ? "Account-kaaga..."
                        : loadingPhase === 2
                          ? "Waddadaada..."
                          : "Waxyar ayaa ka haray..."}
                    </span>
                  ) : (
                    "Sameyso account-kayga →"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance || isLoading}
                  className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/35 disabled:opacity-40"
                >
                  {forwardCtaLabel}
                </Button>
              )}
            </div>

            {optionsHasMore && (currentKind === "goal" || currentKind === "track") && (
              <button
                type="button"
                className="mt-3 w-full py-2 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
                onClick={() => setShowAllStepOptions(true)}
              >
                Muuji dhammaan
              </button>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
            aria-hidden
          />
          <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card/90 px-10 py-12 shadow-xl backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80">
            <Loader2 className="size-10 animate-spin text-violet-600 dark:text-violet-400" />
            <p className="text-sm font-medium text-muted-foreground">
              Waa la diyaarinayaa…
            </p>
          </div>
        </div>
      }
    >
      <WelcomeOnboardingPage />
    </Suspense>
  );
}
