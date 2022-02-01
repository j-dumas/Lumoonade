const fs = require('fs')

const next = require('next')

const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('./config/swagger')

const log = require('./utils/logging')
const { createServer } = require('https')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const ssl = process.env.SSL || false

const httpsOptions = {}
if (ssl == 'true') {
	log.info('SERVER', 'Reading certificates')
	httpsOptions.key = fs.readFileSync('./certificates/name.key')
	httpsOptions.cert = fs.readFileSync('./certificates/name.crt')
}

const app = next({ dev })
const handle = app.getRequestHandler()
if (ssl == 'true')
	app.prepare().then(() => {
		log.info('SERVER', 'Starting in HTTPS')
		createServer(httpsOptions, (req, res) => {
			const parsedURL = parse(req.url, true)
			handle(req, res, parsedURL)
		})
	})
else
	app.prepare().catch((ex) => {
		log.error('SERVER', 'Launch error', ex.stack)
		process.exit(1)
	})

const server = require('./application/app')

expressJSDocSwagger(server)(swaggerOptions)

server.get('*', (req, res) => {
	return handle(req, res)
})

server.listen(port, (err) => {
	if (err) throw err
	log.info('SERVER', `Ready on port ${port}`)
})
