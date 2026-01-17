/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn2.penguin.com.au',
            },
            {
                protocol: 'https',
                hostname: 'www.booksfortopics.com',
            },
            {
                protocol: 'https',
                hostname: 'd28hgpri8am2if.cloudfront.net',
            },
            {
                protocol: 'https',
                hostname: 'simg.marwin.kz',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
};

export default nextConfig;
