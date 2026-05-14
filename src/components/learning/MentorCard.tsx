"use client";
import { useEffect, useState } from "react";
import { Calendar, Users } from "lucide-react";
import { api } from "@/lib/api";

interface CohortData {
  cohort: { id: number; path_type: string; start_date: string } | null;
  mentor: { name: string; bio: string; booking_link: string } | null;
  fellow_learners: { name: string }[];
}

export default function MentorCard() {
  const [data, setData] = useState<CohortData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/lms/my-cohort/")
      .then((res: any) => setData(res.data ?? res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-24 animate-pulse rounded-2xl bg-muted" />;
  }

  if (!data?.mentor) return null;

  const { mentor, fellow_learners } = data;

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-50/5 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
        Mentor-kaaga
      </p>
      <div className="mb-3">
        <p className="font-semibold text-foreground">{mentor.name}</p>
        {mentor.bio && <p className="mt-1 text-sm text-muted-foreground">{mentor.bio}</p>}
      </div>
      {mentor.booking_link && (
        <a
          href={mentor.booking_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          <Calendar className="h-4 w-4" />
          Qabso Ballan
        </a>
      )}
      {fellow_learners.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>Kooxdaada: {fellow_learners.map(l => l.name).join(", ")}</span>
        </div>
      )}
    </div>
  );
}
