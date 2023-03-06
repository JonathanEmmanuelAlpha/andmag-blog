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

const withPWA = require("next-pwa");
const pwaConfig = withPWA({
  pwa: {
    dest: "public",
    register: true,
    disable: process.env.NODE_ENV === "development",
    skipWaiting: true,
  },
});

module.exports = { nextConfig, pwaConfig };
