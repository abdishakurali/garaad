import { Metadata } from "next";
import { CoursesListClient } from "./CoursesListClient";
import { Category } from "@/types/lms";
import { API_BASE_URL } from "@/lib/constants";

const COURSES_URL = "https://garaad.org/courses";

export const metadata: Metadata = {
  title: "Your 30-Day Plan — Garaad",
  description:
    "Pick your path — Freelancer, Worker, or Builder. Follow the 30-day plan. Make your first money online, in Somali.",
  alternates: { canonical: COURSES_URL },
  openGraph: {
    type: "website",
    url: COURSES_URL,
    title: "Your 30-Day Plan — Garaad",
    description: "Pick your path. Follow the plan. Make your first money.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Your 30-Day Plan — Garaad",
    description: "Pick your path. Follow the plan. Make your first money.",
    images: ["https://garaad.org/images/og-main.jpg"],
  },
  robots: { index: true, follow: true },
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lms/categories/`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as Category[]) : ((data.results || []) as Category[]);
  } catch (error) {
    return [];
  }
}

export default async function CoursesPage() {
  const categories = await getCategories();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Koorsooyinka Garaad",
    "description": "Dhammaan koorsooyinka STEM iyo Programming ee af-Soomaaliga ah.",
    "itemListElement": categories.flatMap((cat: any) => cat?.courses || []).map((course: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course?.title,
        "description": course?.description,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Garaad STEM",
          "sameAs": "https://garaad.org"
        },
        "url": `https://garaad.org/courses/${course.category}/${course.slug}`
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CoursesListClient initialCategories={categories} />
    </>
  );
}
