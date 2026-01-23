/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
    images: {
        domains: ['images.unsplash.com'],
    },
};

module.exports = nextConfig;
