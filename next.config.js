/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ye experimental mein dalo
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'nodemailer', 'bcryptjs'],
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: false,
  },

  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, net: false, tls: false, dns: false, child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;