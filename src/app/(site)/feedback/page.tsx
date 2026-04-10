import type { Metadata } from "next";
import { FeedbackPageClient } from "@/components/feedback/FeedbackPageClient";

export const metadata: Metadata = {
  title: "Garaad Transparent — Aragtida ardayda",
  description:
    "Aragtida dhabta ah ee ardayda Garaad — ogolaansho la leh. Reeb aragtidaada ama akhri waxa ardaydu yiraahdaan.",
  alternates: { canonical: "https://garaad.org/feedback" },
  robots: { index: true, follow: true },
};

export default function FeedbackPage() {
  return <FeedbackPageClient />;
}
