/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    apiKey: "AIzaSyDb0BzBiyDn1Gt2hU20cf3DvzUd2zRF41E",
    authDomain: "andmag-ground.firebaseapp.com",
    projectId: "andmag-ground",
    storageBucket: "andmag-ground.appspot.com",
    messagingSenderId: "84683327065",
    appId: "1:84683327065:web:d276ae96bedb6d664b1348",
    measurementId: "G-G4ZD13BLL6",
    reCaptchatSiteKey: "6LcbbQIjAAAAACfc-yfMIQYg7TzpjLmg4PqM_ySx",
  },
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    domains: ["localhost", "firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;
