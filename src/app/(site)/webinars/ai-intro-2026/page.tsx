import type { Metadata } from "next";
import { WebinarPageClient } from "@/components/webinar/WebinarPageClient";

export const metadata: Metadata = {
  title: "AI Webinar — Garaad (April 2026)",
  description:
    "Kulan toos ah oo 2-saacadood ah: AI waa maxay, sababta ay muhiim u tahay, waxaadna ku qaban karto. Loogu talagalay bulshada Soomaaliyeed.",
  alternates: { canonical: "https://garaad.org/webinars/ai-intro-2026" },
};

// YouTube video ID from https://youtu.be/URWrCKuTUMQ
const RECAP_VIDEO_ID = "URWrCKuTUMQ";

export default function AiWebinarPage() {
  return <WebinarPageClient recapVideoId={RECAP_VIDEO_ID} />;
}
