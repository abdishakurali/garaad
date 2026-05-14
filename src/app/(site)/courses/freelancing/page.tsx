import { Metadata } from "next";
import { FreelancingDashboardClient } from "./FreelancingDashboardClient";

export const metadata: Metadata = {
  title: "Start Freelancing — Garaad",
  description:
    "Go from zero to landing your first paid client online. 4 weeks, built in Somali.",
  alternates: { canonical: "https://garaad.org/courses/freelancing" },
  openGraph: {
    type: "website",
    url: "https://garaad.org/courses/freelancing",
    title: "Start Freelancing — Garaad",
    description: "Go from zero to landing your first paid client online.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad" }],
  },
  robots: { index: true, follow: true },
};

export default function FreelancingPage() {
  return <FreelancingDashboardClient />;
}
