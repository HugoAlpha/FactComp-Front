/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      domains: ['10.1.5.193'],
    },
  };
  
  export default nextConfig;