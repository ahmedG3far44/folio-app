/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "www.its.ac.id",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "presento-app.s3.amazonaws.com",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
