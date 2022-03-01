const fs = require('fs')

const next = require('next')
const log = require('./utils/logging')

const compression = require('compression')
const spdy = require('spdy')

/*******************************
 * Reading Environment Variables
 ******************************/
const nodeEnv = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000
const url = process.env.URL || 'localhost'
const cert = process.env.SSL_CERT || 'localhost'
const key = process.env.SSL_KEY || 'localhostKey'
const ca = process.env.SSL_CA || 'null'

// SOCKET
const sm = require('./app/socket/socket-manager')

/*****************************
 * Prepare Frontend NextJS App
 ****************************/
if (nodeEnv !== 'test') {
	const dev = nodeEnv !== 'production'
	const app = next({ dev })
	const handle = app.getRequestHandler()
	app.prepare().catch((ex) => {
		log.error('SERVER', 'Launch error', ex.stack)
		process.exit(1)
	})
} else {
}

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

server.get('*', (req, res) => {
	return handle(req, res)
})

const shouldCompress = (req, res) => {
	if (req.headers['x-no-compression']) {
		return false
	}

	return compression.filter(req, res)
}

server.use(compression({ filter: shouldCompress }))

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
 * Prepare the necessary SSL/TLS files (private key and certificate)
 *
 * @returns https options with key and certificate
 */
function readCertificates() {
	log.info('SERVER', 'Reading certificates')
	const httpsOptions = {
		key: fs.readFileSync(`${__dirname}/config/certificates/${key}`),
		cert: fs.readFileSync(`${__dirname}/config/certificates/${cert}`)
	}
	if (ca != 'null') httpsOptions.ca = fs.readFileSync(`${__dirname}/config/certificates/${ca}`)
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
