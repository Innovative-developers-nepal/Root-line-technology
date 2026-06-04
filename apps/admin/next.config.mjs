import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  basePath: "/admin",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  distDir: process.env.NEXT_DIST_DIR || ".next",
  staticPageGenerationTimeout: 300,
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
