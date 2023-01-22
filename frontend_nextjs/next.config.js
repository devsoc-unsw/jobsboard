/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  output: 'standalone',
  reactStrictMode: true
};

module.exports = nextConfig;
