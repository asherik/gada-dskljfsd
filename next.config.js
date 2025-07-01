/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/gadalka-app',
  images: {
    formats: ['image/avif', 'image/webp'],
    quality: 70,
    unoptimized: false,
  },
};

export default nextConfig; 