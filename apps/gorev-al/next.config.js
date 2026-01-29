/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui", "@repo/lib"],
    images: {
        domains: ['images.unsplash.com'],
    },
    async redirects() {
        return [
            {
                source: '/admin',
                destination: process.env.NEXT_PUBLIC_ADMIN_PANEL_URL || 'https://admin.webisse.tech',
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig;
