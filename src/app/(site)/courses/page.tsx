import { Metadata } from "next";
import { TrackGridClient } from "./TrackGridClient";

const COURSES_URL = "https://garaad.org/courses";

export const metadata: Metadata = {
  title: "Your Path — Garaad",
  description:
    "Choose your learning path — Start Freelancing, Get a Remote Job, or Build a SaaS. Your lessons and mentorship are built around your goal.",
  alternates: { canonical: COURSES_URL },
  openGraph: {
    type: "website",
    url: COURSES_URL,
    title: "Your Path — Garaad",
    description: "Pick the goal that matches where you want to go.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Your Path — Garaad",
    description: "Pick the goal that matches where you want to go.",
    images: ["https://garaad.org/images/og-main.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function CoursesPage() {
  return <TrackGridClient />;
}
