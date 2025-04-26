/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ds055uzetaobb.cloudfront.net"],
  },
  experimental: {
    forceSwcTransforms: true, // Force SWC transforms
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
};

module.exports = nextConfig;
