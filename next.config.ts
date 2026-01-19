import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://192.168.1.83:8000/api/v1/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://192.168.1.83:8000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
