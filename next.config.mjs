/** @type {import('next').NextConfig} */

// Backend API URL for flipbook images
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const FLIPBOOK_ID = '2025-26-Fall-Winter-Catalogue';

// Generate Link headers for HTTP/2 Server Push (first 5 pages)
const generatePushHeaders = () => {
  const headers = [];
  // First page: preload (used immediately)
  headers.push(
    `<${API_URL}/uploads/flipbooks/${FLIPBOOK_ID}/page-0.webp>; rel=preload; as=image; type=image/webp`
  );
  // Remaining pages: prefetch (used soon, but not immediately)
  for (let i = 1; i < 5; i++) {
    headers.push(
      `<${API_URL}/uploads/flipbooks/${FLIPBOOK_ID}/page-${i}.webp>; rel=prefetch; as=image; type=image/webp`
    );
  }
  return headers.join(', ');
};

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next Image Optimization in production
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.orgill.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'rrgeneralsupply.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.rrgeneralsupply.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/uploads/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 256, 384],
  },
  
  // HTTP/2 Server Push headers for flipbook pages
  async headers() {
    return [
      {
        // Apply to homepage and flipbook routes
        source: '/',
        headers: [
          {
            key: 'Link',
            value: generatePushHeaders(),
          },
          // Service Worker hints
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/flipbook/:path*',
        headers: [
          {
            key: 'Link',
            value: generatePushHeaders(),
          },
        ],
      },
      // Cache headers for static assets
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
}

export default nextConfig
