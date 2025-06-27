/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for Puppeteer and related dependencies
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('puppeteer')
      config.externals.push('puppeteer-extra')
      config.externals.push('puppeteer-extra-plugin-stealth')
    }

    // Handle dynamic requires
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }

    // Ignore specific problematic modules
    config.module.rules.push({
      test: /node_modules\/clone-deep\/utils\.js$/,
      use: 'null-loader',
    })

    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'puppeteer-extra', 'puppeteer-extra-plugin-stealth'],
  },
}

export default nextConfig;
