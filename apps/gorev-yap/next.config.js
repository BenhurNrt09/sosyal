/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
    images: {
        domains: ['images.unsplash.com'], // For random placeholder images
    },
    async redirects() {
        return [
            {
                source: '/admin',
                destination: 'https://admin.webisse.tech', // Placeholder, update as needed
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig;
