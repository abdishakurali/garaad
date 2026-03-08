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
          "/community-preview",
          "/launchpad",
          "/blog",
          "/blog/*",
          "/login",
          "/welcome",
          "/about",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/profile",
          "/profile/",
          "/orders",
          "/orders/",
          "/referrals",
          "/referrals/",
          "/verify-email",
          "/verify-email/",
          "/subscribe",
          "/subscribe/",
          "/launchpad/submit",
          "/launchpad/submit/",
          "/launchpad/edit",
          "/launchpad/edit/",
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
