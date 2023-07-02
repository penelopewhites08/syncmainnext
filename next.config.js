/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback.fs = false;
        config.resolve.fallback.net = false;
        config.resolve.fallback.tls = false;
        config.resolve.fallback.lokijs = false;
        config.resolve.fallback.encoding = false;
        config.resolve.fallback["pino-pretty"] = false;
      }
      return config;
    },
  }

module.exports = nextConfig
