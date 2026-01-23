/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
    images: {
        domains: ['images.unsplash.com'], // For random placeholder images
    },
};

module.exports = nextConfig;
