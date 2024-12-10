/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['190.181.63.219:5053/img'],
  },
};

export default nextConfig;