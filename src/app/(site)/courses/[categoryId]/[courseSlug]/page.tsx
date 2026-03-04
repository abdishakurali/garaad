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

        const response = await res.json();

        // Normalize response: output might be an array or a paginated object with .results
        let courses: any[] = [];
        if (Array.isArray(response)) {
            courses = response;
        } else if (response && typeof response === 'object' && 'results' in response && Array.isArray((response as any).results)) {
            courses = (response as any).results;
        }

        return courses.find((c: any) => c.slug === courseSlug) || null;
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { categoryId, courseSlug } = await params;
    const course = await getCourse(categoryId, courseSlug);

    if (!course) return { title: 'Koorso lama helin - Garaad' };

    const title = `${course.title} | Baro Full-Stack Development | Garaad`;

    return {
        title,
        description: `Baro ${course.title} oo Af-Soomaali ah. Skill-kaaga ${course.category || 'Tech'} ku dhis Garaad—macalin la'aan.`,
        openGraph: {
            title,
            description: `Baro ${course.title} oo Af-Soomaali ah. Ku biir kumanaan dhalinyaro ah oo baranaya ${course.title}.`,
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
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "courseWorkload": "PT10H"
        },
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