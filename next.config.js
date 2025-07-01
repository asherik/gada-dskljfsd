/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  // basePath нужен только для GitHub Pages; в dev-режиме он мешает
  ...(isProd ? { basePath: '/gadalka-app' } : {}),
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
};

export default nextConfig; 