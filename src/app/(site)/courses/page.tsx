import { Metadata } from "next";
import { CoursesListClient } from "./CoursesListClient";
import { API_BASE_URL } from "@/lib/constants";

const COURSES_URL = "https://garaad.org/courses";

export const metadata: Metadata = {
  title: "Koorsooyinka — Baro React, Next.js, Node.js, MongoDB & AI | Garaad",
  description:
    "Baro full-stack development-ka Af-Soomaaliga. Koorsooyinka React, Next.js, Node.js, MongoDB, AI iyo MERN stack. Bilow bilaash oo dhamee shahaado. Kan ugu weyn Somaliya.",
  keywords: [
    // English keywords for global search
    "learn React", "React tutorial", "React course", "React for beginners",
    "learn Next.js", "Next.js tutorial", "Next.js course", "Next.js 14",
    "learn Node.js", "Node.js tutorial", "Node.js course", "Express.js",
    "learn MongoDB", "MongoDB tutorial", "MongoDB course", "MERN stack",
    "learn JavaScript", "JavaScript tutorial", "JavaScript course", "ES6",
    "learn AI", "AI tutorial", "machine learning", "ChatGPT development",
    "learn full-stack", "full-stack tutorial", "web development course",
    "learn MERN", "MERN stack tutorial", "MERN stack course",
    "learn TypeScript", "TypeScript tutorial", "React TypeScript",
    "learn CSS", "learn Tailwind", "Tailwind CSS tutorial",
    "learn Python", "Python tutorial", "AI with Python",
    "coding bootcamp", "online coding course", "web development curriculum",
    // Somali keywords for local search
    "baro React Somali", "baro Next.js Somali", "baro JavaScript Somali",
    "baro Node.js Somali", "baro MongoDB Somali", "baro full-stack Somali",
    "baro AI Somali", "baro programming Somali", "baro coding Somali",
    "koorso React bilaash", "koorso Next.js bilaash", "koorso programming Somali",
    "baro web development Somali", "baro MERN stack Somali",
    " Somali coding", "Somali programming", "Somali tech education",
    "Garaad courses", "Koorsooyinka Garaad", "programming Somalia",
    "web development Somalia", "software development Somalia",
    "career in tech Somalia", "become developer Somalia",
  ],
  alternates: { canonical: COURSES_URL },
  openGraph: {
    type: "website",
    url: COURSES_URL,
    title: "Koorsooyinka — Baro React, Next.js, AI & Full-Stack | Garaad",
    description:
      "Baro React, Next.js, Node.js, MongoDB & AI Af-Soomaaliga. Koorsooyinka ugu fiican Somaliya. Bilow bilaash.",
    images: [{ url: "https://garaad.org/images/og-main.jpg", width: 1200, height: 630, alt: "Garaad Courses" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@garaadorg",
    title: "Koorsooyinka — Baro React, Next.js & Full-Stack | Garaad",
    description: "Baro full-stack development Af-Soomaaliga. Bilow bilaash.",
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
