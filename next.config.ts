import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [384, 640, 750, 828, 1080, 1200],
    imageSizes: [256, 384],
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
