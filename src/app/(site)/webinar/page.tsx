import { Metadata } from "next";
import dynamic from "next/dynamic";
import { WebinarPageClient } from "@/components/webinar/WebinarPageClient";

const WhatsAppFloat = dynamic(() =>
  import("@/components/landing/WhatsAppFloat").then((mod) => mod.WhatsAppFloat)
);

export const metadata: Metadata = {
  title: "Free AI Webinar — 9 April 2026",
  description:
    "A free 2-hour live AI session for the Somali community. English session, Somali-friendly. Register for Zoom — no recording.",
  alternates: { canonical: "https://garaad.org/webinar" },
  openGraph: {
    type: "website",
    url: "https://garaad.org/webinar",
    siteName: "Garaad",
    title: "Free AI Webinar — Garaad",
    description:
      "Live on 9 April 2026 (4:00 PM Dublin). Register for your spot — confirmation email + Zoom link 1 hour before start.",
    locale: "en_GB",
  },
};

export default function WebinarPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased">
      <WebinarPageClient />
      <WhatsAppFloat />
    </div>
  );
}
