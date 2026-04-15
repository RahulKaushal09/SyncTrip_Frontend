import type { NextConfig } from "next";
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // 🔥 THIS FIXES YOUR CPU PROBLEM (adds standalone output)
  // output: "standalone",

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },

  images: {
    unoptimized: true,   // disables Next.js image optimization completely
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "synctrip.in", pathname: "/AllImages/**" },
      { protocol: "https", hostname: "synctrip-image-storage.s3.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "synctrip.in", pathname: "/**" },
      { protocol: "https", hostname: "static.vecteezy.com", pathname: "/**" },
      { protocol: "https", hostname: "assets-in.bmscdn.com", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
      { protocol: "https", hostname: "muddietrails.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "wbksuxwcqnzuppviunfz.supabase.co", pathname: "/**" },
      { protocol: "https", hostname: "synctrip-backend.vercel.app", pathname: "/**" },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.synctrip.in', pathname: '/**' },
      { protocol: 'https', hostname: 'synctrip.gumlet.io', pathname: '/**' },
    ],
  },

  async redirects() {
    return [
      {
        source: "/(chats|user|create|userTrip|userTrips|trips|notifications|how-it-works)/:path*",
        destination: '/',
        permanent: false,
      },
    ]
  }
};

module.exports = withBundleAnalyzer(nextConfig);
