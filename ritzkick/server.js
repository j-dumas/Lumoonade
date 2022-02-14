const fs = require('fs')

const http = require('http'),
	https = require('https')

const next = require('next')
const log = require('./utils/logging')

/*******************************
 * Reading Environment Variables
 ******************************/
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const ssl = process.env.SSL || false
const httpsUrl = process.env.HTTPS || 'localhost'
const httpUrl = process.env.HTTP || 'localhost'

// SOCKET
const sm = require('./application/socket/socket-manager')

/*****************************
 * Prepare Frontend NextJS App
 ****************************/
const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare().catch((ex) => {
	log.error('SERVER', 'Launch error', ex.stack)
	process.exit(1)
})

/**********************************
 * Prepare Backend ExpressJS Server
 *********************************/
let server = require('./application/app')
if (!dev) protocolVerification()

server.get('*', (req, res) => {
	return handle(req, res)
})

if (ssl == 'true') {
	const httpsOptions = readCertificates()
	server = https.createServer(httpsOptions, server)
	log.info('SERVER', 'Starting in HTTPS')
} else {
	server = http.createServer(server)
	log.info('SERVER', 'Starting in HTTP')
}
sm.initialize(server)

/**************
 * Start Server
 *************/
server.listen(port, (err) => {
	if (err) throw err
	log.info('SERVER', `Ready on port ${port}`)
})

/**
 * Verifies the protocol and redirects to correct URL
 * Example: HTTP to test.cryptool.atgrosdino.ca
 * 			HTTPS to cryptool.atgrosdino.ca
 */
function protocolVerification() {
	server.get('*', (req, res) => {
		if (req.protocol == 'http' && req.headers['host'] != `${httpUrl}`) {
			log.debug('SERVER', `Redirecting to http://${httpUrl}${req.url}`)
			res.redirect(`http://${httpUrl}${req.url}`)
		} else if (req.protocol == 'https' && req.headers['host'] != httpsUrl) {
			log.debug('SERVER', `Redirecting to https://${httpsUrl}${req.url}`)
			res.redirect(`https://${httpsUrl}${req.url}`)
		} else return handle(req, res)
	})
}

/**
 * Prepare the necessary SSL/TLS files (private key and certificate)
 *
 * @returns https options with key and certificate
 */
function readCertificates() {
	const httpsOptions = {}
	if (ssl == 'true') {
		log.info('SERVER', 'Reading certificates')
		httpsOptions.key = fs.readFileSync(`${__dirname}/certificates/privkey.pem`)
		httpsOptions.cert = fs.readFileSync(`${__dirname}/certificates/fullchain.pem`)
	}
	return httpsOptions
}
