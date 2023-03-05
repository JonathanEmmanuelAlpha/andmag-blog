/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "fr",
    localeDetection: false,
  },
  images: {
    domains: [
      "https://andmag-ground.vercel.app",
      "firebasestorage.googleapis.com",
    ],
  },
};

module.exports = nextConfig;
