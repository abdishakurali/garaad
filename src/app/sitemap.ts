import { MetadataRoute } from "next";
import { API_BASE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://garaad.so";
  const currentDate = new Date();

  // 1. Static Routes that actually exist in src/app
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: currentDate, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/courses`, lastModified: currentDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/community-preview`, lastModified: currentDate, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/welcome`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // 2. Dynamic Categories and Courses
    // Using a longer revalidate for sitemap
    const categoriesRes = await fetch(`${API_BASE_URL}/api/lms/categories/`, { next: { revalidate: 86400 } });
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];

    for (const cat of categories) {
      // Category Landing Page
      dynamicRoutes.push({
        url: `${baseUrl}/courses/${cat.id ?? cat.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      });

      // Courses for this category
      const coursesRes = await fetch(`${API_BASE_URL}/api/lms/courses/?category=${cat.id}`, { next: { revalidate: 86400 } });
      const courses = coursesRes.ok ? await coursesRes.json() : [];

      for (const course of courses) {
        const coursePath = `/courses/${cat.id}/${course.slug}`;
        dynamicRoutes.push({
          url: `${baseUrl}${coursePath}`,
          lastModified: new Date(course.updated_at || currentDate),
          changeFrequency: "weekly",
          priority: 0.8,
        });

        // 3. Dynamic Lessons for each course
        const lessonsRes = await fetch(`${API_BASE_URL}/api/lms/lessons/?course=${course.id}`, { next: { revalidate: 86400 } });
        const lessons = lessonsRes.ok ? await lessonsRes.json() : [];

        for (const lesson of lessons) {
          dynamicRoutes.push({
            url: `${baseUrl}${coursePath}/lessons/${lesson.id}`,
            lastModified: currentDate, // Could use lesson updated_at if available
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }

    // 4. Community Threads (Public)
    const postsRes = await fetch(`${API_BASE_URL}/api/community/posts/public/`, { next: { revalidate: 3600 } });
    const posts = postsRes.ok ? await postsRes.json() : { results: [] };

    (posts.results || []).forEach((post: any) => {
      dynamicRoutes.push({
        url: `${baseUrl}/community-preview?post=${post.id}`,
        lastModified: new Date(post.updated_at || currentDate),
        changeFrequency: "daily",
        priority: 0.6,
      });
    });

  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  // Deduplicate URLs in case of overlaps
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  const uniqueUrls = new Set();
  return allRoutes.filter(route => {
    if (uniqueUrls.has(route.url)) return false;
    uniqueUrls.add(route.url);
    return true;
  });
}
