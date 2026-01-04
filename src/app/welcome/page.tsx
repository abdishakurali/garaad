"use client";
import { useState, useEffect, useMemo } from "react";
import React from "react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthError,
  setError as setAuthError,
  setUser,
} from "@/store/features/authSlice";
import AuthService from "@/services/auth";
import type { AppDispatch } from "@/store";
import { validateEmail } from "@/lib/email-validation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Network,
  Globe,
  BookOpen,
  Code,
  Brain,
  Puzzle,
  Calculator,
  BarChart,
  Atom,
  Loader2,
  Clock,
  Clock1,
  Clock11,
  Clock12,
  Sunrise,
  Moon,
  SunDim,
  RotateCcw,
  User,
  Mail,
  Lock,
  Calendar,
  Tag,
} from "lucide-react";
import { useSoundManager } from "@/hooks/use-sound-effects";

import {
  stepTitles,
  goals,
  topics,
  topicsByGoal,
  topicLevelsByTopic,
  learningGoals
} from "@/config/onboarding-data";

export default function Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, number | string>>({});
  const [selectedTopic, setSelectedTopic] = useState<string>("saas_challenge");
  const [topicLevels, setTopicLevels] = useState<Record<string, string>>({
    saas_challenge: "beginner",
    web_development: "beginner",
    ai_python: "beginner",
    ui_ux_design: "beginner",
    math_engineering: "beginner",
  });
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    referralCode: "",
    promoCode: "",
  });
  const [actualError, setActualError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { playSound } = useSoundManager();
  const steps = [goals, topics, null, learningGoals];
  const progress = (currentStep / (steps.length + 1)) * 100;

  // Redux hooks
  const dispatch = useDispatch<AppDispatch>();
  const authError = useSelector(selectAuthError);

  // Load saved data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved user data
      const savedUserData = localStorage.getItem('welcome_user_data');
      if (savedUserData) {
        try {
          const parsedUserData = JSON.parse(savedUserData);
          setUserData(parsedUserData);
        } catch (e) {
          console.error('Failed to parse saved user data:', e);
        }
      }

      // Load saved selections
      const savedSelections = localStorage.getItem('welcome_selections');
      if (savedSelections) {
        try {
          const parsedSelections = JSON.parse(savedSelections);
          setSelections(parsedSelections);
        } catch (e) {
          console.error('Failed to parse saved selections:', e);
        }
      }

      // Load saved current step
      const savedStep = localStorage.getItem('welcome_current_step');
      if (savedStep) {
        try {
          const step = parseInt(savedStep);
          if (!isNaN(step) && step >= 0 && step <= steps.length + 1) {
            setCurrentStep(step);
          }
        } catch (e) {
          console.error('Failed to parse saved step:', e);
        }
      }

      // Load saved topic levels
      const savedTopicLevels = localStorage.getItem('welcome_topic_levels');
      if (savedTopicLevels) {
        try {
          const parsedTopicLevels = JSON.parse(savedTopicLevels);
          setTopicLevels(parsedTopicLevels);
        } catch (e) {
          console.error('Failed to parse saved topic levels:', e);
        }
      }

      // Load selected topic
      const savedSelectedTopic = localStorage.getItem('welcome_selected_topic');
      if (savedSelectedTopic) {
        setSelectedTopic(savedSelectedTopic);
      }

      // Check for referral code in URL
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setUserData((prev) => ({ ...prev, referralCode: ref }));
      }
    }
  }, [steps.length]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_user_data', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_selections', JSON.stringify(selections));
    }
  }, [selections]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_current_step', currentStep.toString());
    }
  }, [currentStep]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_topic_levels', JSON.stringify(topicLevels));
    }
  }, [topicLevels]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome_selected_topic', selectedTopic);
    }
  }, [selectedTopic]);

  const handleSelect = (value: number | string) => {
    // Play toggle-on sound when an option is selected
    playSound("toggle-on");

    if (currentStep === 1) {
      // Topic selection step
      setSelectedTopic(value as string);
      setSelections((prev) => ({ ...prev, [currentStep]: value }));
    } else if (currentStep === 2) {
      // Level selection step
      // Store the level for the currently selected topic
      setTopicLevels((prev) => ({
        ...prev,
        [selectedTopic]: value as string,
      }));
      setSelections((prev) => ({ ...prev, [currentStep]: value }));
    } else {
      setSelections((prev) => ({ ...prev, [currentStep]: value }));
    }
  };

  const handleContinue = () => {
    // Allow progression through all steps except final submission
    if (currentStep < steps.length + 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Fix any types
  interface Option {
    id: string;
    text: string;
    badge: string;
    icon: JSX.Element;
    disabled?: boolean;
  }

  const currentOptions = useMemo(() => {
    if (currentStep === 1) {
      const selectedGoal = selections[0] as string;
      const allowedTopicIds = topicsByGoal[selectedGoal] || [];
      return topics.filter(topic => allowedTopicIds.includes(topic.id)) as Option[];
    }
    return steps[currentStep] as Option[] | null;
  }, [currentStep, selections]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any existing errors and set loading state
    setActualError("");
    setIsLoading(true);
    dispatch(setAuthError(null));

    try {
      // Validate all data
      if (
        !userData.name.trim() ||
        !userData.email.trim() ||
        !userData.password.trim() ||
        !userData.age.trim()
      ) {
        setActualError("Fadlan buuxi dhammaan xogta");
        return;
      }

      // Enhanced email validation
      const emailValidation = validateEmail(userData.email);
      if (!emailValidation.isValid) {
        setActualError(emailValidation.error || "Fadlan geli email sax ah");
        return;
      }

      // Check if all selections are made
      if (Object.keys(selections).length < 4) {
        setActualError("Fadlan buuxi dhammaan su'aalaha");
        return;
      }

      // Attempt signup - the backend will handle existing user scenarios
      // Format the request body
      const signUpData = {
        email: userData.email.trim(),
        password: userData.password.trim(),
        name: userData.name.trim(),
        username: userData.email.trim(),
        age: Number.parseInt(userData.age),
        onboarding_data: {
          goal: String(selections[0]).trim(),
          topic: String(selections[1]).trim(),
          math_level: String(selections[2]).trim(),
          minutes_per_day: Number.parseInt(String(selections[3])),
          preferred_study_time: String(selections[3]).trim(), // Using minutes_per_day string representation for now
        },
        ...(userData.referralCode ? { referral_code: userData.referralCode.trim() } : {}),
        ...(userData.promoCode ? { promo_code: userData.promoCode.trim() } : {}),
      };


      // Call AuthService directly to avoid Redux error handling interference
      console.log("SENDING SIGNUP PAYLOAD:", JSON.stringify(signUpData, null, 2));
      const result = await AuthService.getInstance().signUp(signUpData);


      // Update Redux state with the successful result
      if (result?.user) {
        dispatch(setUser({
          ...result.user,
          is_premium: result.user.is_premium || false,
          referral_code: result.user.referral_code,
          referral_points: result.user.referral_points,
          referral_count: result.user.referral_count,
          referred_by: result.user.referred_by,
          referred_by_username: result.user.referred_by_username,
        }));
      }

      // Only redirect if signup was successful
      if (result) {
        // Check if the user's email is already verified
        if (result.user?.is_email_verified) {
          // User is already verified, check premium status
          // User is already verified, check premium status
          console.log("Waad mahadsantahay! Emailkaaga la xaqiijiyay.");

          // Clear localStorage data since user is already verified
          if (typeof window !== 'undefined') {
            localStorage.removeItem('welcome_user_data');
            localStorage.removeItem('welcome_selections');
            localStorage.removeItem('welcome_current_step');
            localStorage.removeItem('welcome_topic_levels');
            localStorage.removeItem('welcome_selected_topic');
            localStorage.removeItem('user');
          }

          // Check premium status and redirect accordingly
          if (result.user.is_premium) {
            router.push('/courses');
          } else {
            router.push('/subscribe');
          }
        } else {
          // User needs email verification
          // User needs email verification
          console.log("Waad mahadsantahay! Si aad u bilowdo, fadlan xaqiiji emailkaaga.");

          // Store user data in localStorage for email verification page
          localStorage.setItem('user', JSON.stringify({ email: userData.email }));

          // After email verification, user will be redirected based on premium status
          router.push(`/verify-email?email=${userData.email}`);
        }
      }
    } catch (error: unknown) {
      console.log("Submission failed:", error);

      // Handle specific case where user already exists
      if (error instanceof Error && error.message.includes("horey ayaa loo diiwaangeliyay")) {
        // User already exists - suggest they should verify email or login
        // User already exists - suggest they should verify email or login
        console.log("Isticmaalaha ayaa horey u jira. Emailkaagu horey ayuu u diiwaangelisan yahay.");

        // Clear local storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('welcome_user_data');
          localStorage.removeItem('welcome_selections');
          localStorage.removeItem('welcome_current_step');
          localStorage.removeItem('welcome_topic_levels');
          localStorage.removeItem('welcome_selected_topic');
          localStorage.removeItem('user');
        }

        // Redirect to email verification page as default action
        router.push(`/verify-email?email=${userData.email}`);
        return;
      }

      // Use the error message from the thrown error (already processed by auth service)
      if (error instanceof Error) {
        setActualError(error.message);
      } else {
        setActualError("Wax khalad ah ayaa dhacay. Fadlan mar kale isku day.");
      }
    } finally {
      // Always set loading to false when done
      setIsLoading(false);
    }
  };

  // Clear Redux error when component mounts or when user starts over
  useEffect(() => {
    if (authError) {
      dispatch(setAuthError(null));
    }
  }, [authError, dispatch]);

  const handleStartOver = () => {
    // Clear all localStorage data and reset the form
    if (typeof window !== 'undefined') {
      localStorage.removeItem('welcome_user_data');
      localStorage.removeItem('welcome_selections');
      localStorage.removeItem('welcome_current_step');
      localStorage.removeItem('welcome_topic_levels');
      localStorage.removeItem('welcome_selected_topic');
      localStorage.removeItem('user');
    }

    // Reset all state
    setCurrentStep(0);
    setSelections({});
    setSelectedTopic("math");
    setTopicLevels({
      math: "beginner",
      programming: "beginner",
    });
    setUserData({
      name: "",
      email: "",
      password: "",
      age: "",
      referralCode: "",
      promoCode: "",
    });
    setActualError("");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-2 py-6">
      <Card className="w-full max-w-2xl shadow-lg border-0 overflow-hidden px-0">
        <CardContent className="p-0">
          {/* Progress bar */}
          <Progress value={progress} className="h-1 rounded-none" />

          <div className="p-4 md:p-6">
            {/* Step Title and Start Over Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {currentStep <= steps.length
                  ? stepTitles[currentStep]
                  : "Fadlan geli Xogtaada"}
              </h2>
              {currentStep > 0 && (
                <button
                  onClick={handleStartOver}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Bilow cusub
                </button>
              )}
            </div>

            {/* Display error if it exists */}
            {actualError && (
              <Alert className="mb-6 border-rose-200 bg-rose-50 text-rose-800">
                <AlertTitle className="text-rose-900 flex items-center gap-2 font-medium">
                  Khalad ayaa dhacay <span className="text-xl">⚠️</span>
                </AlertTitle>
                <AlertDescription className="text-rose-800">
                  {actualError}
                </AlertDescription>

              </Alert>
            )}

            {/* Options Grid */}
            {currentStep === 0 && (
              <div className="grid gap-3">
                {currentOptions &&
                  currentOptions.map((option: Option) => (
                    <div key={option.id}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelect(option.id);
                        }}
                        className="w-full group relative"
                        disabled={option.disabled || isLoading}
                      >
                        <div
                          className={cn(
                            "flex items-center p-4 rounded-xl border-2 transition-all",
                            " hover:shadow-sm",
                            selections[currentStep] === option.id
                              ? "border-primary bg-primary/5"
                              : "border-slate-200",
                            option.disabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <div className="text-primary">{option.icon}</div>
                          </div>
                          <div className="flex-1 text-left px-4 text-sm md:text-base font-medium text-slate-700">
                            {option.text}
                          </div>
                          {option.disabled && (
                            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                              Dhowaan
                            </span>
                          )}
                        </div>

                        {selections[currentStep] === option.id && (
                          <div className="absolute -top-2 left-4 px-3 py-1 bg-amber-50 text-amber-800 text-xs rounded-full border border-amber-200">
                            {option.badge}
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid gap-3">
                {currentOptions &&
                  currentOptions.map((option: Option) => (
                    <div key={option.id}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelect(option.id);
                        }}
                        className="w-full group relative"
                        disabled={option.disabled || isLoading}
                      >
                        <div
                          className={cn(
                            "flex items-center p-4 rounded-xl border-2 transition-all",
                            "hover:border-primary/50 hover:shadow-sm",
                            selections[currentStep] === option.id
                              ? "border-primary bg-primary/5"
                              : "border-slate-200",
                            option.disabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <div className="text-primary">{option.icon}</div>
                          </div>
                          <div className="flex-1 text-left px-4 text-sm md:text-base font-medium text-slate-700">
                            {option.text}
                          </div>
                          {option.disabled && (
                            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                              Dhowaan
                            </span>
                          )}
                        </div>

                        {selections[currentStep] === option.id && (
                          <div className="absolute -top-2 left-4 px-3 py-1 bg-amber-50 text-amber-800 text-xs rounded-full border border-amber-200">
                            {option.badge}
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {currentStep === 2 && (
              <>
                <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-700 font-medium">
                    Heerkaaga{" "}
                    {topics.find((t) => t.id === selectedTopic)?.text ||
                      selectedTopic}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(topicLevelsByTopic as any)[selectedTopic].map((level: any) => (
                    <div key={level.level}>
                      <button
                        onClick={() => handleSelect(level.level)}
                        className="w-full text-left"
                        disabled={isLoading}
                      >
                        <div
                          className={cn(
                            "p-5 rounded-xl border-2 transition-all h-full",
                            "hover:border-primary/50 hover:shadow-sm",
                            topicLevels[selectedTopic] === level.level
                              ? "border-primary bg-primary/5"
                              : "border-slate-200"
                          )}
                        >
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                            <div className="text-primary">{level.icon}</div>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-slate-800">
                            {level.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-3">
                            {level.description}
                          </p>
                          <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 border border-slate-200">
                            {level.example}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="grid gap-3">
                {learningGoals.map((option: Option) => (
                  <div key={option.id}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelect(option.id);
                      }}
                      className="w-full group relative"
                      disabled={option.disabled || isLoading}
                    >
                      <div
                        className={cn(
                          "flex items-center p-4 rounded-xl border-2 transition-all",
                          "hover:border-primary/50 hover:shadow-sm",
                          selections[currentStep] === option.id
                            ? "border-primary bg-primary/5"
                            : "border-slate-200",
                          option.disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                          <div className="text-primary">{option.icon}</div>
                        </div>
                        <div className="flex-1 text-left px-4 text-sm md:text-base font-medium text-slate-700">
                          {option.text}
                        </div>
                        {option.disabled && (
                          <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                            Dhowaan
                          </span>
                        )}
                      </div>

                      {selections[currentStep] === option.id && (
                        <div className="absolute -top-2 left-4 px-3 py-1 bg-amber-50 text-amber-800 text-xs rounded-full border border-amber-200">
                          {option.badge}
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Magacaaga
                    </Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Geli magacaaga"
                        value={userData.name}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                        className="w-full p-3 h-auto rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-base shadow-sm transition-all duration-200 hover:border-slate-300"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="age"
                      className="text-sm font-medium text-slate-700"
                    >
                      Da`da
                    </Label>
                    <div className="relative">
                      <Input
                        id="age"
                        type="number"
                        min="5"
                        max="100"
                        placeholder="Geli da'daada"
                        value={userData.age}
                        onChange={(e) =>
                          setUserData({ ...userData, age: e.target.value })
                        }
                        className="w-full p-3 h-auto rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-base shadow-sm transition-all duration-200 hover:border-slate-300"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Emailkaaga
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      className="w-full p-3 h-auto rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-base shadow-sm transition-all duration-200 hover:border-slate-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Passwordkaaga
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={userData.password}
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                      className="w-full p-3 h-auto rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-base shadow-sm transition-all duration-200 hover:border-slate-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="promoCode"
                    className="text-sm font-medium text-slate-700"
                  >
                    Koodka Dalacsiinta (Ikhtiyaari)
                  </Label>
                  <div className="relative">
                    <Input
                      id="promoCode"
                      type="text"
                      placeholder="Geli koodka"
                      value={userData.promoCode || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, promoCode: e.target.value })
                      }
                      className="w-full p-3 h-auto rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-base shadow-sm transition-all duration-200 hover:border-slate-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button
                className={cn(
                  "w-full rounded-lg py-6 font-semibold transition-colors",
                  currentStep === 4
                    ? userData.email &&
                      userData.password &&
                      userData.name &&
                      userData.age
                      ? " text-white"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : currentStep === 2
                      ? topicLevels[selectedTopic]
                        ? " text-white"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : selections[currentStep]
                        ? " text-white"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed",
                  isLoading && "opacity-70 cursor-wait"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentStep === 4) {
                    if (!isLoading) {
                      handleSubmit(e);
                    }
                  } else {
                    if (currentStep === 2 && !topicLevels[selectedTopic]) {
                      // Don't continue if no level is selected for the current topic
                      return;
                    }
                    if (
                      (currentStep !== 2 && selections[currentStep]) ||
                      (currentStep === 2 && topicLevels[selectedTopic])
                    ) {
                      handleContinue();
                    }
                  }
                }}
                type={currentStep === 4 ? "submit" : "button"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    <span>Waa la socodaa...</span>
                  </div>
                ) : currentStep === 4 ? (
                  "Gudbi"
                ) : (
                  "Sii wad"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  );
}
