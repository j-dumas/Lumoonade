module.exports = {
	siteUrl: 'https://lumoonade.com',
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				disallow: '/api/',
				disallow: '/api-docs',
				disallow: '/forgotPassword'
			}
		]
	},
	exclude: ['/api/*', '/api-docs']
}
