/** @type {import('next').NextConfig} */
const nextConfig = {
  // and the following to enable top-level await support for Webpack
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
