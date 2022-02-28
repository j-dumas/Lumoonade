const fs = require('fs')

const http = require('http'),
	https = require('https')

const next = require('next')
const log = require('./utils/logging')

const compression = require('compression')
const spdy = require('spdy')

/*******************************
 * Reading Environment Variables
 ******************************/
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const httpsUrl = process.env.HTTPS || 'localhost'
const httpUrl = process.env.HTTP || 'localhost'
const cert = process.env.SSL_CERT || 'localhost'
const key = process.env.SSL_KEY || 'localhostKey'

// SOCKET
const sm = require('./app/socket/socket-manager')

/*****************************
 * Prepare Frontend NextJS App
 ****************************/
const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare().catch((ex) => {
	log.error('SERVER', 'Launch error', ex.stack)
	process.exit(1)
})

/**********************
 * Prepare SPDY Options
 *********************/
const httpSpdyOptions = {
	plain: true,
	ssl: false
}

const spdyOptions = { protocols: ['h2', 'http/1.1'] }

/**********************************
 * Prepare Backend ExpressJS Server
 *********************************/
let server = require('./app/app')
if (!dev) protocolVerification()

const shouldCompress = (req, res) => {
	if (req.headers['x-no-compression']) {
		return false
	}

	return compression.filter(req, res)
}

server.use(compression({ filter: shouldCompress }))

server.get('*', (req, res) => {
	return handle(req, res)
})

prepareHttps2()

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
	log.info('SERVER', 'Reading certificates')
	const httpsOptions = {
		key: fs.readFileSync(`${__dirname}/config/certificates/${key}.pem`),
		cert: fs.readFileSync(`${__dirname}/config/certificates/${cert}.pem`)
	}
	return httpsOptions
}

/**
 * Prepares the HTTPS/2 server
 */
function prepareHttps2() {
	const options = readCertificates()
	options.spdy = spdyOptions
	server = spdy.createServer(options, server)
	log.info('SERVER', 'Starting in HTTPS/2')
}
