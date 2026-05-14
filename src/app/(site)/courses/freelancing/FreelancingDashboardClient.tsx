"use client";

import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Lock, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserProgress } from "@/hooks/useApi";

interface Week {
  number: number;
  label: string;
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
    label: "Toddobaadka 1-aad",
    title: "Gacan ku dhig AI — Eber ilaa Isticmaale Sare",
    incomeMilestone:
      "Isticmaal AI si aad u dhammaystirto shaqadaadii ugu horreysay ee lacag ah — qorid, turjumid, soo koobid, ama cilmi-baaris aad u samayso macmiil dhab ah",
    estimatedTime: "4 saacadood",
    lessons: 6,
    active: true,
    href: "/courses/732311/html-css",
  },
  {
    number: 2,
    label: "Toddobaadka 2-aad",
    title: "Ku Dhis Xirfad AI",
    incomeMilestone:
      "Dooro mid: koodh qoris (coding), naqshadayn (design), SEO, ama tafatirka muuqaalka (video editing) — oo soo gudbi tusaalahaagii ugu horreeyay ee AI kaa caawisay",
    estimatedTime: "5 saacadood",
    lessons: 7,
    active: false,
  },
  {
    number: 3,
    label: "Toddobaadka 3-aad",
    title: "Dhis Faylkaaga Shaqada (Portfolio)",
    incomeMilestone:
      "Daabac 3 tusaale shaqo oo muujinaya waxa aad u qaban karto macmiilka",
    estimatedTime: "4 saacadood",
    lessons: 6,
    active: false,
  },
  {
    number: 4,
    label: "Toddobaadka 4-aad",
    title: "Habeeyo Boggaga Shaqada Madax-bannaan (Profile-kaaga)",
    incomeMilestone:
      "Profile-kaaga oo laga arki karo Upwork ama Fiverr — cinwaan la hagaajiyay, taariikh nololeed (bio), qiimayaal, iyo dalabyo (proposals) diyaar ah",
    estimatedTime: "3 saacadood",
    lessons: 5,
    active: false,
  },
  {
    number: 5,
    label: "Toddobaadka 5-aad",
    title: "Raadi Macaamiil & Hel Lacagtaada",
    incomeMilestone:
      "Hel macmiilkaagii ugu horreeyay ee lacag bixiya — $500 kaaga ugu horreeya ee online ah",
    estimatedTime: "4 saacadood",
    lessons: 6,
    active: false,
  },
];

const TOTAL_LESSONS = WEEKS.reduce((sum, w) => sum + w.lessons, 0);

export function FreelancingDashboardClient() {
  const { progress } = useUserProgress();
  const overallPercent: number = 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Back link */}
      <Link
        href="/courses"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Dhammaan waddooyinka
      </Link>

      {/* Track header */}
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            $500 kaaga ugu horreeya ee online ah
          </span>
        </div>
        <h1 className="mb-1 text-3xl font-bold text-foreground sm:text-4xl">
          Bilow Shaqo Madax-bannaan
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {WEEKS.length} toddobaadyo · {TOTAL_LESSONS} cashar
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Horumarka guud</span>
            <span className="font-bold tabular-nums text-foreground">{overallPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gold transition-all duration-700"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            0 / {WEEKS.length} toddobaadyo la dhammaystay
          </p>
        </div>
      </div>

      {/* Week list with connector line */}
      <div className="relative">
        <div className="absolute left-[17px] top-5 bottom-5 w-px bg-border" />

        <div className="space-y-4">
          {WEEKS.map((week) => (
            <div key={week.number} className="relative flex gap-4">
              {/* Step bubble */}
              <div
                className={cn(
                  "relative z-10 mt-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                  week.active
                    ? "border-gold bg-gold text-white"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                {week.active ? week.number : <Lock className="h-3.5 w-3.5" />}
              </div>

              {/* Card */}
              <div
                className={cn(
                  "flex-1 rounded-2xl border bg-card p-5 transition-shadow",
                  week.active
                    ? "border-gold shadow-md shadow-gold/10"
                    : "border-border opacity-70"
                )}
              >
                {/* Header row */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {week.label}
                    </p>
                    <h2 className="text-base font-bold leading-snug text-foreground">
                      {week.title}
                    </h2>
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

                {/* Milestone */}
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  🎯 {week.incomeMilestone}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {week.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {week.lessons} cashar
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-5">
                  {week.active && week.href ? (
                    <Link
                      href={week.href}
                      className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold"
                    >
                      Bilow Toddobaadka 1-aad
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      🔒 Dhammaystir Toddobaadka {week.number - 1} horta
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
