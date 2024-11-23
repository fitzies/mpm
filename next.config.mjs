import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});


/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development"
  }
})

export default nextConfig;
