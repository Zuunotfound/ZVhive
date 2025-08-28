/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    turbo: {
      resolveAlias: {
        '@': './src'
      }
    }
  }
};

export default nextConfig;