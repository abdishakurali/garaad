"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { API_BASE_URL } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface HeroCourse {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  is_published: boolean;
}

type HeroCourseWithCategory = HeroCourse & { categoryId: number };

function parseCategories(data: unknown): HeroCourseWithCategory[] {
  const categories = Array.isArray(data) ? data : (data as { results?: unknown[] })?.results ?? [];
  return (categories as { id: number; courses?: HeroCourse[] }[]).flatMap((cat) =>
    (cat.courses || []).filter((c) => c.is_published).map((c) => ({ ...c, categoryId: cat.id }))
  );
}

/**
 * For guests: /welcome (lessons are auth-gated).
 * For logged-in users: first lesson of the first published course, or /courses.
 */
export function useFirstFreeLessonHref() {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!user;

  const { data: categoriesData } = useSWR<unknown>(
    `${API_BASE_URL}/api/lms/categories/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );

  const firstCourse = useMemo(() => {
    const courses = parseCategories(categoriesData ?? []);
    if (courses.length === 0) return null;
    return [...courses].sort((a, b) => {
      if (a.categoryId !== b.categoryId) return a.categoryId - b.categoryId;
      return a.id - b.id;
    })[0];
  }, [categoriesData]);

  const lessonsKey =
    isLoggedIn && firstCourse
      ? `${API_BASE_URL}/api/lms/lessons/?course=${firstCourse.id}`
      : null;

  const { data: lessonsData } = useSWR(lessonsKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 1000,
  });

  const firstLessonId = useMemo(() => {
    if (!lessonsData) return null;
    const list = Array.isArray(lessonsData)
      ? lessonsData
      : (lessonsData as { results?: { id: number }[] }).results ?? [];
    const first = list[0] as { id?: number } | undefined;
    return typeof first?.id === "number" ? first.id : null;
  }, [lessonsData]);

  const href = useMemo(() => {
    if (!isLoggedIn) return "/welcome";
    if (firstCourse && firstLessonId != null) {
      return `/courses/${firstCourse.categoryId}/${firstCourse.slug}/lessons/${firstLessonId}`;
    }
    return "/courses";
  }, [isLoggedIn, firstCourse, firstLessonId]);

  return { href, isLoggedIn };
}
