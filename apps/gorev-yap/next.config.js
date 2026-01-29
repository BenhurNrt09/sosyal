/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui", "@repo/lib"],
    images: {
        domains: ['images.unsplash.com'], // For random placeholder images
    },
};

module.exports = nextConfig;
