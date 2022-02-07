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

if (ssl == 'true') {
	protocolVerification()
} else {
	server.get('*', (req, res) => {
		return handle(req, res)
	})
}

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
		const httpsUrl = `https://cryptool.atgrosdino.ca${req.url}`
		const httpUrl = `http://test.cryptool.atgrosdino.ca${req.url}:3000`
		if (req.protocol == 'http') {
			log.debug('SERVER', `Redirecting to ${httpUrl}`)
			res.redirect(httpUrl)
		} else if (req.protocol == 'https') {
			log.debug('SERVER', `Redirecting to ${httpsUrl}`)
			res.redirect(httpsUrl)
		} else {
			return handle(req, res)
		}
	})
}
