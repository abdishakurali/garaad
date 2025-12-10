import { createClient, type Entry, type Asset } from "contentful";

// Lazy-loaded Contentful client to prevent initialization errors at build time
let _client: ReturnType<typeof createClient> | null = null;

function getClient(): ReturnType<typeof createClient> {
  if (!_client) {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

    if (!spaceId || !accessToken) {
      throw new Error(
        "Contentful credentials not configured. Please set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN environment variables."
      );
    }

    _client = createClient({
      space: spaceId,
      accessToken: accessToken,
    });
  }

  return _client;
}

// Type definitions for Contentful entries
export type ContentfulImage = Asset;

export interface BlogPageFields {
  title?: string;
  body?: any; // RichText content
  image?: ContentfulImage;
  recommendedPosts?: Entry<any>[]; // Linked entries
  slug?: string;
}

export type BlogPageSkeleton = {
  contentTypeId: "blogPage";
  fields: BlogPageFields;
};

export type BlogPage = Entry<BlogPageSkeleton>;

/**
 * Fetches all BlogPage entries from Contentful.
 */
export async function getBlogPages(): Promise<BlogPage[]> {
  try {
    const response = await getClient().getEntries<BlogPageSkeleton>({
      content_type: "blogPage",
      order: ["sys.createdAt", "sys.updatedAt"],
      include: 2, // Include linked assets and entries
    });

    return response.items as BlogPage[];
  } catch (error) {
    console.error("Error fetching blog pages:", error);
    return [];
  }
}

/**
 * Fetches a single BlogPage entry by its entry ID.
 * @param id The sys.id of the BlogPage entry.
 */
export async function getBlogPageById(id: string): Promise<BlogPage | null> {
  try {
    const entry = await getClient().getEntry<BlogPageSkeleton>(id, {
      include: 2,
    });
    return entry as BlogPage;
  } catch (error) {
    console.error(`Error fetching blog page with ID "${id}":`, error);
    return null;
  }
}

/**
 * Converts a string to a URL-friendly slug
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
}

/**
 * Fetches a single BlogPage entry by its slug.
 * @param slug The slug of the BlogPage entry.
 */
export async function getBlogPageBySlug(
  slug: string
): Promise<BlogPage | null> {
  try {
    const response = await getClient().getEntries<BlogPageSkeleton>({
      content_type: "blogPage",
      include: 2,
      ...({ ["fields.slug"]: slug } as any),
    } as any);

    return (response.items[0] as BlogPage) || null;
  } catch (error) {
    console.error(`Error fetching blog page with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetches a single BlogPage entry by its title.
 * @param title The title of the BlogPage entry.
 */
export async function getBlogPageByTitle(
  title: string
): Promise<BlogPage | null> {
  try {
    const slug = createSlug(title);
    return await getBlogPageBySlug(slug);
  } catch (error) {
    console.error(`Error fetching blog page with title "${title}":`, error);
    return null;
  }
}

/**
 * Helper to estimate reading time for 'body' rich text content.
 */
export function estimateReadingTime(content: any): number {
  if (!content) return 1;
  const text = JSON.stringify(content);
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
