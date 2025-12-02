import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async redirects() {
    return [
      {
        source: "/pathways",
        destination: "https://pathways.freedomwc.org",
        permanent: true,
      },
      {
        source: "/pathways/:slug*",
        destination: "https://pathways.freedomwc.org/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
