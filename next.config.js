/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
