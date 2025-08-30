import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle file paths with special characters and ignore favicon
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Add rule to ignore favicon.ico files completely
    config.module.rules.unshift({
      test: /favicon\.ico$/,
      loader: 'ignore-loader',
    });

    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Override metadata generation to avoid favicon issues
  generateBuildId: async () => {
    return 'productivity-hub-build';
  },
};

export default nextConfig;
