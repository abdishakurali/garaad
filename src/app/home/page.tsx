"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { API_BASE_URL } from "@/lib/constants";
import type React from "react";
import Image from "next/image";
import useSWR from "swr";
import {
  Clock,
  ChevronRight,
  Zap,
  Crown,
  Trophy,
  Mail,
  Linkedin,
  Twitter,
  Facebook
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthService from "@/services/auth";
import { Header } from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useGamificationStatus } from "@/services/gamification";
import { DailyFocus } from "@/components/dashboard/DailyFocus";
import { StatusScreen } from "@/components/dashboard/StatusScreen";
import { SafetyReturnScreen } from "@/components/dashboard/SafetyReturnScreen";

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  progress: number;
  is_published: boolean;
  lesson_count?: number;
  estimatedHours?: number;
}

interface LeagueStanding {
  rank: number;
  user: {
    id: string;
    name: string;
  };
  points: number;
  streak: number;
}

interface LeagueLeaderboard {
  time_period: string;
  league: string;
  standings: LeagueStanding[];
  my_standing: {
    rank: number;
    points: number;
    streak: number;
  };
}

interface LeagueStatus {
  current_league: {
    id: number;
    name: string;
    somali_name: string;
  };
  current_points: number;
}

interface StreakData {
  current_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  dailyActivity: {
    day: string;
    status: "complete" | "incomplete";
  }[];
}

const authFetcher = async <T = unknown>(url: string): Promise<T> => {
  const service = AuthService.getInstance();
  return await service.makeAuthenticatedRequest("get", url);
};

const publicFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Ku guuldaraystay in la soo raro");
  return response.json();
};

export default function Home() {
  const { user } = useAuth();
  const { gamificationStatus, isLoading: isLoadingStatus } = useGamificationStatus();
  const [showReturnScreen, setShowReturnScreen] = useState(false);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("weekly");

  const router = useRouter();

  // 1. Fetch Courses
  const {
    data: courses = [],
    isLoading: isLoadingCourses,
  } = useSWR<Course[]>(
    `${API_BASE_URL}/api/lms/courses/`,
    publicFetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  // 2. Fetch League Status
  const { data: leagueStatus } = useSWR<LeagueStatus>("/api/league/leagues/status/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // 3. Fetch Leaderboard
  const {
    data: leagueLeaderboard,
    isLoading: isLoadingLeaderboard,
  } = useSWR<LeagueLeaderboard>(
    leagueStatus?.current_league?.id
      ? `/api/league/leagues/leaderboard/?time_period=${leaderboardPeriod}&league=${leagueStatus.current_league.id}`
      : null,
    authFetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  // Check for return-from-decay parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("recovery") === "true") {
      setShowReturnScreen(true);
    }
  }, []);

  useEffect(() => {
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) router.push("/");
  }, [router]);



  return (
    <>
      <Header />

      <div className="flex flex-col gap-8 p-6 md:p-8 max-w-5xl mx-auto mt-20 pb-24">
        {showReturnScreen ? (
          <SafetyReturnScreen onReturn={() => setShowReturnScreen(false)} />
        ) : (
          <>
            {/* 1. Daily Focus & Stats - Unified */}
            <div className="grid gap-6">
              <DailyFocus nextAction={user?.next_action || gamificationStatus?.next_action} />
              <StatusScreen status={gamificationStatus} loading={isLoadingStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
              {/* Left: Courses */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Koorsooyinkaaga</h3>
                  <Link href="/courses">
                    <Button variant="ghost" className="text-xs font-medium text-primary hover:bg-primary/10">
                      Eeg Dhammaan
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isLoadingCourses ? (
                    [1, 2].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)
                  ) : courses?.slice(0, 4).map(course => (
                    <Link href={`/courses/default/${course.slug}`} key={course.id} className="block group">
                      <Card className="h-full overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                        <div className="aspect-video bg-gray-50 dark:bg-gray-800 relative">
                          {course.thumbnail && (
                            <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-sm mb-3 line-clamp-1">{course.title}</h4>
                          <div className="flex items-center gap-3">
                            <Progress value={course.progress} className="h-1.5 flex-1 bg-gray-100 dark:bg-gray-800" />
                            <span className="text-xs font-bold text-primary">{course.progress}%</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right: Leaderboard */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Horyaalka</h3>
                  <Tabs value={leaderboardPeriod} onValueChange={setLeaderboardPeriod}>
                    <TabsList className="h-8 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
                      <TabsTrigger value="weekly" className="text-xs px-3 h-7 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Usbuuca</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs px-3 h-7 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Bisha</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm rounded-2xl overflow-hidden">
                  <div className="p-4 space-y-1">
                    {isLoadingLeaderboard ? (
                      [1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
                    ) : leagueLeaderboard?.standings.slice(0, 5).map((standing, idx) => (
                      <div key={standing.user.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className={cn(
                          "w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
                          idx === 0 ? "bg-yellow-100 text-yellow-700" :
                            idx === 1 ? "bg-gray-100 text-gray-700" :
                              idx === 2 ? "bg-orange-100 text-orange-700" : "text-gray-400"
                        )}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{standing.user.name}</div>
                          <div className="text-[10px] text-gray-500">{standing.points} XP</div>
                        </div>
                        {idx < 3 && <Crown className={cn("w-3 h-3", idx === 0 ? "text-yellow-500" : "text-gray-300")} />}
                      </div>
                    ))}
                  </div>

                  {leagueLeaderboard?.my_standing && (
                    <div className="p-4 bg-primary/5 border-t border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
                          {leagueLeaderboard.my_standing.rank}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-primary">Is barbar dhig</div>
                          <div className="text-[10px] text-primary/70">{leagueLeaderboard.my_standing.points} XP</div>
                        </div>
                        <Trophy className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:Info@garaad.org" className="hover:text-primary transition-colors">Info@garaad.org</a>
                </div>

                <div className="flex items-center gap-6">
                  <a href="https://www.linkedin.com/company/garaad" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077b5] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Linkedin className="w-4 h-4" />
                    <span className="hidden md:inline">LinkedIn</span>
                  </a>
                  <a href="https://x.com/Garaadstem" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                    <Twitter className="w-4 h-4" />
                    <span className="hidden md:inline">Twitter</span>
                  </a>
                  <a href="http://facebook.com/Garaadstem" target="_blank" rel="noopener noreferrer" className="hover:text-[#1877F2] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Facebook className="w-4 h-4" />
                    <span className="hidden md:inline">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
