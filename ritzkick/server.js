const fs = require('fs')

const http = require('http'),
	https = require('https')

const next = require('next')
const log = require('./utils/logging')
const expressJSDocSwagger = require('express-jsdoc-swagger')
const swaggerOptions = require('./config/swagger')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
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
if (local == 'false') protocolVerification()
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

function protocolVerification() {
	server.get('*', (req, res) => {
		const data = {
			protocol: req.protocol,
			host: req.headers['host'],
			url: req.url,
			http: httpUrl,
			https: httpsUrl,
		}
		log.debug('SERVER', `${JSON.stringify(data)}`)

		if (req.protocol == 'http' && req.headers['host'] != `${httpUrl}`) {
			log.debug('SERVER', `Redirecting to http://${httpUrl}${req.url}`)
			res.redirect(`http://${httpUrl}${req.url}`)
		} else if (req.protocol == 'https' && req.headers['host'] != httpsUrl) {
			log.debug('SERVER', `Redirecting to https://${httpsUrl}${req.url}`)
			res.redirect(`https://${httpsUrl}${req.url}`)
		} else return handle(req, res)
	})
}
