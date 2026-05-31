/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' }
];

const apiNoStoreHeaders = [
  ...securityHeaders,
  { key: 'Cache-Control', value: 'no-store' }
];

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      },
      {
        source: '/api/:path*',
        headers: apiNoStoreHeaders
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/planets',
        destination: '/galaxy/planets',
        permanent: true
      },
      {
        source: '/moons-systems',
        destination: '/galaxy/moons-systems',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
