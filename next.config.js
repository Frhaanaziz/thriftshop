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
        ],
    },
};

module.exports = nextConfig;
