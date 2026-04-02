// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vsszwqqelbyrnjwyspdo.supabase.co",
        pathname: "/storage/v1/object/public/**", // importante para liberar o bucket
      },
    ],
  },
};

export default nextConfig;