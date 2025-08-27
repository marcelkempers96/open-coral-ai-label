/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const config = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  webpack: (cfg) => {
    cfg.resolve = cfg.resolve || {}
    cfg.resolve.alias = {
      ...(cfg.resolve.alias || {}),
      canvas: false,
    }
    cfg.resolve.fallback = {
      ...(cfg.resolve.fallback || {}),
      canvas: false,
      fs: false,
      path: false,
    }
    return cfg
  },
  ...(isStaticExport
    ? {
        output: 'export',
        images: { unoptimized: true },
        basePath,
        assetPrefix: basePath,
      }
    : {}),
}

export default config

