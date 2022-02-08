module.exports = {
	siteUrl: 'https://cryptool.atgrosdino.ca',
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
