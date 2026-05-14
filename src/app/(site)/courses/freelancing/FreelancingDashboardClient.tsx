"use client";

import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Lock, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserProgress } from "@/hooks/useApi";

interface Week {
  number: number;
  title: string;
  incomeMilestone: string;
  estimatedTime: string;
  lessons: number;
  active: boolean;
  href?: string;
}

const WEEKS: Week[] = [
  {
    number: 1,
    title: "AI sidii Qalabkaaga Ugu Weyn",
    incomeMilestone: "Samee shaqadii ugu horreysay ee macmiilku ku bixiyo lacag — qoraal, tarjumaan, ama sawir",
    estimatedTime: "4 saacadood",
    lessons: 6,
    active: true,
    href: "/courses/732311/html-css",
  },
  {
    number: 2,
    title: "Dhis Website La Bixiyo — Coding Looma Baahna",
    incomeMilestone: "Soo gudbi websaytkii ugu horreeyay aad macmiil ka bixi karto $100–$300",
    estimatedTime: "6 saacadood",
    lessons: 8,
    active: false,
  },
  {
    number: 3,
    title: "Bilow Platforms-ka Freelancing",
    incomeMilestone: "Profile diyaar ah oo Upwork ama Fiverr ku jira, haddana qoraal codsi ah oo guuleysta",
    estimatedTime: "4 saacadood",
    lessons: 6,
    active: false,
  },
  {
    number: 4,
    title: "Xidh Macmiilkaagii Ugu Horreeyay",
    incomeMilestone: "Lacag geli — $500 kaaga ugu horreeya ee online ah",
    estimatedTime: "3 saacadood",
    lessons: 5,
    active: false,
  },
];

export function FreelancingDashboardClient() {
  const { progress } = useUserProgress();

  const overallPercent: number = 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Back link */}
      <Link
        href="/courses"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Dhammaan waddooyinka
      </Link>

      {/* Track header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-xs font-semibold text-muted-foreground">
            $500 kaaga ugu horreeya ee online ah
          </span>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
          Bilow Shaqo Madax-bannaan
        </h1>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Horumarka guud</span>
            <span>{overallPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week list */}
      <div className="space-y-3">
        {WEEKS.map((week) => (
          <div
            key={week.number}
            className={cn(
              "rounded-2xl border bg-card p-5 transition-shadow",
              week.active
                ? "border-gold shadow-md shadow-gold/10"
                : "border-border opacity-75"
            )}
          >
            <div className="flex items-start gap-4">
              {/* Week number bubble */}
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  week.active
                    ? "bg-gold text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {week.active ? week.number : <Lock className="h-4 w-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Toddobaadka {week.number}
                    </p>
                    <h2 className="font-semibold text-foreground">{week.title}</h2>
                  </div>
                  {week.active ? (
                    <span className="shrink-0 rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                      Firfircoon
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Dhowaan soo socda
                    </span>
                  )}
                </div>

                {/* Income milestone */}
                <p className="mt-1 text-xs text-muted-foreground">
                  🎯 {week.incomeMilestone}
                </p>

                {/* Meta row */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {week.estimatedTime}
                  </span>
                  {week.lessons > 0 && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {week.lessons} cashar
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4">
                  {week.active && week.href ? (
                    <Link
                      href={week.href}
                      className="btn-gold inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold"
                    >
                      Bilow toddobaadka <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      🔒 Dhammeystir toddobaadka {week.number - 1} horta
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
