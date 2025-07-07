"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import type { User } from "@/types/auth";
import AuthService from "@/services/auth";
import { progressService, type UserProgress } from "@/services/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  UserIcon,
  Settings,
  Trophy,
  BookOpen,
  Mail,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

// Extend User type to include required fields
interface ExtendedUser extends User {
  first_name: string;
  last_name: string;
  username: string;
}

interface ReferralStats {
  referral_code: string;
  referral_points: number;
  referral_count: number;
}

interface ReferralUser {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface ReferralList {
  referred_users: ReferralUser[];
}

function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = 0;
    const duration = 800;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplay(Math.floor(start + (value - start) * progress));
      if (progress < 1) {
        requestAnimationFrame((t) => step(t, startTime));
      }
    };
    requestAnimationFrame((t) => step(t, t));
  }, [value]);
  return <span ref={ref} className={className}>{display}</span>;
}

function ProgressRing({ percent, size = 64, stroke = 6, color = "#6366f1" }: { percent: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width={size} height={size} className="block">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={stroke}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1 }}
      />
    </svg>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20 dark:border-gray-800/40 shadow-xl rounded-3xl ${className}`}>{children}</div>
  );
}

function ReferralDashboard({ stats, referrals }: { stats: ReferralStats | null; referrals: ReferralList | null }) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopy = () => {
    if (stats?.referral_code) {
      navigator.clipboard.writeText(stats.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = () => {
    if (stats?.referral_code) {
      const shareUrl = `${window.location.origin}/welcome?ref=${stats.referral_code}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
      const token = AuthService.getInstance().getToken();

      if (!token) {
        console.error('Token lama helin ee koodka la wareejiyo la sameeyo');
        return;
      }

      const response = await fetch(`${apiBase}/api/auth/generate-referral-code/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.log('[Referral Debug] 401 Unauthorized - redirecting to login');
        // Use AuthService for proper logout
        AuthService.getInstance().logout();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log('[Referral Debug] Generated referral code:', data);
        // Update the stats state instead of refreshing the page
        if (data.referral_code) {
          // Update the parent component's state by calling a callback
          // For now, we'll trigger a re-fetch of referral data
          window.dispatchEvent(new CustomEvent('referralCodeGenerated'));
        }
      } else {
        console.error('Ku guuldaraystay in la sameeyo koodka la wareejiyo:', response.status);
      }
    } catch (error) {
      console.error('Qalad ayaa dhacay marka la sameeyay koodka la wareejiyo:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const hasReferralCode = stats?.referral_code && stats.referral_code.trim() !== '';

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-gray-500 text-sm">Koodka La Wareejiyo</div>
          <div className="flex items-center space-x-2 mt-1">
            {hasReferralCode ? (
              <>
                <span className="font-mono text-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded border border-gray-200 dark:border-gray-700">
                  {stats?.referral_code}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-blue-600 hover:text-blue-800 transition font-semibold px-2 py-1 rounded border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950"
                >
                  {copied ? 'La koobiyey!' : 'Koobi'}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 italic">Wali koodka la wareejiyo ma jiro</span>
                <button
                  onClick={handleGenerateCode}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white px-3 py-1 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isGenerating ? 'La sameeyo...' : 'Samee Kood'}
                </button>
              </div>
            )}
          </div>
        </div>
        {hasReferralCode && (
          <button
            onClick={handleShare}
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            {copied ? 'La koobiyey!' : 'Wadaag Linkiga'}
          </button>
        )}
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-purple-600">{stats?.referral_points ?? 0}</span>
          <div className="text-xs text-gray-500">Dhibcaha</div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-600">{stats?.referral_count ?? 0}</span>
          <div className="text-xs text-gray-500">La Wareejiyo</div>
        </div>
      </div>
      <div>
        <div className="text-gray-600 mb-2 font-semibold">Asxaabta aad u wareejiyey:</div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {referrals && referrals.referred_users && referrals.referred_users.length > 0 ? referrals.referred_users.map((user) => (
            <li key={user.id} className="py-2 flex justify-between items-center text-sm">
              <span>{user.first_name} {user.last_name}</span>
              <span className="text-xs text-gray-400">{new Date(user.created_at).toLocaleDateString()}</span>
            </li>
          )) : (
            <li className="py-2 text-gray-400">
              {hasReferralCode ? 'Wali la wareejiyo ma jiro. Wadaag koodkaaga si aad u bilowdo inaad hesho dhibcaha!' : 'Samee kood la wareejiyo si aad u bilowdo inaad hesho dhibcaha!'}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [progress, setProgress] = useState<UserProgress[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ExtendedUser>>({});
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referralList, setReferralList] = useState<ReferralList | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok)
        throw new Error("Ku guuldaraystay in la cusboonaysiiyo profile-ka");

      const updated = await response.json();
      setUser(updated);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      setError("Ku guuldaraystay in la cusboonaysiiyo profile-ka");
    }
  };

  // Load user from AuthService (cookies)
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = AuthService.getInstance().getCurrentUser();
      if (storedUser) {
        setUser(storedUser as ExtendedUser);
        setEditForm({
          first_name: storedUser.first_name,
          last_name: storedUser.last_name,
          username: storedUser.username,
          email: storedUser.email,
        });
      } else {
        setError("Isticmaalaha lama helin");
      }
    } catch (err) {
      console.error("Qalad ayaa dhacay marka la soo raray isticmaalaha:", err);
      setError("Ku guuldaraystay in la soo raro xogta profile-ka");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch progress once user is loaded
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

  useEffect(() => {
    // Debug: print all localStorage keys/values and cookies
    console.log('[Referral Debug] localStorage:', { ...localStorage });
    console.log('[Referral Debug] document.cookie:', document.cookie);

    function getToken() {
      const authService = AuthService.getInstance();
      const token = authService.getToken();
      if (token) {
        console.log('[Referral Debug] Found token via AuthService:', token.substring(0, 20) + '...');
        return token;
      }
      console.log('[Referral Debug] No token found via AuthService.');
      return null;
    }

    // Fetch all referral info from /referrals/
    const fetchReferral = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
      const token = getToken();
      if (!token) {
        setError("Ma galin. Fadlan gal si aad u aragto macluumaadka la wareejiyo.");
        return;
      }
      try {
        const res = await fetch(`${apiBase}/api/auth/referrals/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          console.log('[Referral Debug] 401 Unauthorized - redirecting to login');
          // Use AuthService for proper logout
          AuthService.getInstance().logout();
          return;
        }
        if (!res.ok) {
          throw new Error(`Ku guuldaraystay in la soo raro xogta la wareejiyo: ${res.status}`);
        }
        const data = await res.json();
        console.log('[Referral Debug] /referrals/ response:', data);
        setReferralStats({
          referral_code: data.referral_code,
          referral_points: data.referral_points,
          referral_count: data.referral_count,
        });
        setReferralList({ referred_users: data.referred_users || [] });
      } catch (err: unknown) {
        console.error('[Referral Debug] fetch error:', err);
        setError('Ku guuldaraystay in la soo raro xogta la wareejiyo. Fadlan hubi isku xirkaaga ama la xiriirka taageerada.');
      }
    };

    // Listen for referral code generation events
    const handleReferralCodeGenerated = () => {
      console.log('[Referral Debug] Referral code generated, re-fetching data...');
      fetchReferral();
    };

    window.addEventListener('referralCodeGenerated', handleReferralCodeGenerated);

    fetchReferral();

    // Cleanup event listener
    return () => {
      window.removeEventListener('referralCodeGenerated', handleReferralCodeGenerated);
    };
  }, []);

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
  const lessonsCompleted =
    progress?.filter((lesson) => lesson.status === "completed").length || 0;

  const completedPercentage =
    progressItems && lessonsCompleted
      ? Math.round((lessonsCompleted / progressItems) * 100)
      : 0;
  console.log(referralStats);
  console.log(referralList);
  return (
    <>
      <Header />
      <div className="min-h-screen relative bg-gradient-to-br from-blue-400/40 via-white/60 to-purple-400/40 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 overflow-x-hidden">
        {/* Animated background particles or gradient */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Adiga can add a canvas or SVG for animated particles here */}
        </motion.div>
        <div className="container max-w-4xl mx-auto px-4 py-6 sm:py-10 relative z-10">
          {/* Modern Profile Header with glassmorphism and animated avatar ring */}
          <div className="relative flex flex-col items-center justify-center mb-8 sm:mb-10">
            <GlassCard className="absolute inset-0 h-48 sm:h-56 -z-10"> </GlassCard>
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <motion.div
                className="relative group"
                initial={{ scale: 0.9, boxShadow: "0 0 0 0 rgba(99,102,241,0.4)" }}
                animate={{ scale: 1, boxShadow: "0 0 32px 0 rgba(99,102,241,0.25)" }}
                transition={{ duration: 1, type: "spring" }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/40 to-purple-500/40 blur-xl animate-pulse" />
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 border-4 border-white/60 dark:border-gray-900/60 shadow-2xl transition-transform group-hover:scale-105 relative z-10">
                  <AvatarFallback className="text-2xl sm:text-3xl md:text-5xl bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-green-500 rounded-full p-1 sm:p-2 shadow-lg border-2 sm:border-4 border-white/60 dark:border-gray-900/60 animate-pulse" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white text-center drop-shadow-lg px-4">
                {user.first_name} {user.last_name}
              </h1>
              <div className="flex flex-col sm:flex-row items-center gap-2 text-gray-500 dark:text-gray-300 text-sm sm:text-lg px-4">
                <span className="font-mono bg-white/40 dark:bg-gray-800/40 px-2 py-1 rounded shadow-inner text-center">@{user.username}</span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1 text-center"><Mail className="h-3 w-3 sm:h-4 sm:w-4" />{user.email}</span>
              </div>
            </div>
            {/* Quick Stats Card with animated counters and progress ring */}
            <div className="mt-6 sm:mt-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center items-center">
              <GlassCard className="flex flex-col items-center p-4 sm:p-6">
                <div className="mb-2"><ProgressRing percent={completedPercentage} size={48} stroke={4} /></div>
                <AnimatedCounter value={completedPercentage} className="text-xl sm:text-2xl font-bold text-blue-600" />
                <span className="text-xs text-gray-500 text-center">Horumarinta</span>
              </GlassCard>
              <GlassCard className="flex flex-col items-center p-4 sm:p-6">
                <BookOpen className="h-5 w-5 sm:h-7 sm:w-7 text-blue-500 mb-2" />
                <AnimatedCounter value={lessonsCompleted} className="text-xl sm:text-2xl font-bold text-gray-900" />
                <span className="text-xs text-gray-500 text-center">Casharka</span>
              </GlassCard>
              {referralStats && (
                <GlassCard className="flex flex-col items-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                  <UserIcon className="h-5 w-5 sm:h-7 sm:w-7 text-purple-500 mb-2" />
                  <AnimatedCounter value={referralStats.referral_points ?? 0} className="text-xl sm:text-2xl font-bold text-purple-600" />
                  <span className="text-xs text-gray-500 text-center">Dhibcaha La Wareejiyo</span>
                </GlassCard>
              )}
            </div>
          </div>

          {/* Main Content - Floating Glass Tabs */}
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="mb-6 sm:mb-8 flex justify-center gap-1 sm:gap-2 bg-white/40 dark:bg-gray-900/40 shadow-lg rounded-full p-1 max-w-lg mx-auto backdrop-blur-md">
              <TabsTrigger
                value="progress"
                className="flex-1 rounded-full px-3 sm:px-6 py-2 text-sm sm:text-lg font-semibold transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-200"
              >
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" /> Horumarinta
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex-1 rounded-full px-3 sm:px-6 py-2 text-sm sm:text-lg font-semibold transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-200"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" /> Dejinta
              </TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6 sm:space-y-8">
              <GlassCard className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-between mb-6 sm:mb-8">
                  <div className="flex-1 w-full">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">Horumarintaada</h2>
                    <Progress value={completedPercentage} className="h-3 sm:h-4 rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400">{completedPercentage}%</span>
                    <span className="text-xs sm:text-sm text-gray-500">La dhameeyey</span>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Casharka</h3>
                  <div className="grid gap-3 sm:gap-4">
                    {progress && progress.length > 0 ? progress.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center justify-between bg-white/60 dark:bg-gray-900/60 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition backdrop-blur-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0 ${item.status === "completed" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"}`}>
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.lesson_title}</h4>
                            <p className="text-xs text-gray-500">Casharka #{index + 1}</p>
                          </div>
                        </div>
                        <Badge
                          variant={item.status === "completed" ? "default" : "secondary"}
                          className={`rounded-full px-2 sm:px-4 py-1 text-xs font-semibold flex-shrink-0 ${item.status === "completed" ? "bg-green-500 text-white" : "bg-yellow-400 text-gray-900"}`}
                        >
                          {item.status === "completed" ? (
                            <><CheckCircle2 className="h-3 w-3 mr-1" /> La dhameeyey</>
                          ) : (
                            <><Clock className="h-3 w-3 mr-1" /> Socda</>
                          )}
                        </Badge>
                      </motion.div>
                    )) : (
                      <div className="text-center text-gray-400 py-6 sm:py-8">Wali cashar ma jiro.</div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-8">
              {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 text-center font-semibold">
                  {error}
                </div>
              )}
              <ReferralDashboard stats={referralStats} referrals={referralList} />
            </TabsContent>
          </Tabs>

          {/* Edit Modal */}
          <AnimatePresence>
            {showEditModal && (
              <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Cusboonaysii Profile-ka</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-6">
                      <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Koowaad</Label>
                        <Input id="first_name" name="first_name" value={editForm.first_name || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Geli magacaaga koowaad" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Dambe</Label>
                        <Input id="last_name" name="last_name" value={editForm.last_name || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Geli magacaaga dambe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-200">Magaca Isticmaalaha</Label>
                        <Input id="username" name="username" value={editForm.username || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Geli magaca isticmaalaha" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Iimaylka</Label>
                        <Input id="email" name="email" type="email" value={editForm.email || ""} onChange={handleInputChange} className="rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="Geli iimaylkaaga" />
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
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
