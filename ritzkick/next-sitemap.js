module.exports = {
	siteUrl: 'https://lumoonade.com',
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				disallow: '/api/',
				disallow: '/api/docs',
				disallow: '/forgotPassword',
				disallow: '/email-confirmation',
				disallow: '/reset-password',
				disallow: '/404'
			}
		]
	},
	exclude: ['/api/*', '/api/docs']
}
