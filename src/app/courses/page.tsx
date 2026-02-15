import { Metadata } from "next";
import { CoursesListClient } from "./CoursesListClient";

export const metadata: Metadata = {
  title: "Koorsooyinka STEM-ka | Garaad - Somali Tech Academy",
  description: "Ka baro Full-Stack Development, AI, iyo STEM-ka afkaaga hooyo. Waddooyin isku xiga oo loo maro hanashada Tiknoolajiyadda casriga ah.",
  openGraph: {
    title: "Koorsooyinka STEM-ka ee Garaad",
    description: "Ku biir jiilka dhisaya mustaqbalka tech-ka Soomaaliya. Baro Full-Stack, AI, iyo qaar kaloo badan.",
    url: "https://garaad.so/courses",
    images: [{ url: "/images/og-courses.jpg" }],
  },
};

export default function CoursesPage() {
  return <CoursesListClient />;
}
