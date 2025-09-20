import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
  },
  webpack: (config, { isServer }) => {
    // Handle AMD modules like docusign-esign
    config.module.rules.push({
      test: /node_modules\/docusign-esign\/.*\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { modules: 'commonjs' }]],
          plugins: ['@babel/plugin-transform-modules-commonjs']
        }
      }
    });

    // Fallback for Node.js modules in client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
