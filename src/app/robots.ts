import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/private/", "/admin/"],
    },
    sitemap: "https://garaad.so/sitemap.xml",
  };
}
