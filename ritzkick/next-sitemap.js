module.exports = {
	siteUrl: 'https://cryptool.atgrosdino.ca',
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				disallow: '/api/',
				disallow: '/api-docs',
				disallow: '/forgotPassword',
			},
		],
	},
	exclude: ['/api/*', '/api-docs'],
}
