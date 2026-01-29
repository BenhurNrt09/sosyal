/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui", "@repo/lib"],
    images: {
        domains: ['images.unsplash.com'],
    },
};

module.exports = nextConfig;
