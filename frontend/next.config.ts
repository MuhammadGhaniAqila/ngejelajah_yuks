import type { NextConfig } from "next";

const adminDestination =
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "/admin")
    : "http://127.0.0.1:8000/admin");

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: adminDestination,
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: `${adminDestination}/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
