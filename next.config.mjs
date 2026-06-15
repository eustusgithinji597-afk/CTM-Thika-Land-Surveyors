/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nkkcyduvuasiyqcznbhb.supabase.co', // Your exact Supabase project reference id domain
        port: '',
        pathname: '/storage/v1/object/public/**', // Allows access to all your public storage buckets
      },
    ],
  },
};

export default nextConfig;
