/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'https://refer.pratheek.shop/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
