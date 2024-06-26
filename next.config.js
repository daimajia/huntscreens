/** @type {import('next').NextConfig} */
const nextConfig = {
  // and the following to enable top-level await support for Webpack
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
