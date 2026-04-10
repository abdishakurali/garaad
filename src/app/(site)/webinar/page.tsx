import { Metadata } from "next";
import { WebinarPageClient } from "@/components/webinar/WebinarPageClient";

export const metadata: Metadata = {
  title: "Webinar AI — bilaash, 9 April 2026 | Garaad",
  description:
    "Kulan toos ah oo 2 saacadood ah: AI waa maxay, sababta ay muhiim u tahay, waxaadna ku qaban karto. Loogu talagalay bulshada Soomaaliyeed. Ma jiro duubis.",
  alternates: { canonical: "https://garaad.org/webinar" },
  openGraph: {
    type: "website",
    url: "https://garaad.org/webinar",
    siteName: "Garaad",
    title: "Webinar AI — Garaad",
    description:
      "Khamiis 9 April 2026 (6:00 PM Dublin · 8:00 PM Geeska Afrika · 1:00 PM US ET). Is-diiwaangeli — email xaqiijin + link Zoom 1 saac ka hor.",
    locale: "so_SO",
  },
};

export default function WebinarPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="w-full border-b border-primary/20 bg-primary/10 py-3 px-6 text-center">
        <p className="text-sm font-medium text-primary">
          This webinar has ended.
          <br />
          Watch for the next session at garaad.org
        </p>
      </div>
      <WebinarPageClient />
    </div>
  );
}
