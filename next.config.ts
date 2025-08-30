// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fuerza a Next a tomar ESTE proyecto como root
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
