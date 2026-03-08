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

const OG_FALLBACK = "https://garaad.org/images/og-main.jpg";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { categoryId, courseSlug } = await params;
    const course = await getCourse(categoryId, courseSlug);

    if (!course) return { title: 'Koorso lama helin - Garaad' };

    const title = `${course.title} | Garaad`;
    const canonicalUrl = `https://garaad.org/courses/${categoryId}/${courseSlug}`;
    const rawDesc = typeof course.description === "string" ? course.description : "";
    const description = rawDesc.length > 155 ? rawDesc.slice(0, 155).trim() + "…" : rawDesc.trim() || `Baro ${course.title} oo Af-Soomaali ah. Garaad.`;
    const ogImage = course.thumbnail && (course.thumbnail.startsWith("http") ? course.thumbnail : `https://garaad.org${course.thumbnail.startsWith("/") ? "" : "/"}${course.thumbnail}`) || OG_FALLBACK;

    return {
        title,
        description,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            type: "website",
            url: canonicalUrl,
            title,
            description,
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            site: "@garaadorg",
            title,
            description,
            images: [ogImage],
        },
        robots: { index: true, follow: true },
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
            "sameAs": "https://garaad.org"
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