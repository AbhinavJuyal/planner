/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/app/my-tasks",
        permanent: true,
      },
      {
        source: "/app",
        destination: "/app/my-tasks",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
