module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost',
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				disallow: '/api/',
				disallow: '/api-docs',
			},
		],
	},
	exclude: ['/api/*', '/api-docs'],
}
