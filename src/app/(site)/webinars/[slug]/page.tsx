import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WebinarDetailClient } from "@/components/webinar/WebinarDetailClient";

export const revalidate = 60;

interface WebinarData {
  id: number;
  title: string;
  slug: string;
  description: string;
  banner_image: string | null;
  date_utc: string;
  zoom_url: string;
  meeting_id: string;
  passcode: string;
  is_active: boolean;
  is_past: boolean;
}

async function fetchWebinar(slug: string): Promise<WebinarData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/webinars/${slug}/`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const webinar = await fetchWebinar(slug);
  if (!webinar) return { title: "Webinar — Garaad" };
  return {
    title: `${webinar.title} — Garaad`,
    description: webinar.description.slice(0, 160),
    openGraph: {
      title: webinar.title,
      description: webinar.description.slice(0, 160),
      images: webinar.banner_image ? [webinar.banner_image] : [],
    },
  };
}

export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const webinar = await fetchWebinar(slug);
  if (!webinar) notFound();

  return <WebinarDetailClient webinar={webinar} />;
}
