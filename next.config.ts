/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/do3dahfvh/**",
      },
    ],
  },
};

module.exports = nextConfig;
