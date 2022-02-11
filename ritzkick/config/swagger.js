module.exports = {
	info: {
		version: '1.0.0',
		title: 'Cryptool',
		description: 'Cryptool API',
		license: {
			name: 'MIT'
		}
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
	swaggerUIPath: '/api-docs'
};

// https://brikev.github.io/express-jsdoc-swagger-docs/#/
