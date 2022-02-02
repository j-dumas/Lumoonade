const fs = require('fs')

const http = require('http'),
	https = require('https')

const next = require('next')
const log = require('./utils/logging')
const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('./config/swagger')

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
app.prepare().catch((ex) => {
	log.error('SERVER', 'Launch error', ex.stack)
	process.exit(1)
})

let server = require('./application/app')

expressJSDocSwagger(server)(swaggerOptions)

server.get('*', (req, res) => {
	return handle(req, res)
})

if (ssl == 'true') {
	log.info('SERVER', 'Starting in HTTPS')
	server = https.createServer(httpsOptions, server)
} else {
	log.info('SERVER', 'Starting in HTTP')
	server = http.createServer(server)
}

server.listen(port, (err) => {
	if (err) throw err
	log.info('SERVER', `Ready on port ${port}`)
})
