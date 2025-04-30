/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ds055uzetaobb.cloudfront.net",
      "res.cloudinary.com",
      "assets.grok.com",
    ],
  },

  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
};

module.exports = nextConfig;
