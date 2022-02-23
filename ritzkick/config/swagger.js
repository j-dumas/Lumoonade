module.exports = {
	info: {
		version: '1.0.0',
		title: 'Cryptool',
		description: 'Cryptool API'
	},
	security: {
		BearerAuth: {
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT'
		}
	},
	baseDir: __dirname,
	filesPattern: '../api/**/*.js',
	swaggerUIPath: '/api-docs',
	servers: [
		{
			url: 'http://localhost',
			description: 'Dev server',
			variables: {
				port: {
					enum: ['3000'],
					default: '3000'
				}
			}
		},
		{
			url: 'https://test.cryptool.atgrosdino.ca',
			description: 'Test server'
		}
	]
}

// https://brikev.github.io/express-jsdoc-swagger-docs/#/
