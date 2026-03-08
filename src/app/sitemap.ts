import { MetadataRoute } from "next";
import { API_BASE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://garaad.org";
  const currentDate = new Date();

  // 1. Static routes — only URLs that return 200 with actual content (no redirects/404s)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: currentDate, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/courses`, lastModified: currentDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/community-preview`, lastModified: currentDate, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/launchpad`, lastModified: currentDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/welcome`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/login`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // 2. Dynamic Categories and Courses
    // Using a longer revalidate for sitemap
    const categoriesRes = await fetch(`${API_BASE_URL}/api/lms/categories/`, { next: { revalidate: 86400 } });
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];
    const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.results || []);

    for (const cat of categories) {
      if (!cat) continue;
      // Category Landing Page
      dynamicRoutes.push({
        url: `${baseUrl}/courses/${cat.id ?? cat.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      });

      // Courses for this category
      const coursesRes = await fetch(`${API_BASE_URL}/api/lms/courses/?category=${cat.id}`, { next: { revalidate: 86400 } });
      const coursesData = coursesRes.ok ? await coursesRes.json() : [];
      const courses = Array.isArray(coursesData) ? coursesData : (coursesData?.results || []);

      for (const course of courses) {
        if (!course) continue;
        const coursePath = `/courses/${cat.id}/${course.slug}`;
        dynamicRoutes.push({
          url: `${baseUrl}${coursePath}`,
          lastModified: new Date(course.updated_at || currentDate),
          changeFrequency: "weekly",
          priority: 0.8,
        });
        // Lessons (e.g. .../lessons/:id) require auth — not in sitemap so all URLs return 200
      }
    }

    // 4. Dynamic Launchpad Startups
    const startupsRes = await fetch(`${API_BASE_URL}/api/launchpad/startups/`, { next: { revalidate: 3600 } });
    const startupsResponse = startupsRes.ok ? await startupsRes.json() : [];

    // Handle both paginated and non-paginated responses
    const startups = Array.isArray(startupsResponse) ? startupsResponse : (startupsResponse?.results || []);

    startups.forEach((startup: any) => {
      if (!startup) return;
      dynamicRoutes.push({
        url: `${baseUrl}/launchpad/${startup.slug || startup.id}`,
        lastModified: new Date(startup.updated_at || currentDate),
        changeFrequency: "daily",
        priority: 0.8,
      });
    });

    // 5. Community: canonical is /community-preview only (no ?post= URLs to avoid duplicate content)

    // 6. Blog Posts
    const blogPostsRes = await fetch(`${API_BASE_URL}/api/blog/posts/`, { next: { revalidate: 3600 } });
    const blogPostsData = blogPostsRes.ok ? await blogPostsRes.json() : [];
    const blogPosts = Array.isArray(blogPostsData) ? blogPostsData : (blogPostsData?.results || []);

    blogPosts.forEach((post: any) => {
      if (!post) return;
      dynamicRoutes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at || currentDate),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    });

    // 7. Blog Tags
    const blogTagsRes = await fetch(`${API_BASE_URL}/api/blog/tags/`, { next: { revalidate: 3600 } });
    const blogTagsData = blogTagsRes.ok ? await blogTagsRes.json() : [];
    const blogTags = Array.isArray(blogTagsData) ? blogTagsData : (blogTagsData?.results || []);

    blogTags.forEach((tag: any) => {
      if (!tag) return;
      dynamicRoutes.push({
        url: `${baseUrl}/blog/tag/${tag.slug}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
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
