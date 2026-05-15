import type { Metadata } from "next";

export const SITE_URL = "https://garaad.org";
export const SITE_NAME = "Garaad";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-main.jpg`;
export const TWITTER_HANDLE = "@garaadorg";

// ─── Metadata builders ────────────────────────────────────────────────────────

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  ogType = "website",
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical: url,
      languages: { so: url, "x-default": url },
    },
    openGraph: {
      type: ogType,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: "so_SO",
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

// ─── JSON-LD schema builders ──────────────────────────────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: "Garaad",
    alternateName: "Garaad Academy",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    foundingDate: "2023",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida ee barashada freelancing, programming, iyo xirfadaha dijital.",
    inLanguage: ["so", "en"],
    areaServed: ["SO", "IE", "GB", "US", "ET", "KE"],
    sameAs: [
      "https://x.com/Garaadstem",
      "https://facebook.com/Garaadstem",
      "https://www.linkedin.com/company/garaad",
    ],
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; item?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.item && { item: crumb.item }),
    })),
  };
}

export function courseSchema({
  name,
  description,
  url,
  image,
  level,
  slug,
  isFree = true,
  durationHours = 10,
  language = "so",
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  level?: string;
  slug?: string;
  isFree?: boolean;
  durationHours?: number;
  language?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course`,
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Garaad",
    },
    ...(image && { image }),
    ...(slug && { courseCode: slug }),
    ...(level && { educationalLevel: level }),
    inLanguage: language,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${durationHours}H`,
      inLanguage: language,
    },
    offers: [
      {
        "@type": "Offer",
        category: isFree ? "Free" : "Paid",
        price: isFree ? "0" : undefined,
        priceCurrency: "USD",
        url,
      },
    ],
  };
}

export function articleSchema({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = "Garaad",
  language = "so",
}: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  language?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    inLanguage: language,
    ...(image && { image }),
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Garaad",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
  };
}

export function learningResourceSchema({
  name,
  description,
  url,
  courseUrl,
  courseName,
  lessonOrder,
  isFree = false,
  language = "so",
}: {
  name: string;
  description: string;
  url: string;
  courseUrl?: string;
  courseName?: string;
  lessonOrder?: number;
  isFree?: boolean;
  language?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${url}#lesson`,
    name,
    description,
    url,
    inLanguage: language,
    educationalLevel: "beginner",
    learningResourceType: "lesson",
    isAccessibleForFree: isFree,
    ...(courseUrl && courseName && {
      isPartOf: {
        "@type": "Course",
        "@id": `${courseUrl}#course`,
        name: courseName,
      },
    }),
    ...(lessonOrder !== undefined && { position: lessonOrder }),
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Garaad",
    },
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

// ─── Somali keyword maps ───────────────────────────────────────────────────────
// Used by programmatic SEO pages and metadata generators.

export const FREELANCING_KEYWORDS = [
  "freelancing Soomaali",
  "lacag online Soomaali",
  "shaqo online Soomaali",
  "sida loo helo macmiil online",
  "Upwork Soomaali",
  "Fiverr Soomaali",
  "freelancer Somalia",
  "online jobs Somalia",
  "remote work Somalia",
  "earn money online Somalia",
  "digital skills Somalia",
  "xirfadaha dijital Soomaali",
  "side hustle Somalia",
  "copywriting Soomaali",
  "graphic design Soomaali",
  "how to freelance Somalia",
  "freelancing for beginners Somali",
];

export const PROGRAMMING_KEYWORDS = [
  "baro programming Soomaali",
  "baro coding Soomaali",
  "baro React Soomaali",
  "baro JavaScript Soomaali",
  "baro web development Soomaali",
  "coding Somalia",
  "programming Somalia",
  "software developer Somalia",
  "learn to code Somali",
];

export const SKILLS_KEYWORDS = [
  "best skills to learn Somalia",
  "xirfadaha ugu fiican ee loo barto",
  "AI jobs Somalia",
  "AI xirfado Soomaali",
  "remote job skills Somalia",
  "digital marketing Somalia",
  "tech skills Soomaali",
];
