const fs = require('fs')

const http = require('http'),
	https = require('https')

const next = require('next')
const log = require('./utils/logging')

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
	httpsVerification()
} else {
	server.get('*', (req, res) => {
		return handle(req, res)
	})
}

if (ssl == 'true') {
	log.info('SERVER', 'Starting HTTPS')
	serverHttps = https.createServer(httpsOptions, server)

	serverHttps.listen(port, (err) => {
		if (err) throw err
	})

	log.info('SERVER', 'Starting HTTP')
	serverHttp = http.createServer(server)
	serverHttp.listen(80, (err) => {
		if (err) throw err
		log.info('SERVER', `Ready on port 80`)
	})
} else {
	log.info('SERVER', 'Starting HTTP')
	serverHttp = http.createServer(server)
	serverHttp.listen(port, (err) => {
		if (err) throw err
		log.info('SERVER', `Ready on port ${port}`)
	})
}

function httpsVerification(redirect) {
	server.get('*', (req, res) => {
		const httpsUrl = `https://${req.headers['host']}${req.url}`
		if (req.protocol == 'http') {
			log.debug('SERVER', `Redirecting to ${httpsUrl}`)
			res.redirect(httpsUrl)
		} else {
			return handle(req, res)
		}
	})
}
