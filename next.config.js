/** @type {import('next').NextConfig} */
const nextConfig = {
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
