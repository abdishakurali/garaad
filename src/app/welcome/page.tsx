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
import { Loader2, RotateCcw, X } from "lucide-react";
import { useSoundManager } from "@/hooks/use-sound-effects";
import { isAllowedRedirect } from "@/lib/auth-redirect";
import { progressService } from "@/services/progress";
import { getResumeLessonPath } from "@/lib/onboarding-resume";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";

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
  goal?: string;
  experience?: string;
  barrier?: string | null;
  learning_goal?: string;
  topic?: string;
  project_idea?: string;
  project_description?: string;
};

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
  return {
    welcome_v2: {
      goal: answers.goal ?? null,
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

  return {
    goal: answers.goal!,
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
  { heading: string; subheading: string }
> = {
  goal: {
    heading: "Maxaad doonaysaa inaad gaarto?",
    subheading:
      "Runta sheeg — tani waxay naga caawinaysaa inaan kula dhisno wax adiga kugu habboon.",
  },
  experience: {
    heading: "Horey ma isugu dayday inaad coding barato?",
    subheading:
      "Halkan jawaab khaldan ma jirto — tani waxay naga caawinaysaa inaan meesha saxda ah kaaga bilaabno.",
  },
  barrier: {
    heading: "Maxaa markii hore ku hor istaagay?",
    subheading: "Kani waa su'aasha noogu muhiimsan ee aan ku weydiinno.",
  },
  time: {
    heading:
      "Waqti intee le'eg ayaad toddobaadkii si dhab ah u bixin kartaa?",
    subheading:
      "Si dhab ah u hadal — joogteynta ayaa ka muhiimsan dadaalka badan ee mar qura ah.",
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
        "Horey ayaad isugu dayday — markan farqiga jira waa in Abdishakuur uu kula joogo."
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
        "Challenge-ga dhexdiisa waligaa keligaa ma noqonaysid — Abdishakuur iyo 9 arday oo kale ayaa kula jooga toddobaad kasta."
      );
      break;
    case "expensive":
      parts.push(
        "$149 hal bixis ah. 7 maalmood oo lacag celin ah. Wax khatar ah ma leh."
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

  switch (a.goal) {
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
    "Abdishakuur ayaa kula joogi doona toddobaad kasta muddo 3 bilood ah. Af Soomaali."
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
  const [phase, setPhase] = useState<"wizard" | "challenge">("wizard");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
    promoCode: "",
  });
  const [actualError, setActualError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [showAllStepOptions, setShowAllStepOptions] = useState(false);
  const [wizardHydrated, setWizardHydrated] = useState(false);
  const [postSignupDest, setPostSignupDest] = useState("/courses");

  const { playSound } = useSoundManager();
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
          if (parsed.answers) setAnswers(parsed.answers);
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
            setAnswers((prev) => ({ ...prev, ...wv }));
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
    const ref = searchParams.get("ref");
    if (ref) {
      setUserData((prev) => ({ ...prev, referralCode: ref }));
    }
  }, [searchParams]);

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
      const g = answersRef.current.goal;
      const tracksViewed =
        typeof g === "string" ? topicsByGoal[g] ?? [] : [];
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
    const g = answers.goal;
    const allowed = g ? topicsByGoal[g] ?? [] : [];
    return topics.filter((t) => allowed.includes(t.id)) as OptionRow[];
  }, [answers.goal]);

  const { visibleOptions, optionsHasMore } = useMemo(() => {
    if (currentKind !== "goal" && currentKind !== "track") {
      return { visibleOptions: null as OptionRow[] | null, optionsHasMore: false };
    }
    const opts = currentKind === "goal" ? (goals as OptionRow[]) : trackOptions;
    if (!opts?.length) {
      return { visibleOptions: null, optionsHasMore: false };
    }
    if (!isMobile || opts.length <= MOBILE_OPTION_COLLAPSE_AT || showAllStepOptions) {
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
    if (currentKind !== "goal" && currentKind !== "track") return;
    const opts = currentKind === "goal" ? goals : trackOptions;
    if (
      !opts?.length ||
      !isMobile ||
      opts.length <= MOBILE_OPTION_COLLAPSE_AT
    ) {
      return;
    }
    const sel = currentKind === "goal" ? answers.goal : answers.topic;
    if (!sel) return;
    const idx = opts.findIndex((o) => o.id === sel);
    if (idx >= MOBILE_OPTION_COLLAPSE_AT) {
      setShowAllStepOptions(true);
    }
  }, [currentKind, trackOptions, isMobile, answers.goal, answers.topic]);

  const selectIdForKind = useCallback(
    (kind: StepKind): string | undefined => {
      switch (kind) {
        case "goal":
          return answers.goal;
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
    playSound("toggle-on");

    if (kind === "goal") {
      setAnswers((prev) => {
        const next = { ...prev, goal: id };
        const allowed = topicsByGoal[id] ?? [];
        if (next.topic && !allowed.includes(next.topic)) {
          delete next.topic;
        }
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
    playSound("toggle-on");
    setAnswers((prev) => {
      const next = { ...prev };
      if (kind === "goal") {
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
    const id = selectIdForKind(currentKind);
    if (currentKind === "project") {
      if (!id) return false;
      if (id === "yes_clear" || id === "yes_vague") {
        return (answers.project_description ?? "").trim().length > 0;
      }
      return true;
    }
    return Boolean(id);
  }, [currentKind, selectIdForKind, answers.project_description]);

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
      referralCode: userData.referralCode,
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
      a.goal &&
        a.experience &&
        a.learning_goal &&
        a.topic &&
        a.project_idea &&
        (a.experience !== "tried_before" || a.barrier !== undefined)
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
          const payload = {
            goal: answers.goal!.trim(),
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
        ...(userData.referralCode
          ? { referral_code: userData.referralCode.trim() }
          : {}),
        ...(userData.promoCode ? { promo_code: userData.promoCode.trim() } : {}),
      };

      const result = await AuthService.getInstance().signUp(signUpData);

      if (result?.user) {
        setAuthStoreUser({
          ...result.user,
          is_premium: result.user.is_premium || false,
          referral_code: result.user.referral_code,
          referral_points: result.user.referral_points,
          referral_count: result.user.referral_count,
          referred_by: result.user.referred_by,
          referred_by_username: result.user.referred_by_username,
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
        setPhase("challenge");
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

  const showRecBadge = (topicId: string) => {
    const g = answers.goal;
    if (!g) return false;
    const exp = answers.experience;
    if (exp !== "first_time" && exp !== "tried_before") return false;
    return recommendedTopicByGoal[g] === topicId;
  };

  const renderOptionCard = (
    kind: StepKind,
    option: OptionRow,
    selectedId: string | undefined
  ) => {
    const isSelected = selectedId === option.id;
    return (
      <div key={option.id} className="group relative min-h-[104px]">
        <div
          className={cn(
            "flex min-h-[104px] items-stretch overflow-hidden rounded-xl border-2 transition-all duration-200 ease-in-out",
            isSelected
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/10 bg-white/[0.02] hover:border-purple-500/60",
            option.disabled && "pointer-events-none opacity-50"
          )}
        >
          <div
            role="button"
            tabIndex={option.disabled || isLoading ? -1 : 0}
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
            className="flex min-w-0 flex-1 cursor-pointer items-center p-4 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
              <div className="text-purple-400">{option.icon}</div>
            </div>
            <div className="flex-1 px-4 text-sm font-medium text-white md:text-base">
              {option.text}
            </div>
          </div>
          {isSelected && (
            <button
              type="button"
              aria-label="Ka saar doorashada"
              disabled={isLoading}
              className="flex shrink-0 items-center justify-center border-l border-white/10 px-3 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => toggleDeselect(kind, option.id)}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          )}
        </div>
        {kind === "track" && showRecBadge(option.id) && (
          <div className="absolute -top-2 right-2 rounded-full border border-purple-400/40 bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-200">
            Adiga ayaa lagula taliyay
          </div>
        )}
        {isSelected && (
          <div className="absolute -top-2 left-4 max-w-[calc(100%-3rem)] rounded-full border border-purple-500/30 bg-purple-950/90 px-3 py-1 text-xs leading-snug text-purple-100">
            {option.badge}
          </div>
        )}
      </div>
    );
  };

  if (resumeRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 py-12 text-white">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ku soo dhowow, {firstName}.
          </h1>
          <p className="text-left text-base leading-relaxed text-zinc-300 md:text-lg">
            {narrative}
          </p>

          <ul className="space-y-2 text-left text-sm text-zinc-400">
            {answers.barrier === "english" && (
              <li>✓ Wax kasta waxaa lagu baranayaa af Soomaali.</li>
            )}
            {answers.barrier === "alone" && (
              <li>✓ Mentor dhab ah toddobaad kasta — Abdishakuur.</li>
            )}
            <li>✓ $149 — hal bixis muddo 3 bilood ah.</li>
            <li>✓ 7 maalmood oo damaanad ah (lacag celin).</li>
            <li>✓ Kaliya 10 arday ayaa koox kasta ka mid ah.</li>
            <li>
              ✓ {spotsLabel} boos ayaa ka haray kooxdan.
              {challengeLoading && !challengeData ? " …" : ""}
            </li>
          </ul>

          {waitlist && (
            <p className="text-sm text-zinc-400">
              Kooxta hadda waa buuxday — kii xiga markuu furmo waxaad ahaanaysaa
              kii ugu horreeyay ee la xiriiraa.
            </p>
          )}

          <div className="flex flex-col gap-4 pt-4">
            <Button
              asChild
              className="h-14 w-full rounded-xl bg-purple-600 text-base font-semibold text-white transition-all duration-200 hover:bg-purple-700"
            >
              <Link href="/subscribe?plan=challenge">
                {waitlist
                  ? "Liiska Sugitaanka gal →"
                  : `Ku soo biir Challenge-ga — ${spotsLabel} boos ayaa haray →`}
              </Link>
            </Button>
            <Link
              href={postSignupDest}
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("post_signup_redirect", postSignupDest);
                }
              }}
              className="text-center text-sm text-purple-400 underline-offset-4 hover:text-purple-300 hover:underline"
            >
              Marka hore bilaash ku tijaabi — eeg casharrada
            </Link>
          </div>
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-2 py-6 text-white">
      <Card className="mx-auto w-full max-w-2xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-lg">
        <CardContent className="p-0">
          <Progress
            value={progressPct}
            className="h-1.5 rounded-none bg-white/10 [&>div]:bg-purple-600 [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-in-out"
          />
          <p className="border-b border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs text-zinc-400 sm:text-sm">
            Tallaabada{" "}
            <span className="font-medium text-white">{progressCurrent}</span> ee{" "}
            <span className="font-medium text-white">{progressTotal}</span>
          </p>

          <div className="flex flex-col p-4 md:p-6">
            <div className="mb-6 flex items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                {currentKind === "personal"
                  ? "Waxyar ayaa kuu dhiman."
                  : STEP_COPY[currentKind as Exclude<StepKind, "personal">]
                      .heading}
              </h2>
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="flex shrink-0 items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  Bilow cusub
                </button>
              )}
            </div>

            {currentKind !== "personal" && (
              <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                {STEP_COPY[currentKind as Exclude<StepKind, "personal">]
                  .subheading}
              </p>
            )}

            {currentKind === "personal" && (
              <p className="mb-6 text-sm leading-relaxed text-zinc-400">
                Sameyso account si aad u xafidato horumarkaaga.
              </p>
            )}

            {actualError && (
              <Alert
                variant="destructive"
                className="mb-6 border-red-500/40 bg-red-950/40"
              >
                <AlertTitle className="font-medium">Khalad</AlertTitle>
                <AlertDescription>{actualError}</AlertDescription>
                {actualError.includes("sign in") && (
                  <div className="mt-3">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-purple-400 underline"
                    >
                      Soo gal
                    </Link>
                  </div>
                )}
              </Alert>
            )}

            {(currentKind === "goal" || currentKind === "track") && listOpts && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {listOpts.map((opt) =>
                  renderOptionCard(currentKind, opt, selectedId)
                )}
              </div>
            )}

            {currentKind === "experience" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {(experienceOptions as OptionRow[]).map((opt) =>
                  renderOptionCard("experience", opt, answers.experience)
                )}
              </div>
            )}

            {currentKind === "barrier" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {(learningGoals as OptionRow[]).map((opt) =>
                  renderOptionCard("time", opt, answers.learning_goal)
                )}
              </div>
            )}

            {currentKind === "project" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {(projectIdeaOptions as OptionRow[]).map((opt) =>
                    renderOptionCard("project", opt, answers.project_idea)
                  )}
                </div>
                {(answers.project_idea === "yes_clear" ||
                  answers.project_idea === "yes_vague") && (
                  <div className="space-y-2 pt-2">
                    <Label className="text-zinc-200">
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
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                    />
                    <p className="text-xs text-zinc-500">
                      {projectIdeaPrompt.helpText}
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentKind === "personal" && (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-200">
                    Magacaaga oo buuxa
                  </Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData((u) => ({ ...u, name: e.target.value }))
                    }
                    disabled={isLoading}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-200">
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
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-200">
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
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promoCode" className="text-zinc-400">
                    Koodka Dalacsiinta (Ikhtiyaari)
                  </Label>
                  <Input
                    id="promoCode"
                    value={userData.promoCode}
                    onChange={(e) =>
                      setUserData((u) => ({ ...u, promoCode: e.target.value }))
                    }
                    disabled={isLoading}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>Ku soo biiritaan waa bilaash — looma baahna credit card.</li>
                  <li>Waddadii laguu diyaariyay waa diyaar.</li>
                  <li>
                    Bilaash ku billow, markaad diyaar tahayna kor u qaado.
                  </li>
                </ul>
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <input
                    type="checkbox"
                    id="termsAcceptance"
                    checked
                    readOnly
                    className="mt-1 h-4 w-4 cursor-default rounded border-white/20"
                  />
                  <label
                    htmlFor="termsAcceptance"
                    className="text-sm leading-relaxed text-zinc-300"
                  >
                    Wan aqbalay{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-purple-400 hover:underline"
                    >
                      shuruudaha Garaad
                    </Link>
                  </label>
                </div>
                <p className="text-center text-sm text-zinc-400">
                  Horey ma uu kuu jiraan akoon?{" "}
                  <Link href="/login" className="text-purple-400 hover:underline">
                    Soo gal
                  </Link>
                </p>
              </form>
            )}

            <div
              className={cn(
                "mt-8 w-full",
                "max-md:sticky max-md:bottom-4 max-md:z-20 max-md:border-t max-md:border-white/10 max-md:bg-[#0f0f0f]/95 max-md:pt-4 max-md:backdrop-blur-sm"
              )}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  disabled={stepIndex === 0 || isLoading}
                  className="text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  Dib u noqo
                </Button>
                <div className="flex flex-1 flex-col gap-2 sm:max-w-md sm:flex-row sm:justify-end">
                  {currentKind === "barrier" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={skipBarrier}
                      disabled={isLoading}
                      className="border-white/20 bg-transparent text-zinc-200 hover:bg-white/5"
                    >
                      Ka bood tallaabadan
                    </Button>
                  )}
                  {currentKind === "personal" ? (
                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={(e) => void handleSubmit(e)}
                      className="h-12 flex-1 rounded-xl bg-purple-600 font-semibold text-white hover:bg-purple-700"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {loadingPhase <= 1
                            ? "Account-kaaga ayaa la diyaarinayaa..."
                            : loadingPhase === 2
                              ? "Waddadaada gaarka ah ayaa la dhisayaa..."
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
                      className="h-12 flex-1 rounded-xl bg-purple-600 font-semibold text-white hover:bg-purple-700 disabled:opacity-40"
                    >
                      Horey u soco
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {optionsHasMore && (currentKind === "goal" || currentKind === "track") && (
              <button
                type="button"
                className="mt-3 w-full py-2 text-sm text-purple-400 hover:underline"
                onClick={() => setShowAllStepOptions(true)}
              >
                Muuji dhammaan
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        </div>
      }
    >
      <WelcomeOnboardingPage />
    </Suspense>
  );
}
