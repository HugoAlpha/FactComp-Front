/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    //domains: ["190.181.63.219"],
    domains: ["10.1.5.193"],
  },
};

export default nextConfig;