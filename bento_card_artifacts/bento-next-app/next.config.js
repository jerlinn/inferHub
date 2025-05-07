/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 配置构建输出
  output: 'standalone',
  
  // 禁用静态优化，确保每次请求都重新渲染页面
  experimental: {
    // 禁止自动静态优化
    disableOptimizedLoading: true,
  },
  
  // 配置响应头，防止缓存
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
    ]
  },
  
  // 禁用webpack缓存
  webpack: (config, { dev, isServer }) => {
    // 在开发模式下禁用缓存
    if (dev) {
      config.cache = false;
    }
    return config;
  }
}

module.exports = nextConfig 