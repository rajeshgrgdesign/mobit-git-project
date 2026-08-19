import type { NextConfig } from "next";

// Derive the WordPress media hostname from WORDPRESS_API_URL so
// next/image is allowed to optimize images served straight from the CMS,
// without hardcoding a domain.
const wpHostname = process.env.WORDPRESS_API_URL
  ? new URL(process.env.WORDPRESS_API_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...(wpHostname
        ? ([
            { protocol: "https" as const, hostname: wpHostname },
            // WP media is commonly served from a separate uploads/CDN subdomain.
            { protocol: "https" as const, hostname: `*.${wpHostname}` },
          ])
        : []),
    ],
  },

  async headers() {
    return [
      {
        // Long-lived, immutable caching for Next's fingerprinted build assets.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
