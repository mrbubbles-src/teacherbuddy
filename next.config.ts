import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: process.env.NEXT_DISABLE_REACT_COMPILER !== "1",
};

export default nextConfig;
