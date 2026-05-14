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
          "/blog",
          "/blog/*",
          "/about",
          "/about/*",
          "/privacy",
          "/terms",
          "/feedback",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/admin",
          "/admin/",
          "/community",
          "/community/",
          "/profile",
          "/profile/",
          "/login",
          "/login/",
          "/signup",
          "/signup/",
          "/welcome",
          "/welcome/",
          "/reset-password",
          "/reset-password/",
          "/verify-email",
          "/verify-email/",
          "/subscribe",
          "/subscribe/",
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
