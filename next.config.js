/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['lucide-react'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'pooumjecbqvuxlccnqev.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'loremflickr.com',
            },
        ],
    },
};

module.exports = nextConfig;
