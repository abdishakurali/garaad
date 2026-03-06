import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/courses",
          "/courses/*",
          "/launchpad",
          "/launchpad/*",
          "/about",
          "/welcome",
          "/community-preview",
          "/blog",
          "/blog/*",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/dashboard/",
          "/profile/",
          "/verify-email/",
          "/test-*",
          "/payment*",
          "/stripe*",
        ],
      },
    ],
    sitemap: "https://garaad.org/sitemap.xml",
    host: "https://garaad.org",
  };
}
