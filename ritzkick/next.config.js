const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})

const { i18n } = require('./next-i18next.config')

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' https://apis.google.com/;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'self' https://accounts.google.com/;
`

const securityHeaders = [
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on'
	},
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload'
	},
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block'
	},
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN'
	},
	{
		key: 'X-Frame-Options',
		value: 'DENY'
	},
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff'
	},
	{
		key: 'Referrer-Policy',
		value: 'strict-origin'
	},
	{
		key: 'Content-Security-Policy',
		value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
	}
]

module.exports = withBundleAnalyzer({
	i18n,
	reactStrictMode: true,
	async headers() {
		return [
			{
				// Apply these headers to all routes in your application.
				source: '/:path*',
				headers: securityHeaders
			}
		]
	}
})
