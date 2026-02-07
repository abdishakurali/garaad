import { Metadata } from 'next';
import { API_BASE_URL } from '@/lib/constants';
import { CourseDetailClient } from '@/components/learning/CourseDetailClient';

interface Props {
    params: Promise<{ categoryId: string; courseSlug: string }>;
}

async function getCourse(categoryId: string, courseSlug: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/lms/courses/?category=${categoryId}`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return null;

        const courses = await res.json();
        return courses.find((c: any) => c.slug === courseSlug) || null;
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { categoryId, courseSlug } = await params;
    const course = await getCourse(categoryId, courseSlug);

    if (!course) return { title: 'Koorso lama helin - Garaad' };

    const title = `Barashada ${course.title}: Sida loo dhiso App (Somali)`;

    return {
        title,
        description: course.description,
        openGraph: {
            title,
            description: course.description,
            images: course.thumbnail ? [{ url: course.thumbnail }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: course.description,
            images: course.thumbnail ? [course.thumbnail] : [],
        },
        alternates: {
            canonical: `https://garaad.so/courses/${categoryId}/${courseSlug}`,
        }
    };
}

export default async function Page({ params }: Props) {
    const { categoryId, courseSlug } = await params;
    const course = await getCourse(categoryId, courseSlug);

    const jsonLd = course ? {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "Garaad",
            "sameAs": "https://garaad.so"
        },
        "courseCode": course.slug,
        "educationalLevel": course.level,
        "inLanguage": "so",
        "offers": [{
            "@type": "Offer",
            "category": "Free",
            "price": "0",
            "priceCurrency": "USD"
        }]
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <CourseDetailClient />
        </>
    );
}