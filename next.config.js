/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/gadalka-app',
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: false,
  },
};

export default nextConfig; 