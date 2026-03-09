import { Metadata } from "next";
import { CoursesListClient } from "./CoursesListClient";
import { API_BASE_URL } from "@/lib/constants";

const COURSES_URL = "https://garaad.org/courses";

export const metadata: Metadata = {
  title: "Koorsooyin — Full-Stack MERN & AI | Garaad",
  description:
    "Baro React, Node.js, MongoDB iyo AI — Af-Soomaali. Koorsooyin loo qaabeeyey kuwa bilowga ah iyo xirfadlayaasha.",
  keywords: [
    "Koorsooyin Somali",
    "Baro Coding",
    "Somali Programming",
    "React Somali",
    "Full-Stack Somali",
    "Garaad Courses",
  ],
  alternates: { canonical: COURSES_URL },
  openGraph: {
    type: "website",
    url: COURSES_URL,
    title: "Koorsooyin — Full-Stack MERN & AI | Garaad",
    description:
      "Baro React, Node.js, MongoDB iyo AI — Af-Soomaali. Koorsooyin loo qaabeeyey kuwa bilowga ah iyo xirfadlayaasha.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad Koorsooyinka" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Koorsooyin — Full-Stack MERN & AI | Garaad",
    description: "Baro React, Node.js, MongoDB iyo AI — Af-Soomaali. Koorsooyin loo qaabeeyey kuwa bilowga ah iyo xirfadlayaasha.",
    images: ["https://garaad.org/images/og-main.jpg"],
  },
  robots: { index: true, follow: true },
};

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lms/categories/`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results || []);
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
      <CoursesListClient />
    </>
  );
}
