/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  env: {
    WEBSITE_NAME: process.env.WEBSITE_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    BASE_URL: process.env.BASE_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    CLOUD_UPDATE_PRESET: process.env.CLOUD_UPDATE_PRESET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API: process.env.CLOUD_API,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },
  images: {
    domains: ["res.cloudinary.com"],
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      require("./sitemap/generate-sitemap");
    }

    return config;
  },
  experimental: {
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: "/product",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/user",
        destination: "/users",
        permanent: true,
      },
      {
        source: "/order",
        destination: "/profile",
        permanent: true,
      },
    ];
  },
};
