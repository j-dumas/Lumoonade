module.exports = {
	info: {
		version: '1.0.0',
		title: 'Lumoonade',
		description: 'Lumoonade API'
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
	swaggerUIPath: '/api/docs',
	servers: [
		{
			url: 'https://localhost:3000',
			description: 'Dev server'
		},
		{
			url: 'https://lumoonade.com:4000',
			description: 'Test server'
		}
	]
}

// https://brikev.github.io/express-jsdoc-swagger-docs/#/
