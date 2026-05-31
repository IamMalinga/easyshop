const nextConfig = {
  images: {                          // ← images key
    remotePatterns: [                // ← remotePatterns array
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
