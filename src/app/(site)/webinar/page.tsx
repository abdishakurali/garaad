import { Metadata } from "next";
import { WebinarPageClient } from "@/components/webinar/WebinarPageClient";

export const metadata: Metadata = {
  title: "Webinar AI — Bilaash | Garaad",
  description:
    "Kulan toos ah oo 2 saacadood ah: AI waa maxay, sababta ay muhiim u tahay, waxaadna ku qaban karto. Loogu talagalay bulshada Soomaaliyeed.",
  alternates: { canonical: "https://garaad.org/webinar" },
  openGraph: {
    type: "website",
    url: "https://garaad.org/webinar",
    siteName: "Garaad",
    title: "Webinar AI — Garaad",
    description:
      "Kulan toos ah oo 2 saacadood ah: AI waa maxay, sababta ay muhiim u tahay, waxaadna ku qaban karto. Loogu talagalay bulshada Soomaaliyeed.",
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
