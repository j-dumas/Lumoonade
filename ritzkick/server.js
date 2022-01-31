require('dotenv').config()

const express = require('express'),
	next = require('next')

const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('./config/swagger')

const hello = require('./api/hello')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
	.then(() => {
		const server = express()
		expressJSDocSwagger(server)(swaggerOptions)

		server.use(hello)

		server.get('*', (req, res) => {
			return handle(req, res)
		})

		server.listen(port, (err) => {
			if (err) throw err
			console.log(`Ready on port ${port}`)
		})
	})
	.catch((ex) => {
		console.error(ex.stack)
		process.exit(1)
	})
