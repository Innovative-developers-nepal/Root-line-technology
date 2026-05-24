/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  transpilePackages: [
    "@rootline/ui",
    "@rootline/config-tailwind",
    "@rootline/utils",
    "@rootline/hooks",
    "@rootline/validators",
    "@rootline/api-client",
    "@rootline/auth-client",
    "@rootline/storage",
    "@rootline/seo",
    "@rootline/analytics",
  ],
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**.rootline.tech" },
    ],
  },
};

export default nextConfig;
