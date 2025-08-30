import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle file paths with special characters
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },
  // Disable static optimization for metadata files to avoid path issues
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
