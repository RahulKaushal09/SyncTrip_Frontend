import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    ],
  },
};

export default nextConfig;
