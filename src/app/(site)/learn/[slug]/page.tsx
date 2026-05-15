import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  articleSchema,
  SITE_URL,
} from "@/lib/seo";
import { getTopicBySlug, getAllTopicSlugs, type SeoTopic } from "@/lib/seo-topics";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTopicSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: "Not Found" };

  return buildMetadata({
    title: topic.title,
    description: topic.description,
    path: `/learn/${slug}`,
    keywords: topic.keywords,
    ogType: "article",
  });
}

export default async function LearnTopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const pageUrl = `${SITE_URL}/learn/${slug}`;

  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Garaad", item: SITE_URL },
    { name: "Baro", item: `${SITE_URL}/learn` },
    { name: topic.headline, item: pageUrl },
  ]);

  const jsonLdFaq = faqSchema(topic.faq);

  const jsonLdArticle = articleSchema({
    headline: topic.headline,
    description: topic.description,
    url: pageUrl,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex flex-wrap gap-1 items-center">
              <li><Link href="/" className="hover:underline">Garaad</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/learn" className="hover:underline">Baro</Link></li>
              <li aria-hidden>/</li>
              <li className="text-foreground font-medium" aria-current="page">{topic.headline}</li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
            {topic.headline}
          </h1>

          {/* Answer-first block — AI Overview bait */}
          <div className="bg-muted/50 border border-border rounded-xl p-5 mb-8">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Jawaab Degdeg ah
            </p>
            <p className="text-base text-foreground leading-relaxed">
              {topic.answer}
            </p>
          </div>

          {/* CTA — above the fold */}
          <div className="mb-10">
            <Link
              href={topic.ctaPath}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {topic.ctaLabel} →
            </Link>
          </div>

          {/* Outcomes */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Waxa Aad Ka Baraneyso
            </h2>
            <ul className="space-y-2">
              {topic.outcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ — structured for AI extraction */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Su&apos;aalaha Badanaa La Weydiiyo
            </h2>
            <div className="space-y-6">
              {topic.faq.map(({ question, answer }, i) => (
                <div key={i} className="border-b border-border pb-6 last:border-0">
                  <h3 className="font-semibold text-foreground mb-2">{question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold text-foreground mb-2">
              Diyaar baad u tahay bilawga?
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Koorsooyinka Garaad waa Af-Soomaali, bilaash, oo macmiil-heli ku dhammaanaya.
            </p>
            <Link
              href={topic.ctaPath}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {topic.ctaLabel} →
            </Link>
          </div>

          {/* Related topics */}
          {topic.related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Mowduucyada La xiriira
              </h2>
              <ul className="space-y-2">
                {topic.related.map((relSlug) => {
                  const rel = getTopicBySlug(relSlug);
                  if (!rel) return null;
                  return (
                    <li key={relSlug}>
                      <Link
                        href={`/learn/${relSlug}`}
                        className="text-primary hover:underline"
                      >
                        {rel.headline}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
