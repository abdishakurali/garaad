/**
 * Optimizes Cloudinary URLs by injecting auto-format and auto-quality transformations.
 * Also handles fallback for non-Cloudinary URLs.
 */
export const optimizeCloudinaryUrl = (url: string | undefined): string => {
    if (!url) return "";

    // Only process res.cloudinary.com URLs
    if (url.includes("res.cloudinary.com")) {
        // Check for standard upload path
        if (url.includes("/upload/")) {
            // Don't double-inject if already present
            if (!url.includes("q_auto") && !url.includes("f_auto")) {
                return url.replace("/upload/", "/upload/f_auto,q_30/");
            }
        }
    }

    return url;
};

/**
 * Generates a poster image URL for a Cloudinary video.
 */
const getCloudinaryVideoPoster = (url: string | undefined): string | undefined => {
    if (!url || !url.includes("res.cloudinary.com")) return undefined;
    return url
        .replace("/video/upload/", "/video/upload/f_auto,q_30,so_0/")
        .replace(/\.[^/.]+$/, ".jpg");
};
