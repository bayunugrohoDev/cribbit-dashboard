import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**", // Mengizinkan semua path di bawah domain ini
      },
    ],
  },
};

export default nextConfig;
