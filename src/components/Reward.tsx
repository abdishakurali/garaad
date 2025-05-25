"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Zap,
  Star,
  Crown,
  Flame,
  Award,
  Users,
  ChevronRight,
  Target,
  TrendingUp,
  Calendar,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Interfaces (remain unchanged)
interface UserReward {
  id: number;
  user: number;
  reward_type: string;
  reward_name: string;
  value: number;
  awarded_at: string;
}

interface UserStreak {
  current_streak: number;
  max_streak: number;
  problems_solved_today: number;
  problems_to_next_streak: number;
  energy: { current: number; max: number; next_update: string };
}

interface LeagueInfo {
  current_league: {
    id: string;
    name: string;
    min_xp: number;
  };
  current_points: number;
  weekly_rank: number;
  streak: {
    current_streak: number;
    max_streak: number;
    streak_charges: number;
    last_activity_date: string;
  };
  next_league: {
    id: string;
    name: string;
    min_xp: number;
    points_needed: number;
  };
}

interface LeagueStanding {
  league: { id: string; name: string };
  time_period: string;
  standings: Array<{
    rank: number;
    user: { id: string; name: string };
    points: number;
    streak: number;
  }>;
  my_standing: {
    rank: number;
    points: number;
    streak: number;
  };
}

interface EnhancedRewardDisplayProps {
  onContinue: () => void;
  rewards: UserReward[];
  streak?: UserStreak;
  league?: LeagueInfo;
  leaderboard?: LeagueStanding;
  lessonTitle: string;
}

type RewardStep =
  | "welcome"
  | "rewards"
  | "streak"
  | "league"
  | "leaderboard"
  | "summary"
  | "done";

