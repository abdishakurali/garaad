"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import type { User } from "@/types/auth";
import Link from "next/link";
import AuthService from "@/services/auth";
import { progressService, type UserProgress } from "@/services/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Loader2 as Loader2Icon,
  UserIcon,
  Settings,
  BookOpen,
  Pencil,
  Mail,
  CheckCircle2,
  Users,


  MessageCircle,
  MapPin,
} from "lucide-react";
import { Header } from "@/components/Header";
import { getMediaUrl } from "@/lib/utils";
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import { useAuthStore } from "@/store/useAuthStore";
import { API_BASE_URL } from "@/lib/constants";

import { DashboardProfile } from "@/services/auth";
import type { OnboardingData } from "@/services/auth";
import {
  goals,
  topics,
  topicsByGoal,
  topicLevelsByTopic,
  learningGoals,
  stepTitles,
} from "@/config/onboarding-data";
import { cn } from "@/lib/utils";

interface ExtendedUser extends User {
  first_name: string;
  last_name: string;
  username: string;
  age?: number;
  bio?: string;
  whatsapp_number?: string;
}

const DEFAULT_WHATSAPP_DIAL = "+252";

function splitWhatsappE164(value?: string): { dial: string; local: string } {
  const raw = (value || "").trim();
  if (!raw) return { dial: DEFAULT_WHATSAPP_DIAL, local: "" };
  const normalized = raw.startsWith("+") ? raw : `+${raw}`;
  if (normalized.startsWith("+252")) {
    return { dial: "+252", local: normalized.slice(4) };
  }
  return { dial: DEFAULT_WHATSAPP_DIAL, local: normalized.replace(/\D/g, "") };
}

function buildWhatsappE164(dial: string, local: string): string {
  const cleanDial = (dial || DEFAULT_WHATSAPP_DIAL).replace(/[^\d+]/g, "");
  const cleanLocal = (local || "").replace(/\D/g, "");
  if (!cleanLocal) return "";
  return `${cleanDial}${cleanLocal}`;
}

