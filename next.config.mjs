import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
            },
            {
                protocol: 'https',
                hostname: 'imagedelivery.net',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            '@react-native-async-storage/async-storage': path.resolve(
                process.cwd(),
                'src/lib/shims/asyncStorage.ts'
            ),
        };
        return config;
    },
};

export default nextConfig;
