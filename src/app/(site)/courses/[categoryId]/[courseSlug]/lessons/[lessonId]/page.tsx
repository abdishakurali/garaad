import { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/constants';
import { LessonDetailClient } from '@/components/learning/LessonDetailClient';

interface Props {
    params: Promise<{ categoryId: string; courseSlug: string; lessonId: string }>;
}

async function getLesson(lessonId: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/lms/lessons/${lessonId}/`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { categoryId, courseSlug, lessonId } = await params;
    const lesson = await getLesson(lessonId);

    if (!lesson) return { title: 'Cashar lama helin - Garaad' };

    // Targeted Search Intent Title
    const title = `Barashada ${lesson.title}: Sida loo dhiso App (Somali)`;

    return {
        title,
        description: lesson.description || `Barashada ${lesson.title} oo ku hadla Af-Soomaali hufan.`,
        openGraph: {
            title,
            description: lesson.description || `Baro ${lesson.title} oo ku hadla Af-Soomaali hufan.`,
            type: 'article',
            url: `https://garaad.so/courses/${categoryId}/${courseSlug}/lessons/${lessonId}`,
        },
        alternates: {
            canonical: `https://garaad.so/courses/${categoryId}/${courseSlug}/lessons/${lessonId}`,
        }
    };
}

export default async function Page() {
    return <LessonDetailClient />;
}