export default function ProfilePage() {
  const [user, setUserState] = useState<ExtendedUser | null>(null);
  const [progress, setProgress] = useState<UserProgress[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ExtendedUser>>({});
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useAuthStore();
  const [dashboardProfile, setDashboardProfile] = useState<DashboardProfile | null>(null);
  const [onboarding, setOnboarding] = useState<(OnboardingData & { has_completed_onboarding?: boolean }) | null>(null);
  const [showLearningPathModal, setShowLearningPathModal] = useState(false);
  const [learningPathStep, setLearningPathStep] = useState(0);
  const [learningPathSelections, setLearningPathSelections] = useState<Record<number, number | string>>({});
  const [learningPathTopic, setLearningPathTopic] = useState<string>("");
  const [learningPathTopicLevels, setLearningPathTopicLevels] = useState<Record<string, string>>({});
  const [isSavingLearningPath, setIsSavingLearningPath] = useState(false);
  const [learningPathError, setLearningPathError] = useState<string | null>(null);
  const [waDial, setWaDial] = useState(DEFAULT_WHATSAPP_DIAL);
  const [waLocal, setWaLocal] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authService = AuthService.getInstance();
      const waDigits = waLocal.replace(/\D/g, "");
      if (waDigits.length > 0 && waDigits.length < 5) {
        alert("Lambarka WhatsApp waa inuu ku filan yahay.");
        return;
      }
      const whatsapp_number = buildWhatsappE164(waDial, waLocal);
      const updated = await authService.updateProfile({
        ...editForm,
        whatsapp_number,
      });
      setUserState(updated as ExtendedUser);
      setShowEditModal(false);
      alert("Profile-ka waa la cusboonaysiiyay!");
    } catch (err) {
      console.error(err);
      setError("Ku guuldaraystay in la cusboonaysiiyo profile-ka");
    }
  };

  // Load user data and onboarding
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      const authService = AuthService.getInstance();
      try {
        const [basic, dashboard, onboardingRes] = await Promise.all([
          authService.getBasicProfile(),
          authService.getDashboardProfile(),
          authService.getOnboarding().catch(() => null),
        ]);

        setUserState(basic as ExtendedUser);
        setDashboardProfile(dashboard);
        setOnboarding(onboardingRes ?? null);

        setEditForm({
          first_name: basic.first_name,
          last_name: basic.last_name,
          username: basic.username,
          email: basic.email,
          bio: (basic as any).bio,
          location: (basic as any).location || "",
          age: (basic as any).age,
        });
        const wa = splitWhatsappE164((basic as ExtendedUser).whatsapp_number);
        setWaDial(wa.dial);
        setWaLocal(wa.local);
      } catch (err) {
        console.error("Qalad ayaa dhacay marka la soo raray isticmaalaha:", err);
        setError("Ku guuldaraystay in la soo raro xogta profile-ka");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Fetch progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const data = await progressService.getUserProgress();
        setProgress(data);
      } catch (err: unknown) {
        console.error(err);
        setError("Ku guuldaraystay in la soo raro xogta horumarinta");
      }
    };
    fetchProgress();
  }, [user]);

  // Handle profile picture update
  const handleProfilePictureUpdate = async (file: File) => {
    try {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        alert("Nooca faylka aan la aqbalin. Isticmaal JPG, PNG, GIF, ama BMP.");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("Faylka aad ka weyn yahay. Fadlan door hal ka yar 5MB.");
        return;
      }

      setIsUploadingPicture(true);
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch(`${API_BASE_URL}/api/auth/upload-profile-picture/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AuthService.getInstance().getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.profile_picture?.[0] || `Failed to update profile picture: ${response.status}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // Update user state
      if (data.user) {
        setUser(data.user);
        setUserState(data.user as ExtendedUser);
        AuthService.getInstance().setCurrentUser(data.user);
      } else if (data.profile_picture && user) {
        const updatedUser = { ...user, profile_picture: data.profile_picture };
        setUser(updatedUser);
        setUserState(updatedUser);
        AuthService.getInstance().setCurrentUser(updatedUser);
      }

      alert("Sawirka profile-ka waa la cusboonaysiiyay!");
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      alert("Cillad ayaa dhacday: " + (error instanceof Error ? error.message : "Fadlan isku day mar kale."));
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const steps = [goals, topics, null, learningGoals];
  const learningPathOptions = (() => {
    if (learningPathStep === 0) return goals;
    if (learningPathStep === 1) {
      const goalId = learningPathSelections[0] as string | undefined;
      const allowed = goalId ? (topicsByGoal[goalId] || []) : [];
      return topics.filter((t) => allowed.includes(t.id));
    }
    if (learningPathStep === 2 && learningPathTopic) {
      const arr = (topicLevelsByTopic as Record<string, Array<{ level: string }>>)[learningPathTopic];
      return arr ?? [];
    }
    if (learningPathStep === 3) return learningGoals;
    return [];
  })();

  const openLearningPathEdit = () => {
    const o = onboarding;
    const goalId = (o?.goal && goals.some((g) => g.id === o.goal)) ? o.goal : goals[0]?.id ?? "";
    const topicId = (o?.topic && topics.some((t) => t.id === o.topic)) ? o.topic : (topicsByGoal[goalId]?.[0] ?? "");
    const level = o?.math_level ?? "beginner";
    const minMap: Record<number, string> = { 15: "15_min", 30: "30_min", 60: "60_min", 90: "90_min" };
    const timeId = o?.minutes_per_day != null ? (minMap[o.minutes_per_day] ?? "30_min") : "30_min";
    setLearningPathSelections({ 0: goalId, 1: topicId, 2: level, 3: timeId });
    setLearningPathTopic(topicId);
    setLearningPathTopicLevels((prev) => ({ ...prev, [topicId]: level }));
    setLearningPathStep(0);
    setLearningPathError(null);
    setShowLearningPathModal(true);
  };

  const handleLearningPathSelect = (value: number | string) => {
    if (learningPathStep === 1) {
      setLearningPathTopic(value as string);
      setLearningPathSelections((prev) => ({ ...prev, [learningPathStep]: value }));
    } else if (learningPathStep === 2) {
      setLearningPathTopicLevels((prev) => ({ ...prev, [learningPathTopic]: value as string }));
      setLearningPathSelections((prev) => ({ ...prev, [learningPathStep]: value }));
    } else {
      setLearningPathSelections((prev) => ({ ...prev, [learningPathStep]: value }));
    }
  };

  const canContinueLearningPath = () => {
    if (learningPathStep === 2) return !!learningPathTopicLevels[learningPathTopic];
    return learningPathSelections[learningPathStep] != null;
  };

  const saveLearningPath = async () => {
    const goal = String(learningPathSelections[0] ?? "").trim();
    const topic = String(learningPathSelections[1] ?? "").trim();
    const math_level = String(learningPathSelections[2] ?? "beginner").trim();
    const timeId = String(learningPathSelections[3] ?? "30_min");
    const minutes_per_day = parseInt(timeId.replace(/_min$/, ""), 10) || 30;
    setIsSavingLearningPath(true);
    setLearningPathError(null);
    try {
      const updated = await AuthService.getInstance().updateOnboarding({
        goal,
        topic,
        math_level,
        minutes_per_day,
      });
      setOnboarding(updated);
      setShowLearningPathModal(false);
    } catch (err: unknown) {
      setLearningPathError(err instanceof Error ? err.message : "Ku guuldaraystay in la cusboonaysiiyo");
    } finally {
      setIsSavingLearningPath(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Waa la soo raraya...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="text-destructive bg-card p-6 rounded-lg shadow-lg border">
            <h2 className="text-lg font-semibold mb-2">Khalad ayaa dhacay</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <UserIcon className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Isticmaalaha lama helin</p>
        </div>
      </div>
    );
  }

  const progressItems = progress?.length || 0;
  const lessonsCompleted = progress?.filter((lesson) => lesson.status === "completed").length || 0;
  const completedPercentage = progressItems && lessonsCompleted
    ? Math.round((lessonsCompleted / progressItems) * 100)
    : 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Simplified Cover */}
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                {/* Profile Picture & Info */}
                <div className="relative pt-8 pb-6 px-6 text-center">
                  <AuthenticatedAvatar
                    key={user.profile_picture || 'default'}
                    src={getMediaUrl(user.profile_picture, 'profile_pics')}
                    alt={`${user.first_name} ${user.last_name}`}
                    fallback={`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
                    size="xl"
                    className="h-24 w-24 border-4 border-white dark:border-gray-700 shadow-xl mx-auto"
                    editable={true}
                    onImageUpdate={handleProfilePictureUpdate}
                    isUpdating={isUploadingPicture}
                  />

                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">@{user.username}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">Arday Garaad</p>
                </div>

                {/* Contact */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.is_email_verified && (
                    <div className="flex items-center text-sm text-green-600 mt-2">
                      <CheckCircle2 className="h-4 w-4 mr-3" />
                      <span>Email la xaqiijiyey</span>
                    </div>
                  )}
                  <div className="flex items-start text-sm text-gray-600 dark:text-gray-300 mt-3">
                    <MessageCircle className="h-4 w-4 mr-3 mt-0.5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">WhatsApp: </span>
                      {(user as ExtendedUser).whatsapp_number ? (
                        <a
                          href={`https://wa.me/${(user as ExtendedUser).whatsapp_number!.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          {(user as ExtendedUser).whatsapp_number}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Lama gelin</span>
                      )}
                    </div>
                  </div>
                  {(user as ExtendedUser).location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-3">
                      <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                      <span>{(user as ExtendedUser).location}</span>
                    </div>
                  )}
                </div>
                {(user as ExtendedUser).bio && (
                  <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">{(user as ExtendedUser).bio}</p>
                  </div>
                )}

                {/* Community Stats */}
                {dashboardProfile?.community_profile && (
                  <div className="mx-6 mb-6 p-4 rounded-xl bg-white dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Waxqabadka Bulshada</div>
                    <div className="text-lg font-bold flex items-center justify-between text-gray-900 dark:text-white">
                      <span>Bulshada Garaad</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                        {dashboardProfile.community_profile.total_posts} qoraal
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Update your learning path */}
                <div className="mx-6 mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Waxbarashadaaga</span>
                  </div>
                  {onboarding?.goal || onboarding?.topic ? (
                    <>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-3">
                        <li><span className="font-medium text-gray-700 dark:text-gray-200">Hadaf:</span> {goals.find((g) => g.id === onboarding?.goal)?.text ?? onboarding?.goal ?? "—"}</li>
                        <li><span className="font-medium text-gray-700 dark:text-gray-200">Track:</span> {topics.find((t) => t.id === onboarding?.topic)?.text ?? onboarding?.topic ?? "—"}</li>
                        <li><span className="font-medium text-gray-700 dark:text-gray-200">Heer:</span> {onboarding?.math_level ?? "—"}</li>
                        <li><span className="font-medium text-gray-700 dark:text-gray-200">Waqti maalin:</span> {onboarding?.minutes_per_day != null ? `${onboarding.minutes_per_day} daqiiqo` : "—"}</li>
                      </ul>
                      <Button variant="outline" size="sm" className="w-full rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20" onClick={openLearningPathEdit}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Beddel
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Ma aadan buuxin waxbarashada. Ku beddel hadaf, track iyo waqtiga.</p>
                      <Button variant="outline" size="sm" className="w-full rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20" onClick={openLearningPathEdit}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Bilow waxbarashada
                      </Button>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 space-y-3">
                  <Button
                    onClick={() => {
                      const wa = splitWhatsappE164((user as ExtendedUser).whatsapp_number);
                      setWaDial(wa.dial);
                      setWaLocal(wa.local);
                      setShowEditModal(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Cusboonaysii Profile-ka
                  </Button>

                  <Link href="/community" className="block w-full">
                    <Button variant="outline" className="w-full rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20">
                      <Users className="h-4 w-4 mr-2" />
                      Ku Biir Bulshada
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Learning Summary */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Horumarka Waxbarashada
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Casharro la dhammeeyay</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{lessonsCompleted}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Heerka dhammaystirka</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{completedPercentage}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning path edit modal (welcome flow steps 0–3) */}
        <Dialog open={showLearningPathModal} onOpenChange={setShowLearningPathModal}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {learningPathStep <= 3 ? stepTitles[learningPathStep] : "Waxbarashadaaga"}
              </DialogTitle>
            </DialogHeader>
            {learningPathError && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{learningPathError}</p>
            )}
            <div className="py-4">
              {learningPathStep === 0 && (
                <div className="grid gap-3">
                  {(learningPathOptions as typeof goals).map((option: { id: string; text: string; icon?: React.ReactNode }) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleLearningPathSelect(option.id)}
                      className={cn(
                        "flex items-center p-4 rounded-xl border-2 text-left transition-all w-full",
                        learningPathSelections[0] === option.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-background shadow-sm flex items-center justify-center shrink-0">{option.icon}</div>
                      <span className="ml-4 font-medium text-foreground">{option.text}</span>
                    </button>
                  ))}
                </div>
              )}
              {learningPathStep === 1 && (
                <div className="grid gap-3">
                  {(learningPathOptions as typeof topics).map((option: { id: string; text: string; icon?: React.ReactNode }) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleLearningPathSelect(option.id)}
                      className={cn(
                        "flex items-center p-4 rounded-xl border-2 text-left transition-all w-full",
                        learningPathSelections[1] === option.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-background shadow-sm flex items-center justify-center shrink-0">{option.icon}</div>
                      <span className="ml-4 font-medium text-foreground">{option.text}</span>
                    </button>
                  ))}
                </div>
              )}
              {learningPathStep === 2 && learningPathTopic && (
                <div className="grid gap-3">
                  {((topicLevelsByTopic as Record<string, Array<{ level: string; title: string; description: string; icon?: React.ReactNode }>>)[learningPathTopic] ?? []).map((level) => (
                    <button
                      key={level.level}
                      type="button"
                      onClick={() => handleLearningPathSelect(level.level)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all w-full",
                        learningPathTopicLevels[learningPathTopic] === level.level ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="font-bold text-foreground">{level.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{level.description}</div>
                    </button>
                  ))}
                </div>
              )}
              {learningPathStep === 3 && (
                <div className="grid gap-3">
                  {(learningPathOptions as typeof learningGoals).map((option: { id: string; text: string; icon?: React.ReactNode }) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleLearningPathSelect(option.id)}
                      className={cn(
                        "flex items-center p-4 rounded-xl border-2 text-left transition-all w-full",
                        learningPathSelections[3] === option.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-background shadow-sm flex items-center justify-center shrink-0">{option.icon}</div>
                      <span className="ml-4 font-medium text-foreground">{option.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              {learningPathStep > 0 ? (
                <Button type="button" variant="outline" onClick={() => setLearningPathStep((s) => s - 1)} className="rounded-full">
                  Dib u noqo
                </Button>
              ) : null}
              {learningPathStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => canContinueLearningPath() && setLearningPathStep((s) => s + 1)}
                  disabled={!canContinueLearningPath()}
                  className="rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sii wad
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={saveLearningPath}
                  disabled={isSavingLearningPath || !canContinueLearningPath()}
                  className="rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isSavingLearningPath ? <Loader2Icon className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydi
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        {showEditModal && (
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Cusboonaysii Profile-ka</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 py-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Koowaad</Label>
                        <Input id="first_name" name="first_name" value={editForm.first_name || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Liban" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Dambe</Label>
                        <Input id="last_name" name="last_name" value={editForm.last_name || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Garaad" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium text-gray-700 dark:text-gray-200">Da'da</Label>
                      <Input id="age" name="age" type="number" value={editForm.age || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="25" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-200">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={editForm.bio || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full flex min-h-[100px] rounded-lg border border-input bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Wax nooga sheeg naftaada..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-200">Goobta (Location)</Label>
                      <Input
                        id="location"
                        name="location"
                        value={editForm.location || ""}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        className="rounded-lg bg-gray-50 dark:bg-gray-800"
                        placeholder="Mogadishu, Somalia"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="profile-wa-dial" className="text-sm font-medium text-gray-700 dark:text-gray-200">Code</Label>
                        <Input
                          id="profile-wa-dial"
                          value={waDial}
                          onChange={(e) => setWaDial(e.target.value)}
                          className="rounded-lg bg-gray-50 dark:bg-gray-800"
                          placeholder="+252"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="profile-wa-local" className="text-sm font-medium text-gray-700 dark:text-gray-200">WhatsApp Number</Label>
                        <Input
                          id="profile-wa-local"
                          value={waLocal}
                          onChange={(e) => setWaLocal(e.target.value)}
                          className="rounded-lg bg-gray-50 dark:bg-gray-800"
                          placeholder="612345678"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="rounded-full">Jooji</Button>
                  <Button type="submit" className="rounded-full bg-blue-600 text-white hover:bg-blue-700">Kaydi Isbedelada</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
