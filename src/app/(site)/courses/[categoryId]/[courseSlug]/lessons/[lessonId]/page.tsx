import { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/constants';
import { LessonDetailClient } from '@/components/learning/LessonDetailClient';
import {
  buildMetadata,
  breadcrumbSchema,
  articleSchema,
  learningResourceSchema,
  SITE_URL,
} from '@/lib/seo';

interface Props {
  params: Promise<{ categoryId: string; courseSlug: string; lessonId: string }>;
}

async function getLesson(lessonId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lms/lessons/${lessonId}/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getCourse(categoryId: string, courseSlug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lms/courses/?category=${categoryId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const courses = Array.isArray(data) ? data : (data?.results ?? []);
    return courses.find((c: any) => c.slug === courseSlug) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryId, courseSlug, lessonId } = await params;
  const lesson = await getLesson(lessonId);

  if (!lesson) return { title: 'Cashar lama helin — Garaad' };

  const lessonPath = `/courses/${categoryId}/${courseSlug}/lessons/${lessonId}`;
  const title = `${lesson.title} — Baro Af-Soomaali | Garaad`;
  const description =
    lesson.description?.trim() ||
    `Baro ${lesson.title} oo ku hadla Af-Soomaali hufan. Cashar waxbarasho oo Garaad ka mid ah.`;

  return buildMetadata({
    title,
    description,
    path: lessonPath,
    ogType: 'article',
    keywords: [
      lesson.title,
      `baro ${lesson.title} Soomaali`,
      `${lesson.title} Af-Soomaali`,
      'Garaad cashar',
      'online lesson Somali',
      courseSlug,
    ],
  });
}

export default async function Page({ params }: Props) {
  const { categoryId, courseSlug, lessonId } = await params;
  const [lesson, course] = await Promise.all([
    getLesson(lessonId),
    getCourse(categoryId, courseSlug),
  ]);

  const lessonUrl = `${SITE_URL}/courses/${categoryId}/${courseSlug}/lessons/${lessonId}`;
  const courseUrl = `${SITE_URL}/courses/${categoryId}/${courseSlug}`;
  const lessonTitle = lesson?.title ?? 'Cashar';
  const lessonDesc =
    lesson?.description?.trim() || `Baro ${lessonTitle} oo Af-Soomaali ah.`;

  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: 'Garaad', item: SITE_URL },
    { name: 'Korsooyinka', item: `${SITE_URL}/courses` },
    ...(course ? [{ name: course.title, item: courseUrl }] : []),
    { name: lessonTitle, item: lessonUrl },
  ]);

  const jsonLdArticle = articleSchema({
    headline: lessonTitle,
    description: lessonDesc,
    url: lessonUrl,
    ...(lesson?.thumbnail && { image: lesson.thumbnail }),
    ...(lesson?.created_at && { datePublished: lesson.created_at }),
    ...(lesson?.updated_at && { dateModified: lesson.updated_at }),
  });

  const jsonLdLearning = learningResourceSchema({
    name: lessonTitle,
    description: lessonDesc,
    url: lessonUrl,
    courseUrl,
    courseName: course?.title,
    lessonOrder: lesson?.order,
    isFree: lesson?.is_free ?? false,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLearning) }}
      />
      <LessonDetailClient initialLesson={lesson} />
    </>
  );
}
