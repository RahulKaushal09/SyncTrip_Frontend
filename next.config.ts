import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  images: {
    // domains: ['synctrip.in'],
    // deviceSizes: [320, 420, 540, 768, 1024, 1200], // add 540 here
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 540], // optionally here too
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'synctrip.in',
        pathname: '/AllImages/**',
      },
      {
        protocol: 'https',
        hostname: 'wbksuxwcqnzuppviunfz.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'assets-in.bmscdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'muddietrails.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
