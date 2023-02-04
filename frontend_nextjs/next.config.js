const withTwin = require('./withTwin.ts');

/** @type {import('next').NextConfig} */
const nextConfig = withTwin({
  experimental: {
    appDir: true
  },
  output: 'standalone',
  reactStrictMode: true
});

module.exports = nextConfig;
