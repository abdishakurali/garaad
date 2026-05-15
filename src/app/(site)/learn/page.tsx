import Link from "next/link";
import { buildMetadata, breadcrumbSchema, SITE_URL } from "@/lib/seo";
import { SEO_TOPICS } from "@/lib/seo-topics";

export const metadata = buildMetadata({
  title: "Baro Af-Soomaali — Hagayaasha Freelancing, Coding & AI | Garaad",
  description:
    "Hagayaasha Af-Soomaali: sida loo bilaabo freelancing, Upwork, Fiverr, xirfadaha dijital, lacag online, iyo wax badan. Garaad.",
  path: "/learn",
  keywords: [
    "baro Af-Soomaali",
    "hagayaasha freelancing Soomaali",
    "xirfadaha dijital Soomaali",
    "lacag online Soomaali",
    "Garaad baro",
    "online learning Somali",
  ],
});

const jsonLdBreadcrumb = breadcrumbSchema([
  { name: "Garaad", item: SITE_URL },
  { name: "Baro", item: `${SITE_URL}/learn` },
]);

export default function LearnIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Baro Af-Soomaali
          </h1>
          <p className="text-muted-foreground mb-10 text-base">
            Hagayaasha buuxa ee freelancing, xirfadaha dijital, iyo sida lacag looga sameeyo internet — oo dhan Af-Soomaali.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {SEO_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/learn/${topic.slug}`}
                className="block border border-border rounded-xl p-5 hover:border-primary/60 hover:bg-muted/30 transition-all group"
              >
                <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1 text-sm leading-snug">
                  {topic.headline}
                </h2>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {topic.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/courses/freelancing"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Bilow Koorso Bilaashka ah →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