const RewardDisplay: React.FC<EnhancedRewardDisplayProps> = ({
  onContinue,
  rewards,
  streak,
  league,
  leaderboard,
  lessonTitle,
}) => {
  const [step, setStep] = useState<RewardStep>("welcome");
  const [rewardIndex, setRewardIndex] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, [step, rewardIndex]);

  const transitionToNextStep = useCallback(() => {
    setIsTransitioning(true);
    setShowAnimation(false);

    setTimeout(() => {
      if (step === "welcome") {
        setStep(rewards.length > 0 ? "rewards" : "streak");
      } else if (step === "rewards" && rewardIndex < rewards.length - 1) {
        setRewardIndex((prev) => prev + 1);
      } else if (step === "rewards") {
        setStep("streak");
      } else if (step === "streak") {
        setStep("league");
      } else if (step === "league") {
        setStep("leaderboard");
      } else if (step === "leaderboard") {
        setStep("summary");
      } else if (step === "summary") {
        setStep("done");
        onContinue();
      }
      setIsTransitioning(false);
    }, 300);
  }, [step, rewardIndex, rewards.length, onContinue]);

  useEffect(() => {
    if (step === "streak" && !streak) setStep("league");
    if (step === "league" && !league) setStep("leaderboard");
    if (step === "leaderboard" && !leaderboard) setStep("summary");
  }, [step, streak, league, leaderboard]);

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType.toLowerCase()) {
      case "xp":
        return <Star className="h-12 w-12 text-background" />;
      case "streak":
        return <Flame className="h-12 w-12 text-background" />;
      case "league":
        return <Crown className="h-12 w-12 text-background" />;
      case "achievement":
        return <Trophy className="h-12 w-12 text-background" />;
      case "energy":
        return <Zap className="h-12 w-12 text-background" />;
      default:
        return <Award className="h-12 w-12 text-background" />;
    }
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-primary">
        <div
          className={cn(
            "transition-all duration-700 transform",
            showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <Card className="w-full max-w-lg shadow-2xl border-0 bg-background">
            <div className="h-2 bg-card" />
            <CardHeader className="text-center pb-6 pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-6 rounded-full bg-primary shadow-xl animate-pulse">
                  <Trophy className="h-16 w-16 text-background" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-card-foreground mb-3">
                Cashar La Dhameeyay!
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Waad ku guulaysatay Dhamaystirka "{lessonTitle}"
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="text-center space-y-6">
                <p className="text-card-foreground">
                  Waxaad ku sameysay horumar aad u wanaagsan. Aynu aragno waxaad
                  kasbatay!
                </p>
                <Button
                  onClick={transitionToNextStep}
                  className="w-full py-4 text-lg font-medium bg-primary hover:bg-primary/90 text-background"
                  size="lg"
                >
                  Arag Abaalamrinta
                  <Gift className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "rewards" && rewardIndex < rewards.length) {
    const reward = rewards[rewardIndex];
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-card">
        <div
          className={cn(
            "transition-all duration-500 transform",
            showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <Card className="w-full max-w-md shadow-2xl border-0 bg-background">
            <div className="h-3 bg-primary" />
            <CardHeader className="text-center pb-4 pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-8 rounded-full bg-primary shadow-2xl">
                  {getRewardIcon(reward.reward_type)}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground mb-2">
                Abaalmarin La Helay!
              </CardTitle>
              <p className="text-muted-foreground">
                Waxaad fursad u heshay abaalmarintan
              </p>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-card-foreground">
                  {reward.reward_name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <Badge className="text-xl px-6 py-3 bg-card">
                    +{reward.value} {reward.reward_type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  La helay {new Date(reward.awarded_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                onClick={transitionToNextStep}
                className="w-full py-3 text-lg font-medium bg-primary hover:bg-primary/90 text-background"
                size="lg"
              >
                {rewardIndex < rewards.length - 1
                  ? "Abaalmarin Xiga"
                  : "Sii Wad"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "streak" && streak) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-card">
        <div
          className={cn(
            "transition-all duration-500 transform",
            showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <Card className="max-w-lg w-full shadow-2xl border-0 bg-background">
            <div className="h-3 bg-primary" />
            <CardHeader className="text-center pb-4 pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-8 rounded-full bg-primary shadow-2xl">
                  <Flame className="h-12 w-12 text-background" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Xariga Barashadaada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-card rounded-xl border">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {streak.current_streak}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Xariga Hadda
                  </div>
                </div>
                <div className="text-center p-6 bg-card rounded-xl border">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {streak.max_streak}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Xariga Ugu Dheeraa
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="text-card-foreground">
                      suaalaha la xaliyay maanta
                    </span>
                  </div>
                  <Badge className="text-lg px-3 py-1 bg-primary text-background">
                    {streak.problems_solved_today}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="text-card-foreground">Tamarta</span>
                  </div>
                  <div className="font-medium text-primary">
                    {streak.energy.current}/{streak.energy.max}
                  </div>
                </div>
              </div>

              <Button
                onClick={transitionToNextStep}
                className="w-full py-3 text-lg font-medium bg-primary hover:bg-primary/90 text-background"
                size="lg"
              >
                Sii Wad
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "league" && league) {
    const progressPercentage = Math.min(
      (league.current_points / league.next_league.min_xp) * 100,
      100
    );

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-card">
        <div
          className={cn(
            "transition-all duration-500 transform",
            showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <Card className="max-w-lg w-full shadow-2xl border-0 bg-background">
            <div className="h-3 bg-primary" />
            <CardHeader className="text-center pb-4 pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-8 rounded-full bg-primary shadow-2xl">
                  <Crown className="h-12 w-12 text-background" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Xaalada Liigga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="text-center space-y-3">
                <div className="text-lg font-semibold text-card-foreground">
                  Liigga Hadda
                </div>
                <Badge className="text-xl px-6 py-3 bg-primary text-background">
                  {league.current_league.name}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-primary">
                    #{league.weekly_rank}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Darajada Usbuuca
                  </div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-primary">
                    {league.current_points}
                  </div>
                  <div className="text-sm text-muted-foreground">Dhibcaha</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-card-foreground">
                    Horumarinta {league.next_league.name}
                  </span>
                  <span className="text-primary">
                    {league.next_league.points_needed} dhibcaha laoo baahanyahy
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-4 bg-card"
                  // indicatorClassName="bg-primary"
                />
              </div>

              <Button
                onClick={transitionToNextStep}
                className="w-full py-3 text-lg font-medium bg-primary hover:bg-primary/90 text-background"
                size="lg"
              >
                Sii Wad
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "leaderboard" && leaderboard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-card">
        <div
          className={cn(
            "transition-all duration-500 transform",
            showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <Card className="max-w-lg w-full shadow-2xl border-0 bg-background">
            <div className="h-3 bg-primary" />
            <CardHeader className="text-center pb-4 pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-8 rounded-full bg-primary shadow-2xl">
                  <Users className="h-12 w-12 text-background" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Booska Sharafta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="text-center space-y-3">
                <div className="text-4xl font-bold text-primary">
                  #{leaderboard.my_standing.rank}
                </div>
                <div className="text-muted-foreground text-lg">
                  Darajada Usbuucda
                </div>
                <p className="text-sm text-muted-foreground">
                  Ka mid ah barayaasha liiggaaga
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-card rounded-xl border">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {leaderboard.my_standing.points}
                  </div>
                  <div className="text-sm text-muted-foreground">Dhibcaha</div>
                </div>
                <div className="text-center p-6 bg-card rounded-xl border">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {leaderboard.my_standing.streak}
                  </div>
                  <div className="text-sm text-muted-foreground">Xariga</div>
                </div>
              </div>

              <Button
                onClick={transitionToNextStep}
                className="w-full py-3 text-lg font-medium bg-primary hover:bg-primary/90 text-background"
                size="lg"
              >
                Sii Wad
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "summary") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-card">
        <div
          className={cn(
            "transition-all duration-500 transform",
            showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
        >
          <Card className="max-w-lg w-full shadow-2xl border-0 bg-background">
            <div className="h-3 bg-primary" />
            <CardHeader className="text-center pb-4 pt-8">
              <div className="flex justify-center mb-6">
                <div className="p-8 rounded-full bg-primary shadow-2xl">
                  <Trophy className="h-12 w-12 text-background" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Horumar Fiican!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="text-center space-y-4">
                <p className="text-card-foreground text-lg">
                  Waxaad si guul leh u qabatay cashar cusub oo heshay
                  abaalmarino qiimo leh.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {rewards.length > 0 && (
                    <div className="text-center p-3 bg-card rounded-lg border">
                      <Gift className="h-6 w-6 text-primary mx-auto mb-1" />
                      <div className="text-sm font-medium text-card-foreground">
                        {rewards.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Abaalmarino
                      </div>
                    </div>
                  )}

                  {streak && (
                    <div className="text-center p-3 bg-card rounded-lg border">
                      <Flame className="h-6 w-6 text-primary mx-auto mb-1" />
                      <div className="text-sm font-medium text-card-foreground">
                        {streak.current_streak}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Maalmood
                      </div>
                    </div>
                  )}

                  {league && (
                    <div className="text-center p-3 bg-card rounded-lg border">
                      <Crown className="h-6 w-6 text-primary mx-auto mb-1" />
                      <div className="text-sm font-medium text-card-foreground">
                        #{league.weekly_rank}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Darajada Liigga
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={transitionToNextStep}
                className="w-full py-4 text-lg font-medium bg-primary hover:bg-primary/90 text-background"
                size="lg"
              >
                Ku Noqo Koorsada
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default RewardDisplay;
