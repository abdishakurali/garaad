import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the full authenticated backend media URL for a given file and type
 * @param filename - The file name, path, or full URL
 * @param type - The type of media (profile_pics, community_posts, courses, or generic)
 */
export function getMediaUrl(
  filename?: string,
  type: "profile_pics" | "community_posts" | "courses" | "community_attachments" | "generic" = "generic"
): string | undefined {
  if (!filename) return undefined;

  // If it's already a full URL, return as is
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }

  const baseUrl = "https://api.garaad.org/media";

  // Extract filename from path if it starts with /media/
  let cleanFilename = filename;
  if (filename.startsWith("/media/")) {
    // Remove /media/ prefix and get the rest
    cleanFilename = filename.replace("/media/", "");
  }

  // If the clean filename already contains the media type directory, use it as is
  if (cleanFilename.startsWith(`${type}/`)) {
    return `${baseUrl}/${cleanFilename}`;
  }

  // Otherwise, add the media type directory
  let finalUrl: string;
  switch (type) {
    case "profile_pics":
      finalUrl = `${baseUrl}/profile_pics/${cleanFilename}`;
      break;
    case "community_posts":
      finalUrl = `${baseUrl}/community/posts/${cleanFilename}`;
      break;
    case "courses":
      finalUrl = `${baseUrl}/courses/${cleanFilename}`;
      break;
    case "community_attachments":
      finalUrl = `${baseUrl}/community/attachments/${cleanFilename}`;
      break;
    default:
      finalUrl = `${baseUrl}/${cleanFilename}`;
  }

  // Add cache-busting parameter for profile pictures to ensure fresh images
  if (type === "profile_pics") {
    const timestamp = Date.now();
    finalUrl += `?t=${timestamp}`;
  }

  return finalUrl;
}

/**
 * Formats a date string into a relative Somali time string in uppercase
 * e.g., "20 SAAC KA HOR", "HADDA"
 */
export function formatSomaliRelativeTime(dateString?: string): string {
  if (!dateString) return "HADDA";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "HADDA";

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} DAQIIQO KA HOR`;
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} SAAC KA HOR`;
  }

  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} MAALIN KA HOR`;
  }

  if (diffInSeconds < 2419200) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ASBUUC KA HOR`;
  }

  return date.toLocaleDateString("so-SO").toUpperCase();
}
