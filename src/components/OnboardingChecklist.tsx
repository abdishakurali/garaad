import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingStatus {
  profile_completed: boolean;
  first_lesson_watched: boolean;
  community_visited: boolean;
  call_booked: boolean;
}

const OnboardingChecklist = () => {
  const { user } = useAuth();

  // Fallback data since we don't have the actual API update yet
  // In a real scenario, this would come from the user object or a separate API call
  const status: OnboardingStatus = {
    profile_completed: (user as any)?.profile_completed ?? false,
    first_lesson_watched: (user as any)?.first_lesson_watched ?? false,
    community_visited: (user as any)?.community_visited ?? false,
    call_booked: (user as any)?.call_booked ?? false,
  };

  const steps = [
    {
      id: "profile",
      label: "Dhamee profile-kaaga",
      link: "/profile",
      completed: status.profile_completed,
      locked: false,
    },
    {
      id: "lesson",
      label: "Daawo casharka 1aad",
      link: "/courses",
      completed: status.first_lesson_watched,
      locked: false,
    },
    {
      id: "community",
      label: "Ku biir bulshadda",
      link: "/subscribe",
      completed: status.community_visited,
      locked: true,
    },
    {
      id: "call",
      label: "Book 1-on-1 kaaga",
      link: "/subscribe",
      completed: status.call_booked,
      locked: true,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Onboarding Checklist</CardTitle>
        <p className="text-sm text-muted-foreground">
          {completedCount} of {steps.length} steps complete
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center justify-between p-2 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : step.locked ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={cn("text-sm", step.completed && "text-muted-foreground line-through")}>
                {step.label}
                {step.locked && !step.completed && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    Members only
                  </span>
                )}
              </span>
            </div>

            {step.locked && !step.completed ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                    Unlock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Membership Required</DialogTitle>
                    <DialogDescription>
                      Tani waxay u baahan tahay membership — bixi $49 maanta oo hel helitaan buuxa
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center mt-4">
                    <Link href="/subscribe">
                      <Button className="w-full">Subscribe Now</Button>
                    </Link>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Link
                href={step.link}
                className="text-xs text-primary hover:underline font-medium"
              >
                {step.completed ? "Completed" : "Go"}
              </Link>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;
