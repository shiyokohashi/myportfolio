import type { NextConfig } from "next";

/** Branding work that used to live under /projects (Webdev & Apps). */
const MOVED_TO_BRANDING = ["triton-trading-group", "brisbane-2032", "scot-scoop-news-logo", "aeon"];

const nextConfig: NextConfig = {
  async redirects() {
    return MOVED_TO_BRANDING.map((slug) => ({
      source: `/projects/${slug}`,
      destination: `/graphic-design/${slug}`,
      permanent: true,
    }));
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [384, 640, 750, 828, 1080, 1200],
    imageSizes: [256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.shiyoohashi.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "i-p.rmcdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
