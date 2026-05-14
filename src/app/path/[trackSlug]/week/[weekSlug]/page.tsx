import { Metadata } from "next";
import WeekDetailClient from "@/components/learning/WeekDetailClient";

interface Props {
  params: { trackSlug: string; weekSlug: string };
}

async function getWeekData(trackSlug: string, weekSlug: string) {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org").replace(/\/$/, "");
  try {
    const res = await fetch(
      `${apiBase}/api/lms/courses/?track__slug=${trackSlug}&slug=${weekSlug}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return (data as any).results?.[0] ?? (Array.isArray(data) ? data[0] : null);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const week = await getWeekData(params.trackSlug, params.weekSlug);

  if (!week) return { title: "Garaad" };

  return {
    title: `Usbuuc ${week.week_number}: ${week.title} | Garaad`,
    description: week.income_milestone
      ? `${week.description} — Outcome: ${week.income_milestone}`
      : week.description,
    alternates: {
      canonical: `/path/${params.trackSlug}/week/${params.weekSlug}`,
    },
  };
}

function WeekJsonLd({ week, trackSlug, weekSlug }: { week: any; trackSlug: string; weekSlug: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `Usbuuc ${week?.week_number}: ${week?.title}`,
    description: week?.income_milestone ?? week?.description,
    url: `https://garaad.org/path/${trackSlug}/week/${weekSlug}`,
    provider: {
      "@type": "Organization",
      name: "Garaad",
      url: "https://garaad.org",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function WeekPage({ params }: Props) {
  const week = await getWeekData(params.trackSlug, params.weekSlug);

  return (
    <>
      {week && (
        <WeekJsonLd
          week={week}
          trackSlug={params.trackSlug}
          weekSlug={params.weekSlug}
        />
      )}
      <WeekDetailClient
        weekSlug={params.weekSlug}
        trackSlug={params.trackSlug}
      />
    </>
  );
}
