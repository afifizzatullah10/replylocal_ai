import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Hide the floating dev indicator (route / bundler context) during `next dev`. */
  devIndicators: false,
};

export default nextConfig;
