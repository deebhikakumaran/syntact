import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      remotePatterns: [
          { protocol: "https", hostname: "avatars.githubusercontent.com" },
      ],
  },
  allowedDevOrigins: ['codefox-a7ft.vercel.app'],
};

export default nextConfig;
