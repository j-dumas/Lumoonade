const fs = require('fs')

const http = require('http'),
	https = require('https')

const next = require('next')
const log = require('./utils/logging')
const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('./config/swagger')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const testPort = process.env.TEST_PORT || 3000
const local = process.env.LOCAL || false
const ssl = process.env.SSL || false
const httpsUrl = process.env.HTTPS || 'localhost'
const httpUrl = process.env.HTTP || 'localhost'

const httpsOptions = {}
if (ssl == 'true') {
	log.info('SERVER', 'Reading certificates')
	httpsOptions.key = fs.readFileSync(`${__dirname}/certificates/privkey.pem`)
	httpsOptions.cert = fs.readFileSync(`${__dirname}/certificates/fullchain.pem`)
}

const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare().catch((ex) => {
	log.error('SERVER', 'Launch error', ex.stack)
	process.exit(1)
})

let server = require('./application/app')
if (local != 'false') protocolVerification()
expressJSDocSwagger(server)(swaggerOptions)

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

function protocolVerification() {
	server.get('*', (req, res) => {
		if (req.protocol == 'http' && req.headers['host'] != `${httpUrl}:${testPort}`) {
			log.debug('SERVER', `Redirecting to http://${httpUrl}:${testPort}${req.url}`)
			res.redirect(`http://${httpUrl}:${testPort}${req.url}`)
		} else if (req.protocol == 'https' && req.headers['host'] != httpsUrl) {
			log.debug('SERVER', `Redirecting to https://${httpsUrl}${req.url}`)
			res.redirect(httpsUrl)
		} else {
			return handle(req, res)
		}
	})
}
