const path = require("path");

const repoRoot = path.resolve(__dirname);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Same absolute root for tracing + Turbopack (Next merges these; avoids wrong parent lockfile root).
  outputFileTracingRoot: repoRoot,

  // When a lockfile exists in a parent directory (e.g. ~/package-lock.json), Next can pick
  // the wrong Turbopack root and fail to resolve packages like `tailwindcss`.
  turbopack: {
    root: repoRoot,
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "api.garaad.org" },
      { protocol: "https", hostname: "www.garaad.org" },
      { protocol: "https", hostname: "garaad.org" },
      { protocol: "https", hostname: "ds055uzetaobb.cloudfront.net" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "localhost" },
      { protocol: "https", hostname: "127.0.0.1" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // Do not redirect www ↔ apex here. If Vercel/Cloudflare also redirects the other way, you get
  // ERR_TOO_MANY_REDIRECTS. Pick one place only: e.g. Vercel → Domains → set primary + “redirect to”.
  // Canonical URLs in metadata already use https://garaad.org.

  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://*.posthog.com *.vercel-scripts.com https://player.vimeo.com https://accounts.google.com;
      style-src 'self' 'unsafe-inline' fonts.googleapis.com https://accounts.google.com;
      img-src 'self' blob: data: https: res.cloudinary.com api.garaad.org localhost:8000 127.0.0.1:8000 images.ctfassets.net *.posthog.com https://*.stripe.com https://img.youtube.com https://www.transparenttextures.com;
      media-src 'self' blob: data: https://res.cloudinary.com https://api.garaad.org http://localhost:8000 http://127.0.0.1:8000;
      font-src 'self' fonts.gstatic.com data: https://r2cdn.perplexity.ai;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      frame-src https://js.stripe.com https://player.vimeo.com https://www.youtube.com https://accounts.google.com;
      connect-src 'self' https://api.garaad.org wss://api.garaad.org https://*.posthog.com https://api.stripe.com https://js.stripe.com https://www.transparenttextures.com http://localhost:8000 http://127.0.0.1:8000 https://accounts.google.com https://oauth2.googleapis.com;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
           { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(self)" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/version.txt",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      }
    ];
  },

  async redirects() {
    return [
      {
        source: "/challenge",
        destination: "/subscribe?plan=challenge",
        permanent: true,
      },
      {
        source: "/community-preview",
        destination: "/community",
        permanent: true,
      },
    ];
  },

  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  experimental: {
    // Requires `critters` and interacts with dev error pages; off avoids MODULE_NOT_FOUND when deps lag.
    optimizeCss: false,
    scrollRestoration: true,
    optimizePackageImports: [
      "lucide-react",
      "@rive-app/canvas",
      "@rive-app/react-canvas",
      "recharts",
      "date-fns",
      "framer-motion"
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  trailingSlash: false,
  generateBuildId: async () => {
    return "garaad-v1";
  },

  // Reduce full page reloads in dev when navigating between pages (memory pressure / buffer)
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 60s — keep pages in buffer longer
    pagesBufferLength: 8,      // keep more pages to avoid reload on back/forward
  },
};

module.exports = nextConfig;
