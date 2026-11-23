import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return ["/admin/:path*", "/sign-in/:path*", "/api/:path*"].map(source => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
  async redirects() {
    return [{ source: "/faq", destination: "/#faq", permanent: true }];
  },
};

export default nextConfig;
