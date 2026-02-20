import { Metadata } from "next";
import { CoursesListClient } from "./CoursesListClient";
import { API_BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Koorsooyinka STEM-ka | Garaad STEM - Somali Tech Academy",
  description: "Ka baro Full-Stack Development, React, Next.js, AI, iyo STEM-ka afkaaga hooyo (Somali). Waddooyin isku xiga oo loo maro hanashada Tiknoolajiyadda casriga ah.",
  keywords: [
    "Koorsooyin Somali", "Baro Coding", "Somali Programming", "React Somali",
    "Next.js Somali", "Full-Stack Development Somali", "STEM Somali",
    "Soomaali Programming", "Barashada Computer-ka", "Garaad Courses"
  ],
  openGraph: {
    title: "Koorsooyinka STEM-ka ee Garaad STEM",
    description: "Ku biir jiilka dhisaya mustaqbalka tech-ka Soomaaliya. Baro Full-Stack, AI, iyo Tiknoolajiyadda afkaaga hooyo.",
    url: "https://garaad.so/courses",
    images: [{ url: "/images/og-courses.jpg" }],
  },
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
          "sameAs": "https://garaad.so"
        },
        "url": `https://garaad.so/courses/${course.category}/${course.slug}`
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
