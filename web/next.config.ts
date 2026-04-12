import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://res.cloudinary.com/dz2jhmos1/image/upload/**",
      ),
    ],
  },
};

export default nextConfig;
