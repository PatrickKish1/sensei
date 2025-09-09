/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {},
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Node.js polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Web Worker: treat as module
    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      type: 'javascript/esm',
    });

    // Terser fix
    if (config.optimization && config.optimization.minimizer) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.exclude = /HeartbeatWorker/;
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            module: false,
            compress: {
              ...minimizer.options.terserOptions?.compress,
              module: false,
            },
            mangle: {
              ...minimizer.options.terserOptions?.mangle,
              module: false,
            },
          };
        }
      });
    }

    return config;
  },
};

module.exports = nextConfig;
