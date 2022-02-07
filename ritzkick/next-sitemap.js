const port = process.env.PORT || 3000
const url = process.env.SITE_URL || 'http://localhost'

module.exports = {
	siteUrl: `${url}:${port}`,
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
